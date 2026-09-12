import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Koneksi Gemini Live API lewat SDK resmi (@google/genai).
 *
 * Ephemeral token dikirim sebagai token.name ("auth_tokens/xxx"), bukan
 * nilai mentah — SDK memakai prefix itu untuk memilih metode autentikasi.
 *
 * Pasang dulu: npm install @google/genai
 */

const MODEL_LIVE = "models/gemini-2.5-flash-native-audio-preview-12-2025";

const LAJU_MASUK = 16000; // Live API menerima PCM 16 kHz
const LAJU_KELUAR = 24000; // Live API mengembalikan PCM 24 kHz

/**
 * Ukuran potongan audio. Pada 16 kHz:
 *   4096 = 256 ms  (terasa lambat)
 *   2048 = 128 ms
 *   1024 =  64 ms  (terasa alami)
 */
const UKURAN_POTONGAN = 1024;

/* Catatan: kalibrasi derau dan gerbang otomatis sudah dibuang.
   Keduanya dibutuhkan saat giliran bicara dideteksi sendiri — begitu
   user yang menekan tombol, semua itu tidak lagi berguna dan hanya
   menambah kemungkinan salah. */

/* ---------- Bantuan konversi audio ---------- */

function keP16(float32) {
  const buf = new ArrayBuffer(float32.length * 2);
  const view = new DataView(buf);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buf;
}

function keBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let biner = "";
  const BLOK = 0x8000;
  for (let i = 0; i < bytes.length; i += BLOK) {
    biner += String.fromCharCode.apply(null, bytes.subarray(i, i + BLOK));
  }
  return btoa(biner);
}

function dariBase64(b64) {
  const biner = atob(b64);
  const bytes = new Uint8Array(biner.length);
  for (let i = 0; i < biner.length; i++) bytes[i] = biner.charCodeAt(i);
  return bytes.buffer;
}

function keAudioBuffer(ctx, arrayBuffer, laju) {
  const view = new DataView(arrayBuffer);
  const jumlah = arrayBuffer.byteLength / 2;
  const buffer = ctx.createBuffer(1, jumlah, laju);
  const kanal = buffer.getChannelData(0);
  for (let i = 0; i < jumlah; i++) {
    kanal[i] = view.getInt16(i * 2, true) / 32768;
  }
  return buffer;
}

/* ------------------------------------------------------------------ */

export function useGeminiLive({ onTranskrip, onSelesai, onGalat } = {}) {
  const [terhubung, setTerhubung] = useState(false);
  const [mendengar, setMendengar] = useState(false);
  const [berbicara, setBerbicara] = useState(false);
  const [tingkat, setTingkat] = useState(0);
  const [galat, setGalat] = useState("");
  // Apakah user sedang menekan tombol bicara. Ini yang menentukan
  // audio dikirim atau tidak — bukan lagi deteksi otomatis.
  const [sedangBicara, setSedangBicara] = useState(false);

  const r = useRef({
    sesi: null,
    ctxMasuk: null,
    ctxKeluar: null,
    stream: null,
    prosesor: null,
    analis: null,
    frame: null,
    antrian: [],
    waktuBerikut: 0,
    sumberAktif: [],
    ditutupSengaja: false,
    siap: false,
    giliranAktif: false, // apakah activityStart sudah dikirim
  });

  const cb = useRef({ onTranskrip, onSelesai, onGalat });
  useEffect(() => {
    cb.current = { onTranskrip, onSelesai, onGalat };
  });

  /* ---------- Pemutaran audio balasan ---------- */

  const putarAntrian = useCallback(() => {
    const s = r.current;
    if (!s.ctxKeluar || s.antrian.length === 0) {
      if (s.antrian.length === 0 && s.sumberAktif.length === 0) {
        setBerbicara(false);
      }
      return;
    }

    while (s.antrian.length > 0) {
      const buffer = s.antrian.shift();
      const sumber = s.ctxKeluar.createBufferSource();
      sumber.buffer = buffer;
      sumber.connect(s.ctxKeluar.destination);

      const sekarang = s.ctxKeluar.currentTime;

      // Kalau jadwal tertinggal jauh — biasanya karena tab sempat tidak
      // aktif — antrian diselaraskan ulang. Tanpa ini AI terdengar
      // memutar audio basi di belakang percakapan.
      if (s.waktuBerikut < sekarang - 0.25) s.waktuBerikut = 0;

      // Ancang-ancang 20 ms: potongan yang dijadwalkan tepat di
      // currentTime kadang terlewat dan terdengar patah.
      const mulai = Math.max(sekarang + 0.02, s.waktuBerikut);
      sumber.start(mulai);
      s.waktuBerikut = mulai + buffer.duration;

      s.sumberAktif.push(sumber);
      sumber.onended = () => {
        s.sumberAktif = s.sumberAktif.filter((x) => x !== sumber);
        if (s.sumberAktif.length === 0 && s.antrian.length === 0) {
          setBerbicara(false);
        }
      };
    }
    setBerbicara(true);
  }, []);

  const hentikanSuaraAi = useCallback(() => {
    const s = r.current;
    s.antrian = [];
    s.sumberAktif.forEach((x) => {
      try {
        x.stop();
      } catch {
        /* sudah berhenti */
      }
    });
    s.sumberAktif = [];
    s.waktuBerikut = 0;
    setBerbicara(false);
  }, []);

  /* ---------- Mulai sesi ---------- */

  const mulai = useCallback(
    async ({ token, instruksi, suara = "Puck" }) => {
      setGalat("");
      const s = r.current;
      s.ditutupSengaja = false;
      s.siap = false;
      s.giliranAktif = false;

      const apiKey =
        typeof token === "object" && token !== null ? token.name : token;

      if (!apiKey?.startsWith("auth_tokens/")) {
        console.warn(
          "[useGeminiLive] Token tidak dimulai dengan 'auth_tokens/' —",
          "pastikan backend mengirim token.name.",
          "Nilai diterima:",
          String(apiKey).slice(0, 40),
        );
      }

      try {
        const { GoogleGenAI, Modality } = await import("@google/genai");

        // 1. Mikrofon
        s.stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        // latencyHint "interactive": browser memilih buffer perangkat
        // keras terkecil yang sanggup ia tangani.
        s.ctxMasuk = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: LAJU_MASUK,
          latencyHint: "interactive",
        });
        s.ctxKeluar = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: LAJU_KELUAR,
          latencyHint: "interactive",
        });

        // 2. Koneksi lewat SDK
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { apiVersion: "v1alpha" },
        });

        const sesi = await ai.live.connect({
          model: MODEL_LIVE,
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: suara } },
              languageCode: "id-ID",
            },
            systemInstruction: instruksi,
            inputAudioTranscription: {},
            outputAudioTranscription: {},

            // VAD otomatis Google DIMATIKAN, giliran dikendalikan sendiri.
            //
            // Alasannya: gerbang derau di sisi klien berhenti mengirim
            // audio saat user diam. VAD Google lalu tidak pernah mendengar
            // keheningan — dari sudut pandangnya, aliran audio cuma
            // berhenti — sehingga giliran menggantung dan AI menunggu
            // selamanya.
            //
            // Dengan kendali manual, gerbang yang sudah tahu persis kapan
            // bicara dimulai dan berakhir mengirimkan penanda activityStart
            // dan activityEnd secara eksplisit. Hasilnya jauh lebih pasti
            // dan responsnya langsung.
            realtimeInputConfig: {
              automaticActivityDetection: { disabled: true },
            },
          },
          callbacks: {
            onopen: () => {
              s.siap = true;
              setTerhubung(true);
            },

            onmessage: (pesan) => {
              const sc = pesan.serverContent;
              if (!sc) return;

              if (sc.interrupted) {
                hentikanSuaraAi();
                return;
              }

              if (sc.inputTranscription?.text) {
                cb.current.onTranskrip?.("user", sc.inputTranscription.text);
              }
              if (sc.outputTranscription?.text) {
                cb.current.onTranskrip?.("ai", sc.outputTranscription.text);
              }

              const bagian = sc.modelTurn?.parts || [];
              for (const p of bagian) {
                const d = p.inlineData;
                if (d?.data && d.mimeType?.startsWith("audio/pcm")) {
                  s.antrian.push(
                    keAudioBuffer(s.ctxKeluar, dariBase64(d.data), LAJU_KELUAR),
                  );
                }
              }
              if (s.antrian.length > 0) putarAntrian();

              if (sc.turnComplete) {
                cb.current.onTranskrip?.("giliran-selesai", "");
              }
            },

            onerror: (e) => {
              const pesan = e?.message || "Koneksi suara bermasalah.";
              setGalat(pesan);
              cb.current.onGalat?.(pesan, !s.siap);
            },

            onclose: (e) => {
              setTerhubung(false);
              setMendengar(false);
              if (!s.ditutupSengaja) {
                const pesan = e?.reason
                  ? `Sesi terputus: ${e.reason}`
                  : "Sesi terputus.";
                setGalat(pesan);
                cb.current.onGalat?.(pesan, !s.siap);
              }
              cb.current.onSelesai?.();
            },
          },
        });

        s.sesi = sesi;

        // 3. Alirkan mikrofon ke sesi
        const sumber = s.ctxMasuk.createMediaStreamSource(s.stream);

        s.analis = s.ctxMasuk.createAnalyser();
        s.analis.fftSize = 256;
        s.analis.smoothingTimeConstant = 0.6;
        sumber.connect(s.analis);

        // ScriptProcessor memang usang, tapi AudioWorklet butuh berkas
        // terpisah yang harus ikut proses build. Peringatan di console
        // tidak memengaruhi fungsinya.
        s.prosesor = s.ctxMasuk.createScriptProcessor(UKURAN_POTONGAN, 1, 1);
        sumber.connect(s.prosesor);
        s.prosesor.connect(s.ctxMasuk.destination);

        s.prosesor.onaudioprocess = (e) => {
          if (!s.sesi || !s.siap) return;

          // Audio HANYA dikirim saat user menekan tombol bicara.
          //
          // Pendekatan ini menggantikan deteksi otomatis yang sebelumnya
          // sering keliru: derau latar membuat giliran tidak pernah
          // tertutup, sementara jeda berpikir malah memotong kalimat.
          // Dengan tombol, user yang memutuskan — dan keputusannya selalu
          // benar karena hanya dia yang tahu sudah selesai atau belum.
          if (!s.giliranAktif) return;

          const data = e.inputBuffer.getChannelData(0);
          try {
            s.sesi.sendRealtimeInput({
              media: {
                data: keBase64(keP16(data)),
                mimeType: `audio/pcm;rate=${LAJU_MASUK}`,
              },
            });
          } catch {
            /* sesi sudah tertutup */
          }
        };

        setMendengar(true);

        // 4. Pengukur volume untuk menggerakkan orb
        const data = new Uint8Array(s.analis.frequencyBinCount);
        const ukur = () => {
          if (!s.analis) return;
          s.analis.getByteFrequencyData(data);
          const rata = data.reduce((a, b) => a + b, 0) / data.length;
          setTingkat(Math.min(1, rata / 90));
          s.frame = requestAnimationFrame(ukur);
        };
        ukur();
      } catch (e) {
        const pesan =
          e?.name === "NotAllowedError"
            ? "Izin mikrofon ditolak. Aktifkan izin mikrofon di pengaturan browser."
            : e?.message || "Gagal memulai sesi suara.";
        setGalat(pesan);
        cb.current.onGalat?.(pesan, true);
        throw e;
      }
    },
    [putarAntrian, hentikanSuaraAi],
  );

  /* ---------- Kendali bicara ---------- */

  const mulaiBicara = useCallback(() => {
    const s = r.current;
    if (!s.sesi || !s.siap || s.giliranAktif) return;

    try {
      // AI dipotong kalau ia masih bicara — user yang menekan tombol
      // jelas ingin bicara sekarang, bukan menunggu.
      hentikanSuaraAi();
      s.sesi.sendRealtimeInput({ activityStart: {} });
      s.giliranAktif = true;
      setSedangBicara(true);
    } catch {
      /* sesi sudah tertutup */
    }
  }, [hentikanSuaraAi]);

  const selesaiBicara = useCallback(() => {
    const s = r.current;
    if (!s.sesi || !s.siap || !s.giliranAktif) return;

    try {
      // Penanda ini yang memicu AI mulai menyusun jawaban.
      s.sesi.sendRealtimeInput({ activityEnd: {} });
    } catch {
      /* sesi sudah tertutup */
    } finally {
      s.giliranAktif = false;
      setSedangBicara(false);
    }
  }, []);

  /* ---------- Akhiri sesi ---------- */

  const akhiri = useCallback(() => {
    const s = r.current;
    s.ditutupSengaja = true;

    if (s.frame) cancelAnimationFrame(s.frame);
    hentikanSuaraAi();

    try {
      s.prosesor?.disconnect();
    } catch {
      /* abaikan */
    }
    s.stream?.getTracks().forEach((t) => t.stop());

    try {
      s.ctxMasuk?.close();
    } catch {
      /* abaikan */
    }
    try {
      s.ctxKeluar?.close();
    } catch {
      /* abaikan */
    }
    try {
      s.sesi?.close();
    } catch {
      /* abaikan */
    }

    r.current = {
      ...r.current,
      sesi: null,
      ctxMasuk: null,
      ctxKeluar: null,
      stream: null,
      prosesor: null,
      analis: null,
      frame: null,
      antrian: [],
      sumberAktif: [],
      waktuBerikut: 0,
      siap: false,
      giliranAktif: false,
    };

    setTerhubung(false);
    setMendengar(false);
    setBerbicara(false);
    setSedangBicara(false);
    setTingkat(0);
  }, [hentikanSuaraAi]);

  useEffect(() => () => akhiri(), [akhiri]);

  return {
    terhubung,
    mendengar,
    berbicara,
    tingkat,
    galat,
    sedangBicara,
    mulai,
    akhiri,
    mulaiBicara,
    selesaiBicara,
  };
}

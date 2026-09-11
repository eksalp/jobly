import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Koneksi Gemini Live API lewat SDK resmi (@google/genai).
 *
 * FIX: Ephemeral token harus dikirim sebagai token.name ("auth_tokens/xxx"),
 * bukan nilai token mentah. SDK mengecek prefix "auth_tokens/" untuk
 * menentukan metode autentikasi yang benar (BidiGenerateContentConstrained).
 *
 * Pasang dulu: npm install @google/genai
 */

const MODEL_LIVE = "models/gemini-2.5-flash-native-audio-preview-12-2025";

const LAJU_MASUK = 16000; // Live API menerima PCM 16 kHz
const LAJU_KELUAR = 24000; // Live API mengembalikan PCM 24 kHz

/* ---------- Bantuan konversi audio ---------- */

/** Float32 (-1..1) -> PCM 16-bit little endian. */
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
  });

  const cb = useRef({ onTranskrip, onSelesai, onGalat });
  useEffect(() => {
    cb.current = { onTranskrip, onSelesai, onGalat };
  });

  /* ---------- Pemutaran audio balasan ---------- */

  const putarAntrian = useCallback(() => {
    const s = r.current;
    if (!s.ctxKeluar || s.antrian.length === 0) {
      if (s.antrian.length === 0 && s.sumberAktif.length === 0)
        setBerbicara(false);
      return;
    }

    while (s.antrian.length > 0) {
      const buffer = s.antrian.shift();
      const sumber = s.ctxKeluar.createBufferSource();
      sumber.buffer = buffer;
      sumber.connect(s.ctxKeluar.destination);

      const sekarang = s.ctxKeluar.currentTime;
      const mulai = Math.max(sekarang, s.waktuBerikut);
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

  /** Hentikan audio AI seketika — dipakai saat user memotong. */
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

      // Validasi format token — harus "auth_tokens/xxx" bukan nilai mentah.
      // Kalau backend mengembalikan objek, ambil .name-nya di sini.
      const apiKey =
        typeof token === "object" && token !== null ? token.name : token;

      if (!apiKey?.startsWith("auth_tokens/")) {
        console.warn(
          "[useGeminiLive] Token tidak dimulai dengan 'auth_tokens/' —",
          "pastikan backend mengirim token.name, bukan token.token.",
          "Nilai diterima:",
          String(apiKey).slice(0, 40),
        );
      }

      try {
        const { GoogleGenAI, Modality } = await import("@google/genai");

        // 1. Mikrofon — noise suppression agresif untuk lingkungan berisik
        s.stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            // Chrome-specific: filter tambahan untuk noise latar & kresek
            googNoiseSuppression: true,
            googHighpassFilter: true,
            googEchoCancellation: true,
            googAutoGainControl: true,
          },
        });

        s.ctxMasuk = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: LAJU_MASUK,
        });
        s.ctxKeluar = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: LAJU_KELUAR,
        });

        // 2. Koneksi lewat SDK.
        //    apiKey harus berupa token.name ("auth_tokens/xxx").
        //    apiVersion v1alpha wajib — diset via httpOptions.
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
            // VAD — lebih cepat potong saat diam, tidak terpancing noise latar
            realtimeInputConfig: {
              automaticActivityDetection: {
                disabled: false,
                startOfSpeechSensitivity: "START_SENSITIVITY_LOW",
                endOfSpeechSensitivity: "END_SENSITIVITY_HIGH",
                prefixPaddingMs: 200,
                silenceDurationMs: 500,
              },
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

        s.prosesor = s.ctxMasuk.createScriptProcessor(2048, 1, 1);
        sumber.connect(s.prosesor);
        s.prosesor.connect(s.ctxMasuk.destination);

        s.prosesor.onaudioprocess = (e) => {
          if (!s.sesi || !s.siap) return;
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
    };

    setTerhubung(false);
    setMendengar(false);
    setBerbicara(false);
    setTingkat(0);
  }, [hentikanSuaraAi]);

  useEffect(() => () => akhiri(), [akhiri]);

  return { terhubung, mendengar, berbicara, tingkat, galat, mulai, akhiri };
}

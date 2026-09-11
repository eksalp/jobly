import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Pengenalan suara dan pembacaan suara lewat Web Speech API.
 *
 * Keduanya bawaan browser, jadi TIDAK ADA biaya API sama sekali dan
 * latensinya jauh lebih rendah daripada mengirim audio bolak-balik ke
 * server. Ini yang membuat fitur simulasi interview bisa dijual di harga
 * paket saat ini — kalau memakai layanan suara berbayar, satu sesi saja
 * bisa menelan lebih dari separuh harga paketnya.
 *
 * Dukungan browser: Chrome, Edge, dan Safari mendukung pengenalan suara.
 * Firefox belum. Karena itu `didukung` selalu dicek dan panel menyediakan
 * jalur mengetik sebagai cadangan.
 */
export function usePengenalanSuara({
  bahasa = "id-ID",
  // Jeda dasar sebelum jawaban dianggap selesai. Dinaikkan ke 3 detik
  // karena 1,8 detik terbukti terlalu agresif — orang berhenti sejenak
  // untuk berpikir di tengah jawaban, terutama saat menjawab pertanyaan
  // wawancara yang menuntut mengingat pengalaman.
  jedaSelesaiMs = 3000,
  onSelesaiBicara = null,
} = {}) {
  const [mendengar, setMendengar] = useState(false);
  const [teks, setTeks] = useState("");
  const [galat, setGalat] = useState("");
  const pengenalRef = useRef(null);
  const finalRef = useRef("");
  const jedaRef = useRef(null);
  const onSelesaiRef = useRef(onSelesaiBicara);

  // Disimpan di ref supaya callback terbaru selalu terpakai tanpa
  // perlu membangun ulang objek pengenal setiap render.
  useEffect(() => {
    onSelesaiRef.current = onSelesaiBicara;
  }, [onSelesaiBicara]);

  const Pengenal =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const didukung = Boolean(Pengenal);

  const mulai = useCallback(() => {
    if (!didukung) {
      setGalat(
        "Browser ini belum mendukung pengenalan suara. Gunakan Chrome, Edge, atau Safari.",
      );
      return;
    }

    setGalat("");
    setTeks("");
    finalRef.current = "";

    const p = new Pengenal();
    p.lang = bahasa;
    // continuous + interimResults: jawaban wawancara bisa panjang dan
    // berjeda. Tanpa continuous, perekaman berhenti sendiri di jeda
    // pertama dan memotong jawaban di tengah kalimat.
    p.continuous = true;
    p.interimResults = true;

    p.onresult = (e) => {
      let sementara = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const potongan = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalRef.current += potongan + " ";
        else sementara += potongan;
      }
      const gabungan = (finalRef.current + sementara).trim();
      setTeks(gabungan);

      // Setiap kali ada suara masuk, hitungan jeda diulang dari nol.
      clearTimeout(jedaRef.current);
      if (!gabungan || !onSelesaiRef.current) return;

      // Jeda disesuaikan dengan bentuk kalimatnya, bukan seragam.
      //
      // Kalimat yang menggantung — berakhir dengan kata sambung, atau
      // masih sangat pendek — hampir pasti belum selesai. Memotongnya di
      // situ adalah kesalahan paling mengganggu dalam percakapan suara,
      // jadi kasus-kasus itu diberi waktu tunggu lebih panjang.
      const kata = gabungan.split(/\s+/);
      const kataTerakhir = (kata[kata.length - 1] || "").toLowerCase();

      const GANTUNG = [
        "dan",
        "atau",
        "tapi",
        "tetapi",
        "karena",
        "kalau",
        "jika",
        "yang",
        "untuk",
        "dengan",
        "di",
        "ke",
        "dari",
        "pada",
        "adalah",
        "sebagai",
        "seperti",
        "kemudian",
        "lalu",
        "terus",
        "jadi",
        "sehingga",
        "supaya",
        "misalnya",
        "contohnya",
        "yaitu",
        "yakni",
        "eee",
        "emm",
        "anu",
        "itu",
        "ini",
      ];

      let jeda = jedaSelesaiMs;

      if (GANTUNG.includes(kataTerakhir)) {
        jeda = jedaSelesaiMs + 2500; // jelas belum selesai
      } else if (kata.length < 8) {
        jeda = jedaSelesaiMs + 1500; // masih terlalu pendek untuk jawaban wawancara
      } else if (/[.!?]$/.test(gabungan)) {
        jeda = Math.max(1800, jedaSelesaiMs - 800); // kalimat sudah utuh
      }

      jedaRef.current = setTimeout(() => {
        onSelesaiRef.current?.(gabungan);
      }, jeda);
    };

    p.onerror = (e) => {
      if (e.error === "no-speech") return; // wajar saat user diam sejenak
      if (e.error === "not-allowed") {
        setGalat(
          "Izin mikrofon ditolak. Aktifkan izin mikrofon di pengaturan browser.",
        );
      } else {
        setGalat(`Pengenalan suara bermasalah: ${e.error}`);
      }
      setMendengar(false);
    };

    p.onend = () => setMendengar(false);

    pengenalRef.current = p;
    p.start();
    setMendengar(true);
  }, [didukung, bahasa, Pengenal]);

  const berhenti = useCallback(() => {
    clearTimeout(jedaRef.current);
    pengenalRef.current?.stop();
    setMendengar(false);
  }, []);

  const bersihkan = useCallback(() => {
    clearTimeout(jedaRef.current);
    finalRef.current = "";
    setTeks("");
  }, []);

  useEffect(
    () => () => {
      clearTimeout(jedaRef.current);
      pengenalRef.current?.abort();
    },
    [],
  );

  return {
    didukung,
    mendengar,
    teks,
    galat,
    mulai,
    berhenti,
    bersihkan,
    setTeks,
  };
}

/**
 * Mengukur kerasnya suara dari mikrofon (0-1).
 *
 * Dipakai untuk menggerakkan orb supaya user langsung tahu mikrofonnya
 * benar-benar menangkap suaranya. Tanpa umpan balik ini, orang cenderung
 * ragu dan mengulang-ulang kalimat karena mengira tidak terdengar.
 *
 * Berjalan terpisah dari SpeechRecognition dengan stream-nya sendiri —
 * Web Speech API tidak membuka data audio mentahnya ke aplikasi.
 */
export function usePengukurSuara(aktif) {
  const [tingkat, setTingkat] = useState(0);
  const rujukan = useRef({});

  useEffect(() => {
    if (!aktif) {
      setTingkat(0);
      return;
    }

    let batal = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (batal) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const sumber = ctx.createMediaStreamSource(stream);
        const analis = ctx.createAnalyser();
        analis.fftSize = 256;
        analis.smoothingTimeConstant = 0.6;
        sumber.connect(analis);

        const data = new Uint8Array(analis.frequencyBinCount);
        rujukan.current = { stream, ctx };

        const ukur = () => {
          if (batal) return;
          analis.getByteFrequencyData(data);
          const rata = data.reduce((a, b) => a + b, 0) / data.length;
          // Dibagi 90, bukan 255 — suara bicara normal jarang menyentuh
          // puncak skala, jadi pembagi penuh membuat orb nyaris tak bergerak.
          setTingkat(Math.min(1, rata / 90));
          rujukan.current.frame = requestAnimationFrame(ukur);
        };
        ukur();
      } catch {
        // Izin mikrofon ditolak — orb tetap jalan tanpa denyut suara.
        setTingkat(0);
      }
    })();

    return () => {
      batal = true;
      const { stream, ctx, frame } = rujukan.current;
      if (frame) cancelAnimationFrame(frame);
      stream?.getTracks().forEach((t) => t.stop());
      ctx?.close();
      rujukan.current = {};
      setTingkat(0);
    };
  }, [aktif]);

  return tingkat;
}

/** Membacakan teks dengan suara bawaan browser. */
export function usePembacaSuara({ bahasa = "id-ID" } = {}) {
  const [berbicara, setBerbicara] = useState(false);

  const didukung = typeof window !== "undefined" && "speechSynthesis" in window;

  const baca = useCallback(
    (teks) => {
      if (!didukung || !teks) return;

      // Batalkan ucapan sebelumnya — kalau tidak, antriannya menumpuk
      // dan AI terdengar membacakan dua pertanyaan sekaligus.
      window.speechSynthesis.cancel();

      const u = new SpeechSynthesisUtterance(teks);
      u.lang = bahasa;
      u.rate = 0.95; // sedikit lebih lambat, lebih mudah disimak

      // Pilih suara Indonesia kalau tersedia di perangkat
      const suara = window.speechSynthesis
        .getVoices()
        .find((v) => v.lang?.startsWith("id"));
      if (suara) u.voice = suara;

      u.onstart = () => setBerbicara(true);
      u.onend = () => setBerbicara(false);
      u.onerror = () => setBerbicara(false);

      window.speechSynthesis.speak(u);
    },
    [didukung, bahasa],
  );

  const hentikan = useCallback(() => {
    if (didukung) window.speechSynthesis.cancel();
    setBerbicara(false);
  }, [didukung]);

  useEffect(
    () => () => {
      if (didukung) window.speechSynthesis.cancel();
    },
    [didukung],
  );

  return { didukung, berbicara, baca, hentikan };
}

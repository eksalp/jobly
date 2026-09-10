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
  // Berapa lama diam sebelum jawaban dianggap selesai. 1,8 detik dipilih
  // dari pengamatan: jeda berpikir di tengah kalimat biasanya di bawah
  // 1,5 detik, sedangkan jeda setelah selesai menjawab jauh lebih panjang.
  // Terlalu pendek -> kalimat terpotong di tengah. Terlalu panjang ->
  // percakapan terasa lambat dan canggung.
  jedaSelesaiMs = 1800,
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
      // Jawaban dianggap selesai hanya kalau benar-benar diam selama
      // jedaSelesaiMs penuh.
      clearTimeout(jedaRef.current);
      if (gabungan && onSelesaiRef.current) {
        jedaRef.current = setTimeout(() => {
          onSelesaiRef.current?.(gabungan);
        }, jedaSelesaiMs);
      }
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

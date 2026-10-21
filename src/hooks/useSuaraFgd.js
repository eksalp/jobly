import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Perekam suara (WAV 16 kHz mono, base64) dan pemutar suara peserta AI
 * (PCM 16-bit dari Gemini TTS) untuk simulasi FGD.
 *
 * WAV dipakai karena format itu pasti diterima Gemini, berbeda dengan
 * webm/opus bawaan MediaRecorder.
 */
const RATE_REKAM = 16000;
export const MAKS_DETIK_BICARA = 90;

function keWavBase64(sampel, rateAsal) {
  // Turunkan sample rate ke 16 kHz (rata-rata sederhana)
  const rasio = rateAsal / RATE_REKAM;
  const n = Math.floor(sampel.length / rasio);
  const pcm = new Int16Array(n);
  for (let i = 0; i < n; i++) {
    const a = Math.floor(i * rasio);
    const b = Math.min(sampel.length, Math.floor((i + 1) * rasio));
    let jumlah = 0;
    for (let j = a; j < b; j++) jumlah += sampel[j];
    const v = Math.max(-1, Math.min(1, jumlah / Math.max(1, b - a)));
    pcm[i] = v < 0 ? v * 0x8000 : v * 0x7fff;
  }
  const buf = new ArrayBuffer(44 + pcm.length * 2);
  const dv = new DataView(buf);
  const tulis = (o, s) => [...s].forEach((c, i) => dv.setUint8(o + i, c.charCodeAt(0)));
  tulis(0, "RIFF");
  dv.setUint32(4, 36 + pcm.length * 2, true);
  tulis(8, "WAVE");
  tulis(12, "fmt ");
  dv.setUint32(16, 16, true);
  dv.setUint16(20, 1, true);
  dv.setUint16(22, 1, true);
  dv.setUint32(24, RATE_REKAM, true);
  dv.setUint32(28, RATE_REKAM * 2, true);
  dv.setUint16(32, 2, true);
  dv.setUint16(34, 16, true);
  tulis(36, "data");
  dv.setUint32(40, pcm.length * 2, true);
  new Int16Array(buf, 44).set(pcm);
  const bytes = new Uint8Array(buf);
  let biner = "";
  for (let i = 0; i < bytes.length; i += 0x8000) biner += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return { base64: btoa(biner), detik: pcm.length / RATE_REKAM };
}

export function useSuaraFgd() {
  const ctxRef = useRef(null);
  const rekam = useRef(null); // { stream, node, sumber, potongan: [] }
  const putar = useRef(null); // { sumber, selesai }
  const [merekam, setMerekam] = useState(false);
  const [tingkatMic, setTingkatMic] = useState(0);
  const [tingkatAi, setTingkatAi] = useState(0);
  const [detikRekam, setDetikRekam] = useState(0);
  const analiserAi = useRef(null);
  const raf = useRef(0);

  const ctx = () => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  };

  // Ukur kerasnya suara AI untuk animasi mulut
  useEffect(() => {
    const ukur = () => {
      const an = analiserAi.current;
      if (an) {
        const d = new Uint8Array(an.fftSize);
        an.getByteTimeDomainData(d);
        let s = 0;
        for (const v of d) s += ((v - 128) / 128) ** 2;
        setTingkatAi(Math.min(1, Math.sqrt(s / d.length) * 4));
      }
      raf.current = requestAnimationFrame(ukur);
    };
    raf.current = requestAnimationFrame(ukur);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const mulaiRekam = useCallback(async () => {
    const c = ctx();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    const sumber = c.createMediaStreamSource(stream);
    const node = c.createScriptProcessor(4096, 1, 1);
    const potongan = [];
    const mulai = Date.now();
    node.onaudioprocess = (e) => {
      const data = e.inputBuffer.getChannelData(0);
      potongan.push(new Float32Array(data));
      let s = 0;
      for (let i = 0; i < data.length; i += 8) s += data[i] * data[i];
      setTingkatMic(Math.min(1, Math.sqrt(s / (data.length / 8)) * 5));
      setDetikRekam(Math.floor((Date.now() - mulai) / 1000));
    };
    sumber.connect(node);
    node.connect(c.destination);
    rekam.current = { stream, node, sumber, potongan, rate: c.sampleRate };
    setDetikRekam(0);
    setMerekam(true);
  }, []);

  /** Hentikan rekaman. Mengembalikan { base64, detik } atau null. */
  const selesaiRekam = useCallback(() => {
    const r = rekam.current;
    rekam.current = null;
    setMerekam(false);
    setTingkatMic(0);
    if (!r) return null;
    try {
      r.node.disconnect();
      r.sumber.disconnect();
    } catch {
      /* sudah terputus */
    }
    r.stream.getTracks().forEach((t) => t.stop());
    const total = r.potongan.reduce((a, p) => a + p.length, 0);
    if (!total) return null;
    const semua = new Float32Array(total);
    let o = 0;
    r.potongan.forEach((p) => {
      semua.set(p, o);
      o += p.length;
    });
    return keWavBase64(semua, r.rate);
  }, []);

  const hentikanSuara = useCallback(() => {
    const p = putar.current;
    putar.current = null;
    if (p) {
      try {
        p.sumber.stop();
      } catch {
        /* sudah berhenti */
      }
      p.selesai();
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  /** Putar PCM 16-bit base64. Selesai saat audio habis atau dihentikan. */
  const putarPcm = useCallback(
    (base64, mime = "audio/L16;rate=24000") =>
      new Promise((ok) => {
        const c = ctx();
        const rate = Number(/rate=(\d+)/.exec(mime)?.[1]) || 24000;
        const biner = atob(base64);
        const n = Math.floor(biner.length / 2);
        const buf = c.createBuffer(1, n, rate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < n; i++) {
          let v = biner.charCodeAt(i * 2) | (biner.charCodeAt(i * 2 + 1) << 8);
          if (v >= 0x8000) v -= 0x10000;
          ch[i] = v / 0x8000;
        }
        const sumber = c.createBufferSource();
        sumber.buffer = buf;
        const an = c.createAnalyser();
        an.fftSize = 512;
        sumber.connect(an);
        an.connect(c.destination);
        analiserAi.current = an;
        const selesai = () => {
          analiserAi.current = null;
          setTingkatAi(0);
          ok();
        };
        sumber.onended = () => {
          if (putar.current?.sumber === sumber) putar.current = null;
          selesai();
        };
        putar.current = { sumber, selesai };
        sumber.start();
      }),
    [],
  );

  /** Cadangan bila TTS gagal: suara bawaan browser. */
  const ucapkan = useCallback(
    (teks, bahasa = "id") =>
      new Promise((ok) => {
        const ss = window.speechSynthesis;
        if (!ss) return ok();
        const u = new SpeechSynthesisUtterance(teks);
        u.lang = bahasa === "en" ? "en-US" : "id-ID";
        u.onend = () => ok();
        u.onerror = () => ok();
        putar.current = { sumber: { stop: () => ss.cancel() }, selesai: ok };
        ss.speak(u);
      }),
    [],
  );

  useEffect(
    () => () => {
      hentikanSuara();
      selesaiRekam();
      if (ctxRef.current) ctxRef.current.close().catch(() => {});
    },
    [hentikanSuara, selesaiRekam],
  );

  return { merekam, tingkatMic, tingkatAi, detikRekam, mulaiRekam, selesaiRekam, putarPcm, ucapkan, hentikanSuara, siapkan: ctx };
}

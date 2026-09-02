import React, { useState, useEffect } from "react";
import {
  Check,
  Loader2,
  Sparkles,
  Clock,
  AlertCircle,
  Receipt,
} from "lucide-react";
import { T } from "../../theme";
import { Glass } from "../../components/ui/Glass";
import { Button } from "../../components/ui/Button";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useLangganan } from "../../hooks/useLangganan";
import { DAFTAR_PAKET, rupiah } from "../../data/paket";
import { RiwayatPembelian } from "../../components/RiwayatPembelian";

/**
 * Memuat script Midtrans Snap sekali saja.
 *
 * Script ini yang menyediakan window.snap.pay(). Tanpa dimuat, tombol
 * beli gagal diam-diam dengan "snap is not defined".
 *
 * URL-nya berbeda antara Sandbox dan Production, dan client key-nya juga.
 * Keduanya ditentukan lewat env var supaya tidak perlu ubah kode saat
 * berpindah lingkungan.
 */
function useSnapScript() {
  const [siap, setSiap] = useState(() => Boolean(window.snap));
  const [galat, setGalat] = useState("");

  useEffect(() => {
    if (window.snap) {
      setSiap(true);
      return;
    }

    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    if (!clientKey) {
      setGalat("VITE_MIDTRANS_CLIENT_KEY belum diisi.");
      return;
    }

    // Client key produksi berawalan "Mid-client-", sandbox "SB-Mid-client-".
    // Dari situ URL script-nya ditentukan, jadi tidak ada kemungkinan
    // memakai key produksi dengan endpoint sandbox atau sebaliknya.
    const produksi = !clientKey.startsWith("SB-");
    const src = produksi
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";

    const ada = document.getElementById("midtrans-snap");
    if (ada) {
      ada.addEventListener("load", () => setSiap(true));
      return;
    }

    const script = document.createElement("script");
    script.id = "midtrans-snap";
    script.src = src;
    script.setAttribute("data-client-key", clientKey);
    script.onload = () => setSiap(true);
    script.onerror = () =>
      setGalat("Gagal memuat Midtrans. Periksa koneksi internet.");
    document.head.appendChild(script);
  }, []);

  return { siap, galat };
}

export function PaketPanel() {
  const langganan = useLangganan();
  const snap = useSnapScript();
  const [proses, setProses] = useState(null); // id paket yang sedang diproses
  const [galat, setGalat] = useState("");

  // Kalau kuota masih banyak, beri tahu sebelum membeli.
  // Membiarkan orang membeli sesuatu yang belum dibutuhkan itu
  // menghasilkan keluhan, bukan pendapatan berulang.
  const perluKonfirmasi =
    langganan.aktif &&
    langganan.sisaAnalisis >= Math.ceil(langganan.kuotaAnalisis * 0.6);

  const beli = async (paketId) => {
    if (!supabaseConfigured) {
      setGalat("Supabase belum dikonfigurasi.");
      return;
    }
    if (!snap.siap) {
      setGalat(
        snap.galat || "Sistem pembayaran masih dimuat, tunggu sebentar.",
      );
      return;
    }

    setProses(paketId);
    setGalat("");

    try {
      // Server yang menentukan harga berdasarkan paketId.
      // Nominal TIDAK dikirim dari sini — kalau dikirim, bisa dipalsukan.
      const { data, error } = await supabase.functions.invoke(
        "create-payment",
        {
          body: { paket: paketId },
        },
      );

      if (error) {
        let pesan = error.message;
        try {
          const body = await error.context?.json?.();
          if (body?.error) pesan = body.error;
        } catch {
          /* biarkan pesan bawaan */
        }
        throw new Error(pesan);
      }
      if (data?.error) throw new Error(data.error);

      window.snap.pay(data.snapToken, {
        onSuccess: async () => {
          // Webhook Midtrans yang mengaktifkan langganan di server.
          // Jeda singkat memberi waktu webhook tiba sebelum kita periksa.
          await new Promise((r) => setTimeout(r, 2500));
          await langganan.refresh();
          setProses(null);
        },
        onPending: () => {
          setGalat(
            "Pembayaran belum selesai. Langganan aktif otomatis setelah pembayaran terkonfirmasi.",
          );
          setProses(null);
        },
        onError: () => {
          setGalat("Pembayaran gagal. Silakan coba lagi.");
          setProses(null);
        },
        onClose: () => setProses(null),
      });
    } catch (e) {
      setGalat(e?.message || "Gagal membuat transaksi.");
      setProses(null);
    }
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 980, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: T.ink,
            marginBottom: 6,
          }}
        >
          Pilih paket yang sesuai
        </div>
        <div
          style={{
            fontSize: 13,
            color: T.inkSoft,
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.65,
          }}
        >
          Analisis AI, CV Builder, LinkedIn Builder, dan akses seluruh loker
          yang cocok dengan profilmu.
        </div>
      </div>

      {/* Status langganan aktif */}
      {langganan.aktif && (
        <Glass
          style={{
            padding: "14px 18px",
            marginBottom: 20,
            background: "rgba(20,184,166,0.07)",
            border: `1px solid ${T.teal}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Check size={16} color={T.teal} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>
              {langganan.detailPaket?.nama} sedang aktif
            </div>
            <div style={{ fontSize: 11.5, color: T.inkSoft, marginTop: 2 }}>
              {langganan.jumlahPaket > 1 &&
                `${langganan.jumlahPaket} paket digabung · `}
              {langganan.sisaAnalisis} dari {langganan.kuotaAnalisis} analisis
              tersisa · berakhir{" "}
              {new Date(langganan.berakhirAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
          {langganan.segeraBerakhir && (
            <span
              style={{
                fontSize: 11.5,
                color: "#B45309",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Clock size={12} /> Tinggal {langganan.sisaHari} hari
            </span>
          )}
        </Glass>
      )}

      {/* Pemberitahuan saat kuota masih banyak */}
      {perluKonfirmasi && (
        <Glass
          style={{
            padding: "13px 16px",
            marginBottom: 16,
            background: "rgba(217,119,6,0.06)",
            border: "1px solid rgba(217,119,6,0.3)",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <AlertCircle
            size={15}
            color="#B45309"
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <div style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6 }}>
            Kuota kamu masih banyak —{" "}
            <strong>{langganan.sisaAnalisis} analisis tersisa</strong> dan aktif{" "}
            {langganan.sisaHari} hari lagi. Kalau tetap membeli, kuotanya
            ditambahkan dan masa berlakunya disambung dari tanggal berakhir
            sekarang. Tidak ada yang hangus, tapi mungkin belum perlu buru-buru.
          </div>
        </Glass>
      )}

      {galat && (
        <Glass
          style={{
            padding: "11px 16px",
            marginBottom: 16,
            background: "rgba(178,58,58,0.06)",
            border: "1px solid rgba(178,58,58,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <AlertCircle size={14} color="#B23A3A" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, color: "#B23A3A" }}>{galat}</span>
        </Glass>
      )}

      {/* Kartu paket */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 14,
          alignItems: "start",
        }}
      >
        {DAFTAR_PAKET.map((p) => {
          const sedangProses = proses === p.id;
          const iniPaketAktif = langganan.aktif && langganan.paket === p.id;

          return (
            <Glass
              key={p.id}
              style={{
                padding: 22,
                border: p.populer
                  ? `1.5px solid ${T.accent}`
                  : `1px solid ${T.border}`,
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {p.populer && (
                <span
                  style={{
                    position: "absolute",
                    top: -10,
                    left: 22,
                    background: T.accent,
                    color: "#fff",
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 99,
                    letterSpacing: "0.03em",
                  }}
                >
                  PALING SESUAI
                </span>
              )}

              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: T.ink,
                  marginBottom: 3,
                }}
              >
                {p.nama}
              </div>
              <div
                style={{ fontSize: 11.5, color: T.inkFaint, marginBottom: 12 }}
              >
                {p.ringkas}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 5,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: T.ink,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {rupiah(p.harga)}
                </span>
              </div>
              <div
                style={{ fontSize: 11, color: T.inkFaint, marginBottom: 16 }}
              >
                sekali bayar · {p.durasiHari} hari · {p.kuotaAnalisis} analisis
              </div>

              <div style={{ flex: 1, marginBottom: 18 }}>
                {p.fitur.map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      gap: 8,
                      fontSize: 12,
                      color: T.inkSoft,
                      lineHeight: 1.55,
                      marginBottom: 7,
                    }}
                  >
                    <Check
                      size={12}
                      color={T.teal}
                      style={{ flexShrink: 0, marginTop: 3 }}
                    />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={p.populer ? "primary" : "outline"}
                onClick={() => beli(p.id)}
                disabled={sedangProses || Boolean(proses) || !snap.siap}
                style={{ width: "100%" }}
              >
                {sedangProses ? (
                  <>
                    <Loader2
                      size={14}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    Memproses...
                  </>
                ) : iniPaketAktif ? (
                  <>
                    Perpanjang <Sparkles size={13} />
                  </>
                ) : (
                  <>Pilih paket ini</>
                )}
              </Button>
            </Glass>
          );
        })}
      </div>

      {/* Riwayat pembelian */}
      <div style={{ marginTop: 30 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <Receipt size={15} color={T.inkSoft} />
          <span style={{ fontSize: 14.5, fontWeight: 600, color: T.ink }}>
            Riwayat Pembelian
          </span>
        </div>
        <RiwayatPembelian />
      </div>

      <div
        style={{
          fontSize: 11,
          color: T.inkFaint,
          textAlign: "center",
          marginTop: 18,
          lineHeight: 1.7,
        }}
      >
        Pembayaran aman lewat Midtrans · QRIS, e-wallet, transfer bank, kartu
        kredit
        <br />
        Paket berlaku sejak pembayaran terkonfirmasi dan tidak diperpanjang
        otomatis.
        <br />
        Membeli saat paket masih aktif akan menambah kuota dan menyambung masa
        berlakunya — sisa yang belum terpakai tidak hangus.
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

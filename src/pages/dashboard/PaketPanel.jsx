import React, { useState, useEffect } from "react";
import {
  Check,
  X,
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
import { DAFTAR_PAKET, SEMUA_TIER, PAKET, rupiah, labelDurasi } from "../../data/paket";
import { RiwayatPembelian } from "../../components/RiwayatPembelian";
import { lokal, t } from "../../i18n.js";

/** Paket berbayar yang membuka latihan praktik. */
const PAKET_LATIHAN_AKTIF = ["coba", "aktif", "serius"];

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
  const [sukses, setSukses] = useState("");

  useEffect(() => {
    if (window.snap) {
      setSiap(true);
      return;
    }

    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    if (!clientKey) {
      setGalat(t("VITE_MIDTRANS_CLIENT_KEY belum diisi.", "VITE_MIDTRANS_CLIENT_KEY is not set."));
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
      setGalat(t("Gagal memuat Midtrans. Periksa koneksi internet.", "Couldn't load Midtrans. Check your internet connection."));
    document.head.appendChild(script);
  }, []);

  return { siap, galat };
}

export function PaketPanel() {
  const langganan = useLangganan();
  const snap = useSnapScript();
  const [proses, setProses] = useState(null); // id paket yang sedang diproses
  const [galat, setGalat] = useState("");
  const [sukses, setSukses] = useState("");

  // Kalau kuota masih banyak, beri tahu sebelum membeli.
  // Membiarkan orang membeli sesuatu yang belum dibutuhkan itu
  // menghasilkan keluhan, bukan pendapatan berulang.
  const perluKonfirmasi =
    langganan.aktif &&
    langganan.sisaAnalisis >= Math.ceil(langganan.kuotaAnalisis * 0.6);

  const beli = async (paketId) => {
    if (!supabaseConfigured) {
      setGalat(t("Supabase belum dikonfigurasi.", "Supabase isn't configured yet."));
      return;
    }
    if (!snap.siap) {
      setGalat(
        snap.galat || t("Sistem pembayaran masih dimuat, tunggu sebentar.", "The payment system is still loading, please wait a moment."),
      );
      return;
    }

    setProses(paketId);
    setGalat("");

    try {
      // Pastikan sesi masih valid sebelum memanggil. 401 di create-payment
      // hampir selalu berarti token login sudah kedaluwarsa — memeriksanya
      // di sini memberi pesan yang jelas ketimbang "Unauthorized" mentah.
      const { data: sesiData } = await supabase.auth.getSession();
      if (!sesiData?.session) {
        setGalat(
          t("Sesi kamu sudah berakhir. Muat ulang halaman dan login lagi, lalu coba beli kembali.", "Your session has expired. Reload the page, sign in again, then try buying again."),
        );
        setProses(null);
        return;
      }

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

        // 401 spesifik: sesi tidak diterima server meski ada di klien.
        if (error.context?.status === 401 || /unauthorized/i.test(pesan)) {
          pesan =
            t("Sesi kamu sudah berakhir. Muat ulang halaman dan login lagi, lalu coba beli kembali.", "Your session has expired. Reload the page, sign in again, then try buying again.");
        }
        throw new Error(pesan);
      }
      if (data?.error) throw new Error(data.error);

      window.snap.pay(data.snapToken, {
        onSuccess: async () => {
          setProses(null);
          setSukses(t("Pembayaran berhasil! Mengaktifkan paketmu...", "Payment successful! Activating your plan..."));

          // Webhook Midtrans mengaktifkan langganan di server, dan waktu
          // tibanya tidak pasti — kadang instan, kadang beberapa detik.
          // Diperiksa berulang sampai kuota bertambah, bukan sekali lalu
          // menyerah.
          const kuotaAwal = langganan.sisaAnalisis;
          let bertambah = false;
          for (let i = 0; i < 5; i++) {
            await new Promise((r) => setTimeout(r, 2500));
            await langganan.refresh();
            if (langganan.sisaAnalisis > kuotaAwal || langganan.aktif) {
              bertambah = true;
              break;
            }
          }

          setSukses(
            bertambah
              ? t("Pembayaran berhasil dan paketmu sudah aktif! Selamat menggunakan.", "Payment successful and your plan is active. Enjoy!")
              : "Pembayaran berhasil! Paketmu sedang diaktifkan. Muat ulang " +
                  "halaman ini sebentar kalau kuota belum terlihat bertambah.",
          );
        },
        onPending: () => {
          setGalat(
            t("Pembayaran belum selesai. Langganan aktif otomatis setelah pembayaran terkonfirmasi.", "Payment isn't finished yet. Your plan activates automatically once payment is confirmed."),
          );
          setProses(null);
        },
        onError: () => {
          setGalat(t("Pembayaran gagal. Silakan coba lagi.", "Payment failed. Please try again."));
          setProses(null);
        },
        onClose: () => setProses(null),
      });
    } catch (e) {
      setGalat(e?.message || t("Gagal membuat transaksi.", "Couldn't create the transaction."));
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
          {t("Pilih paket yang sesuai", "Choose a plan")}
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
          {t("Semua loker, CV Builder, dan LinkedIn Builder gratis selamanya. Paket berbayar membuka latihan praktik untuk 40 pekerjaan remote dan menambah kuota analisis AI, Pindah Karier, dan simulasi interview.", "Every job, the CV Builder, and the LinkedIn Builder are free forever. Paid plans unlock hands-on practice for 40 remote roles and add credits for AI analysis, Career Switch, and mock interviews.")}
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
              {langganan.detailPaket?.nama}{" "}{t("sedang aktif", "is active")}
            </div>
            <div style={{ fontSize: 11.5, color: T.inkSoft, marginTop: 2 }}>
              {langganan.jumlahPaket > 1 &&
                t(`${langganan.jumlahPaket} paket digabung · `, `${langganan.jumlahPaket} plans combined · `)}
              {t("Berakhir", "Ends")}{" "}
              {new Date(langganan.berakhirAt).toLocaleDateString(lokal(), {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {PAKET_LATIHAN_AKTIF.includes(langganan.paket) && t(" · latihan praktik terbuka", " · practice unlocked")}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
              {[
                [t("Review CV", "CV review"), langganan.sisaAnalisis, langganan.kuotaAnalisis],
                [t("Pindah Karier", "Career switch"), langganan.sisaPindah, langganan.kuotaPindah],
                [t("Simulasi interview", "Mock interview"), langganan.sisaInterview, langganan.kuotaInterview],
              ].map(([label, sisa, total]) => (
                <div key={label} style={{ flex: "1 1 120px", minWidth: 120, padding: "8px 10px", borderRadius: 10, background: "var(--t-surface-2, rgba(127,127,127,0.08))" }}>
                  <div style={{ fontSize: 11, color: T.inkSoft }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 650, color: total ? T.ink : T.inkSoft }}>
                    {total ? (
                      <>
                        {sisa}
                        <span style={{ fontSize: 11.5, fontWeight: 500, color: T.inkSoft }}> / {total} {t("tersisa", "left")}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{t("Tidak termasuk", "Not included")}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {langganan.segeraBerakhir && (
            <span
              style={{
                fontSize: 11.5,
                color: "var(--t-warn)",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Clock size={12} />{" "}{t("Tinggal", "Only")}{" "}{langganan.sisaHari} hari
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
            color="var(--t-warn)"
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <div style={{ fontSize: 12, color: "var(--t-warn-ink)", lineHeight: 1.6 }}>
            {t("Kuota kamu masih banyak:", "You still have plenty of credits:")}{" "}
            <strong>{langganan.sisaAnalisis}{" "}{t("analisis tersisa", "analyses left")}</strong>{" "}{t("dan aktif", "and active for")}{" "}
            {langganan.sisaHari}{" "}{t("hari lagi. Kalau tetap membeli, kuotanya ditambahkan dan masa berlakunya disambung dari tanggal berakhir sekarang. Kuota lama tetap ada, jadi belum perlu buru-buru.", "more days. If you buy now, the credits are added and validity extends from your current end date. Your current credits stay, so there's no need to rush.")}
          </div>
        </Glass>
      )}

      {sukses && (
        <Glass
          style={{
            padding: "13px 16px",
            marginBottom: 16,
            background: "rgba(20,184,166,0.07)",
            border: "1px solid rgba(20,184,166,0.4)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <Check size={16} color={T.teal} style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize: 12.5,
              color: T.ink,
              lineHeight: 1.6,
              flex: 1,
              minWidth: 180,
            }}
          >
            {sukses}
          </span>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            style={{ fontSize: 12, padding: "7px 14px", flexShrink: 0 }}
          >
            {t("Muat ulang sekarang", "Reload now")}
          </Button>
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
          <AlertCircle size={14} color="var(--t-danger)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, color: "var(--t-danger)" }}>{galat}</span>
        </Glass>
      )}

      {/* Kartu paket */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          alignItems: "start",
        }}
      >
        {SEMUA_TIER.map((p) => {
          const sedangProses = proses === p.id;
          const iniPaketAktif = langganan.aktif && langganan.paket === p.id;
          const gratis = p.harga === 0;
          // Free dianggap "paket sekarang" kalau user belum punya langganan aktif
          const iniTierSekarang = gratis && !langganan.aktif;

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
                  {t("PALING SESUAI", "BEST FIT")}
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
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  }}
                >
                  {rupiah(p.harga)}
                </span>
              </div>
              <div
                style={{ fontSize: 11, color: T.inkFaint, marginBottom: 16 }}
              >
                {gratis
                  ? t("Selamanya · tanpa kartu", "Forever · no card needed")
                  : t(`sekali bayar · berlaku ${labelDurasi(p.durasiHari)} · ${p.kuotaAnalisis} analisis AI`, `one-time · valid ${labelDurasi(p.durasiHari)} · ${p.kuotaAnalisis} AI analyses`)}
              </div>

              <div style={{ flex: 1, marginBottom: 18 }}>
                {p.fitur.map((f) => {
                  // Baris "Semua fitur X, plus:" jadi pemisah, bukan item
                  // bercentang — supaya jelas ini rangkuman tier bawah.
                  const pemisah = f.endsWith("plus:");
                  return (
                    <div
                      key={f}
                      style={{
                        display: "flex",
                        gap: 8,
                        fontSize: 12,
                        color: pemisah ? T.ink : T.inkSoft,
                        fontWeight: pemisah ? 600 : 400,
                        lineHeight: 1.55,
                        marginBottom: 7,
                      }}
                    >
                      {pemisah ? (
                        <Sparkles
                          size={12}
                          color={T.accent}
                          style={{ flexShrink: 0, marginTop: 3 }}
                        />
                      ) : (
                        <Check
                          size={12}
                          color={T.teal}
                          style={{ flexShrink: 0, marginTop: 3 }}
                        />
                      )}
                      <span>{f}</span>
                    </div>
                  );
                })}

                {/* Fitur yang TIDAK termasuk. Ditampilkan terus terang
                    supaya user tahu persis apa yang didapat dengan naik
                    paket — jauh lebih jelas daripada membandingkan dua
                    daftar panjang sendiri. */}
                {(p.tanpa || []).map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      gap: 8,
                      fontSize: 12,
                      color: T.inkFaint,
                      lineHeight: 1.55,
                      marginBottom: 7,
                    }}
                  >
                    <X
                      size={12}
                      color={T.inkFaint}
                      style={{ flexShrink: 0, marginTop: 3 }}
                    />
                    <span
                      style={{ textDecoration: "line-through", opacity: 0.75 }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              {gratis ? (
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    padding: "9px 0",
                    borderRadius: 12,
                    border: `1px dashed ${T.border}`,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: iniTierSekarang ? T.teal : T.inkFaint,
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  }}
                >
                  {iniTierSekarang ? t("Paket kamu sekarang", "Your current plan") : t("Selalu aktif", "Always active")}
                </div>
              ) : (
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
                      {t("Memproses...", "Processing...")}
                    </>
                  ) : iniPaketAktif ? (
                    <>
                      {t("Perpanjang", "Renew")}{" "}<Sparkles size={13} />
                    </>
                  ) : (
                    <>{t("Pilih paket ini", "Choose this plan")}</>
                  )}
                </Button>
              )}
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
            {t("Riwayat Pembelian", "Purchase history")}
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
        {t("Pembayaran lewat QRIS, diproses dengan aman oleh Midtrans", "Pay by QRIS, processed securely by Midtrans")}
        <br />
        {t("Paket berlaku sejak pembayaran terkonfirmasi dan tidak diperpanjang otomatis.", "Plans start once payment is confirmed and never renew automatically.")}
        <br />
        {t("Membeli saat paket masih aktif akan menambah kuota dan menyambung masa berlakunya. Sisa kuota yang belum terpakai ikut dijumlahkan.", "Buying while a plan is active adds credits and extends validity. Unused credits are added together.")}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

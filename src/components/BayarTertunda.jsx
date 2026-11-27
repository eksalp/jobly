import React, { useCallback, useEffect, useState } from "react";
import { Clock, Loader2 } from "lucide-react";
import { T } from "../theme";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { PAKET, rupiah } from "../data/paket";
import { BATAS_BAYAR_MENIT, lanjutkanBayar, sisaMenitBayar } from "../utils/snap";
import { t } from "../i18n.js";

/**
 * Pembayaran paket (pencari kerja) yang jendela Midtrans-nya tertutup
 * sebelum selesai. Selama batas waktunya belum lewat, jendela yang sama
 * bisa dibuka lagi dengan token yang tersimpan. Butuh SQL 20 (izin baca
 * tabel payments untuk pemiliknya).
 *
 * `penanda` dinaikkan oleh PaketPanel setiap jendela pembayaran ditutup,
 * supaya kartu ini langsung muncul tanpa muat ulang halaman.
 */
export function BayarTertunda({ penanda = 0, onLunas }) {
  const { user } = useAuth();
  const [daftar, setDaftar] = useState([]);
  const [proses, setProses] = useState(null);
  const [pesan, setPesan] = useState("");
  const [, setDetak] = useState(0);

  const muat = useCallback(async () => {
    if (!user || !supabaseConfigured) return;
    const batas = new Date(Date.now() - BATAS_BAYAR_MENIT * 60000).toISOString();
    const { data } = await supabase
      .from("payments")
      .select("order_id, gross_amount, snap_token, created_at, status")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .not("snap_token", "is", null)
      .gte("created_at", batas)
      .order("created_at", { ascending: false })
      .limit(3);
    setDaftar(data || []);
  }, [user]);

  useEffect(() => {
    muat();
  }, [muat, penanda]);

  // Perbarui sisa waktu setiap 30 detik
  useEffect(() => {
    if (!daftar.length) return undefined;
    const id = setInterval(() => setDetak((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, [daftar.length]);

  const aktif = daftar.filter((d) => sisaMenitBayar(d.created_at) > 0);
  if (!aktif.length) return null;

  const lanjut = async (d) => {
    setProses(d.order_id);
    setPesan("");
    try {
      await lanjutkanBayar(d.snap_token, {
        onSuccess: () => {
          setProses(null);
          setPesan(t("Pembayaran berhasil! Paketmu sedang diaktifkan.", "Payment successful! Activating your plan."));
          setTimeout(() => {
            muat();
            onLunas?.();
          }, 3000);
        },
        onPending: () => setProses(null),
        onError: () => {
          setProses(null);
          setPesan(t("Sesi pembayaran ini sudah tidak berlaku. Silakan pilih paket lagi.", "This payment session is no longer valid. Please choose a plan again."));
        },
        onClose: () => setProses(null),
      });
    } catch (e) {
      setProses(null);
      setPesan(e.message);
    }
  };

  return (
    <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
      {aktif.map((d) => {
        const paketId = String(d.order_id).split("-")[1];
        const nama = PAKET[paketId]?.nama || t("Paket", "Plan");
        return (
          <div
            key={d.order_id}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "14px 18px",
              borderRadius: 14,
              border: "1px solid #f5d38a",
              background: "var(--t-warn-bg, #fff8e6)",
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--t-warn-ink, #7a4b00)" }}>
                {t("Pembayaran belum selesai", "Payment not finished")}
              </div>
              <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 2 }}>
                {t(`Paket ${nama}`, `${nama} plan`)} · {rupiah(d.gross_amount)} ·{" "}
                {t(`sisa waktu ${sisaMenitBayar(d.created_at)} menit`, `${sisaMenitBayar(d.created_at)} min left`)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => lanjut(d)}
              disabled={Boolean(proses)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                border: 0,
                borderRadius: 10,
                padding: "9px 14px",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                color: "#fff",
                background: "#0b3c6e",
              }}
            >
              {proses === d.order_id ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Clock size={14} />}
              {t("Lanjutkan pembayaran", "Continue payment")}
            </button>
          </div>
        );
      })}
      {pesan && <div style={{ fontSize: 12.5, color: T.inkSoft }}>{pesan}</div>}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  Receipt,
  Loader2,
  Check,
  Clock,
  X,
  Zap,
  ChevronDown,
} from "lucide-react";
import { T } from "../theme";
import { Glass } from "./ui/Glass";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { PAKET, rupiah } from "../data/paket";

const STATUS = {
  aktif: { label: "Aktif", warna: "#0F7B4F", Ikon: Check },
  kedaluwarsa: { label: "Kedaluwarsa", warna: "#8891A8", Ikon: Clock },
  pending: { label: "Menunggu bayar", warna: "#B45309", Ikon: Clock },
  batal: { label: "Batal", warna: "#B23A3A", Ikon: X },
};

const tglLengkap = (s) =>
  s
    ? new Date(s).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

const tglSingkat = (s) =>
  s
    ? new Date(s).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

export function RiwayatPembelian() {
  const { user } = useAuth();
  const [daftar, setDaftar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dibuka, setDibuka] = useState(null);

  useEffect(() => {
    if (!user || !supabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase
      .from("subscriptions")
      .select(
        "id, paket, status, harga, kuota_analisis, kuota_terpakai, mulai_at, berakhir_at, order_id, created_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error)
          console.error("Gagal memuat riwayat pembelian:", error.message);

        // Baris uji dari masa pengembangan disembunyikan agar riwayat
        // hanya memuat transaksi sungguhan.
        const bersih = (data || []).filter(
          (d) => !String(d.order_id || "").startsWith("UJI"),
        );
        setDaftar(bersih);
        setLoading(false);
      });
  }, [user?.id]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12.5,
          color: T.inkSoft,
          padding: "20px 0",
        }}
      >
        <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />{" "}
        Memuat riwayat...
      </div>
    );
  }

  if (daftar.length === 0) {
    return (
      <div
        style={{
          fontSize: 12.5,
          color: T.inkFaint,
          textAlign: "center",
          padding: "24px 18px",
          border: `1px dashed ${T.border}`,
          borderRadius: 14,
          lineHeight: 1.6,
        }}
      >
        Belum ada pembelian. Riwayat paket yang kamu beli akan muncul di sini.
      </div>
    );
  }

  const totalBelanja = daftar
    .filter((d) => d.status === "aktif" || d.status === "kedaluwarsa")
    .reduce((n, d) => n + (d.harga || 0), 0);

  return (
    <div>
      {/* Ringkasan */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 12,
          fontSize: 11.5,
          color: T.inkSoft,
          flexWrap: "wrap",
        }}
      >
        <span>{daftar.length} transaksi</span>
        <span style={{ width: 1, height: 12, background: T.border }} />
        <span>Total belanja {rupiah(totalBelanja)}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {daftar.map((d) => {
          const st = STATUS[d.status] ?? STATUS.batal;
          const { Ikon } = st;
          const detail = PAKET[d.paket];
          const buka = dibuka === d.id;
          const terpakai = d.kuota_terpakai ?? 0;
          const total = d.kuota_analisis ?? 0;

          return (
            <Glass key={d.id} style={{ padding: 14 }}>
              <div
                onClick={() => setDibuka(buka ? null : d.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: `${st.warna}14`,
                    color: st.warna,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ikon size={15} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{ fontSize: 13, fontWeight: 600, color: T.ink }}
                    >
                      {detail?.nama ?? d.paket}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: st.warna,
                        background: `${st.warna}14`,
                        padding: "2px 7px",
                        borderRadius: 99,
                      }}
                    >
                      {st.label}
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 11, color: T.inkFaint, marginTop: 2 }}
                  >
                    {tglSingkat(d.created_at)} · {total} analisis
                  </div>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>
                    {d.harga > 0 ? rupiah(d.harga) : "Gratis"}
                  </div>
                </div>

                <ChevronDown
                  size={14}
                  color={T.inkFaint}
                  style={{
                    flexShrink: 0,
                    transform: buka ? "rotate(180deg)" : "none",
                    transition: "transform .15s",
                  }}
                />
              </div>

              {buka && (
                <div
                  style={{
                    marginTop: 13,
                    paddingTop: 13,
                    borderTop: `1px solid ${T.border}`,
                  }}
                >
                  {/* Pemakaian kuota */}
                  {total > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 6,
                        }}
                      >
                        <Zap size={11} color={T.inkFaint} />
                        <span style={{ fontSize: 11.5, color: T.inkSoft }}>
                          {terpakai} dari {total} analisis terpakai
                        </span>
                      </div>
                      <div
                        style={{
                          height: 4,
                          borderRadius: 99,
                          background: "rgba(0,0,0,0.06)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${total > 0 ? (terpakai / total) * 100 : 0}%`,
                            height: "100%",
                            background: st.warna,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {[
                    ["Mulai berlaku", tglLengkap(d.mulai_at)],
                    ["Berakhir", tglLengkap(d.berakhir_at)],
                    ["Nomor pesanan", d.order_id ?? "—"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        fontSize: 11.5,
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ color: T.inkFaint, flexShrink: 0 }}>
                        {k}
                      </span>
                      <span
                        style={{
                          color: T.ink,
                          textAlign: "right",
                          wordBreak: "break-all",
                          fontFamily:
                            k === "Nomor pesanan"
                              ? "'IBM Plex Mono', monospace"
                              : undefined,
                          fontSize: k === "Nomor pesanan" ? 10.5 : 11.5,
                        }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}

                  {d.status === "pending" && (
                    <div
                      style={{
                        fontSize: 11.5,
                        color: "#92400E",
                        marginTop: 9,
                        lineHeight: 1.55,
                      }}
                    >
                      Pembayaran belum terkonfirmasi. Kalau kamu sudah membayar,
                      paket akan aktif otomatis dalam beberapa menit.
                    </div>
                  )}
                </div>
              )}
            </Glass>
          );
        })}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

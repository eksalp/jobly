// @ts-nocheck
// Edge Function: kabar-loker
// Dipanggil dasbor pemberi kerja setelah loker diajukan. Mengirim ringkasan
// loker ke admin Telegram (TELEGRAM_ADMIN_IDS) beserta tombol Setujui/Tolak
// yang ditangani telegram-bot.
//
// Masukan: { id: <nomor loker_perusahaan> }

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rp = (n) => (n ? `Rp${Number(n).toLocaleString("id-ID")}` : "");

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  try {
    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    const { id } = await req.json();
    // Dibaca dengan sesi pengguna: RLS memastikan hanya loker miliknya
    const { data: m } = await supa.from("loker_perusahaan").select("*").eq("id", id).maybeSingle();
    if (!m || m.status !== "menunggu") {
      console.warn(`kabar-loker: loker ${id} tidak ditemukan atau statusnya ${m?.status ?? "-"}`);
      return json({ ok: false, alasan: "loker tidak ditemukan / bukan menunggu" });
    }
    const { data: pt } = await supa.from("perusahaan").select("nama, situs, kota").eq("user_id", m.user_id).maybeSingle();

    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const admin = (Deno.env.get("TELEGRAM_ADMIN_IDS") ?? "").split(/[,\s]+/).filter(Boolean);
    if (!token || !admin.length) {
      console.error(`kabar-loker: secret ${!token ? "TELEGRAM_BOT_TOKEN" : "TELEGRAM_ADMIN_IDS"} belum di-set`);
      return json({ ok: false, alasan: "Telegram belum diatur" });
    }

    const situs = (Deno.env.get("JOBLY_URL") ?? "https://workly.id").replace(/\/+$/, "");
    const gaji = m.gaji_min ? `${rp(m.gaji_min)}${m.gaji_max ? `–${rp(m.gaji_max)}` : ""}${m.tampilkan_gaji ? "" : " (disembunyikan)"}` : "";
    const ulang = m.tayang_sampai ? "\n<i>Pengajuan ulang setelah diubah (loker sudah pernah tayang)</i>" : "";
    const teks = `<b>Loker baru menunggu persetujuan</b> #${m.id}${ulang}

<b>${esc(m.posisi)}</b>
${esc(pt?.nama)}${pt?.situs ? ` · ${esc(pt.situs)}` : ""}
${[m.lokasi || pt?.kota, m.tipe, m.cara_kerja, gaji].filter(Boolean).map(esc).join(" · ")}
Lamar: ${esc(m.link)}

${esc(String(m.deskripsi || "").slice(0, 1200))}${String(m.deskripsi || "").length > 1200 ? "…" : ""}

Tolak dengan alasan: <code>/tolakloker ${m.id} alasannya</code>
Semua antrean: ${situs}/pemberi-kerja/admin`;

    const hasil = await Promise.all(
      admin.map((chat_id) =>
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id,
            text: teks,
            parse_mode: "HTML",
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [[
                { text: "Setujui", callback_data: `m|s|${m.id}` },
                { text: "Tolak", callback_data: `m|t|${m.id}` },
              ]],
            },
          }),
        })
          .then(async (res) => {
            const b = await res.json().catch(() => ({}));
            if (!b.ok) console.error(`kabar-loker: Telegram menolak kirim ke ${chat_id}: ${b.description || res.status}`);
            return Boolean(b.ok);
          })
          .catch((e) => {
            console.error(`kabar-loker: gagal menghubungi Telegram: ${e?.message}`);
            return false;
          }),
      ),
    );
    console.log(`kabar-loker: loker #${m.id} dikirim ke ${hasil.filter(Boolean).length}/${admin.length} admin`);
    return json({ ok: hasil.some(Boolean) });
  } catch (e) {
    console.error("kabar-loker:", e?.message);
    return json({ ok: false }, 200);
  }
});

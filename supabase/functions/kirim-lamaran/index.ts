// @ts-nocheck
// Edge Function: kirim-lamaran
// Menyimpan lamaran dari formulir Workly (workly.id/lamar/<nomor>) dan
// meneruskannya ke email perusahaan, lengkap dengan CV terlampir.
//
// Masukan: { loker_id, nama, email, telepon, domisili, tautan, pesan, cv_path }
//   cv_path = file PDF yang sudah diunggah pelamar ke bucket cv-pelamar
//             di foldernya sendiri (<user id>/...).
//
// Secret: RESEND_API_KEY (API key Resend, domain workly.id terverifikasi).
// Tanpa secret ini lamaran tetap tersimpan dan terlihat di dasbor
// perusahaan, hanya email pemberitahuannya yang tidak terkirim.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const potong = (v, n) => String(v ?? "").trim().slice(0, n);
const SITUS = (Deno.env.get("JOBLY_URL") ?? "https://workly.id").replace(/\/+$/, "");
const PENGIRIM = Deno.env.get("EMAIL_PENGIRIM") ?? "Workly <noreply@workly.id>";

async function kirimEmail(isi) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) {
    console.warn("kirim-lamaran: RESEND_API_KEY belum di-set, email tidak dikirim");
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: PENGIRIM, ...isi }),
  });
  if (!res.ok) console.error(`kirim-lamaran: Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.ok;
}

const bingkai = (judul, isi) => `<div style="background:#f4f6fb;padding:28px 14px;font-family:Arial,Helvetica,sans-serif;color:#111b29">
<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e3e8f0;border-radius:16px;padding:28px 26px">
<div style="font-size:20px;font-weight:800;color:#1660F5;margin-bottom:18px">Workly</div>
<h1 style="font-size:19px;margin:0 0 14px">${judul}</h1>${isi}</div>
<p style="text-align:center;font-size:12px;color:#8a94a3;margin:14px 0 0">Workly · workly.id</p></div>`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    const {
      data: { user },
    } = await supa.auth.getUser();
    if (!user) return json({ error: "Silakan masuk terlebih dahulu." }, 401);
    if (user.user_metadata?.peran === "perusahaan") return json({ error: "Akun perusahaan tidak bisa mengirim lamaran." }, 403);

    const b = await req.json();
    const lokerId = Number(b.loker_id);
    const data = {
      nama: potong(b.nama, 120),
      email: potong(b.email, 160).toLowerCase(),
      telepon: potong(b.telepon, 40) || null,
      domisili: potong(b.domisili, 120) || null,
      tautan: potong(b.tautan, 300) || null,
      pesan: potong(b.pesan, 3000) || null,
      cv_path: potong(b.cv_path, 300),
    };
    if (!lokerId || data.nama.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return json({ error: "Nama dan email wajib diisi dengan benar." }, 400);
    }
    if (!data.cv_path.startsWith(`${user.id}/`) || !data.cv_path.endsWith(".pdf")) {
      return json({ error: "CV belum terunggah. Unggah CV dalam format PDF." }, 400);
    }
    if (data.tautan && !/^https?:\/\//i.test(data.tautan)) data.tautan = `https://${data.tautan}`;

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: loker } = await admin
      .from("loker_perusahaan")
      .select("id, user_id, posisi, status, cara_lamar, email_lamaran, tayang_sampai")
      .eq("id", lokerId)
      .maybeSingle();
    if (!loker || loker.status !== "tayang" || loker.cara_lamar !== "form" || new Date(loker.tayang_sampai) <= new Date()) {
      return json({ error: "Lowongan ini sudah tidak menerima lamaran lewat Workly." }, 410);
    }
    const { data: pt } = await admin.from("perusahaan").select("nama").eq("user_id", loker.user_id).maybeSingle();

    const { data: lamaran, error: galat } = await admin
      .from("lamaran_mitra")
      .insert({ loker_id: lokerId, pelamar_id: user.id, ...data })
      .select("id")
      .single();
    if (galat) {
      if (galat.code === "23505") return json({ error: "Kamu sudah pernah melamar lowongan ini." }, 409);
      throw new Error(galat.message);
    }
    // Hitung sebagai klik lamar di statistik perusahaan
    await admin.rpc("catat_loker_mitra", { p_id: lokerId, p_jenis: "klik" }).then(() => {}, () => {});

    // ------------------------------------------------ email ke perusahaan
    let tujuan = loker.email_lamaran;
    if (!tujuan) {
      const { data: u } = await admin.auth.admin.getUserById(loker.user_id);
      tujuan = u?.user?.email;
    }
    const { data: tanda } = await admin.storage.from("cv-pelamar").createSignedUrl(data.cv_path, 60 * 60 * 24 * 7);
    const baris = (k, v) =>
      v ? `<tr><td style="padding:6px 0;color:#6b7685;width:120px;vertical-align:top">${k}</td><td style="padding:6px 0">${v}</td></tr>` : "";
    const namaFile = `CV-${data.nama.replace(/[^A-Za-z0-9]+/g, "-")}.pdf`;

    let terkirim = false;
    if (tujuan) {
      terkirim = await kirimEmail({
        to: [tujuan],
        reply_to: data.email,
        subject: `Lamaran baru: ${loker.posisi} – ${data.nama}`,
        html: bingkai(
          `Lamaran baru untuk ${esc(loker.posisi)}`,
          `<table style="width:100%;font-size:14px;border-collapse:collapse">
${baris("Nama", esc(data.nama))}
${baris("Email", `<a href="mailto:${esc(data.email)}">${esc(data.email)}</a>`)}
${baris("Telepon / WA", esc(data.telepon))}
${baris("Domisili", esc(data.domisili))}
${baris("LinkedIn / portofolio", data.tautan ? `<a href="${esc(data.tautan)}">${esc(data.tautan)}</a>` : "")}
</table>
${data.pesan ? `<div style="margin:16px 0;padding:14px;border-radius:10px;background:#f4f6fb;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(data.pesan)}</div>` : ""}
<p style="font-size:14px;line-height:1.6;margin:16px 0">CV pelamar terlampir di email ini.${tanda?.signedUrl ? ` Bisa juga diunduh <a href="${tanda.signedUrl}">di sini</a> (berlaku 7 hari).` : ""}</p>
<a href="${SITUS}/pemberi-kerja/dasbor" style="display:inline-block;background:#0b3c6e;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:11px 20px;border-radius:10px">Lihat semua pelamar</a>
<p style="font-size:12.5px;color:#6b7685;margin:18px 0 0">Balas email ini untuk menghubungi pelamar secara langsung.</p>`,
        ),
        attachments: tanda?.signedUrl ? [{ filename: namaFile, path: tanda.signedUrl }] : undefined,
      });
    }

    // ------------------------------------------------ konfirmasi ke pelamar
    await kirimEmail({
      to: [data.email],
      subject: `Lamaranmu untuk ${loker.posisi} sudah terkirim`,
      html: bingkai(
        "Lamaranmu sudah terkirim",
        `<p style="font-size:14.5px;line-height:1.6;margin:0 0 14px">Lamaranmu untuk posisi <b>${esc(loker.posisi)}</b>${pt?.nama ? ` di <b>${esc(pt.nama)}</b>` : ""} sudah kami teruskan ke perusahaan.</p>
<p style="font-size:14px;line-height:1.6;color:#3b4656;margin:0">Perusahaan akan menghubungimu langsung bila lamaranmu sesuai. Semoga berhasil!</p>`,
      ),
    });

    console.log(`kirim-lamaran: lamaran #${lamaran.id} untuk loker #${lokerId}, email perusahaan ${terkirim ? "terkirim" : "tidak terkirim"}`);
    return json({ ok: true, id: lamaran.id });
  } catch (e) {
    console.error("kirim-lamaran:", e?.message);
    return json({ error: "Lamaran gagal dikirim. Coba lagi sebentar." }, 500);
  }
});

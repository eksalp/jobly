// @ts-nocheck
// Email pemberitahuan ke perusahaan setelah loker disetujui atau ditolak.
// Dipakai telegram-bot (tombol Setujui/Tolak, /tolakloker) dan edge function
// kabar-perusahaan (dari halaman admin di situs).
//
// Secret: RESEND_API_KEY. EMAIL_PENGIRIM opsional (bawaan Workly <noreply@workly.id>).

const URL_DB = (Deno.env.get("SUPABASE_URL") ?? "").replace(/\/+$/, "");
const KUNCI = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const SITUS = (Deno.env.get("JOBLY_URL") ?? "https://workly.id").replace(/\/+$/, "");
const PENGIRIM = Deno.env.get("EMAIL_PENGIRIM") ?? "Workly <noreply@workly.id>";
const ID_MITRA = 800000000;

const kepala = () => (KUNCI.startsWith("sb_") ? { apikey: KUNCI } : { apikey: KUNCI, Authorization: `Bearer ${KUNCI}` });
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function ambilJson(path) {
  const res = await fetch(`${URL_DB}${path}`, { headers: kepala() });
  if (!res.ok) throw new Error(`${path.split("?")[0]} ${res.status}`);
  return res.json();
}

const tglId = (iso) =>
  iso ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }) : "";

const bingkai = (judul, isi) => `<div style="background:#f4f6fb;padding:28px 14px;font-family:Arial,Helvetica,sans-serif;color:#111b29">
<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e3e8f0;border-radius:16px;padding:28px 26px">
<div style="font-size:20px;font-weight:800;color:#1660F5;margin-bottom:18px">Workly</div>
<h1 style="font-size:19px;margin:0 0 14px">${judul}</h1>${isi}</div>
<p style="text-align:center;font-size:12px;color:#8a94a3;margin:14px 0 0">Workly · workly.id</p></div>`;

const tombol = (href, teks) =>
  `<a href="${href}" style="display:inline-block;background:#0b3c6e;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:11px 20px;border-radius:10px">${teks}</a>`;

/**
 * Kirim email status loker ke akun perusahaan pemiliknya.
 * Mengembalikan { ok, ke, alasan } — tidak pernah melempar galat,
 * supaya persetujuan/penolakan tetap berhasil walau email gagal.
 */
export async function kabariPerusahaan(id) {
  try {
    const key = Deno.env.get("RESEND_API_KEY");
    if (!key) return { ok: false, alasan: "RESEND_API_KEY belum di-set" };

    const [m] = await ambilJson(
      `/rest/v1/loker_perusahaan?id=eq.${Number(id)}&select=id,user_id,posisi,status,alasan_tolak,tayang_sampai,sudah_bayar`,
    );
    if (!m) return { ok: false, alasan: "loker tidak ditemukan" };
    if (!["tayang", "ditolak"].includes(m.status)) return { ok: false, alasan: `status ${m.status}` };
    const [pt] = await ambilJson(`/rest/v1/perusahaan?user_id=eq.${m.user_id}&select=nama,kontak_nama`);
    const u = await ambilJson(`/auth/v1/admin/users/${m.user_id}`);
    const ke = u?.email;
    if (!ke) return { ok: false, alasan: "email akun tidak ditemukan" };

    const sapa = `<p style="font-size:14.5px;line-height:1.6;margin:0 0 14px">Halo${pt?.kontak_nama ? ` ${esc(pt.kontak_nama)}` : ""},</p>`;
    let subject, html;
    if (m.status === "tayang") {
      subject = `Loker ${m.posisi} sudah tayang di Workly`;
      html = bingkai(
        "Lokermu sudah tayang",
        `${sapa}<p style="font-size:14.5px;line-height:1.6;margin:0 0 14px">Loker <b>${esc(m.posisi)}</b>${pt?.nama ? ` dari <b>${esc(pt.nama)}</b>` : ""} sudah kami setujui dan kini tampil sebagai loker prioritas di Workly${m.tayang_sampai ? ` sampai <b>${tglId(m.tayang_sampai)}</b>` : ""}.</p>
<p style="margin:0 0 18px">${tombol(`${SITUS}/loker/db1-${ID_MITRA + m.id}`, "Lihat loker")}</p>
<p style="font-size:13.5px;line-height:1.6;color:#3b4656;margin:0">Jumlah dilihat, klik lamar, dan pelamar bisa dipantau di <a href="${SITUS}/pemberi-kerja/dasbor">dasbor perusahaan</a>.</p>`,
      );
    } else {
      const kreditKembali = !m.tayang_sampai;
      subject = `Loker ${m.posisi} perlu diperbaiki`;
      html = bingkai(
        "Lokermu belum bisa ditayangkan",
        `${sapa}<p style="font-size:14.5px;line-height:1.6;margin:0 0 14px">Loker <b>${esc(m.posisi)}</b> belum bisa kami tayangkan dengan alasan berikut:</p>
<div style="margin:0 0 16px;padding:14px;border-radius:10px;background:#fef2f2;color:#991b1b;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(m.alasan_tolak || "Isi loker belum memenuhi ketentuan Workly.")}</div>
<p style="font-size:14px;line-height:1.6;margin:0 0 18px">Silakan perbaiki lokernya di dasbor lalu ajukan kembali.${kreditKembali ? " Kredit yang terpakai sudah dikembalikan, jadi pengajuan ulang tidak memotong kredit lagi." : ""}</p>
<p style="margin:0">${tombol(`${SITUS}/pemberi-kerja/dasbor`, "Buka dasbor")}</p>`,
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: PENGIRIM, to: [ke], subject, html }),
    });
    if (!res.ok) {
      const t = (await res.text()).slice(0, 200);
      console.error(`kabariPerusahaan: Resend ${res.status}: ${t}`);
      return { ok: false, ke, alasan: `Resend ${res.status}` };
    }
    return { ok: true, ke };
  } catch (e) {
    console.error("kabariPerusahaan:", e?.message);
    return { ok: false, alasan: e?.message };
  }
}

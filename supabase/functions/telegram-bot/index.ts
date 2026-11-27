// @ts-nocheck
// Edge Function: telegram-bot — bot Telegram Workly untuk mencari loker.
//
// Pengguna cukup mengetik, misalnya:
//   "data science"            → loker data science
//   "admin jakarta"           → admin di Jakarta
//   "remote marketing"        → marketing yang bisa remote
//   "freelance desain"        → desain freelance
//   "bumn engineer"           → engineer di BUMN
//   /remote /freelance /bumn /magang /bantuan
//
// Data diambil dari API Workly (workly.id/api/loker), jadi hasil dan
// kecerdasan pencariannya sama persis dengan situs: padanan kata, kota,
// bidang, BUMN, dan seterusnya.
//
// Secret yang dibutuhkan:
//   TELEGRAM_BOT_TOKEN        token dari @BotFather
//   TELEGRAM_WEBHOOK_SECRET   teks acak; dikirim Telegram di setiap pesan
//   JOBLY_URL (opsional)      bawaan https://workly.id
//   TELEGRAM_ADMIN_IDS        ID Telegram admin (dipisah koma) untuk
//                             mengelola sertifikasi; cek lewat /idku
//
// Rekomendasi sertifikasi & pelatihan:
//   /sertifikasi [posisi]     semua orang
//   /sadmin                   daftar perintah admin (lihat sertifikasi.ts)
//
// Urgently hiring:
//   /urgent                   semua orang: daftar loker urgent
//   /urgent <link|kata>       admin: tandai urgent (lihat urgent.ts)
//   /lepasurgent <link>       admin: hapus tanda urgent
//
// Loker manual (admin, lihat manual.ts):
//   /lokerbaru /lokermanual /lokerubah /lokertutup /lokerbuka

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { bacaPermintaan } from "./parser.ts";
import * as S from "./sertifikasi.ts";
import * as U from "./urgent.ts";
import * as M from "./manual.ts";
import * as P from "./mitra.ts";
import { kabariPerusahaan } from "../_shared/kabarPerusahaan.ts";

const TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const RAHASIA = Deno.env.get("TELEGRAM_WEBHOOK_SECRET") ?? "";
const SITUS = (Deno.env.get("JOBLY_URL") ?? "https://workly.id").replace(/\/+$/, "");
const PER_HALAMAN = 5;

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function tg(metode, isi) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${metode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(isi),
  });
  if (!res.ok) console.warn("Telegram", metode, res.status, (await res.text()).slice(0, 200));
}

function judulFilter(f) {
  const bagian = [];
  if (f.q) bagian.push(`"${f.q}"`);
  if (f.tipe) bagian.push(f.tipe);
  if (f.lokasi) bagian.push(f.lokasi);
  if (f.bumn) bagian.push("BUMN");
  if (f.kota) bagian.push(`di ${f.kota}`);
  if (f.urgent) bagian.push("urgently hiring");
  return bagian.join(" · ") || "terbaru";
}

function waktu(iso) {
  if (!iso) return "";
  const hari = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (hari <= 0) return "hari ini";
  if (hari === 1) return "kemarin";
  if (hari < 30) return `${hari} hari lalu`;
  return `${Math.floor(hari / 30)} bulan lalu`;
}

async function cariLoker(f, kursor) {
  const p = new URLSearchParams({ aksi: "daftar", n: String(PER_HALAMAN) });
  Object.entries(f).forEach(([k, v]) => v && p.set(k, v));
  if (kursor) p.set("c", kursor);
  // Kunci bersama supaya lolos penjaga anti-scraping di /api/loker
  const kunci = Deno.env.get("JOBLY_API_KUNCI");
  const res = await fetch(`${SITUS}/api/loker?${p}`, { headers: kunci ? { "x-jobly-kunci": kunci } : {} });
  if (!res.ok) throw new Error(`API Workly ${res.status}`);
  return res.json();
}

// callback_data maks 64 byte: "m|<kursor>|<filter ringkas>"
const kodeFilter = (f) =>
  [f.q || "", f.kota || "", f.lokasi || "", f.tipe || "", f.bumn ? "1" : "", f.urgent ? "1" : ""].join("~").slice(0, 44);
const bacaKode = (s) => {
  const [q, kota, lokasi, tipe, bumn, urgent] = String(s || "").split("~");
  return Object.fromEntries(Object.entries({ q, kota, lokasi, tipe, bumn, urgent }).filter(([, v]) => v));
};

async function kirimHasil(chatId, f, kursor = "", total = null) {
  let d;
  try {
    d = await cariLoker(f, kursor);
  } catch (e) {
    console.error(e);
    return tg("sendMessage", { chat_id: chatId, text: "Maaf, data loker sedang tidak bisa dimuat. Coba lagi sebentar lagi ya." });
  }
  const rows = d.rows || [];
  const jumlah = d.total ?? total;
  const linkSitus = `${SITUS}/loker?${new URLSearchParams(Object.fromEntries(Object.entries(f).filter(([, v]) => v)))}`;

  if (!rows.length) {
    return tg("sendMessage", {
      chat_id: chatId,
      parse_mode: "HTML",
      text: `Belum ada loker untuk <b>${esc(judulFilter(f))}</b>.\n\nCoba kata yang lebih umum, misalnya <i>admin</i>, <i>marketing jakarta</i>, atau <i>remote</i>.`,
    });
  }

  const daftar = rows
    .map((r, i) => {
      const posisi = r.title || r.posisi || "Lowongan";
      const pt = r.company || r.perusahaan || "";
      const lokasi = r.location || r.lokasi || "";
      const url = `${SITUS}/loker/${U.kodeLoker(r._s || "db1", r.id)}`;
      const tgl = waktu(r.date_posted || r.created_at || r.posted_at);
      const urgent = r.urgent === true && (!r.urgent_sampai || new Date(r.urgent_sampai).getTime() > Date.now());
      return `<b>${esc(posisi)}</b>${urgent ? " · <i>Urgently hiring</i>" : ""}\n🏢 ${esc(pt)}${lokasi ? ` · 📍 ${esc(lokasi)}` : ""}${tgl ? ` · 🕒 ${tgl}` : ""}\n<a href="${url}">Lihat & lamar →</a>`;
    })
    .join("\n\n");

  const kepala = kursor
    ? `🔎 Lanjutan <b>${esc(judulFilter(f))}</b>`
    : `🔎 Loker <b>${esc(judulFilter(f))}</b>${jumlah ? ` · ${Number(jumlah).toLocaleString("id-ID")} lowongan` : ""}`;

  const tombol = [];
  if (d.kursor) tombol.push({ text: `${PER_HALAMAN} berikutnya ›`, callback_data: `m|${String(d.kursor).slice(0, 14)}|${kodeFilter(f)}` });
  tombol.push({ text: "Buka di Workly", url: linkSitus });

  return tg("sendMessage", {
    chat_id: chatId,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    text: `${kepala}\n\n${daftar}`,
    reply_markup: { inline_keyboard: [tombol] },
  });
}

const BANTUAN = `Halo! Aku bot <b>Workly</b> 👋
Ketik saja loker yang kamu cari, contohnya:

• <code>data science</code>
• <code>admin jakarta</code>
• <code>remote marketing</code>
• <code>freelance desain</code>
• <code>bumn engineer</code>
• <code>magang bandung</code>

Perintah cepat:
/remote · /freelance · /bumn · /magang · /terbaru · /urgent

Cari sertifikasi & pelatihan yang cocok:
<code>/sertifikasi data analyst</code>

Semua loker diambil dari situs karier perusahaan, BUMN, LinkedIn, Indeed, dan lainnya di ${SITUS.replace("https://", "")}. Gratis.`;

const kirim = (chatId, text, extra = {}) =>
  tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true, ...extra });

const tombolDraf = (id) => ({ inline_keyboard: [[{ text: "✅ Terbitkan", callback_data: `s|t|${id}` }, { text: "🗑️ Arsipkan", callback_data: `s|a|${id}` }]] });

async function sertifikasiUmum(chatId, kata) {
  const hasil = await S.rekomendasi(kata);
  const link = `${SITUS}/sertifikasi${kata ? `?q=${encodeURIComponent(kata)}` : ""}`;
  if (!hasil.length) {
    return kirim(chatId, `Belum ada rekomendasi untuk <b>${esc(kata)}</b>. Coba kata yang lebih umum, misalnya <i>data</i>, <i>marketing</i>, atau <i>pajak</i>.`, {
      reply_markup: { inline_keyboard: [[{ text: "Lihat semua di Workly", url: `${SITUS}/sertifikasi` }]] },
    });
  }
  return kirim(chatId, `🎓 Sertifikasi & pelatihan${kata ? ` untuk <b>${esc(kata)}</b>` : ""}\n\n${hasil.map((r) => S.kartu(r)).join("\n\n")}`, {
    reply_markup: { inline_keyboard: [[{ text: "Lihat semua di Workly", url: link }]] },
  });
}

/** Perintah admin sertifikasi. Mengembalikan true bila perintah dikenali. */
async function perintahAdmin(chatId, userId, perintah, teks) {
  const baris = teks.split("\n");
  const argumen = baris[0].split(/\s+/).slice(1).join(" ").trim();
  const isi = baris.slice(1).join("\n");
  const id = Number(argumen.match(/\d+/)?.[0] || 0);
  const oleh = userId;

  switch (perintah) {
    case "/sadmin":
      await kirim(chatId, `${S.BANTUAN_ADMIN}\n\n${U.BANTUAN_URGENT}\n\n${M.BANTUAN_MANUAL}\n\n${P.BANTUAN_MITRA}`);
      return true;
    case "/sformat":
      await kirim(chatId, S.FORMAT);
      return true;
    case "/slist": {
      const d = await S.daftar({ kata: argumen, semua: true, batas: 40 });
      if (!d.length) await kirim(chatId, "Belum ada data.");
      else {
        const teksDaftar = d.map((r) => `#${r.id} ${esc(r.nama)}\n   ${S.statusTeks(r)}`).join("\n");
        await kirim(chatId, `<b>Sertifikasi (${d.length})</b>\n${teksDaftar}\n\nDetail: /slihat &lt;nomor&gt;`);
      }
      return true;
    }
    case "/sbaru": {
      const d = (await S.daftar({ semua: false, batas: 300 })).filter((r) => {
        const h = S.hariKe(r.tutup);
        return h !== null && h <= 7;
      });
      await kirim(
        chatId,
        d.length
          ? `<b>Perlu diperbarui</b>\n${d.map((r) => `#${r.id} ${esc(r.nama)}${r.batch ? ` (${esc(r.batch)})` : ""}\n   ${S.statusTeks(r)}`).join("\n")}\n\nPerbarui batch dengan /subah &lt;nomor&gt;, misalnya:\n<code>/subah 12\nbatch: Batch 2 2027\nbuka: 2027-01-05\ntutup: 2027-02-01</code>`
          : "Aman. Tidak ada yang tutup dalam 7 hari ke depan.",
      );
      return true;
    }
    case "/slihat": {
      const r = id && (await S.ambil(id));
      await kirim(chatId, r ? S.kartu(r, { lengkap: true }) : "Nomor tidak ditemukan.", r && !r.aktif ? { reply_markup: tombolDraf(r.id) } : {});
      return true;
    }
    case "/stambah": {
      const { data, galat } = S.bacaBlok(isi || argumen);
      if (!data.nama) {
        await kirim(chatId, `Nama wajib diisi.\n\n${S.FORMAT}`);
        return true;
      }
      const r = await S.tambah(data, oleh);
      await kirim(chatId, `✅ Ditambahkan.\n\n${S.kartu(r, { lengkap: true })}${galat.length ? `\n\n⚠️ Dilewati: ${esc(galat.join("; "))}` : ""}`);
      return true;
    }
    case "/subah": {
      if (!id) {
        await kirim(chatId, "Tulis nomornya, misalnya <code>/subah 12</code> lalu baris kunci: nilai.");
        return true;
      }
      const { data, galat } = S.bacaBlok(isi);
      if (!Object.keys(data).length) {
        await kirim(chatId, `Tidak ada yang diubah.${galat.length ? `\n⚠️ ${esc(galat.join("; "))}` : ""}\n\nContoh:\n<code>/subah ${id}\ntutup: 2026-12-15</code>`);
        return true;
      }
      const r = await S.ubah(id, data, oleh);
      await kirim(chatId, r ? `✏️ Diperbarui.\n\n${S.kartu(r, { lengkap: true })}${galat.length ? `\n\n⚠️ Dilewati: ${esc(galat.join("; "))}` : ""}` : "Nomor tidak ditemukan.");
      return true;
    }
    case "/sterbit":
    case "/sarsip": {
      const r = id && (await S.ubah(id, { aktif: perintah === "/sterbit" }, oleh));
      await kirim(chatId, r ? `${perintah === "/sterbit" ? "✅ Terbit" : "🗄️ Diarsipkan"}: #${r.id} ${esc(r.nama)}` : "Nomor tidak ditemukan.");
      return true;
    }
    case "/sai": {
      const sumber = `${argumen}\n${isi}`.trim();
      if (sumber.length < 30) {
        await kirim(chatId, "Tempel teks pengumumannya setelah /sai (boleh di baris berikutnya).");
        return true;
      }
      await tg("sendChatAction", { chat_id: chatId, action: "typing" });
      const { data, galat } = await S.ekstrakAi(sumber);
      if (!data.nama) {
        await kirim(chatId, "AI tidak menemukan nama program di teks itu. Coba tambahkan dengan /stambah.");
        return true;
      }
      const r = await S.tambah({ ...data, aktif: false }, oleh);
      await kirim(
        chatId,
        `🤖 Draf dari AI. Periksa dulu, ubah dengan <code>/subah ${r.id}</code> bila perlu, lalu terbitkan.\n\n${S.kartu(r, { lengkap: true })}${galat.length ? `\n\n⚠️ ${esc(galat.join("; "))}` : ""}`,
        { reply_markup: tombolDraf(r.id) },
      );
      return true;
    }
  }
  return false;
}

const judulBaris = (r) => `${esc(r.title || "Lowongan")}${r.company ? ` · ${esc(r.company)}` : ""}`;
const linkLoker = (r) => `${SITUS}/loker/${U.kodeLoker(r.db, r.id)}`;

/** /urgent dan /lepasurgent untuk admin. */
async function perintahUrgent(chatId, perintah, teks) {
  const argumen = teks.replace(/^\S+/, "").trim();
  if (perintah === "/lepasurgent") {
    const ruj = U.bacaRujukan(argumen);
    if (!ruj) return kirim(chatId, "Tempel link lokernya, misalnya <code>/lepasurgent https://workly.id/loker/1758392041-admin</code>");
    const r = await U.lepas(ruj);
    return kirim(chatId, r ? `Tanda urgent dihapus: <a href="${linkLoker(r)}">${judulBaris(r)}</a>` : "Loker tidak ditemukan.");
  }
  if (!argumen) {
    const d = await U.daftarUrgent();
    const ok = d.filter((r) => !r.galat);
    const galat = d.filter((r) => r.galat).map((r) => `⚠️ ${esc(r.galat)}`);
    const isi = ok.length
      ? ok.map((r, i) => `${i + 1}. <a href="${linkLoker(r)}">${judulBaris(r)}</a>\n   ${U.sisaTeks(r)}`).join("\n")
      : "Belum ada loker yang ditandai urgent.";
    const tombol = ok.slice(0, 20).map((r, i) => [{ text: `Lepas ${i + 1}`, callback_data: `u|-|${r.db}|${r.id}` }]);
    return kirim(chatId, `<b>Urgently hiring (${ok.length})</b>\n\n${isi}${galat.length ? `\n\n${galat.join("\n")}` : ""}\n\n${U.BANTUAN_URGENT}`, tombol.length ? { reply_markup: { inline_keyboard: tombol } } : {});
  }
  // Link/nomor loker, boleh diakhiri jumlah hari
  const mHari = argumen.match(/^(\S+)\s+(\d{1,3})$/);
  const ruj = U.bacaRujukan(mHari ? mHari[1] : argumen);
  if (ruj) {
    const r = await U.tandai(ruj, mHari ? Number(mHari[2]) : undefined);
    return kirim(chatId, r ? `Ditandai urgent ${U.sisaTeks(r)}:\n<a href="${linkLoker(r)}">${judulBaris(r)}</a>` : "Loker tidak ditemukan.", r ? { reply_markup: { inline_keyboard: [[{ text: "Batalkan", callback_data: `u|-|${r.db}|${r.id}` }]] } } : {});
  }
  // Kata kunci: tampilkan hasil pencarian untuk dipilih
  const d = await cariLoker({ q: argumen }, "");
  const rows = (d.rows || []).map((r) => ({ ...r, db: r._s || "db1" }));
  if (!rows.length) return kirim(chatId, `Tidak ada loker untuk <b>${esc(argumen)}</b>. Coba kata lain atau tempel link lokernya.`);
  const isi = rows.map((r, i) => `${i + 1}. <a href="${linkLoker(r)}">${judulBaris(r)}</a>${r.urgent ? " (urgent)" : ""}`).join("\n");
  const tombol = rows.map((r, i) => ({ text: r.urgent ? `Lepas ${i + 1}` : `Tandai ${i + 1}`, callback_data: `u|${r.urgent ? "-" : "+"}|${r.db}|${r.id}` }));
  return kirim(chatId, `Pilih loker yang ingin ditandai urgent (${U.sisaTeks({ urgent_sampai: new Date(Date.now() + 14 * 86400000).toISOString() })}):\n\n${isi}`, {
    reply_markup: { inline_keyboard: [tombol] },
  });
}

/** Perintah loker manual (admin). */
async function perintahManual(chatId, userId, perintah, teks) {
  const barisPertama = teks.split("\n")[0];
  const argumen = barisPertama.replace(/^\S+/, "").trim();
  const isi = teks.split("\n").slice(1).join("\n");
  const nomor = Number(argumen.match(/\d+/)?.[0] || 0);
  const tombolTutup = (r) => ({ inline_keyboard: [[{ text: "Lihat di Workly", url: M.linkManual(SITUS, r) }, { text: "Tutup loker", callback_data: `l|t|${r.id}` }]] });

  if (perintah === "/lokerbaru") {
    if (!isi.trim() && !argumen) return kirim(chatId, M.TEMPLATE);
    const h = await M.simpanBaru(`${argumen}\n${isi}`, userId);
    if (h.kurang) {
      return kirim(chatId, `Belum lengkap: <b>${h.kurang.join(", ")}</b> wajib diisi.${h.galat.length ? `\n⚠️ ${esc(h.galat.join("; "))}` : ""}\n\nKetik /lokerbaru untuk melihat template.`);
    }
    return kirim(
      chatId,
      `✅ Loker tersimpan dan sudah tampil di Workly.\n\n${M.ringkas(h.r, esc)}${h.urgent ? `\nUrgently hiring ${U.sisaTeks({ urgent_sampai: h.sampai })}` : ""}${h.galat.length ? `\n\n⚠️ Dilewati: ${esc(h.galat.join("; "))}` : ""}`,
      { reply_markup: tombolTutup(h.r) },
    );
  }
  if (perintah === "/lokermanual") {
    const d = await M.daftar();
    if (!d.length) return kirim(chatId, "Belum ada loker manual yang aktif. Tambah dengan /lokerbaru.");
    return kirim(chatId, `<b>Loker manual aktif (${d.length})</b>\n\n${d.map((r) => `${M.ringkas(r, esc)}\n<a href="${M.linkManual(SITUS, r)}">Lihat</a>`).join("\n\n")}\n\nUbah: /lokerubah &lt;nomor&gt; · Tutup: /lokertutup &lt;nomor&gt;`);
  }
  if (!nomor) return kirim(chatId, `Tulis nomornya, misalnya <code>${perintah} 3</code>. Nomor ada di /lokermanual.`);
  if (perintah === "/lokerubah") {
    const h = await M.ubah(nomor, isi);
    if (h.kosong) return kirim(chatId, `Tidak ada yang diubah. Contoh:\n<code>/lokerubah ${nomor}\ngaji: 7-9 jt\nurgent: ya 30</code>`);
    if (!h.r) return kirim(chatId, "Nomor tidak ditemukan.");
    return kirim(chatId, `✏️ Diperbarui.\n\n${M.ringkas(h.r, esc)}${h.urgent ? `\nUrgently hiring ${U.sisaTeks({ urgent_sampai: h.sampai })}` : ""}${h.galat.length ? `\n\n⚠️ Dilewati: ${esc(h.galat.join("; "))}` : ""}`, { reply_markup: tombolTutup(h.r) });
  }
  const r = await M.setAktif(nomor, perintah === "/lokerbuka");
  return kirim(chatId, r ? `${perintah === "/lokerbuka" ? "Dibuka kembali" : "Ditutup, sudah hilang dari situs"}: #${r.id} ${esc(r.posisi)}` : "Nomor tidak ditemukan.");
}

serve(async (req) => {
  if (req.method !== "POST") return new Response("ok");
  if (!TOKEN) return new Response("TELEGRAM_BOT_TOKEN belum di-set", { status: 500 });
  if (RAHASIA && req.headers.get("x-telegram-bot-api-secret-token") !== RAHASIA) return new Response("forbidden", { status: 403 });

  let upd;
  try {
    upd = await req.json();
  } catch {
    return new Response("ok");
  }

  try {
    // Tombol "berikutnya"
    if (upd.callback_query) {
      const cq = upd.callback_query;
      const [jenis, kursor, kode, ekstra] = String(cq.data || "").split("|");
      if (jenis === "m") {
        // Moderasi loker pemberi kerja: m|s|id (setujui), m|t|id (tolak)
        if (!S.adalahAdmin(cq.from?.id)) {
          await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Khusus admin." });
          return new Response("ok");
        }
        const chat = cq.message?.chat?.id;
        // Lepas tombol dari pesan asal supaya tidak diklik dua kali
        const lepasTombol = () =>
          chat && cq.message?.message_id
            ? tg("editMessageReplyMarkup", { chat_id: chat, message_id: cq.message.message_id, reply_markup: { inline_keyboard: [] } })
            : null;
        try {
          const m = await P.ambil(kode);
          if (!m) {
            await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Loker tidak ditemukan" });
            return new Response("ok");
          }
          if (kursor === "s") {
            await P.setujui(kode);
            await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Disetujui" });
            await lepasTombol();
            const email = await kabariPerusahaan(kode);
            if (chat) await kirim(chat, `Disetujui dan sudah tayang: #${kode} ${esc(m.posisi)} · ${esc(m.perusahaan)}
${P.teksEmail(email, esc)}`);
          } else {
            // Tolak: minta alasan dulu, admin membalas pesan ini
            if (m.status !== "menunggu" && m.status !== "tayang") {
              await tg("answerCallbackQuery", { callback_query_id: cq.id, text: `Status loker: ${m.status}` });
              return new Response("ok");
            }
            await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Tulis alasannya" });
            if (chat)
              await kirim(chat, `${P.PROMPT_ALASAN}${kode} (${esc(m.posisi)} · ${esc(m.perusahaan)})

Balas pesan ini dengan alasan penolakan. Alasan dikirim ke email perusahaan dan tampil di dasbornya.
Tanpa alasan khusus: <code>/tolakloker ${kode}</code>`, {
                reply_markup: { force_reply: true, input_field_placeholder: "Tulis alasan penolakan..." },
              });
          }
        } catch (e) {
          await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Gagal" });
          if (chat) await kirim(chat, `Gagal: ${esc(e?.message)}`);
        }
        return new Response("ok");
      }
      if (jenis === "l") {
        // Tombol loker manual: l|t|id (tutup)
        if (!S.adalahAdmin(cq.from?.id)) {
          await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Khusus admin." });
          return new Response("ok");
        }
        const r = await M.setAktif(Number(kode), false).catch(() => null);
        await tg("answerCallbackQuery", { callback_query_id: cq.id, text: r ? "Loker ditutup" : "Gagal" });
        if (r && cq.message?.chat?.id) await kirim(cq.message.chat.id, `Ditutup, sudah hilang dari situs: #${r.id} ${esc(r.posisi)}\nBuka lagi dengan /lokerbuka ${r.id}`);
        return new Response("ok");
      }
      if (jenis === "u") {
        // Tombol urgent: u|+|db1|id (tandai) atau u|-|db1|id (lepas)
        if (!S.adalahAdmin(cq.from?.id)) {
          await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Khusus admin." });
          return new Response("ok");
        }
        const ruj = { db: kode, id: Number(ekstra) };
        try {
          const r = kursor === "+" ? await U.tandai(ruj) : await U.lepas(ruj);
          await tg("answerCallbackQuery", { callback_query_id: cq.id, text: r ? (kursor === "+" ? "Ditandai urgent" : "Tanda urgent dihapus") : "Tidak ditemukan" });
          if (r && cq.message?.chat?.id) {
            await kirim(cq.message.chat.id, `${kursor === "+" ? `Urgent ${U.sisaTeks(r)}` : "Tanda urgent dihapus"}: <a href="${linkLoker(r)}">${judulBaris(r)}</a>`);
          }
        } catch (e) {
          await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Gagal" });
          if (cq.message?.chat?.id) await kirim(cq.message.chat.id, `Gagal: ${esc(e?.message)}`);
        }
        return new Response("ok");
      }
      if (jenis === "s") {
        // Tombol admin sertifikasi: s|t|id (terbitkan) atau s|a|id (arsipkan)
        if (!S.adalahAdmin(cq.from?.id)) {
          await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Khusus admin." });
          return new Response("ok");
        }
        const r = await S.ubah(Number(kode), { aktif: kursor === "t" }, cq.from.id);
        await tg("answerCallbackQuery", { callback_query_id: cq.id, text: r ? (kursor === "t" ? "Diterbitkan" : "Diarsipkan") : "Tidak ditemukan" });
        if (r && cq.message?.chat?.id) await kirim(cq.message.chat.id, `${kursor === "t" ? "✅ Terbit" : "🗄️ Diarsipkan"}: #${r.id} ${esc(r.nama)}`);
        return new Response("ok");
      }
      await tg("answerCallbackQuery", { callback_query_id: cq.id });
      if (jenis === "m" && cq.message?.chat?.id) await kirimHasil(cq.message.chat.id, bacaKode(kode), kursor);
      return new Response("ok");
    }

    const pesan = upd.message;
    const chatId = pesan?.chat?.id;
    const teks = String(pesan?.text || "").trim();
    if (!chatId || !teks) return new Response("ok");

    const perintah = teks.split(/\s+/)[0].toLowerCase().replace(/@.*$/, "");
    const userId = pesan?.from?.id;

    // Balasan admin atas permintaan alasan penolakan loker
    const asal = String(pesan?.reply_to_message?.text || "");
    if (asal.startsWith(P.PROMPT_ALASAN) && !teks.startsWith("/")) {
      if (!S.adalahAdmin(userId)) return new Response("ok");
      const nomor = asal.slice(P.PROMPT_ALASAN.length).match(/^\d+/)?.[0];
      try {
        await P.tolak(nomor, teks);
        const email = await kabariPerusahaan(nomor);
        await kirim(chatId, `Loker #${nomor} ditolak.
Alasan: ${esc(teks)}
${P.teksEmail(email, esc)}`);
      } catch (e) {
        await kirim(chatId, `Gagal menolak #${nomor}: ${esc(e?.message)}`);
      }
      return new Response("ok");
    }

    if (perintah === "/idku") {
      await kirim(chatId, `ID Telegram-mu: <code>${esc(userId)}</code>`);
      return new Response("ok");
    }
    if (perintah === "/sertifikasi" || perintah === "/sertif" || perintah === "/pelatihan") {
      await sertifikasiUmum(chatId, teks.split("\n")[0].split(/\s+/).slice(1).join(" ").trim());
      return new Response("ok");
    }
    if (/^\/s(admin|format|list|baru|lihat|tambah|ubah|terbit|arsip|ai)$/.test(perintah)) {
      if (!S.adalahAdmin(userId)) {
        await kirim(chatId, "Perintah ini khusus admin Workly.");
      } else {
        try {
          await perintahAdmin(chatId, userId, perintah, teks);
        } catch (e) {
          console.error("admin sertifikasi:", e?.message);
          await kirim(chatId, `Gagal: ${esc(e?.message || "galat tidak dikenal")}${/sertifikasi/.test(e?.message || "") ? "\nSudah menjalankan supabase/sql/10_sertifikasi.sql?" : ""}`);
        }
      }
      return new Response("ok");
    }

    if (perintah === "/antreanloker" || perintah === "/tolakloker") {
      if (!S.adalahAdmin(userId)) {
        await kirim(chatId, "Perintah ini khusus admin Workly.");
        return new Response("ok");
      }
      try {
        if (perintah === "/antreanloker") {
          const d = await P.antrean();
          await kirim(
            chatId,
            d.length
              ? `<b>Menunggu persetujuan (${d.length})</b>\n\n${d.map((r) => `#${r.id} <b>${esc(r.posisi)}</b> · ${esc(r.perusahaan)}`).join("\n")}`
              : "Tidak ada loker yang menunggu persetujuan.",
            d.length
              ? { reply_markup: { inline_keyboard: d.slice(0, 15).map((r) => [{ text: `Setujui #${r.id}`, callback_data: `m|s|${r.id}` }, { text: `Tolak #${r.id}`, callback_data: `m|t|${r.id}` }]) } }
              : {},
          );
        } else {
          const m = teks.match(/^\S+\s+(\d+)\s*([\s\S]*)$/);
          if (!m) await kirim(chatId, "Contoh: <code>/tolakloker 12 Link lamaran tidak bisa dibuka</code>");
          else {
            await P.tolak(m[1], m[2].trim() || P.ALASAN_BAWAAN);
            const email = await kabariPerusahaan(m[1]);
            await kirim(chatId, `Loker #${m[1]} ditolak. Alasan terlihat di dasbor pemberi kerja.\n${P.teksEmail(email, esc)}`);
          }
        }
      } catch (e) {
        await kirim(chatId, `Gagal: ${esc(e?.message)}`);
      }
      return new Response("ok");
    }

    if (/^\/loker(baru|manual|ubah|tutup|buka)$/.test(perintah)) {
      if (!S.adalahAdmin(userId)) {
        await kirim(chatId, "Perintah ini khusus admin Workly.");
      } else {
        try {
          await perintahManual(chatId, userId, perintah, teks);
        } catch (e) {
          console.error("loker manual:", e?.message);
          await kirim(chatId, `Gagal: ${esc(e?.message || "galat tidak dikenal")}`);
        }
      }
      return new Response("ok");
    }

    if (perintah === "/urgent" || perintah === "/lepasurgent") {
      if (S.adalahAdmin(userId)) {
        try {
          await perintahUrgent(chatId, perintah, teks);
        } catch (e) {
          console.error("urgent:", e?.message);
          await kirim(chatId, `Gagal: ${esc(e?.message || "galat tidak dikenal")}`);
        }
      } else if (perintah === "/urgent") {
        await kirimHasil(chatId, { urgent: "1", ...bacaPermintaan(teks.slice(7)) });
      } else {
        await kirim(chatId, "Perintah ini khusus admin Workly.");
      }
      return new Response("ok");
    }

    if (perintah === "/start" || perintah === "/bantuan" || perintah === "/help") {
      await tg("sendMessage", { chat_id: chatId, parse_mode: "HTML", text: BANTUAN, disable_web_page_preview: true });
    } else if (perintah === "/remote") {
      await kirimHasil(chatId, { lokasi: "remote", ...bacaPermintaan(teks.slice(7)) });
    } else if (perintah === "/freelance") {
      await kirimHasil(chatId, { tipe: "freelance", ...bacaPermintaan(teks.slice(10)) });
    } else if (perintah === "/bumn") {
      await kirimHasil(chatId, { bumn: "1", ...bacaPermintaan(teks.slice(5)) });
    } else if (perintah === "/magang") {
      await kirimHasil(chatId, { tipe: "magang", ...bacaPermintaan(teks.slice(7)) });
    } else if (perintah === "/terbaru") {
      await kirimHasil(chatId, {});
    } else if (teks.startsWith("/")) {
      await tg("sendMessage", { chat_id: chatId, parse_mode: "HTML", text: BANTUAN, disable_web_page_preview: true });
    } else {
      await tg("sendChatAction", { chat_id: chatId, action: "typing" });
      await kirimHasil(chatId, bacaPermintaan(teks));
    }
  } catch (e) {
    console.error("telegram-bot:", e?.message);
  }
  // Selalu 200 supaya Telegram tidak mengirim ulang pesan yang sama
  return new Response("ok");
});

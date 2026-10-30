// @ts-nocheck
// Edge Function: telegram-bot — bot Telegram Jobly untuk mencari loker.
//
// Pengguna cukup mengetik, misalnya:
//   "data science"            → loker data science
//   "admin jakarta"           → admin di Jakarta
//   "remote marketing"        → marketing yang bisa remote
//   "freelance desain"        → desain freelance
//   "bumn engineer"           → engineer di BUMN
//   /remote /freelance /bumn /magang /bantuan
//
// Data diambil dari API Jobly (jobly.my.id/api/loker), jadi hasil dan
// kecerdasan pencariannya sama persis dengan situs: padanan kata, kota,
// bidang, BUMN, dan seterusnya.
//
// Secret yang dibutuhkan:
//   TELEGRAM_BOT_TOKEN        token dari @BotFather
//   TELEGRAM_WEBHOOK_SECRET   teks acak; dikirim Telegram di setiap pesan
//   JOBLY_URL (opsional)      bawaan https://jobly.my.id
//   TELEGRAM_ADMIN_IDS        ID Telegram admin (dipisah koma) untuk
//                             mengelola sertifikasi; cek lewat /idku
//
// Rekomendasi sertifikasi & pelatihan:
//   /sertifikasi [posisi]     semua orang
//   /sadmin                   daftar perintah admin (lihat sertifikasi.ts)

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { bacaPermintaan } from "./parser.ts";
import * as S from "./sertifikasi.ts";

const TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const RAHASIA = Deno.env.get("TELEGRAM_WEBHOOK_SECRET") ?? "";
const SITUS = (Deno.env.get("JOBLY_URL") ?? "https://jobly.my.id").replace(/\/+$/, "");
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
  const res = await fetch(`${SITUS}/api/loker?${p}`);
  if (!res.ok) throw new Error(`API Jobly ${res.status}`);
  return res.json();
}

// callback_data maks 64 byte: "m|<kursor>|<filter ringkas>"
const kodeFilter = (f) =>
  [f.q || "", f.kota || "", f.lokasi || "", f.tipe || "", f.bumn ? "1" : ""].join("~").slice(0, 44);
const bacaKode = (s) => {
  const [q, kota, lokasi, tipe, bumn] = String(s || "").split("~");
  return Object.fromEntries(Object.entries({ q, kota, lokasi, tipe, bumn }).filter(([, v]) => v));
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
      const url = `${SITUS}/loker/${r._s || "db1"}-${r.id}`;
      const tgl = waktu(r.date_posted || r.created_at || r.posted_at);
      return `<b>${esc(posisi)}</b>\n🏢 ${esc(pt)}${lokasi ? ` · 📍 ${esc(lokasi)}` : ""}${tgl ? ` · 🕒 ${tgl}` : ""}\n<a href="${url}">Lihat & lamar →</a>`;
    })
    .join("\n\n");

  const kepala = kursor
    ? `🔎 Lanjutan <b>${esc(judulFilter(f))}</b>`
    : `🔎 Loker <b>${esc(judulFilter(f))}</b>${jumlah ? ` · ${Number(jumlah).toLocaleString("id-ID")} lowongan` : ""}`;

  const tombol = [];
  if (d.kursor) tombol.push({ text: `${PER_HALAMAN} berikutnya ›`, callback_data: `m|${String(d.kursor).slice(0, 14)}|${kodeFilter(f)}` });
  tombol.push({ text: "Buka di Jobly", url: linkSitus });

  return tg("sendMessage", {
    chat_id: chatId,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    text: `${kepala}\n\n${daftar}`,
    reply_markup: { inline_keyboard: [tombol] },
  });
}

const BANTUAN = `Halo! Aku bot <b>Jobly</b> 👋
Ketik saja loker yang kamu cari, contohnya:

• <code>data science</code>
• <code>admin jakarta</code>
• <code>remote marketing</code>
• <code>freelance desain</code>
• <code>bumn engineer</code>
• <code>magang bandung</code>

Perintah cepat:
/remote · /freelance · /bumn · /magang · /terbaru

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
      reply_markup: { inline_keyboard: [[{ text: "Lihat semua di Jobly", url: `${SITUS}/sertifikasi` }]] },
    });
  }
  return kirim(chatId, `🎓 Sertifikasi & pelatihan${kata ? ` untuk <b>${esc(kata)}</b>` : ""}\n\n${hasil.map((r) => S.kartu(r)).join("\n\n")}`, {
    reply_markup: { inline_keyboard: [[{ text: "Lihat semua di Jobly", url: link }]] },
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
      await kirim(chatId, S.BANTUAN_ADMIN);
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
      const [jenis, kursor, kode] = String(cq.data || "").split("|");
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
        await kirim(chatId, "Perintah ini khusus admin Jobly.");
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

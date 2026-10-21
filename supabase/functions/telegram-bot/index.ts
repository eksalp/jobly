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

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { bacaPermintaan } from "./parser.ts";

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

Semua loker diambil dari situs karier perusahaan, BUMN, LinkedIn, Indeed, dan lainnya di ${SITUS.replace("https://", "")}. Gratis.`;

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
      await tg("answerCallbackQuery", { callback_query_id: cq.id });
      if (jenis === "m" && cq.message?.chat?.id) await kirimHasil(cq.message.chat.id, bacaKode(kode), kursor);
      return new Response("ok");
    }

    const pesan = upd.message;
    const chatId = pesan?.chat?.id;
    const teks = String(pesan?.text || "").trim();
    if (!chatId || !teks) return new Response("ok");

    const perintah = teks.split(/\s+/)[0].toLowerCase().replace(/@.*$/, "");
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

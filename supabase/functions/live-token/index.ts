// @ts-nocheck
// Edge Function: live-token
//
// Menerbitkan token sementara (ephemeral token) untuk koneksi Gemini
// Live API langsung dari browser.
//
// Kenapa tidak mem-proxy WebSocket-nya lewat server saja? Karena
// percakapan suara butuh aliran audio dua arah selama belasan menit,
// dan Edge Function punya batas waktu jalan yang jauh lebih pendek dari
// itu. Token sementara memungkinkan browser terhubung langsung ke
// Google tanpa pernah menyentuh API key aslinya.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  const json = (b, status = 200) =>
    new Response(JSON.stringify(b), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser();
    if (authError || !user) return json({ error: "Unauthorized" }, 401);

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return json({ error: "GEMINI_API_KEY belum di-set." }, 500);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    /* Kuota dipotong SEBELUM token diterbitkan. Kalau dipotong setelah
       sesi selesai, user yang menutup tab di tengah jalan tidak terhitung
       — dan biaya audionya sudah terlanjur keluar. */
    const { data: pakai, error: kuotaErr } = await supabaseAdmin.rpc(
      "pakai_kuota",
      { p_user_id: user.id, p_jenis: "interview" },
    );

    if (kuotaErr) throw new Error("Gagal memeriksa kuota: " + kuotaErr.message);

    const hk = Array.isArray(pakai) ? pakai[0] : pakai;
    if (!hk?.berhasil) {
      return json(
        {
          error: hk?.alasan ?? "Tidak ada langganan aktif.",
          butuhLangganan: true,
        },
        402,
      );
    }

    /* Terbitkan token sementara.
       Masa berlaku sengaja pendek: cukup untuk memulai satu sesi, tidak
       cukup untuk dipakai ulang kalau bocor. */
    // Catat penerbitan token. Id-nya dikirim ke klien dan menjadi
    // satu-satunya cara mengembalikan kuota — tanpa ini, jalur
    // pengembalian bisa dipanggil berulang tanpa batas.
    const { data: catatan, error: galatCatat } = await supabaseAdmin
      .from("sesi_token")
      .insert({ user_id: user.id, jenis: "interview" })
      .select("id")
      .single();

    if (galatCatat) {
      console.error("Gagal mencatat token sesi:", galatCatat.message);
      throw new Error("Gagal menyiapkan sesi.");
    }

    const kedaluwarsa = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const bolehMulaiSampai = new Date(Date.now() + 2 * 60 * 1000).toISOString();

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1alpha/auth_tokens",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          uses: 1,
          expireTime: kedaluwarsa,
          newSessionExpireTime: bolehMulaiSampai,
        }),
      },
    );

    if (!res.ok) {
      const teks = await res.text();
      console.error(
        "Gagal menerbitkan token Live:",
        res.status,
        teks.slice(0, 300),
      );
      throw new Error(`Gagal menyiapkan sesi suara (${res.status}).`);
    }

    const data = await res.json();

    // Dicatat supaya kalau koneksi ditolak, kita bisa memastikan bentuk
    // token yang sebenarnya dikembalikan Google — bukan menebak-nebak.
    console.log("Token Live diterbitkan:", JSON.stringify(data).slice(0, 200));

    /* Daftar model yang benar-benar mendukung percakapan dua arah,
       ditanyakan langsung ke Google. Nama model Live berganti cukup
       sering, dan menebaknya dari dokumentasi sering meleset — ini
       jawaban yang pasti untuk akun ini. Hasilnya dikirim balik ke
       klien supaya bisa dipakai tanpa perlu membuka log. */
    let modelLive = [];
    try {
      const resModel = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200",
        { headers: { "x-goog-api-key": apiKey } },
      );
      if (resModel.ok) {
        const dm = await resModel.json();
        modelLive = (dm.models || [])
          .filter((m) =>
            (m.supportedGenerationMethods || []).includes(
              "bidiGenerateContent",
            ),
          )
          .map((m) => m.name);
        console.log("Model Live tersedia:", JSON.stringify(modelLive));
      } else {
        console.warn("Gagal mengambil daftar model:", resModel.status);
      }
    } catch (e) {
      console.warn("Gagal mengambil daftar model:", e?.message);
    }

    const token = data.name ?? data.token ?? data.tokenString;
    if (!token) {
      console.error(
        "Bentuk respons token tidak dikenali:",
        JSON.stringify(data).slice(0, 400),
      );
      throw new Error("Token suara tidak terbaca dari respons Google.");
    }

    return json({
      token,
      token_id: catatan.id,
      model_live: modelLive,
      sisa_interview: hk.sisa,
    });
  } catch (err) {
    const pesan = err instanceof Error ? err.message : "Internal server error.";
    console.error("live-token error:", pesan);
    return json({ error: pesan, detail: pesan }, 503);
  }
});

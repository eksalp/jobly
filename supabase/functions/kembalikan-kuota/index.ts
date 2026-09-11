// @ts-nocheck
// Edge Function: kembalikan-kuota
//
// Mengembalikan satu kuota kalau sesi gagal dipakai. Dipanggil klien
// saat koneksi suara gagal tersambung, atau saat sesi berakhir tanpa
// ada satu pun jawaban dari user.
//
// Kenapa tidak sekadar memotong kuota di akhir sesi saja? Karena user
// yang menutup tab di tengah percakapan tidak akan pernah mengirim
// sinyal apa pun — biayanya sudah keluar, tapi kuotanya tidak terpotong.
// Memotong di awal lalu mengembalikan bila perlu menutup kedua celah.

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

    const { jenis } = await req.json();
    const jenisBersih = ["analisis", "pindah", "interview"].includes(jenis)
      ? jenis
      : "analisis";

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabaseAdmin.rpc("kembalikan_kuota", {
      p_user_id: user.id,
      p_jenis: jenisBersih,
    });

    if (error) throw new Error(error.message);

    const h = Array.isArray(data) ? data[0] : data;
    return json({ berhasil: Boolean(h?.berhasil), sisa: h?.sisa ?? 0 });
  } catch (err) {
    const pesan = err instanceof Error ? err.message : "Internal server error.";
    console.error("kembalikan-kuota error:", pesan);
    return json({ error: pesan }, 503);
  }
});

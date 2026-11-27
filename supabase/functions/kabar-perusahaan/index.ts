// @ts-nocheck
// Edge Function: kabar-perusahaan
// Dipanggil halaman admin (/pemberi-kerja/admin) setelah loker disetujui
// atau ditolak, untuk mengirim email status ke perusahaan.
// Masukan: { id: <nomor loker_perusahaan> }. Hanya admin Workly.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { kabariPerusahaan } from "../_shared/kabarPerusahaan.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  try {
    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    const { data: admin } = await supa.rpc("saya_admin");
    if (admin !== true) return json({ ok: false, alasan: "Khusus admin." }, 403);
    const { id } = await req.json();
    const hasil = await kabariPerusahaan(id);
    console.log(`kabar-perusahaan: loker #${id} → ${hasil.ok ? `terkirim ke ${hasil.ke}` : `tidak terkirim (${hasil.alasan})`}`);
    return json(hasil);
  } catch (e) {
    console.error("kabar-perusahaan:", e?.message);
    return json({ ok: false }, 200);
  }
});

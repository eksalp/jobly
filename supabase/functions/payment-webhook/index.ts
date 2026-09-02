// @ts-nocheck
// Edge Function: payment-webhook
// Midtrans memanggil URL ini saat status transaksi berubah.
// Di sinilah langganan benar-benar diaktifkan.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PAKET } from "./paket.ts";

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
    const body = await req.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body;

    // Verifikasi tanda tangan Midtrans.
    // Tanpa ini, siapa pun bisa memalsukan notifikasi dan mengaktifkan
    // langganan tanpa membayar.
    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    if (!serverKey)
      return json({ error: "MIDTRANS_SERVER_KEY belum di-set." }, 500);
    const bahan = order_id + status_code + gross_amount + serverKey;
    const buf = await crypto.subtle.digest(
      "SHA-512",
      new TextEncoder().encode(bahan),
    );
    const tandaTangan = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (tandaTangan !== signature_key) {
      console.error("Tanda tangan tidak cocok untuk order", order_id);
      return json({ error: "Invalid signature" }, 403);
    }

    const lunas =
      (transaction_status === "capture" && fraud_status === "accept") ||
      transaction_status === "settlement";
    const gagal = ["cancel", "deny", "expire"].includes(transaction_status);

    if (!lunas && !gagal)
      return json({ ok: true, catatan: "status diabaikan" });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    await supabaseAdmin
      .from("payments")
      .update({
        status: lunas ? "paid" : "failed",
        paid_at: lunas ? new Date().toISOString() : null,
      })
      .eq("order_id", order_id);

    if (!lunas) {
      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "batal" })
        .eq("order_id", order_id);
      return json({ ok: true, langganan: "dibatalkan" });
    }

    // --- Aktifkan langganan ---
    const { data: lang } = await supabaseAdmin
      .from("subscriptions")
      .select("id, user_id, paket, status")
      .eq("order_id", order_id)
      .maybeSingle();

    if (!lang) {
      console.error("Langganan tidak ditemukan untuk order", order_id);
      return json({ ok: true, catatan: "langganan tidak ditemukan" });
    }

    // Midtrans bisa mengirim notifikasi yang sama lebih dari sekali.
    // Tanpa penjagaan ini, masa aktif bisa terhitung ganda.
    if (lang.status === "aktif") {
      return json({ ok: true, catatan: "sudah aktif sebelumnya" });
    }

    const paket = PAKET[lang.paket] ?? PAKET.coba;
    const sekarang = new Date();

    // Kalau user masih punya langganan aktif, masa baru disambung
    // dari tanggal berakhirnya — bukan menimpa sisa yang belum terpakai.
    const { data: berjalan } = await supabaseAdmin
      .from("subscriptions")
      .select("berakhir_at")
      .eq("user_id", lang.user_id)
      .eq("status", "aktif")
      .gt("berakhir_at", sekarang.toISOString())
      .order("berakhir_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const mulai = berjalan?.berakhir_at
      ? new Date(berjalan.berakhir_at)
      : sekarang;
    const berakhir = new Date(mulai.getTime() + paket.durasiHari * 86400000);

    const { error: aktifErr } = await supabaseAdmin
      .from("subscriptions")
      .update({
        status: "aktif",
        mulai_at: mulai.toISOString(),
        berakhir_at: berakhir.toISOString(),
        kuota_analisis: paket.kuotaAnalisis,
      })
      .eq("id", lang.id);

    if (aktifErr)
      throw new Error("Gagal mengaktifkan langganan: " + aktifErr.message);

    console.log(
      `Langganan ${lang.paket} aktif untuk ${lang.user_id} sampai ${berakhir.toISOString()}`,
    );
    return json({ ok: true, berakhir_at: berakhir.toISOString() });
  } catch (err) {
    const pesan = err instanceof Error ? err.message : "Internal server error.";
    console.error("payment-webhook error:", pesan);
    return json({ error: pesan }, 500);
  }
});

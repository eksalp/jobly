// @ts-nocheck
// Edge Function: create-payment
// Membuat transaksi Midtrans untuk sebuah paket langganan.

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

    const { paket: paketId } = await req.json();
    const paket = PAKET[paketId];

    // Paket harus dikenali. Harga diambil dari definisi server,
    // bukan dari apa pun yang dikirim browser.
    if (!paket) return json({ error: "Paket tidak dikenali." }, 400);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Awalan proyek. order_id harus unik di SELURUH akun Midtrans, bukan
    // hanya di dalam satu aplikasi — kalau akunnya dipakai bersama proyek
    // lain, tanpa awalan ini tabrakan tinggal menunggu waktu.
    const awalan = Deno.env.get("ORDER_PREFIX") ?? "JF";
    const orderId = `${awalan}-${paket.id}-${user.id.slice(0, 8)}-${Date.now()}`;

    // Catat pembayaran dan langganan berstatus pending.
    // Langganan baru diaktifkan oleh webhook setelah pembayaran terkonfirmasi.
    const { error: bayarErr } = await supabaseAdmin.from("payments").insert({
      user_id: user.id,
      order_id: orderId,
      status: "pending",
      gross_amount: paket.harga,
    });
    if (bayarErr)
      throw new Error("Gagal mencatat pembayaran: " + bayarErr.message);

    const { error: langErr } = await supabaseAdmin
      .from("subscriptions")
      .insert({
        user_id: user.id,
        paket: paket.id,
        status: "pending",
        kuota_analisis: paket.kuotaAnalisis,
        kuota_terpakai: 0,
        harga: paket.harga,
        order_id: orderId,
      });
    if (langErr)
      throw new Error("Gagal mencatat langganan: " + langErr.message);

    // Midtrans Snap
    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    if (!serverKey)
      return json({ error: "MIDTRANS_SERVER_KEY belum di-set." }, 500);

    // Endpoint ditentukan dari bentuk server key-nya. Key sandbox berawalan
    // "SB-Mid-server-". Dengan cara ini mustahil terjadi kombinasi keliru
    // seperti key produksi ditembakkan ke endpoint sandbox.
    const produksi = !serverKey.startsWith("SB-");
    const snapUrl = produksi
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    console.log(
      `Membuat transaksi ${orderId} (${produksi ? "PRODUKSI" : "sandbox"})`,
    );

    // URL notifikasi ditentukan per transaksi, bukan mengandalkan setelan
    // dashboard. Dashboard hanya bisa menyimpan satu URL untuk seluruh akun,
    // jadi kalau akunnya dipakai bersama aplikasi lain, mengubah setelan itu
    // akan memutus notifikasi aplikasi tersebut.
    //
    // Kalau URL ini tidak di-set, Midtrans jatuh ke setelan dashboard.
    const urlNotifikasi = Deno.env.get("MIDTRANS_NOTIFICATION_URL");

    const mtRes = await fetch(snapUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(serverKey + ":")}`,
        ...(urlNotifikasi ? { "X-Override-Notification": urlNotifikasi } : {}),
      },
      body: JSON.stringify({
        transaction_details: { order_id: orderId, gross_amount: paket.harga },
        customer_details: { email: user.email },
        item_details: [
          {
            id: paket.id,
            price: paket.harga,
            quantity: 1,
            // Nama aplikasi disertakan supaya transaksi mudah dibedakan
            // di dashboard yang dipakai bersama beberapa aplikasi.
            name: `JobFinder AI — ${paket.nama} (${paket.durasiHari} hari)`.slice(
              0,
              50,
            ),
          },
        ],
      }),
    });

    if (!mtRes.ok) {
      const teks = await mtRes.text();
      throw new Error("Midtrans error: " + teks.slice(0, 200));
    }

    const mtData = await mtRes.json();
    await supabaseAdmin
      .from("payments")
      .update({ snap_token: mtData.token })
      .eq("order_id", orderId);

    return json({ snapToken: mtData.token, orderId, paket: paket.id });
  } catch (err) {
    const pesan = err instanceof Error ? err.message : "Internal server error.";
    console.error("create-payment error:", pesan);
    return json({ error: pesan }, 500);
  }
});

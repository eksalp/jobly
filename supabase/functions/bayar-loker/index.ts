// @ts-nocheck
// Edge Function: bayar-loker
// Membuat transaksi Midtrans untuk membeli kredit pasang loker (pemberi kerja).
// Kredit ditambahkan oleh payment-webhook setelah pembayaran lunas.
//
// Masukan : { paket: "satu" | "lima" | "sepuluh" }
// Keluaran: { snapToken, orderId }

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PAKET_LOKER } from "../_shared/paketLoker.ts";

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
    const {
      data: { user },
    } = await supa.auth.getUser();
    if (!user) return json({ error: "Silakan masuk terlebih dahulu." }, 401);

    const { paket: paketId } = await req.json();
    const paket = PAKET_LOKER[paketId];
    if (!paket) return json({ error: "Paket tidak dikenali." }, 400);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: pt } = await admin.from("perusahaan").select("nama").eq("user_id", user.id).maybeSingle();
    if (!pt) return json({ error: "Lengkapi profil perusahaan terlebih dahulu." }, 400);

    // "-LK-" menandai pembelian kredit loker; payment-webhook memakainya
    // untuk membedakan dari langganan pencari kerja.
    const awalan = Deno.env.get("ORDER_PREFIX") ?? "JF";
    const orderId = `${awalan}-LK-${paket.id}-${user.id.slice(0, 8)}-${Date.now()}`;

    const { error: catatErr } = await admin.from("pembelian_kredit").insert({
      order_id: orderId,
      user_id: user.id,
      paket: paket.id,
      kredit: paket.kredit,
      harga: paket.harga,
    });
    if (catatErr) throw new Error("Gagal mencatat pembelian: " + catatErr.message);

    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    if (!serverKey) return json({ error: "MIDTRANS_SERVER_KEY belum di-set." }, 500);
    const produksi = !serverKey.startsWith("SB-");
    const snapUrl = produksi
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";
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
        // Batas waktu bayar. Selama belum lewat, pengguna bisa membuka lagi
        // jendela pembayaran yang tertutup (src/utils/snap.js, BATAS_BAYAR_MENIT).
        expiry: { unit: "minutes", duration: 60 },
        customer_details: { email: user.email, first_name: String(pt.nama).slice(0, 50) },
        enabled_payments: (Deno.env.get("MIDTRANS_METODE") ?? "other_qris")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        item_details: [
          { id: `loker-${paket.id}`, price: paket.harga, quantity: 1, name: `Workly — ${paket.nama}`.slice(0, 50) },
        ],
      }),
    });
    if (!mtRes.ok) throw new Error("Midtrans error: " + (await mtRes.text()).slice(0, 200));
    const mt = await mtRes.json();
    await admin.from("pembelian_kredit").update({ snap_token: mt.token }).eq("order_id", orderId);
    console.log(`Pembelian kredit ${orderId} (${produksi ? "PRODUKSI" : "sandbox"})`);
    return json({ snapToken: mt.token, orderId });
  } catch (e) {
    console.error("bayar-loker:", e?.message);
    return json({ error: e?.message || "Gagal membuat pembayaran." }, 500);
  }
});

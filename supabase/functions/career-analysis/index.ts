// @ts-nocheck — file ini jalan di Deno (Supabase Edge Functions), bukan Node.js.
// Error "Cannot find module" dan "Cannot find name Deno" dari VS Code bisa diabaikan,
// atau install ekstensi "Deno" di VS Code lalu enable di folder ini.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Support dua mode:
    // 1. AnalyzerPanel — kirim { prompt } → single user message
    // 2. AICareerCoachPanel — kirim { system, messages } → multi-turn chat
    let systemPrompt: string;
    let messages: { role: string; content: string }[];

    if (body.messages && Array.isArray(body.messages)) {
      systemPrompt =
        body.system ||
        "Kamu adalah AI Career Coach untuk JobFinder AI di Indonesia.";
      messages = body.messages;
    } else if (body.prompt) {
      systemPrompt =
        "Kamu adalah AI career coach untuk platform JobFinder AI di Indonesia.";
      messages = [{ role: "user", content: body.prompt }];
    } else {
      return new Response(
        JSON.stringify({
          error: "Request harus berisi 'prompt' atau 'messages'.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "ANTHROPIC_API_KEY belum di-set di Supabase secrets.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return new Response(
        JSON.stringify({ error: `Anthropic API error: ${response.status}` }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error.";
    console.error("Edge function error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

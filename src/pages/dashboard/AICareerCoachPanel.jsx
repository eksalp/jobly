import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { T } from "../../theme";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useUserProfile } from "../../context/UserProfileContext";
import { Glass } from "../../components/ui/Glass";

const SYSTEM_PROMPT = `Kamu adalah AI Career Coach untuk platform JobFinder AI di Indonesia. 
Kamu membantu user soal: strategi karier, persiapan interview, negosiasi gaji, perbaikan CV/LinkedIn, skill gap, dan transisi karier.
Jawab dalam Bahasa Indonesia. Jawaban singkat, konkret, dan actionable. Maksimal 3-4 paragraf.
Kalau user menyebut profil atau CV mereka, gunakan konteks itu untuk personalisasi saran.`;

const STARTER_CHIPS = [
  "Cara jawab 'kelemahan terbesar' saat interview",
  "Tips negosiasi gaji kalau offer di bawah ekspektasi",
  "Bagaimana transisi karier ke bidang tech?",
  "Apa yang harus ada di LinkedIn supaya dilirik recruiter?",
];

export function AICareerCoachPanel() {
  const { cvText } = useUserProfile();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Halo! Aku siap bantu diskusi soal strategi karier, persiapan interview, negosiasi gaji, atau apapun seputar karier kamu. Mau mulai dari mana?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setInput("");
    setError("");
    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      if (!supabaseConfigured) {
        throw new Error("Supabase belum dikonfigurasi.");
      }

      // Bangun history untuk Anthropic API (max 10 pesan terakhir supaya hemat token)
      const cvContext = cvText?.trim()
        ? `\n\nBerikut CV/profil user yang bisa kamu jadikan konteks:\n"""\n${cvText.slice(0, 2000)}\n"""`
        : "";

      const apiMessages = newMessages.slice(-10).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const { data, error: fnError } = await supabase.functions.invoke(
        "career-analysis",
        {
          body: {
            system: SYSTEM_PROMPT + cvContext,
            messages: apiMessages,
          },
        },
      );

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      const replyText = (data.content || [])
        .map((c) => c.text || "")
        .join("")
        .trim();

      if (!replyText) throw new Error("Respons AI kosong.");

      setMessages((prev) => [...prev, { role: "assistant", text: replyText }]);
    } catch (err) {
      setError(err?.message || "Gagal menghubungi AI. Coba lagi.");
      // Rollback pesan user kalau gagal total
      setMessages(messages);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        padding: 28,
        maxWidth: 760,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 160px)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: T.ink,
            marginBottom: 4,
          }}
        >
          AI Career Coach
        </div>
        <div style={{ fontSize: 13, color: T.inkSoft }}>
          Tanya apapun soal karier kamu — interview, gaji, CV, atau transisi
          karier.
          {cvText?.trim() && (
            <span style={{ color: T.accent, marginLeft: 6 }}>
              <Sparkles
                size={12}
                style={{ verticalAlign: -2, marginRight: 3 }}
              />
              Profil CV kamu sudah terbaca.
            </span>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "78%",
                padding: "12px 16px",
                borderRadius:
                  m.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                background:
                  m.role === "user" ? T.accent : "rgba(255,255,255,0.75)",
                color: m.role === "user" ? "#fff" : T.ink,
                fontSize: 13.5,
                lineHeight: 1.65,
                border: m.role === "user" ? "none" : `1px solid ${T.border}`,
                backdropFilter: m.role === "user" ? "none" : "blur(14px)",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "16px 16px 16px 4px",
                background: "rgba(255,255,255,0.75)",
                border: `1px solid ${T.border}`,
                backdropFilter: "blur(14px)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: T.inkSoft,
                fontSize: 13,
              }}
            >
              <Loader2
                size={14}
                style={{ animation: "spin 1s linear infinite" }}
              />
              Sedang berpikir...
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              fontSize: 12.5,
              color: "#B23A3A",
              background: "rgba(178,58,58,0.07)",
              border: "1px solid rgba(178,58,58,0.2)",
              borderRadius: 10,
              padding: "10px 14px",
            }}
          >
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips — only shown at start */}
      {messages.length === 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          {STARTER_CHIPS.map((c) => (
            <span
              key={c}
              onClick={() => sendMessage(c)}
              style={{
                fontSize: 11.5,
                padding: "6px 12px",
                borderRadius: 99,
                border: `1px solid ${T.border}`,
                color: T.inkSoft,
                background: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = T.accent)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = T.border)
              }
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Input box */}
      <Glass
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          padding: "10px 14px",
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanya apapun soal kariermu... (Enter untuk kirim)"
          rows={1}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: 13.5,
            fontFamily: "'Poppins', sans-serif",
            background: "transparent",
            color: T.ink,
            resize: "none",
            maxHeight: 120,
            overflow: "auto",
            lineHeight: 1.5,
          }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: loading || !input.trim() ? T.inkFaint : T.accent,
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            flexShrink: 0,
            transition: "background 0.15s",
          }}
        >
          <Send size={14} color="#fff" />
        </button>
      </Glass>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

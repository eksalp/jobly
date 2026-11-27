import React, { useEffect } from "react";
import { ArrowRight, Check, ClipboardCheck, CreditCard, FilePen, Megaphone, Eye, MousePointerClick } from "lucide-react";
import { PublicLayout, useGulirKeHash } from "../../components/publik/PublicLayout";
import { DaftarFaq } from "../../components/publik/DaftarFaq";
import { useJobs } from "../../context/JobsContext";
import { useAuth } from "../../context/AuthContext";
import { PAKET_LOKER, FITUR_LOKER, MASA_TAYANG_HARI, rupiah } from "../../data/paketLoker";
import { tautan } from "../../utils/navigasi";
import { lokal, t } from "../../i18n.js";

const LANGKAH = [
  {
    Ikon: CreditCard,
    judul: t("Pilih paket", "Pick a bundle"),
    isi: t(
      "Beli kredit sesuai kebutuhan. Satu kredit untuk satu loker, dan kredit tidak hangus.",
      "Buy credits as you need them. One credit covers one job post, and credits never expire.",
    ),
  },
  {
    Ikon: FilePen,
    judul: t("Tulis loker", "Write the job"),
    isi: t(
      "Isi posisi, lokasi, gaji, deskripsi, dan link atau email lamaran. Pratinjau tampil saat mengetik.",
      "Fill in the role, location, salary, description, and an apply link or email. A live preview updates as you type.",
    ),
  },
  {
    Ikon: ClipboardCheck,
    judul: t("Dicek tim Workly", "Reviewed by Workly"),
    isi: t(
      "Setiap loker dicek dulu supaya pencari kerja terhindar dari loker palsu. Bila ditolak, kredit dikembalikan.",
      "Every post is reviewed so job seekers stay safe from fake listings. If it's rejected, the credit is refunded.",
    ),
  },
  {
    Ikon: Megaphone,
    judul: t("Tayang sebagai prioritas", "Goes live as featured"),
    isi: t(
      `Loker tampil ${MASA_TAYANG_HARI} hari di urutan teratas pencarian yang cocok dan di beranda Workly.`,
      `Your post is shown for ${MASA_TAYANG_HARI} days at the top of matching searches and on the Workly homepage.`,
    ),
  },
];

const FAQ_MITRA = [
  [
    t("Berapa lama loker dicek?", "How long does the review take?"),
    t(
      "Biasanya di hari yang sama pada jam kerja. Statusnya terlihat di dasbor, dan alasan penolakan (bila ada) ditampilkan di sana juga.",
      "Usually the same business day. You can follow the status in your dashboard, including the reason if a post is rejected.",
    ),
  ],
  [
    t("Apakah kredit bisa hangus?", "Do credits expire?"),
    t(
      "Tidak. Kredit yang belum dipakai tetap tersimpan di akun perusahaanmu.",
      "No. Unused credits stay in your company account.",
    ),
  ],
  [
    t("Bagaimana pelamar melamar?", "How do candidates apply?"),
    t(
      "Lewat link lamaran atau alamat email yang kamu cantumkan. Dasbor menampilkan berapa kali loker dilihat dan berapa kali tombol lamar diklik.",
      "Through the apply link or email address you provide. Your dashboard shows how often the post was viewed and how often the apply button was clicked.",
    ),
  ],
  [
    t("Bisakah loker diubah setelah tayang?", "Can I edit a post after it goes live?"),
    t(
      "Bisa. Loker yang diubah akan dicek ulang tanpa memotong kredit, dan masa tayangnya tetap berjalan.",
      "Yes. Edited posts are reviewed again without using another credit, and the original run time continues.",
    ),
  ],
  [
    t("Metode pembayaran apa saja?", "Which payment methods are accepted?"),
    t(
      "QRIS lewat Midtrans, bisa dibayar dari aplikasi bank atau e-wallet mana pun.",
      "QRIS via Midtrans, payable from any banking or e-wallet app.",
    ),
  ],
];

function ContohKartu() {
  return (
    <div className="pk-contoh" aria-hidden="true">
      <div className="pb-card pb-card-prioritas" style={{ pointerEvents: "none" }}>
        <div className="pb-card-head">
          <div className="pk-contoh-logo">PT</div>
          <div className="pb-card-who">
            <div className="pb-card-co">{t("Perusahaan kamu", "Your company")}</div>
            <div className="pb-card-src">{t("Diposting langsung", "Posted directly")}</div>
          </div>
          <span className="pb-badge-prioritas">{t("Prioritas", "Featured")}</span>
        </div>
        <h3 style={{ margin: "14px 0 6px", fontSize: 17 }}>{t("Posisi yang kamu buka", "The role you're hiring for")}</h3>
        <div style={{ color: "var(--muted)", fontSize: 13.5 }}>{t("Kota · Full time · Di kantor", "City · Full time · On-site")}</div>
        <div style={{ marginTop: 14, fontWeight: 650, color: "var(--brand)" }}>{t("Rentang gaji", "Salary range")}</div>
      </div>
      <div className="pk-contoh-statistik">
        <span>
          <Eye size={14} /> {t("Dilihat", "Views")}
        </span>
        <span>
          <MousePointerClick size={14} /> {t("Klik lamar", "Apply clicks")}
        </span>
      </div>
    </div>
  );
}

export function PemberiKerjaPage() {
  const { session } = useAuth();
  const { statistik } = useJobs();
  const total = statistik?.total;
  useGulirKeHash(true);
  useEffect(() => {
    document.title = t("Pasang loker di Workly · Untuk perusahaan", "Post a job on Workly · For employers");
  }, []);

  return (
    <PublicLayout aktif="/pemberi-kerja">
      <section className="pb-wrap pb-hero pk-hero">
        <div data-muncul="">
          <span className="pb-label">{t("Untuk perusahaan", "For employers")}</span>
          <h1>
            {t("Temukan kandidat lebih cepat dengan ", "Reach candidates faster with ")}
            <span>{t("loker prioritas", "featured jobs")}</span>
          </h1>
          <p className="pb-lede">
            {t(
              `Pasang loker di Workly mulai ${rupiah(PAKET_LOKER[0].harga)}. Lokermu tampil paling atas di antara ${total ? `${total.toLocaleString(lokal())} ` : ""}lowongan yang dicari pengguna Workly setiap hari, lengkap dengan logo perusahaan.`,
              `Post a job on Workly from ${rupiah(PAKET_LOKER[0].harga)}. Your post appears first among the ${total ? `${total.toLocaleString(lokal())} ` : ""}jobs Workly users browse every day, complete with your company logo.`,
            )}
          </p>
          <div className="pk-aksi">
            <a className="pb-btn pb-btn-primary" {...tautan(session ? "/pemberi-kerja/dasbor?tab=tulis" : "/pemberi-kerja/daftar")}>
              {t("Pasang loker", "Post a job")} <ArrowRight size={16} />
            </a>
            <a className="pb-btn pb-btn-outline" href="#harga">
              {t("Lihat harga", "See pricing")}
            </a>
          </div>
        </div>
        <ContohKartu />
      </section>

      <section className="pb-section" id="cara-kerja">
        <div className="pb-wrap">
          <div className="pb-head" data-muncul="">
            <div>
              <span className="pb-label">{t("Cara kerja", "How it works")}</span>
              <h2>{t("Empat langkah sampai lokermu tayang", "Four steps to a live job post")}</h2>
            </div>
          </div>
          <ol className="pk-langkah">
            {LANGKAH.map(({ Ikon, judul, isi }, i) => (
              <li key={judul} data-muncul="" style={{ "--tunda": `${i * 70}ms` }}>
                <span className="pk-langkah-ikon">
                  <Ikon size={20} />
                </span>
                <b>
                  {i + 1}. {judul}
                </b>
                <p>{isi}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pb-section tint pk-harga" id="harga">
        <div className="pb-wrap">
          <div className="pb-head" data-muncul="">
            <div>
              <span className="pb-label">{t("Harga", "Pricing")}</span>
              <h2>{t("Bayar per loker, lebih hemat dengan paket", "Pay per post, save with a bundle")}</h2>
              <p>{t("Sekali bayar, tanpa langganan. Semua paket mendapat fitur yang sama:", "One-time payment, no subscription. Every bundle includes:")}</p>
            </div>
          </div>
          <div className="pb-prices">
            {PAKET_LOKER.map((p, i) => (
              <div key={p.id} className={`pb-price ${p.populer ? "rek" : ""}`} data-muncul="" style={{ "--tunda": `${i * 70}ms` }}>
                <div className="pb-price-top">
                  <h3>{p.nama}</h3>
                  {p.populer && <span className="pb-tag">{t("Paling banyak dipilih", "Most popular")}</span>}
                </div>
                <div className="amt">{rupiah(p.harga)}</div>
                <div className="per">
                  {p.kredit > 1
                    ? t(`${rupiah(Math.round(p.harga / p.kredit))} per loker · hemat ${p.hemat}%`, `${rupiah(Math.round(p.harga / p.kredit))} per post · save ${p.hemat}%`)
                    : t("per loker", "per post")}
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "var(--ink2)" }}>{p.ket}</p>
                <ul>
                  {FITUR_LOKER.map((f) => (
                    <li key={f}>
                      <Check size={15} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a className={`pb-btn ${p.populer ? "pb-btn-primary" : "pb-btn-outline"}`} {...tautan(`/pemberi-kerja/dasbor?beli=${p.id}`)}>
                  {t(`Pilih ${p.nama}`, `Choose ${p.nama}`)}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-section" id="faq">
        <div className="pb-wrap pk-faq">
          <div data-muncul="">
            <span className="pb-label">FAQ</span>
            <h2 className="pb-h2">{t("Pertanyaan pemberi kerja", "Employer questions")}</h2>
          </div>
          <DaftarFaq items={FAQ_MITRA.map(([q, j]) => ({ q, a: [j] }))} />
        </div>
      </section>

      <section className="pb-section tint">
        <div className="pb-wrap pk-ajak" data-muncul="">
          <h2>{t("Siap membuka lowongan?", "Ready to hire?")}</h2>
          <p>{t("Buat akun perusahaan gratis. Kredit baru dibeli saat kamu siap memasang loker.", "Create a free company account. Buy credits only when you're ready to post.")}</p>
          <a className="pb-btn pb-btn-primary" {...tautan(session ? "/pemberi-kerja/dasbor?tab=tulis" : "/pemberi-kerja/daftar")}>
            {t("Mulai sekarang", "Get started")} <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}

// Persiapan wawancara kerja seputar Excel: pertanyaan umum, pertanyaan per posisi, tips tes praktik, dan cara menulis skill Excel di CV.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Html } from '../components/Html';
import { JoblyCard } from '../components/JoblyCard';
import { Paywall } from '../components/Buy';
import { useProgress } from '../lib/progress';
import { IV_CHECKLIST, IV_CV, IV_GENERAL, IV_ROLES, IV_TEST_TIPS } from '../content/interview.js';

const CHK_KEY = 'kr.iv.check';
const readChk = (): number[] => { try { const x = JSON.parse(localStorage.getItem(CHK_KEY) || '[]'); return Array.isArray(x) ? x.filter(Number.isInteger) : []; } catch { return []; } };

export default function InterviewPage() {
  const { isPro } = useProgress();
  const [role, setRole] = useState(IV_ROLES[0].id);
  const [chk, setChk] = useState<number[]>(readChk);
  const [copied, setCopied] = useState(-1);
  useEffect(() => { document.title = 'Wawancara & CV: Pertanyaan Excel yang Sering Ditanya · Jagoan Excel'; }, []);
  useEffect(() => { try { localStorage.setItem(CHK_KEY, JSON.stringify(chk)); } catch { /* abaikan */ } }, [chk]);
  const r = IV_ROLES.find(x => x.id === role)!;
  const copy = async (t: string, i: number) => { try { await navigator.clipboard.writeText(t); setCopied(i); setTimeout(() => setCopied(-1), 1500); } catch { /* abaikan */ } };

  return (
    <div className="wrap page iv">
      <div className="page-head"><p className="eyebrow">Persiapan kerja</p><h1>Wawancara & CV: Excel</h1>
        <p>Pertanyaan Excel yang sering ditanyakan saat wawancara, contoh jawabannya, dan cara menulis skill Excel di CV.</p></div>
      {isPro && <nav className="iv-toc" aria-label="Isi halaman">
        <a href="#iv-umum">Pertanyaan umum</a><a href="#iv-posisi">Per posisi</a><a href="#iv-tes">Tips tes praktik</a><a href="#iv-cv">Skill Excel di CV</a><a href="#iv-cek">Checklist H-1</a>
      </nav>}

      <section id="iv-umum" className="iv-sec">
        <h2>10 pertanyaan Excel yang paling sering ditanya</h2>
        <div className="iv-list">{(isPro ? IV_GENERAL : IV_GENERAL.slice(0, 2)).map((x, i) => (
          <details key={i} className="iv-q" open={i === 0}>
            <summary><span className="iv-n">{i + 1}</span>{x.q}</summary>
            <div className="iv-a">
              <p className="iv-why"><b>Kenapa ditanya:</b> {x.why}</p>
              <div className="iv-good"><b>Contoh jawaban yang bagus</b><Html as="p" html={x.good} /></div>
              <div className="iv-avoid"><b>Hindari</b><Html as="p" html={x.avoid} /></div>
            </div>
          </details>))}
        </div>
      </section>

      {!isPro ? <Paywall what="Persiapan wawancara & CV" desc={`Masih ada ${IV_GENERAL.length - 2} pertanyaan umum lagi, pertanyaan teknis untuk ${IV_ROLES.length} posisi, tips tes praktik, contoh kalimat skill Excel untuk CV, dan checklist H-1. Semuanya terbuka untuk member Pro.`} /> : <>
      <section id="iv-posisi" className="iv-sec">
        <h2>Pertanyaan teknis per posisi</h2>
        <div className="filters" role="tablist" aria-label="Posisi">
          {IV_ROLES.map(x => <button key={x.id} role="tab" className="chip" aria-selected={role === x.id} aria-pressed={role === x.id} onClick={() => setRole(x.id)}>{x.title}</button>)}
        </div>
        <div className="iv-list" role="tabpanel">{r.items.map((x, i) => (
          <details key={r.id + i} className="iv-q"><summary><span className="iv-n">{i + 1}</span>{x.q}</summary><div className="iv-a"><Html as="p" html={x.a} /></div></details>))}
        </div>
        <p className="iv-cta">Sudah paham teorinya? Buktikan dengan <Link to="/tes-kerja">simulasi tes Excel rekrutmen</Link> untuk posisi ini.</p>
      </section>

      <section id="iv-tes" className="iv-sec">
        <h2>Tips mengerjakan tes Excel praktik</h2>
        <ol className="iv-tips">{IV_TEST_TIPS.map((t, i) => <li key={i}>{t}</li>)}</ol>
      </section>

      <section id="iv-cv" className="iv-sec">
        <h2>Cara menulis skill Excel di CV</h2>
        <div className="iv-cv">
          <div className="iv-bad"><b>Kurang meyakinkan</b><ul>{IV_CV.weak.map(t => <li key={t}>{t}</li>)}</ul></div>
          <div className="iv-ok"><b>Lebih meyakinkan</b><ul>{IV_CV.strong.map((t, i) => <li key={t}><span>{t}</span><button className="btn ghost sm" onClick={() => copy(t, i)}>{copied === i ? 'Tersalin' : 'Salin'}</button></li>)}</ul></div>
        </div>
        <ul className="iv-tips">{IV_CV.tips.map((t, i) => <li key={i}><Html as="span" html={t} /></li>)}</ul>
        <p className="iv-cta">Lampirkan buktinya: <Link to="/sertifikat">sertifikat dengan QR verifikasi</Link> dan <Link to="/portofolio">portofolio PDF</Link> berisi hasil latihanmu.</p>
        <JoblyCard />
      </section>

      <section id="iv-cek" className="iv-sec">
        <h2>Checklist H-1 sebelum tes & wawancara</h2>
        <ul className="iv-check">{IV_CHECKLIST.map((t, i) => (
          <li key={i}><label><input type="checkbox" checked={chk.includes(i)} onChange={e => setChk(c => e.target.checked ? [...c, i] : c.filter(x => x !== i))} /> <span>{t}</span></label></li>))}
        </ul>
        <p className="muted" style={{ fontSize: 13 }}>{chk.length}/{IV_CHECKLIST.length} selesai · centang tersimpan di perangkat ini.</p>
      </section>
      </>}
    </div>
  );
}

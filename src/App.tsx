import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { Footer } from './components/Footer';
import { BuyProvider } from './components/Buy';
import { pathFor } from './lib/catalog';
import { useAuth } from './lib/auth';
import Home from './pages/Home';
import MateriPage from './pages/MateriPage';
import ProPage from './pages/ProPage';
import FnPage from './pages/FnPage';
import CertificatePage, { VerifyPage } from './pages/CertificatePage';
import ExamPage from './pages/ExamPage';
import PortfolioPage from './pages/PortfolioPage';
import LessonPage from './pages/LessonPage';
import CasesPage from './pages/CasesPage';
import PlaygroundPage from './pages/PlaygroundPage';
import PathsPage from './pages/PathsPage';
import TemplatesPage from './pages/TemplatesPage';
import BankPage from './pages/BankPage';
import DrillPage from './pages/DrillPage';
import CheatSheetPage from './pages/CheatSheetPage';
import { FunctionsPage, RibbonPage, ShortcutsPage } from './pages/RefPages';
import PricingPage from './pages/PricingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import TesKerjaPage from './pages/TesKerjaPage';
import InterviewPage from './pages/InterviewPage';
import ShortcutGamePage from './pages/ShortcutGamePage';
import { ErrorListPage, ErrorPage } from './pages/ErrorPages';
import { setMeta } from './lib/meta';
import RankPage from './pages/RankPage';
import ChallengePage from './pages/ChallengePage';
import NotFound from './pages/NotFound';

const TITLES: Record<string, string> = {
  '/': 'Jagoan Excel', '/materi': 'Materi', '/pro': 'Latihan Pro', '/portofolio': 'Portofolio', '/sertifikat': 'Sertifikat', '/kasus': 'Studi Kasus', '/playground': 'Excel Playground', '/jalur': 'Jalur Belajar', '/template': 'Template Excel', '/soal': 'Bank Soal', '/ringkas': 'Rumus Ringkas', '/fitur': 'Fitur Excel',
  '/fungsi': 'Daftar Fungsi', '/shortcut': 'Shortcut Excel', '/harga': 'Paket Pro', '/dashboard': 'Dashboard', '/peringkat': 'Peringkat', '/masuk': 'Masuk',
};

const DEFAULT_DESC = 'Belajar Excel dari nol sampai siap kerja: materi praktik langsung di browser, studi kasus kantor, bank soal, simulasi tes kerja, dan sertifikat dengan QR verifikasi.';

export default function App() {
  const loc = useLocation();
  const nav = useNavigate();
  const { ready } = useAuth();

  // Tautan di dalam konten HTML kurikulum memakai data-go="id"; arahkan lewat router.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('[data-go]') as HTMLElement | null;
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      e.preventDefault(); nav(pathFor(a.dataset.go || ''));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [nav]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (TITLES[loc.pathname]) setMeta(TITLES[loc.pathname] === 'Jagoan Excel' ? 'Jagoan Excel · Belajar Excel sambil praktik' : TITLES[loc.pathname] + ' · Jagoan Excel', DEFAULT_DESC, loc.pathname);
  }, [loc.pathname]);

  return (
    <BuyProvider>
      <TopBar />
      {!ready ? <p className="loading">Memuat…</p> : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/materi" element={<MateriPage />} />
          <Route path="/pro" element={<ProPage />} />
          <Route path="/portofolio" element={<PortfolioPage />} />
          <Route path="/sertifikat" element={<CertificatePage />} />
          <Route path="/verifikasi/:id" element={<VerifyPage />} />
          <Route path="/ujian/:level" element={<ExamPage />} />
          <Route path="/materi/:id" element={<LessonPage kind="lesson" />} />
          <Route path="/kasus" element={<CasesPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/jalur" element={<PathsPage />} />
          <Route path="/template" element={<TemplatesPage />} />
          <Route path="/jalur/:id" element={<PathsPage />} />
          <Route path="/kasus/:id" element={<LessonPage kind="case" />} />
          <Route path="/soal" element={<BankPage />} />
          <Route path="/soal/:id" element={<DrillPage />} />
          <Route path="/ringkas" element={<CheatSheetPage />} />
          <Route path="/fitur" element={<RibbonPage />} />
          <Route path="/fungsi" element={<FunctionsPage />} />
          <Route path="/fungsi/:name" element={<FnPage />} />
          <Route path="/shortcut" element={<ShortcutsPage />} />
          <Route path="/shortcut/latihan" element={<ShortcutGamePage />} />
          <Route path="/tes-kerja" element={<TesKerjaPage />} />
          <Route path="/peringkat" element={<RankPage />} />
          <Route path="/tantangan" element={<ChallengePage />} />
          <Route path="/wawancara" element={<InterviewPage />} />
          <Route path="/error" element={<ErrorListPage />} />
          <Route path="/error/:slug" element={<ErrorPage />} />
          <Route path="/harga" element={<PricingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/masuk" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
      <Footer />
    </BuyProvider>
  );
}

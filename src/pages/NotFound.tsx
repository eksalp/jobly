import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="wrap page">
      <div className="page-head">
        <h1>Halaman tidak ditemukan</h1>
        <p>Mungkin alamatnya salah ketik, atau halamannya sudah pindah.</p>
      </div>
      <Link className="btn primary" to="/materi">Kembali ke daftar materi</Link>
    </div>
  );
}

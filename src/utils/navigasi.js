/**
 * Navigasi antarhalaman tanpa library router.
 *
 * Komponen mana pun cukup memanggil keHalaman("/loker?q=akuntan").
 * JobFinderSite mendengarkan event ini, memperbarui URL, lalu merender
 * halaman yang sesuai.
 */
export function keHalaman(path) {
  window.dispatchEvent(new CustomEvent("jf:path", { detail: path }));
}

/**
 * Props untuk <a> internal: tetap tautan sungguhan (bisa dibuka di tab
 * baru dengan Ctrl/Cmd-klik), tapi klik biasa tidak memuat ulang halaman.
 */
export function tautan(path) {
  return {
    href: path,
    onClick: (e) => {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
        return;
      e.preventDefault();
      keHalaman(path);
    },
  };
}

/** Tujuan untuk fitur dashboard: langsung ke panel kalau sudah masuk. */
export function pathFitur(panelId, sudahMasuk) {
  return sudahMasuk ? `/dashboard/${panelId}` : "/register";
}

/** Bagikan tautan: pakai menu bagikan bawaan HP, atau salin ke clipboard. */
export async function bagikan({ judul, teks, url }) {
  const lengkap = url.startsWith("http") ? url : window.location.origin + url;
  try {
    if (navigator.share) {
      await navigator.share({ title: judul, text: teks, url: lengkap });
      return "dibagikan";
    }
  } catch {
    // Pengguna membatalkan menu bagikan — lanjut ke salin
  }
  try {
    await navigator.clipboard.writeText(lengkap);
    return "disalin";
  } catch {
    return "gagal";
  }
}

/**
 * Memuat Midtrans Snap (window.snap) sekali saja dan mengembalikannya.
 * Client key sandbox berawalan "SB-", jadi URL script mengikuti key-nya.
 */
let janji = null;

export function muatSnap() {
  if (window.snap) return Promise.resolve(window.snap);
  if (janji) return janji;
  const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
  if (!clientKey) return Promise.reject(new Error("VITE_MIDTRANS_CLIENT_KEY belum diisi."));
  const src = clientKey.startsWith("SB-")
    ? "https://app.sandbox.midtrans.com/snap/snap.js"
    : "https://app.midtrans.com/snap/snap.js";
  janji = new Promise((ok, gagal) => {
    const ada = document.getElementById("midtrans-snap");
    const s = ada || document.createElement("script");
    s.addEventListener("load", () => ok(window.snap));
    s.addEventListener("error", () => {
      janji = null;
      gagal(new Error("Gagal memuat Midtrans. Periksa koneksi internet."));
    });
    if (!ada) {
      s.id = "midtrans-snap";
      s.src = src;
      s.setAttribute("data-client-key", clientKey);
      document.head.appendChild(s);
    }
  });
  return janji;
}

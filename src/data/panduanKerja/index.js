/**
 * Bagian panjang panduan profesi: cara lolos seleksi dan seperti apa kerjanya.
 * Dimuat terpisah (dynamic import) dari halaman detail panduan.
 */
import menulis from "./menulis.js";
import desain from "./desain.js";
import teknologi from "./teknologi.js";
import pemasaran from "./pemasaran.js";
import data from "./data.js";
import keuangan from "./keuangan.js";
import admin from "./admin.js";
import pendidikan from "./pendidikan.js";

export const PANDUAN_KERJA = { ...menulis, ...desain, ...teknologi, ...pemasaran, ...data, ...keuangan, ...admin, ...pendidikan };

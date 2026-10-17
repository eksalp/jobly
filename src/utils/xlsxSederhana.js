/**
 * Pembuat file Excel (.xlsx) kecil tanpa pustaka tambahan.
 *
 * File .xlsx adalah arsip ZIP berisi beberapa berkas XML. Di sini arsipnya
 * disusun sendiri (tanpa kompresi, cukup untuk data portofolio yang
 * kecil), sehingga tidak perlu memuat pustaka spreadsheet yang besar.
 *
 *   const blob = buatXlsx([
 *     { nama: "Hasil", kolom: ["Nama", "Kota"], baris: [["Budi", "Jakarta"]] },
 *     { nama: "Catatan", baris: [["Aturan pembersihan"], ["..."]], lebar: [90] },
 *   ]);
 */

/* ------------------------------------------------------------ ZIP */

const TABEL_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(data) {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = TABEL_CRC[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function waktuDos(d = new Date()) {
  const waktu = (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2);
  const tanggal = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { waktu, tanggal };
}

function buatZip(berkas) {
  const enc = new TextEncoder();
  const { waktu, tanggal } = waktuDos();
  const bagian = [];
  const pusat = [];
  let posisi = 0;

  for (const { nama, isi } of berkas) {
    const namaB = enc.encode(nama);
    const data = typeof isi === "string" ? enc.encode(isi) : isi;
    const crc = crc32(data);

    const lokal = new DataView(new ArrayBuffer(30));
    lokal.setUint32(0, 0x04034b50, true);
    lokal.setUint16(4, 20, true);
    lokal.setUint16(6, 0x0800, true); // nama berkas UTF-8
    lokal.setUint16(8, 0, true); // tanpa kompresi
    lokal.setUint16(10, waktu, true);
    lokal.setUint16(12, tanggal, true);
    lokal.setUint32(14, crc, true);
    lokal.setUint32(18, data.length, true);
    lokal.setUint32(22, data.length, true);
    lokal.setUint16(26, namaB.length, true);
    lokal.setUint16(28, 0, true);
    bagian.push(new Uint8Array(lokal.buffer), namaB, data);

    const p = new DataView(new ArrayBuffer(46));
    p.setUint32(0, 0x02014b50, true);
    p.setUint16(4, 20, true);
    p.setUint16(6, 20, true);
    p.setUint16(8, 0x0800, true);
    p.setUint16(10, 0, true);
    p.setUint16(12, waktu, true);
    p.setUint16(14, tanggal, true);
    p.setUint32(16, crc, true);
    p.setUint32(20, data.length, true);
    p.setUint32(24, data.length, true);
    p.setUint16(28, namaB.length, true);
    p.setUint32(42, posisi, true);
    pusat.push(new Uint8Array(p.buffer), namaB);

    posisi += 30 + namaB.length + data.length;
  }

  const ukuranPusat = pusat.reduce((t, b) => t + b.length, 0);
  const akhir = new DataView(new ArrayBuffer(22));
  akhir.setUint32(0, 0x06054b50, true);
  akhir.setUint16(8, berkas.length, true);
  akhir.setUint16(10, berkas.length, true);
  akhir.setUint32(12, ukuranPusat, true);
  akhir.setUint32(16, posisi, true);

  return new Blob([...bagian, ...pusat, new Uint8Array(akhir.buffer)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

/* ----------------------------------------------------------- XLSX */

const esc = (s) =>
  String(s ?? "")
    // Karakter kendali tidak sah di XML
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function namaKolom(i) {
  let s = "";
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

// Angka murni (tanpa nol di depan, mis. nomor HP "0812…" tetap teks)
const angkaMurni = (v) => typeof v === "number" || /^-?(0|[1-9]\d{0,9})(\.\d+)?$/.test(String(v).trim());

function sel(ref, nilai, gaya) {
  const s = gaya ? ` s="${gaya}"` : "";
  if (nilai === "" || nilai == null) return gaya ? `<c r="${ref}"${s}/>` : "";
  if (angkaMurni(nilai)) return `<c r="${ref}"${s}><v>${Number(String(nilai).trim())}</v></c>`;
  return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${esc(nilai)}</t></is></c>`;
}

/**
 * gaya: 0 biasa, 1 kepala tabel (tebal + latar), 2 teks panjang (wrap),
 * 3 judul (tebal, besar).
 */
function lembar({ kolom, baris = [], lebar, judul }) {
  const semua = [];
  const gayaBaris = [];
  if (judul) {
    semua.push([judul]);
    gayaBaris.push(3);
    semua.push([]);
    gayaBaris.push(0);
  }
  const barisKepala = kolom?.length ? semua.length : -1;
  if (kolom?.length) {
    semua.push(kolom);
    gayaBaris.push(1);
  }
  baris.forEach((b) => {
    semua.push(b);
    gayaBaris.push(2);
  });

  const nKolom = Math.max(1, ...semua.map((b) => b.length));
  const lebarKolom =
    lebar ||
    Array.from({ length: nKolom }, (_, i) =>
      Math.min(60, Math.max(10, ...semua.map((b) => String(b[i] ?? "").split("\n").reduce((m, x) => Math.max(m, x.length), 0) + 2))),
    );

  const xmlBaris = semua
    .map((b, r) => {
      const isi = b.map((v, c) => sel(`${namaKolom(c)}${r + 1}`, v, gayaBaris[r] || 0)).join("");
      return `<row r="${r + 1}">${isi}</row>`;
    })
    .join("");

  const beku = barisKepala >= 0
    ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="${barisKepala + 1}" topLeftCell="A${barisKepala + 2}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`
    : "";
  const cols = `<cols>${lebarKolom.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("")}</cols>`;
  const filter = barisKepala >= 0 && baris.length
    ? `<autoFilter ref="A${barisKepala + 1}:${namaKolom(nKolom - 1)}${barisKepala + 1 + baris.length}"/>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${beku}${cols}<sheetData>${xmlBaris}</sheetData>${filter}</worksheet>`;
}

const GAYA = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="3"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="14"/><name val="Calibri"/></font></fonts>
<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF14549A"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="2"><border/><border><left style="thin"><color rgb="FFD5DBE5"/></left><right style="thin"><color rgb="FFD5DBE5"/></right><top style="thin"><color rgb="FFD5DBE5"/></top><bottom style="thin"><color rgb="FFD5DBE5"/></bottom></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="4">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment vertical="center"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

/** Nama lembar Excel: maks. 31 karakter, tanpa : \ / ? * [ ] */
const namaLembar = (s, i) => (String(s || `Sheet${i + 1}`).replace(/[:\\/?*[\]]/g, " ").trim().slice(0, 31) || `Sheet${i + 1}`);

export function buatXlsx(daftarLembar, { judul = "Jobly", pembuat = "Jobly" } = {}) {
  const lembarAman = daftarLembar.map((l, i) => ({ ...l, nama: namaLembar(l.nama, i) }));
  const sekarang = new Date().toISOString().replace(/\.\d+Z$/, "Z");

  const berkas = [
    {
      nama: "[Content_Types].xml",
      isi: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
${lembarAman.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("\n")}
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
</Types>`,
    },
    {
      nama: "_rels/.rels",
      isi: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
</Relationships>`,
    },
    {
      nama: "docProps/core.xml",
      isi: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<dc:title>${esc(judul)}</dc:title><dc:creator>${esc(pembuat)}</dc:creator>
<dcterms:created xsi:type="dcterms:W3CDTF">${sekarang}</dcterms:created>
</cp:coreProperties>`,
    },
    {
      nama: "xl/workbook.xml",
      isi: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets>${lembarAman.map((l, i) => `<sheet name="${esc(l.nama)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("")}</sheets>
</workbook>`,
    },
    {
      nama: "xl/_rels/workbook.xml.rels",
      isi: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${lembarAman.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("\n")}
<Relationship Id="rId${lembarAman.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
    },
    { nama: "xl/styles.xml", isi: GAYA },
    ...lembarAman.map((l, i) => ({ nama: `xl/worksheets/sheet${i + 1}.xml`, isi: lembar(l) })),
  ];

  return buatZip(berkas);
}

/** Simpan Blob sebagai unduhan. */
export function unduhBlob(blob, namaBerkas) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = namaBerkas;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

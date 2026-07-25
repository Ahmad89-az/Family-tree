# Silsilah Keluarga Besar

Website silsilah keluarga interaktif, modern, dan mampu menangani ratusan–ribuan anggota keluarga. Dibangun dengan React + Vite + Tailwind CSS v4 + Framer Motion.

## Fitur

- **Landing Page** — hero, statistik ringkas, daftar fitur
- **Pohon Keluarga Interaktif** — zoom, drag/pan, expand/collapse cabang, fullscreen, ganti leluhur awal (`react-zoom-pan-pinch`)
- **Pencarian** — nama, panggilan, orang tua, pasangan + filter generasi/gender/status
- **Profil Anggota** — modal detail lengkap (foto, biodata, orang tua, pasangan, anak, galeri)
- **Linimasa Generasi** — kronologis per generasi
- **Statistik Keluarga** — total, gender, generasi, status hidup/wafat, grafik pertumbuhan per dekade
- **Panel Admin** — tambah/ubah/hapus anggota, impor/ekspor JSON, reset ke data awal (tersimpan di `localStorage`)
- **Dark Mode** — toggle, ikut preferensi sistem
- **Responsive** — desktop, tablet, mobile

## Instalasi

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Build Produksi

```bash
npm run build
```

Hasil build ada di folder `dist/`.

## Struktur Data

Data anggota keluarga (`src/data/familyData.js`) — 34 anggota dummy, 4 generasi:

```js
{
  id: "1",
  name: "H. Abdullah Rahman",
  nickname: "Abdullah",
  gender: "Male",
  birthDate: "1932-03-12",
  deathDate: "2005-11-02",
  photo: "url-foto",
  father: null,
  mother: null,
  spouse: ["2"],
  children: ["3","4","5","6"],
  address: "...",
  occupation: "...",
  education: "...",
  notes: "...",
  gallery: ["url1", "url2"]
}
```

Data yang diubah lewat Panel Admin tersimpan otomatis di `localStorage` browser. Gunakan tombol **Ekspor JSON** secara berkala untuk backup, dan **Impor JSON** untuk memuat data lain (misalnya data keluarga sesungguhnya menggantikan data dummy).

## Deploy ke GitHub Pages

1. Push project ini ke repository GitHub.
2. Di `vite.config.js`, `base: './'` sudah diset agar path aset relatif (aman untuk GitHub Pages di subpath apa pun).
3. Build lalu deploy folder `dist/`:

   ```bash
   npm run build
   ```

   **Opsi A — pakai `gh-pages` package:**
   ```bash
   npm install --save-dev gh-pages
   npx gh-pages -d dist
   ```
   Lalu di Settings → Pages repo GitHub, pilih branch `gh-pages` sebagai source.

   **Opsi B — manual:**
   ```bash
   git subtree push --prefix dist origin gh-pages
   ```

4. Website akan tersedia di `https://<username>.github.io/<repo>/`.

Routing menggunakan `HashRouter` (URL berbentuk `/#/pohon-keluarga`) agar semua rute berfungsi normal di GitHub Pages tanpa konfigurasi server tambahan.

## Skalabilitas (500–2000+ anggota)

- Pohon keluarga merender cabang secara lazy: hanya 2 level pertama yang otomatis terbuka (`expanded`), sisanya dibuka on-demand lewat tombol expand/collapse — mengurangi jumlah node yang dirender sekaligus.
- Pencarian dan statistik memakai memoisasi (`useMemo`) agar tidak menghitung ulang saat re-render yang tidak perlu.
- Untuk skala jauh lebih besar (>5000 anggota), pertimbangkan migrasi penyimpanan dari `localStorage` ke backend/database dan tambahkan virtualisasi list (mis. `react-window`) pada halaman Pencarian/Linimasa.

## Teknologi

React 19 · Vite · Tailwind CSS v4 · Framer Motion · Lucide Icons · react-router-dom (HashRouter) · react-zoom-pan-pinch

# Portofolio-nya Andhika

Website portofolio pribadi Andhika Prasetya Adi Nugroho, Hydrographic & Geomatic Engineer. Situs ini menampilkan profil, pengalaman, kemampuan geospasial, dan thesis research dalam pengalaman web interaktif berbasis tema.

Live demo: [portofolio-nya-andhika.vercel.app](https://portofolio-nya-andhika.vercel.app)

Research thesis system: [PADIS WebGIS](https://padis-beryl.vercel.app/)

---

## Tentang Proyek

Portofolio ini dirancang sebagai media presentasi profesional untuk memperkenalkan latar belakang akademik, pengalaman lapangan, kepemimpinan organisasi, dan kapabilitas teknis di bidang geodesi, geomatika, hidrografi, serta sistem informasi geospasial.

Fitur utama:

- Mode visual interaktif untuk Hydro, GIS, Survey, dan Geo Precision
- Profil personal dengan nuansa geospatial command interface
- Riwayat pengalaman kerja, organisasi, dan technical stack
- Logo personal yang mengikuti warna tema aktif
- Card Core Advantage yang menampilkan kekuatan utama tiap mode
- Section Research Thesis dengan akses langsung ke PADIS WebGIS
- Tombol Download CV Andhika dari file PDF portfolio
- Metadata SEO, Open Graph, dan aksesibilitas dasar untuk navigasi interaktif
- Tampilan responsif untuk desktop dan mobile
- Animasi dan micro-interaction menggunakan Motion

---

## Teknologi yang Digunakan

| Teknologi | Keterangan |
|-----------|------------|
| [React](https://react.dev/) | Library UI utama |
| [TypeScript](https://www.typescriptlang.org/) | Type safety untuk kode frontend |
| [Vite](https://vite.dev/) | Build tool dan development server |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Motion](https://motion.dev/) | Animasi komponen React |
| [Lucide React](https://lucide.dev/) | Ikon UI |
| [Vercel](https://vercel.com/) | Hosting dan deployment |

---

## Struktur Proyek

```text
Portofolio-Web/
|-- public/
|   |-- Andhika_Nugroho_CV_Resume.pdf
|   |-- logo.svg
|   `-- profile-picture.jpg
|-- src/
|   |-- App.tsx
|   |-- data.ts
|   |-- hooks.ts
|   |-- icons.tsx
|   |-- index.css
|   |-- main.tsx
|   `-- themes.tsx
|-- index.html
|-- package.json
|-- tsconfig.json
|-- vite.config.ts
`-- README.md
```

---

## Cara Menjalankan Secara Lokal

Pastikan Node.js sudah terinstal di komputer Anda.

### 1. Clone Repository

```bash
git clone https://github.com/mykewazowsky/Portofolio-Myke.git
cd Portofolio-Myke
```

### 2. Install Dependensi

```bash
npm install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Secara default, project berjalan di `http://localhost:3000/`. Jika port tersebut sedang dipakai, Vite akan memakai port berikutnya yang tersedia.

### 4. Cek TypeScript

```bash
npm run lint
```

### 5. Build untuk Produksi

```bash
npm run build
```

Hasil build akan tersimpan di folder `dist/`.

### 6. Preview Hasil Build

```bash
npm run preview
```

---

## Deployment

Website ini di-deploy melalui Vercel. Push ke branch utama akan memicu proses deployment sesuai konfigurasi project di Vercel.

---

## Kontak

Dibuat oleh Andhika Prasetya Adi Nugroho.

Email: [andhikaprasetya68@gmail.com](mailto:andhikaprasetya68@gmail.com)

# Portofolio-nya Andhika

Website portofolio pribadi yang menampilkan daftar proyek dan karya. Dibangun menggunakan Vite dan di-deploy melalui Vercel.

Live demo: [portofolio-nya-andhika.vercel.app](https://portofolio-nya-andhika.vercel.app)

---

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Proyek](#struktur-proyek)
- [Cara Menjalankan Secara Lokal](#cara-menjalankan-secara-lokal)
- [Deployment](#deployment)
- [Lisensi](#lisensi)

---

## Tentang Proyek

Website ini merupakan portofolio pribadi yang dirancang untuk memperkenalkan diri dan menampilkan daftar proyek yang pernah dikerjakan. Tujuan utama pembuatan portofolio ini adalah sebagai media presentasi karya kepada rekruter, klien, maupun komunitas pengembang.

Fitur utama:

- Daftar proyek beserta deskripsi singkat
- Tampilan responsif untuk berbagai ukuran layar
- Performa loading yang cepat berkat Vite sebagai build tool

---

## Teknologi yang Digunakan

| Teknologi | Keterangan |
|-----------|------------|
| [Vite](https://vitejs.dev/) | Build tool dan development server |
| HTML5 | Struktur halaman |
| CSS3 | Styling dan layout |
| JavaScript (ES6+) | Logika interaktivitas |
| [Vercel](https://vercel.com/) | Platform hosting dan deployment |

---

## Struktur Proyek

```
portofolio-nya-andhika/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   ├── styles/
│   └── main.js
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

> Sesuaikan struktur di atas dengan struktur folder aktual di repository.

---

## Cara Menjalankan Secara Lokal

Pastikan [Node.js](https://nodejs.org/) versi 16 ke atas sudah terinstal di komputer Anda.

### 1. Clone Repository

```bash
git clone https://github.com/username/portofolio-nya-andhika.git
cd portofolio-nya-andhika
```

> Ganti `username` dengan username GitHub Anda.

### 2. Install Dependensi

```bash
npm install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka browser dan akses `http://localhost:5173` untuk melihat hasilnya.

### 4. Build untuk Produksi

```bash
npm run build
```

Hasil build akan tersimpan di folder `dist/`.

### 5. Preview Hasil Build

```bash
npm run preview
```

---

## Deployment

Website ini di-deploy secara otomatis melalui [Vercel](https://vercel.com/) setiap kali ada perubahan yang di-push ke branch `main`.

Langkah deploy manual (jika diperlukan):

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login ke akun Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

---

## Lisensi

Proyek ini bersifat open source dan tersedia di bawah lisensi [MIT](LICENSE).

---

Dibuat oleh Andhika Prasetya Adi Nugroho
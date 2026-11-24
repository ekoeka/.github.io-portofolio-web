# Portfolio Eka

Website statis dengan HTML, CSS, dan JavaScript vanilla. Enam kategori dimuat dari Google Sheets yang dipublikasikan sebagai CSV. URL dan urutan kolom mengikuti implementasi yang ada; nama header dan isi sheet live masih perlu diverifikasi.

Untuk pratinjau lokal jalankan `python3 -m http.server 8000`, lalu buka `http://localhost:8000/`. Koneksi ke Google Sheets dan CDN diperlukan untuk data dan ikon.

Jalankan `node tests/csv.test.js`, `node tests/theme.test.js`, dan `node tests/pages.test.js` untuk tes parser, validasi, tema, rendering halaman, retry, dan empty state dengan DOM simulasi. Pemeriksaan browser dan integrasi Google Sheets live belum dilakukan.

Tampilan menggunakan dark mode sebagai pilihan awal, grid modular, dan navigasi ke proyek, keahlian, serta perjalanan. Proyek prioritas hanya diurutkan jika judulnya cocok dengan data Sheets; isi proyek tidak ditambahkan otomatis. Pilihan mode terang atau gelap disimpan di browser dan berlaku pada kedua halaman. Situs menghormati pengaturan reduced motion; daftar keahlian dapat digulir saat animasi dikurangi. Tautan sosial masih placeholder dan menunggu alamat yang diverifikasi.

`data.js` menyediakan URL sheet bersama, parser CSV, validasi URL, fetch dengan timeout, dan validasi proyek. Logo dan gambar detail yang gagal dimuat disembunyikan; gambar detail berikutnya dan logo menggunakan lazy loading. `ui.js` menyediakan helper DOM bersama untuk tag dan retry; `theme.js` mengelola tema. `index.js` dan `detail.js` merender data menggunakan DOM API dan menyediakan loading, error dengan retry, serta empty state. Tautan proyek baru memakai judul unik agar tetap menunjuk proyek yang sama setelah urutan baris berubah. Jika judul berubah atau menjadi duplikat, tautan berbasis judul tidak dapat ditemukan. Untuk judul duplikat, tautan baru memakai indeks dan memeriksa judul. Tautan lama `?id=<indeks>` tetap didukung tetapi dapat menunjuk proyek lain setelah perubahan urutan. ID permanen memerlukan kolom unik yang disepakati sebelum mengubah spreadsheet.

Aset eksternal mencakup Google Sheets, Font Awesome dari cdnjs, serta favicon Google untuk logo institusi berbasis domain. Ketersediaan dan kebijakan cache aset tersebut dikendalikan penyedianya; situs ini tidak menyediakan cache offline atau mengatur header hosting.

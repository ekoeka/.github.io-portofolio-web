# Portfolio Eka

Website statis dengan `index.html`, `detail.html`, `style.css`, dan JavaScript vanilla. Enam kategori dimuat dari Google Sheets yang dipublikasikan sebagai CSV. URL dan urutan kolom mengikuti implementasi yang ada; verifikasi nama header spreadsheet masih diperlukan sebelum mendokumentasikan skema resmi.

Untuk pratinjau lokal jalankan `python3 -m http.server 8000`, lalu buka `http://localhost:8000/`. Koneksi ke Google Sheets dan CDN diperlukan untuk data dan ikon.

Jalankan tes parser dan validasi dengan `node tests/csv.test.js`. Tes ini memakai data lokal dan simulasi kegagalan fetch. Pemeriksaan browser dan integrasi Google Sheets live belum dilakukan.

`data.js` menyediakan parser CSV, validasi URL, fetch dengan timeout, dan validasi indeks proyek. `index.js` dan `detail.js` merender data menggunakan DOM API. Tautan proyek baru menyertakan judul untuk mendeteksi sebagian perubahan urutan; URL lama tetap menggunakan indeks baris dan dapat menunjuk proyek lain jika baris berubah. ID stabil membutuhkan kolom unik yang disepakati sebelum mengubah spreadsheet.

# Roadmap

## Phase 01 — Foundation Improvement (selesai secara lokal)

- Parser CSV bersama menangani field berpetik, koma, kutip ganda, multiline, BOM, CRLF, dan menolak CSV yang tidak valid.
- Render teks spreadsheet melalui DOM API; URL eksternal dibatasi ke HTTP(S), tanpa kredensial.
- Validasi field utama per kategori, indeks dan identitas proyek; loading, error dengan retry, dan empty state tersedia.
- Tautan baru menggunakan judul unik sebagai identitas yang bertahan saat baris dipindahkan. Judul duplikat memakai indeks dengan pemeriksaan judul; tautan indeks lama tetap didukung dan dapat bergeser. Kolom ID unik memerlukan persetujuan perubahan spreadsheet.
- Tes lokal tersedia. Header dan data Google Sheets live serta tampilan browser masih perlu diverifikasi.

## Phase 02 — Refactoring & Code Organization (implementasi lokal)

- Helper DOM untuk teks, tag, dan retry digunakan kedua halaman; konfigurasi sheet dan tema tetap terpusat.
- Aturan mobile digabungkan dan warna latar masuk ke variabel tema tanpa mengubah breakpoint.
- Tes regresi dengan DOM simulasi ditambahkan; verifikasi browser dan Sheets live masih diperlukan.
- Push GitHub pending; tidak ada deployment.

## Phase 03 — UI/UX Redesign (implementasi lokal)

- Hero, navigasi, kartu bento, showcase proyek, dan detail diperbarui dengan gaya engineering gelap serta mode terang.
- Urutan prioritas diterapkan hanya pada judul proyek yang cocok dalam Sheets; data atau klaim proyek tidak ditambahkan.
- Tes regresi lokal lulus. Verifikasi visual browser ditunda karena ruang penyimpanan VM terbatas dan Chromium tidak tersedia; data Sheets live juga belum diverifikasi. Push pending, tanpa deployment.

## Phase 04 — Content Management (implementasi lokal)

- Keahlian dikelompokkan menggunakan kolom pertama Skills yang sudah ada; arti header aktual masih perlu diverifikasi.
- Panduan konten memetakan kolom yang dibaca kode dan menyediakan template proyek tanpa mengisi klaim.
- Konfigurasi tautan CV, GitHub, LinkedIn, dan kontak disiapkan; tautan kosong disembunyikan sampai diverifikasi.
- Konten dan struktur Sheets tidak diubah. Push pending.

## Revisi UI — Identitas sidebar sosial

- Sidebar kiri bawah, ikon GitHub/LinkedIn/email, dan garis vertikal dikembalikan dengan ruang khusus untuk konten pada desktop dan mobile.
- GitHub memakai alamat yang diberikan Eka; LinkedIn dan email tetap tidak aktif sampai tujuannya dikonfirmasi.

## Revisi UI — Galeri proyek

- Halaman detail memakai gambar utama dengan thumbnail yang dapat dipilih dan status aktif yang jelas.
- Thumbnail tunggal disembunyikan; gambar yang gagal dimuat menampilkan placeholder.

## P1 — Usability dan aksesibilitas (implementasi lokal)

- Pilihan tema tersimpan; kontrol tema, landmark, fokus keyboard, status data, dan reduced motion ditingkatkan.
- Jarak mobile dan media disesuaikan; pengujian browser dan pembaca layar masih diperlukan.
- Tautan LinkedIn dan email masih memerlukan tujuan yang diverifikasi bersama Eka.

## P2 — Maintainability dan performa (implementasi lokal)

- URL sheet dipusatkan tanpa mengubah alamat atau kolom.
- Logo dan thumbnail mendukung pemuatan tertunda serta penanganan gambar gagal; warna latar menjadi fallback.
- Ketergantungan eksternal dan batas cache didokumentasikan. Perilaku browser dan ketersediaan aset live masih perlu diverifikasi.

## P3 — Search dan dokumentasi

- Tambahkan metadata yang akurat dan favicon jika aset disetujui.
- Verifikasi header, arti kolom, dan prosedur publikasi setiap sheet bersama Eka.

## Phase 07 — Cloudflare & Custom Domain Deployment

- Rencanakan hosting, DNS, domain kustom, TLS, dan migrasi setelah disetujui. Belum ada deployment.

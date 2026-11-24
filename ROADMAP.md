# Roadmap

## Phase 01 — Foundation Improvement (selesai secara lokal)

- Parser CSV bersama menangani field berpetik, koma, kutip ganda, multiline, BOM, CRLF, dan menolak CSV yang tidak valid.
- Render teks spreadsheet melalui DOM API; URL eksternal dibatasi ke HTTP(S), tanpa kredensial.
- Validasi field utama per kategori, indeks dan identitas proyek; loading, error dengan retry, dan empty state tersedia.
- Tautan baru menggunakan judul unik sebagai identitas yang bertahan saat baris dipindahkan. Judul duplikat memakai indeks dengan pemeriksaan judul; tautan indeks lama tetap didukung dan dapat bergeser. Kolom ID unik memerlukan persetujuan perubahan spreadsheet.
- Tes lokal tersedia. Header dan data Google Sheets live serta tampilan browser masih perlu diverifikasi.

## P1 — Usability dan aksesibilitas (implementasi lokal)

- Pilihan tema tersimpan; kontrol tema, landmark, fokus keyboard, status data, dan reduced motion ditingkatkan.
- Jarak mobile dan media disesuaikan; pengujian browser dan pembaca layar masih diperlukan.
- Tautan sosial masih placeholder dan memerlukan tujuan yang diverifikasi bersama Eka.

## P2 — Maintainability dan performa (implementasi lokal)

- URL sheet dipusatkan tanpa mengubah alamat atau kolom.
- Logo dan gambar detail mendukung pemuatan tertunda serta penanganan gambar gagal; warna latar menjadi fallback.
- Ketergantungan eksternal dan batas cache didokumentasikan. Perilaku browser dan ketersediaan aset live masih perlu diverifikasi.

## P3 — Search dan dokumentasi

- Tambahkan metadata yang akurat dan favicon jika aset disetujui.
- Verifikasi header, arti kolom, dan prosedur publikasi setiap sheet bersama Eka.

## Phase 07 — Cloudflare & Custom Domain Deployment

- Rencanakan hosting, DNS, domain kustom, TLS, dan migrasi setelah disetujui. Belum ada deployment.

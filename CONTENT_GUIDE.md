# Panduan pengelolaan konten

Panduan ini menjelaskan posisi kolom yang **dibaca kode saat ini**, bukan nama header yang sudah diverifikasi di Google Sheets. Jangan menambah, menghapus, atau memindahkan kolom tanpa persetujuan Eka. Baris pertama dianggap header dan tidak ditampilkan. Periksa sheet asli sebelum mengubah konten, lalu periksa CSV terbitan dan pratinjau website. Perubahan di sheet tidak dilakukan oleh fase ini.

## Pemetaan posisi kolom

Nomor dimulai dari 1. Kosongkan nilai opsional yang belum tersedia; jangan mengisi angka, alamat, atau hasil yang belum dapat diverifikasi.

| Kategori | Posisi kolom yang digunakan website |
| --- | --- |
| Projects | 1 judul; 2 ringkasan; 3 deskripsi detail; 4 URL gambar; 5 URL repositori; 6 tanggal; 7 tag; 8 URL video; 9 URL dokumen. |
| Skills | 1 kelompok; 2 nama; 3 nilai persentase; 4 kelas ikon Font Awesome. |
| Education | 1 periode; 2 institusi; 3 keterangan; 4 URL logo atau domain. |
| Experience | 1 judul; 2 periode; 3 dan 4 keterangan; 5 URL logo atau domain. |
| Achievements | 1 judul; 2 keterangan; 3 tahun/periode; 4 URL bukti. |
| Courses and Certifications | 1 judul; 2 penyelenggara/keterangan; 3 URL logo atau domain. |

Judul proyek dan nama skill tidak boleh kosong agar tampil. Untuk kategori lain, kolom pertama harus terisi. Nama dan arti header aktual, termasuk apakah kolom pertama Skills memang dimaksudkan untuk kelompok, masih harus dikonfirmasi dengan Eka. Skills berkelompok berdasarkan teks kolom pertama; kosong akan masuk ke “Lainnya”. Urutan kelompok mengikuti kemunculan pertama dalam sheet dan urutan skill mengikuti urutan baris.

Gunakan label kelompok konsisten sesuai isi yang terverifikasi, misalnya **Embedded & IoT**, **Hardware & Electronics**, **AI & Computer Vision**, **Software & Linux**, atau **Control Systems**. Ini usulan label, bukan daftar kompetensi yang telah dibuktikan. Persentase skill hanya digunakan jika Eka menyetujui dasar penilaiannya; nilai kosong saat ini ditampilkan sebagai 0%, dan angka dibatasi 0–100.

## Menulis proyek

Isi ringkasan satu atau dua kalimat dan gunakan kolom deskripsi detail untuk teks biasa, termasuk baris baru. Template berikut adalah kerangka kosong, bukan klaim proyek:

```text
Tujuan: [masalah dan tujuan yang telah diverifikasi]
Teknologi: [perangkat, bahasa, dan alat yang benar-benar digunakan]
Kontribusi: [peran dan tanggung jawab Eka]
Implementasi: [langkah utama atau cara sistem bekerja]
Hasil: [hasil yang dapat dibuktikan; kosongkan jika belum tersedia]
```

Tuliskan status secara akurat jika proyek masih dalam proses. Tag dan URL gambar dipisahkan dengan `|` di dalam satu sel. Gunakan URL lengkap `https://` atau `http://` yang dapat diakses; tautan berbahaya atau tidak valid tidak ditampilkan. URL repositori, video, dan dokumen bersifat opsional. Judul unik dianjurkan karena tautan detail berbasis judul; perubahan judul dapat memutus tautan yang sudah dibagikan. Judul duplikat memakai indeks yang dapat bergeser.

## Tautan profil dan kontak

Isi URL publik yang sudah diverifikasi di `contacts.js` untuk `cv`, `github`, `linkedin`, dan `contact`; biarkan kosong bila belum tersedia. `contact` harus berupa URL halaman kontak HTTPS/HTTP, bukan alamat email atau `mailto:`. Item kosong dan URL yang tidak valid disembunyikan. Pastikan dokumen CV memang boleh dibagikan secara publik sebelum mengisi URL. Perubahan pada file ini memerlukan commit dan publikasi melalui proses yang disetujui.

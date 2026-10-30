# Model penyimpanan saat ini

Backend masih menggunakan JSON pada penyimpanan privat Android. File sosial yang baru ditambahkan:

- `ohli-posts.json` — postingan, audiens, like, komentar dan status arsip.
- `ohli-follows.json` — relasi mengikuti.
- `ohli-bookmarks.json` — bookmark privat per akun.
- `ohli-notifications.json` — aktivitas sosial.
- `ohli-communities.json` — grup/channel dasar dan anggota/pengikut.
- `ohli-status-views.json` — viewer unik Story dan penghitung tayangan berulang.
- `ohli-profile-views.json` — tayangan profil, maksimal satu catatan per akun per hari.
- `ohli-highlights.json` — Story yang disimpan sebagai Sorotan.
- `ohli-group-messages.json` — pesan teks grup.
- `ohli-channel-posts.json` — pengumuman teks Channel.
- `ohli-blocks.json` — daftar blokir tiap akun.

Data lama memakai file `rk-users.json`, `rk-sessions.json`, `rk-messages.json`, `rk-statuses.json`, `rk-contacts.json`, metadata panggilan/Live serta folder `rk-media`, `rk-profiles`, dan `rk-images`.

## Pemulihan saat server/Wi-Fi mati

Setiap array JSON ditulis terlebih dahulu ke file `.tmp`, di-flush dan di-`fsync`, lalu dipindahkan ke file utama. File utama sebelumnya disalin ke `.bak`. Saat service mulai, backend mencoba membaca JSON utama; bila rusak atau tidak lengkap, ia memulihkan data dari `.tmp` atau `.bak` yang valid. Karena file berada di `getFilesDir()` pada perangkat host, mati listrik, reboot, stop/start service, putus Wi-Fi, atau perubahan IP tidak menghapus akun. Setelah IP berubah, buka URL/IP server terbaru; token browser dapat terikat pada origin lama, sehingga mungkin perlu login lagi dengan nomor akun dan kata sandi yang sama.

## Batas dan migrasi

- File JSON dilindungi sandbox aplikasi Android, tetapi tidak menggantikan database multi-proses yang transaksional. Jangan menjalankan beberapa instance server dengan menyalin file ini ke beberapa host.
- Penghapusan data aplikasi atau uninstall dapat menghilangkan data. Backup yang benar harus dilakukan saat penulisan aman dan disimpan terenkripsi di tempat terpisah; belum ada alur backup terenkripsi otomatis.
- Media sosial mendukung upload sampai 1 GiB per file dengan batas penyimpanan folder media server 16 GiB. Foto profil, cover, foto Story berbasis base64, dan pesan suara mempunyai batas lebih kecil sesuai endpoint lama. Retensi media Story kedaluwarsa belum berupa job cleanup terjadwal.
- Untuk migrasi produksi, ekspor JSON secara aman, normalisasi nomor akun menjadi internal user ID, impor dalam transaksi ke PostgreSQL, buat foreign key dan indeks, lakukan verifikasi row counts, lalu ubah API untuk membaca/menulis SQL. Pindahkan media ke object storage dan validasi setiap ownership sebelum mengaktifkan trafik.

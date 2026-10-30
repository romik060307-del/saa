# OHLI Social — Android-hosted source project

Proyek ini mengubah antarmuka web RKM Chat menjadi OHLI Social dengan layout responsif baru, sambil mempertahankan server Java Android dan endpoint chat yang sudah ada. Sumber utama berada di `app/src/main/java/com/rk/server/ServerService.java`; halaman lama tetap di `app/src/main/assets/index.html`, sedangkan UI sosial baru dipisah ke `ohli-social.css` dan `ohli-social.js`.

> **Status penting:** ini adalah fondasi aplikasi yang sudah diimplementasikan pada proyek sumber, bukan klaim bahwa seluruh daftar kebutuhan sosial setara platform besar selesai. Backend saat ini tetap menyimpan data sebagai berkas JSON pada perangkat Android yang menjadi host. Ini belum merupakan arsitektur produksi multi-server dengan database relasional, object storage, push-notification service, atau SFU Live.

## Perubahan OHLI Social

- Rombak UI menjadi shell responsif: sidebar desktop, navigasi bawah HP, menu tambahan untuk semua halaman, feed/story/video, profil, pencarian, notifikasi, grup/channel dasar, arsip/tersimpan dan pengaturan.
- Mempertahankan layar chat lama, autentikasi, kontak, pesan, lampiran, profil lama, panggilan WebRTC dan signaling Live.
- Endpoint sosial server: posting teks/media, audiens public/followers/private, feed berpaginasi, follow/unfollow, like, komentar, edit/hapus/arsip/pulihkan posting, bookmark, repost, pencarian, notifikasi, dan profil.
- v2.1.1 menambahkan akun privat dan permintaan follow, kontrol privasi daftar followers/following/likes/saved, daftar pengikut yang dapat dibuka, tayangan profil, tab Disukai/Posting ulang, Sorotan, reaksi dan statistik Story, QR kontak, ganti kata sandi, chat grup teks dan posting Channel teks.
- Validasi tanda tangan format media dasar untuk unggahan foto/video sosial. Media sosial mendukung hingga 1 GB per file dengan batas folder media server 16 GB; beberapa unggahan foto profil/Story lama tetap mempunyai batas lebih kecil. Endpoint media mendukung HTTP byte range.
- Server Android memakai foreground service `START_STICKY`, alarm restart ketika task di-swipe, dan receiver boot yang hanya memulai ulang jika server sebelumnya diaktifkan oleh pengguna.

Lihat [`docs/FEATURE-MATRIX.md`](docs/FEATURE-MATRIX.md), [`docs/API.md`](docs/API.md), [`docs/PRODUCTION-DEPLOYMENT.md`](docs/PRODUCTION-DEPLOYMENT.md), dan [`docs/DATA-STORAGE.md`](docs/DATA-STORAGE.md). Skema PostgreSQL tujuan berada di `database/migrations/001_initial_schema.sql`; skema ini hanya referensi migrasi dan belum dipakai APK.

## Build APK melalui GitHub Actions

1. Unggah `OHLI-Social-Source-v2.1.1.zip` ke root repository GitHub (atau unggah seluruh folder proyek pada root).
2. Pastikan file workflow berada pada lokasi root repository `.github/workflows/build-apk.yml`. Bila hanya mengunggah ZIP, ekstrak/copy file workflow dari folder proyek ke lokasi tersebut. Workflow sudah mengenali nama ZIP v2.1.1 dan menggunakan Java 17, Android SDK 35 dan Gradle 8.9.
3. Buka **Actions → Build OHLI Social Server APK → Run workflow**. Setelah workflow selesai, unduh artifact `OHLI-Social-Server-APK` berisi `app-debug.apk`.
4. Instal APK ke perangkat Android yang akan menjadi host. Buka OHLI Social Server dan tekan **MULAI SERVER**. Gunakan **BUKA HALAMAN CHAT** atau akses `http://IP-PERANGKAT:8080/` dari perangkat yang berada pada jaringan yang sama.

Environment variable tidak digunakan oleh backend Android saat ini. Jangan menaruh password atau token akun di repository, screenshot, atau laporan bug.

## Perubahan v2.1.1

- Tata letak profil dan halaman sosial di HP dibatasi ke lebar viewport, tab profil dapat digeser horizontal tanpa membuat seluruh halaman bergeser, dan rail tombol Video Pendek dirapatkan.
- Navigasi Profil selalu mengarah ke akun sendiri; profil teman tetap dibuka hanya lewat aksi profil teman. Tombol kembali baru mengubah halaman dalam OHLI, tidak menutup situs.
- Story diringkas menjadi satu lingkaran per akun. Lingkaran membuka Story terbaru; Story yang lebih lama milik akun yang sama dapat dibuka dengan geser atau tombol kiri/kanan. Nama/foto pembuat dapat ditekan untuk membuka profil.
- Foto profil di halaman profil dapat diketuk untuk melihat ukuran besar. Status tombol mengikuti pada daftar saran ikut menampilkan Ikuti/Mengikuti/Diminta.
- Pesan menampilkan centang 1 saat belum diambil perangkat penerima, centang 2 abu-abu setelah penerima mengambil pesan dari server, dan centang 2 biru setelah percakapan dibuka. Edit/hapus tetap tersedia lewat tekan lama, tidak lagi sebagai tombol permanen di setiap balon.
- Ketuk ganda pada foto/video memicu satu aksi suka; listener ganda dihapus agar sebuah ketuk ganda tidak mengirim dua toggle.
- Jelajah Topik membaca tagar dari postingan 14 hari terakhir dan memberi peringkat berdasarkan pemakaian serta engagement.
- Data JSON mempunyai backup dan file sementara yang dapat dipulihkan jika file utama rusak saat perangkat kehilangan daya. Data berada di penyimpanan internal aplikasi Android (`getFilesDir()`), sehingga restart server atau perubahan IP tidak menghapus database. Hapus data aplikasi atau uninstall APK tetap dapat menghapus penyimpanan internal; buat cadangan off-device secara berkala.

## Pengujian yang tersedia

- `node --check app/src/main/assets/ohli-social.js` dan syntax-check JavaScript inline dapat dijalankan lokal.
- `tools/smoke-test.mjs` melakukan tes API dua akun pada server yang sudah aktif. Lihat instruksi di `docs/API.md`.
- Build APK dan pengujian camera/mic, perilaku background service, serta dua perangkat sungguhan tetap harus dilakukan di GitHub Actions dan perangkat Android.

## Batasan operasional

- Android dapat menghentikan service jika pengguna melakukan **Force stop**, perangkat menerapkan penghematan baterai agresif, memori kritis, atau kebijakan OEM. Tidak ada aplikasi Android biasa yang dapat menjamin service hidup mutlak selamanya. Restart otomatis membantu untuk kondisi tertentu; tombol **MATIKAN SERVER** tetap mematikan service dengan sengaja.
- Server HTTP langsung di port 8080 belum layak diekspos tanpa proteksi ke internet publik. Gunakan HTTPS reverse proxy/tunnel terpercaya dan audit keamanan sebelum menyimpan data sensitif. Token login masih mengikuti rancangan lama dan beberapa request GET membawanya sebagai query parameter.
- Live menggunakan WebRTC peer-to-peer dan signaling yang disimpan pada perangkat host; bukan SFU, tidak direkam, dan dibatasi untuk skenario kecil. Koneksi tertentu memerlukan STUN/TURN. Tutup tab host atau putuskan jaringan dapat menghentikan media.
- Story masih mengandalkan aturan kontak backend lama. Close Friends, daftar pengecualian Story, balasan Story lengkap, dan kontrol audiens per Story belum tersedia. Suka Story tersedia sebagai toggle dan jumlah, tetapi belum ada daftar penyuka.
- Chat grup dan Channel v2.1 masih teks saja. Undangan grup privat, roles/admin, topics, media, edit/hapus pesan dan moderasi belum tersedia.
- Fitur profil privat dan kontrol visibilitas berjalan melalui API, tetapi source ini tetap perlu diuji dengan dua akun dan dua perangkat nyata sebelum dipakai publik.

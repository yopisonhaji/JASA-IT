# SatuJalan - Web & AI Chatbot System

Website Profile Company untuk **SatuJalan** dengan integrasi **AI Chatbot (Gemini + Telegram)**.

## Fitur Utama
1.  **Website Modern**: Desain responsif, animasi premium, dan dark mode.
2.  **Layanan Lengkap**: Menampilkan paket Hardware, Software, dan Advanced Web Dev.
3.  **On-Site Chat Widget**: Pengunjung bisa chat langsung dengan AI di website.
4.  **Telegram Integrasi**: Chatbot juga bisa diakses via Telegram Bot.
5.  **AI Cerdas (Gemini)**: Menjawab pertanyaan layanan (Servis, Harga, Konsultasi) secara otomatis.

## Cara Menjalankan (Localhost)

Website ini memiliki bagian Frontend (HTML/CSS/JS) dan Backend (Python).

### 1. Install Persyaratan
Pastikan Python sudah terinstall. Lalu install library yang dibutuhkan:
```bash
pip install -r requirements.txt
```

### 2. Jalankan Backend AI
Script ini bertugas menghubungkan Chat Widget dengan otak AI.
```bash
python chatbot_service.py
```
*Server berjalan di http://localhost:5000*

### 3. Buka Website
Cukup buka file `index.html` di browser Anda.
*Chat widget hanya akan berfungsi jika script python di langkah 2 sedang berjalan.*

## Deployment (Online)
Agar bisa diakses orang lain di internet:
1.  **Website**: Upload semua file HTML/CSS/JS ke hosting (cPanel, Vercel, Netlify).
2.  **Backend AI**: Upload `chatbot_service.py` dan `requirements.txt` ke cloud server (Render/Heroku/PythonAnywhere) atau VPS.
3.  **Update Link**: Ganti `http://localhost:5000` di `script.js` dengan URL backend online Anda.

## Struktur File
- `index.html`: Halaman utama.
- `style.css`: Styling dan tema Warna.
- `script.js`: Logika interaksi dan Chat Widget.
- `chatbot_service.py`: Server AI (Flask).

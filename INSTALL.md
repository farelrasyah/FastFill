# FastFill Extension - Installation Guide

## 🚀 Quick Installation (Developer Mode)

### Step 1: Download Source Code
1. Download atau clone repository ini
2. Extract ke folder di komputer Anda
3. Pastikan semua file ada di folder `FastFill`

### Step 2: Enable Developer Mode di Chrome
1. Buka Chrome browser
2. Ketik `chrome://extensions/` di address bar
3. Toggle **"Developer mode"** di kanan atas hingga aktif

### Step 3: Load Extension
1. Klik tombol **"Load unpacked"**
2. Navigate ke folder `FastFill` dan pilih folder tersebut
3. Klik **"Select Folder"**
4. Extension akan ter-install dan muncul icon 🚀 di toolbar

### Step 4: Test Extension
1. Buka website yang memiliki form (contoh: contact form, registration form)
2. Klik icon FastFill di toolbar Chrome
3. Pilih template data dari dropdown
4. Klik "Deteksi Form" lalu "Isi Form"

## 🔧 Troubleshooting

### Extension Tidak Muncul
- Pastikan Developer Mode sudah aktif
- Refresh halaman `chrome://extensions/`
- Check console untuk error messages

### Form Tidak Terdeteksi
- Pastikan halaman sudah selesai loading
- Refresh halaman web dan coba lagi
- Check apakah website menggunakan iframe atau shadow DOM

### Data Tidak Terisi
- Pastikan form fields visible dan tidak disabled
- Check apakah ada JavaScript yang interfere
- Coba dengan template data yang berbeda

## 📋 Test Websites

Untuk testing, gunakan website berikut:
- https://www.w3schools.com/html/html_forms.asp
- https://getbootstrap.com/docs/5.0/forms/overview/
- https://formspree.io/ (contact forms)
- Local HTML file dengan form elements

## 🔄 Updates

Untuk update extension:
1. Download versi terbaru
2. Replace file lama dengan file baru
3. Klik "Reload" pada extension di `chrome://extensions/`

## 📞 Support

Jika mengalami masalah:
1. Check browser console untuk errors
2. Pastikan Chrome version 88+ 
3. Disable extension lain yang mungkin conflict
4. Create issue di GitHub repository

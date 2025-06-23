# 🤖 FastFill AI - Smart Form Filler

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://chrome.google.com/webstore)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-34A853?style=for-the-badge)](https://developer.chrome.com/docs/extensions/mv3/)
[![Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-EA4335?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

> **AI-Powered Chrome Extension untuk mengisi form secara otomatis menggunakan Google Gemini Pro**

FastFill AI adalah ekstensi Chrome yang revolusioner yang menggunakan kecerdasan buatan Google Gemini Pro untuk menganalisis dan mengisi form web secara otomatis dengan data yang realistis dan kontekstual. Sempurna untuk QA testing, development, dan automation.

## ✨ Fitur Utama

### 🤖 **AI-Powered Form Filling**
- **Intelligent Field Detection**: Mendeteksi semua jenis form input termasuk text, email, number, select, checkbox, radio, dan textarea
- **Contextual Analysis**: AI menganalisis label, placeholder, dan konteks halaman untuk menghasilkan data yang tepat
- **Smart Data Generation**: Menghasilkan data yang realistis dan koheren (nama depan dan belakang yang cocok, email yang sesuai nama, dll.)
- **Multi-language Support**: Mendukung form dalam bahasa Indonesia dan Inggris

### 🔧 **Advanced Features**
- **Keyboard Shortcut**: `Alt + Shift + F` untuk mengisi form dengan cepat
- **Template Fallback**: Sistem fallback dengan template data jika AI tidak tersedia
- **Safe Element Detection**: Menghindari element sensitive dan sistem browser
- **Form Validation Trigger**: Memicu event validation setelah mengisi field
- **Real-time Statistics**: Menampilkan jumlah field yang terdeteksi dan berhasil diisi

### 🛡️ **Security & Privacy**
- **Local Storage**: API key disimpan secara aman di browser Anda
- **No Data Collection**: Tidak menyimpan atau mengirim data form Anda
- **Secure Communication**: Komunikasi terenkripsi dengan Gemini API
- **Permission Minimal**: Hanya meminta permission yang diperlukan

## 🚀 Cara Instalasi

### Prasyarat
1. **Google Chrome Browser** (versi 88 atau lebih baru)
2. **Gemini API Key** (gratis dari [Google AI Studio](https://makersuite.google.com/app/apikey))

### Langkah Instalasi

#### Method 1: From Chrome Web Store (Coming Soon)
```bash
# Akan tersedia di Chrome Web Store
```

#### Method 2: Manual Installation (Developer Mode)
1. **Clone repository ini**:
   ```bash
   git clone https://github.com/your-username/fastfill-ai-extension.git
   cd fastfill-ai-extension
   ```

2. **Buka Chrome Extensions**:
   - Ketik `chrome://extensions/` di address bar
   - Atau: Menu → More Tools → Extensions

3. **Enable Developer Mode**:
   - Toggle "Developer mode" di pojok kanan atas

4. **Load Extension**:
   - Klik "Load unpacked"
   - Pilih folder project ini
   - Extension akan muncul di toolbar Chrome

5. **Setup API Key**:
   - Klik icon FastFill AI di toolbar
   - Klik tombol Settings (⚙️)
   - Masukkan Gemini API key
   - Klik "Save API Key"

## 🔑 Setup Gemini API Key

### Mendapatkan API Key Gratis
1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan akun Google
3. Klik "Create API Key"
4. Copy API key yang dihasilkan

### Konfigurasi di Extension
1. Buka popup FastFill AI
2. Klik tombol Settings (⚙️) 
3. Paste API key di field yang tersedia
4. Klik "Save API Key"
5. Status akan berubah menjadi "✅ API Key Configured"

## 📖 Cara Penggunaan

### Method 1: Menggunakan Popup UI
1. **Buka halaman dengan form** yang ingin diisi
2. **Klik icon FastFill AI** di toolbar Chrome
3. **Klik "Fill Form with AI"** - AI akan menganalisis dan mengisi form
4. **Tunggu proses selesai** - akan muncul notifikasi jumlah field yang berhasil diisi

### Method 2: Keyboard Shortcut
1. **Buka halaman dengan form**
2. **Tekan `Alt + Shift + F`**
3. **Form akan diisi otomatis** dengan data AI

### Method 3: Template Fallback
1. **Buka popup FastFill AI**
2. **Pilih template** dari dropdown (QA Profile, User Profile, Dummy Profile)
3. **Klik "Fill with Template"**

## 🎯 Contoh Penggunaan

### Untuk QA Testing
```javascript
// Form yang dideteksi:
// - Name: "John Doe"
// - Email: "john.doe@email.com" 
// - Phone: "555-123-4567"
// - Company: "Tech Solutions Inc"
// - Message: "This is a test message for QA validation."
```

### Untuk Registration Forms
```javascript
// AI akan mengisi:
// - First Name: "Sarah"
// - Last Name: "Wilson"
// - Email: "sarah.wilson@example.com"
// - Password: "SecurePass123!"
// - Confirm Password: "SecurePass123!"
// - Birth Date: "1990-05-15"
```

### Untuk Survey Forms
```javascript
// AI memahami konteks dan mengisi:
// - Age: "28"
// - Occupation: "Software Developer"
// - Experience: "5 years"
// - Feedback: "The product meets my expectations and provides good value."
```

## 🛠️ Development

### Struktur Project
```
fastfill-ai-extension/
├── manifest.json          # Extension manifest (Manifest V3)
├── content-ai.js          # Content script dengan AI integration
├── popup-ai.html          # Popup UI
├── popup-ai.js            # Popup JavaScript
├── popup-ai.css           # Popup styling
├── background.js          # Service worker
├── icons/                 # Extension icons
├── test-form.html         # Form testing
└── README.md             # Documentation
```

### Tech Stack
- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No dependencies, lightweight
- **Google Gemini Pro API** - AI untuk intelligent form filling
- **Chrome Storage API** - Secure API key storage
- **Chrome Tabs API** - Communication dengan active tab

### Development Commands
```bash
# Clone repository
git clone https://github.com/your-username/fastfill-ai-extension.git

# Tidak ada build process - pure JavaScript
# Load langsung ke Chrome dalam Developer Mode

# Testing
# Buka test-form.html untuk testing lokal
```

## 🔧 API Integration

### Gemini Pro Integration
Extension ini menggunakan Google Gemini Pro API dengan endpoint:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### Contoh Request Format
```javascript
{
  "contents": [{
    "parts": [{
      "text": "Generate realistic form data for: Name (text), Email (email), Phone (tel)..."
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 2048
  }
}
```

### Response Processing
AI response diparse menjadi array data yang kemudian dimapping ke form fields berdasarkan urutan dan tipe field.

## 🧪 Testing

### Form Testing
1. **Buka `test-form.html`** - Form testing internal
2. **Test di website populer**:
   - Google Forms
   - TypeForm
   - Contact forms
   - Registration forms

### Browser Testing
- ✅ Chrome 88+
- ✅ Edge Chromium
- ❌ Firefox (berbeda API)
- ❌ Safari (berbeda API)

## 🚨 Troubleshooting

### Common Issues

#### ❌ "API Key Required"
**Solusi**: Pastikan API key Gemini sudah dimasukkan dan valid
```bash
1. Dapatkan API key dari Google AI Studio
2. Buka popup extension
3. Klik Settings (⚙️)
4. Masukkan API key
5. Klik Save
```

#### ❌ "No fillable form fields found"
**Solusi**: 
- Pastikan halaman memiliki form input
- Refresh halaman dan coba lagi
- Periksa apakah form fields tidak disabled/hidden

#### ❌ "AI request failed"
**Solusi**:
- Periksa koneksi internet
- Validasi API key masih aktif
- Coba gunakan template fallback

#### ❌ Extension tidak muncul di toolbar
**Solusi**:
- Periksa Extension sudah di-enable
- Pin extension ke toolbar
- Reload extension di `chrome://extensions/`

### Debug Mode
Untuk debugging, buka Developer Tools:
```javascript
// Console logs tersedia di:
// 1. Content Script: Inspect Element → Console
// 2. Popup: Right-click popup → Inspect
// 3. Background: chrome://extensions/ → Inspect views
```

## 🤝 Contributing

Kontribusi sangat diterima! Berikut cara berkontribusi:

### Development Setup
1. **Fork repository**
2. **Clone fork Anda**:
   ```bash
   git clone https://github.com/your-username/fastfill-ai-extension.git
   ```
3. **Create branch baru**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Load extension** dalam Developer Mode untuk testing
5. **Commit changes**:
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Create Pull Request**

### Contribution Guidelines
- **Follow coding standards** (ESLint, Prettier)
- **Add comments** untuk complex logic
- **Test thoroughly** pada berbagai website
- **Update documentation** jika diperlukan

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- **Google Gemini Team** - untuk API AI yang powerful
- **Chrome Extensions Team** - untuk platform yang robust
- **Open Source Community** - untuk inspiration dan feedback

## 📞 Support

- **GitHub Issues**: [Report bugs atau request features](https://github.com/your-username/fastfill-ai-extension/issues)
- **Email**: your-email@example.com
- **Documentation**: [Wiki lengkap](https://github.com/your-username/fastfill-ai-extension/wiki)

---

<div align="center">

**🤖 Made with AI for AI-powered form filling**

[⭐ Star this repo](https://github.com/your-username/fastfill-ai-extension) | [🐛 Report Bug](https://github.com/your-username/fastfill-ai-extension/issues) | [💡 Request Feature](https://github.com/your-username/fastfill-ai-extension/issues)

</div>

# FastFill - Auto Form Filler Chrome Extension

🚀 **Ekstensi Chrome untuk mengisi form secara otomatis dengan data template yang dapat disesuaikan. Ideal untuk QA testing dan development.**

## 📋 Fitur Utama

- ✅ **Deteksi Form Otomatis** - Mendeteksi berbagai jenis input form (text, email, number, tel, date, select, checkbox, radio)
- 🎯 **Template Data Fleksibel** - 3 template bawaan (QA Profile, User Profile, Dummy Profile) + custom templates
- ⚡ **Fill Form Instan** - Mengisi form dengan satu klik melalui popup toolbar
- 🎨 **UI Modern & Intuitif** - Interface yang clean dan mudah digunakan
- 🔧 **Highly Configurable** - Pengaturan advanced untuk berbagai mode filling
- 💾 **Local Storage** - Menyimpan template dan pengaturan secara lokal
- 🔄 **Import/Export** - Backup dan share template dengan mudah
- 📱 **Responsive Design** - Tampilan optimal di berbagai ukuran layar

## 🛠️ Teknologi

- **Manifest V3** - Service Worker architecture terbaru
- **Content Scripts** - Manipulasi DOM yang aman dan efisien
- **Chrome Storage API** - Penyimpanan data lokal yang reliable
- **Modern CSS** - Styling dengan CSS Grid/Flexbox dan CSS Variables
- **Vanilla JavaScript** - No framework dependencies, lightweight & fast

## 📦 Instalasi

### Metode 1: Install dari Chrome Web Store
*(Coming soon)*

### Metode 2: Install Manual (Developer Mode)

1. **Clone repository:**
   ```bash
   git clone https://github.com/yourusername/fastfill-extension.git
   cd fastfill-extension
   ```

2. **Buka Chrome Extensions:**
   - Buka Chrome browser
   - Navigasi ke `chrome://extensions/`
   - Aktifkan "Developer mode" (toggle di kanan atas)

3. **Load Extension:**
   - Klik "Load unpacked"
   - Pilih folder project FastFill
   - Extension akan muncul di toolbar Chrome

## 🚀 Cara Penggunaan

### Quick Start
1. **Buka halaman dengan form** yang ingin diisi
2. **Klik icon FastFill** di toolbar Chrome
3. **Pilih template** dari dropdown (QA Profile, User Profile, atau Dummy Profile)
4. **Klik "Fill Form"** untuk mengisi form secara otomatis
5. **Done!** Form akan terisi dengan data sesuai template

### Fitur Advanced

#### 🔍 Detect Forms
- Gunakan tombol "Detect Forms" untuk melihat berapa banyak form element yang terdeteksi di halaman
- Berguna untuk debugging dan validasi

#### ⚙️ Pengaturan
- **Auto-detect forms**: Otomatis inject script pada halaman baru
- **Show notifications**: Tampilkan notifikasi sukses/error
- **Fill Mode**: 
  - Smart (Recommended): Filling cerdas berdasarkan field name/id
  - Aggressive: Mengisi semua field yang ditemukan
  - Conservative: Hanya mengisi field yang jelas teridentifikasi

#### 📝 Template Management
- **Add New Template**: Buat template custom dengan data JSON
- **Edit Template**: Modifikasi template yang sudah ada
- **Delete Template**: Hapus template (minimal 1 template harus ada)
- **Export/Import**: Backup dan share template

## 📊 Template Structure

Template menggunakan format JSON dengan struktur berikut:

```json
{
  "name": "Template Name",
  "data": {
    "name": "John Doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "081234567890",
    "address": "Jl. Contoh No. 123",
    "city": "Jakarta",
    "zipCode": "12345",
    "age": "25",
    "birthDate": "1999-01-15",
    "company": "Tech Corp",
    "jobTitle": "Software Engineer",
    "website": "https://example.com",
    "description": "Professional description here",
    "gender": "male",
    "country": "Indonesia",
    "password": "SecurePass123!",
    "default": "Default value for unrecognized fields"
  }
}
```

## 🎯 Field Mapping

Extension secara otomatis memetakan field berdasarkan:

| Field Type | Mapping Keywords | Example |
|------------|------------------|---------|
| Name | name, nama, full_name | `name`, `full_name`, `user_name` |
| Email | email, mail, e-mail | `email`, `user_email`, `contact_email` |
| Phone | phone, tel, mobile, hp | `phone`, `mobile`, `phone_number` |
| Address | address, alamat | `address`, `street_address`, `home_address` |
| Birth Date | birth, lahir, date | `birth_date`, `date_of_birth`, `birthday` |
| Company | company, perusahaan | `company`, `company_name`, `organization` |

## 🔧 Development

### Project Structure
```
FastFill/
├── manifest.json          # Extension manifest
├── background.js          # Service worker (Manifest V3)
├── content.js             # Content script untuk DOM manipulation
├── popup.html             # UI popup
├── popup.js               # Logic popup
├── style.css              # Styling untuk popup dan notifications
├── test-form.html         # File testing untuk development
├── validate.js            # Validation utilities
├── icons/                 # Extension icons
│   ├── icon16.png
│   └── README.md
├── API.md                 # API documentation
├── INSTALL.md             # Installation guide
├── README.md              # This file
└── package.json           # Node.js dependencies (optional)
```

### Development Setup

1. **Clone & Setup:**
   ```bash
   git clone https://github.com/yourusername/fastfill-extension.git
   cd fastfill-extension
   npm install  # Optional, untuk development tools
   ```

2. **Testing:**
   - Buka `test-form.html` di browser untuk testing
   - Load extension di Chrome dengan Developer Mode
   - Test pada berbagai website dengan form

3. **Building:**
   ```bash
   npm run build    # Optional build script
   npm run validate # Validate extension files
   ```

## 🧪 Testing

### Manual Testing
1. **Load extension** di Chrome Developer Mode
2. **Buka test-form.html** atau website dengan form
3. **Test semua fitur:**
   - Template selection
   - Form filling
   - Form detection
   - Settings
   - Template management

### Automated Testing
```bash
npm test  # Run validation tests
```

## 🤝 Contributing

Kontribusi sangat welcome! Please follow these steps:

1. **Fork repository**
2. **Create feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Contribution Guidelines
- Follow existing code style
- Add comments untuk code yang complex
- Test thoroughly sebelum submit PR
- Update documentation jika diperlukan

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports & Feature Requests

Gunakan [GitHub Issues](https://github.com/yourusername/fastfill-extension/issues) untuk:
- 🐛 Report bugs
- 💡 Request features
- 📝 Suggest improvements

## 📞 Support

- **Documentation:** [API.md](API.md) & [INSTALL.md](INSTALL.md)
- **Issues:** [GitHub Issues](https://github.com/yourusername/fastfill-extension/issues)
- **Email:** support@example.com

## 🎯 Use Cases

### QA Testing
- ✅ Rapid form testing dengan berbagai data set
- ✅ Edge case testing dengan data boundary
- ✅ Automation untuk regression testing
- ✅ Cross-browser compatibility testing

### Development
- ✅ Quick form population saat development
- ✅ UI/UX testing dengan realistic data
- ✅ Demo preparation dengan consistent data
- ✅ Client presentation dengan professional data

### General Productivity
- ✅ Form filling untuk aplikasi berulang
- ✅ Registration forms dengan data konsisten
- ✅ Survey forms dengan template responses

## 🔄 Changelog

### v1.0.0 (Initial Release)
- ✅ Basic form detection dan filling
- ✅ 3 default templates (QA, User, Dummy)
- ✅ Modern popup UI dengan Material Design
- ✅ Template management (CRUD operations)
- ✅ Import/Export functionality
- ✅ Advanced settings dan configurations
- ✅ Notification system
- ✅ Manifest V3 compliance

## 🔮 Roadmap

### v1.1.0 (Planned)
- [ ] Advanced field mapping dengan AI/ML
- [ ] Bulk template operations
- [ ] Form validation integration
- [ ] Custom CSS injection untuk better compatibility

### v1.2.0 (Future)
- [ ] Cloud sync untuk templates
- [ ] Team collaboration features
- [ ] Advanced analytics dan reporting
- [ ] Integration dengan testing frameworks

## 🏆 Credits

Developed with ❤️ for QA engineers dan developers yang ingin membuat testing lebih efisien.

**Author:** [Your Name](https://github.com/yourusername)
**Created:** 2025
**Last Updated:** June 2025

---

**⭐ Star this repo if it helps you!**

Made with 💻 and ☕ for the testing community.

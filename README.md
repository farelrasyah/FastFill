# FastFill - Auto Form Filler Chrome Extension

🚀 **FastFill** adalah ekstensi Chrome yang dirancang khusus untuk membantu QA tester dan developer dalam melakukan pengisian form otomatis untuk keperluan testing UI/UX.

![FastFill Logo](https://img.shields.io/badge/FastFill-v1.0.0-blue.svg)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🎯 Fitur Utama

### ✨ Deteksi Form Otomatis
- Mendeteksi berbagai jenis input: `text`, `email`, `number`, `tel`, `date`, `select`, `checkbox`, `radio`, `textarea`
- Deteksi form secara real-time pada halaman web
- Support untuk form dinamis dan AJAX

### 📋 Template Data Predefined
- **Profil QA Tester**: Data khusus untuk testing QA
- **Profil User Normal**: Data user biasa untuk testing
- **Profil Dummy Data**: Data dummy internasional

### 🎛️ Kontrol Manual
- Popup interface yang user-friendly
- Trigger autofill secara manual dengan satu klik
- Pilihan template data yang dapat dikustomisasi

### 🔧 Fitur Advanced
- **Template Management**: Tambah, edit, hapus template custom
- **Export/Import**: Backup dan share template data
- **Smart Field Detection**: Identifikasi field berdasarkan nama, placeholder, dan ID
- **Random Selection**: Checkbox dan radio button dipilih secara random
- **Field Highlighting**: Visual feedback saat pengisian form

## 📁 Struktur Project

```
FastFill/
├── manifest.json          # Manifest V3 configuration
├── content.js            # Content script untuk manipulasi DOM
├── background.js         # Service worker untuk komunikasi
├── popup.html           # Interface popup HTML
├── popup.js             # Logic popup dan UI interactions
├── style.css            # Styling untuk popup interface
├── icons/               # Icon ekstensi (16x16, 48x48, 128x128)
└── README.md           # Dokumentasi project
```

## 🚀 Cara Instalasi

### Method 1: Install dari Chrome Web Store
*[Coming Soon - Submit ke Chrome Web Store]*

### Method 2: Install Manual (Developer Mode)

1. **Download Source Code**
   ```bash
   git clone https://github.com/username/fastfill-extension.git
   cd fastfill-extension
   ```

2. **Buka Chrome Extensions**
   - Buka Chrome browser
   - Navigate ke `chrome://extensions/`
   - Aktifkan "Developer mode" (toggle di kanan atas)

3. **Load Extension**
   - Klik "Load unpacked"
   - Pilih folder `FastFill`
   - Extension akan ter-install dan muncul di toolbar

## 📖 Cara Penggunaan

### Langkah Dasar
1. **Buka halaman web** yang memiliki form yang ingin diisi
2. **Klik icon FastFill** di toolbar Chrome
3. **Pilih template data** dari dropdown (QA Profile, User Profile, atau Dummy Data)
4. **Klik "Deteksi Form"** untuk mencari form pada halaman
5. **Klik "Isi Form"** untuk mengisi form secara otomatis

### Penggunaan Advanced
1. **Kelola Template**:
   - Klik "Kelola Template" di popup
   - Tambah template custom dengan data sesuai kebutuhan
   - Export template untuk backup atau sharing

2. **Opsi Lanjutan**:
   - Toggle highlight field yang diisi
   - Kontrol pengisian checkbox dan radio button
   - Customize behavior sesuai kebutuhan testing

## 🔧 Template Data

### Default Templates

#### 1. Profil QA Tester
```json
{
  "name": "Profil QA Tester",
  "data": {
    "firstName": "Ahmad",
    "lastName": "Tester", 
    "fullName": "Ahmad Tester",
    "email": "ahmad.tester@qa.com",
    "phone": "081234567890",
    "birthDate": "1990-05-15",
    "age": "33",
    "address": "Jl. Testing No. 123",
    "city": "Jakarta",
    "country": "Indonesia",
    "company": "QA Testing Corp",
    "jobTitle": "Senior QA Engineer"
  }
}
```

#### 2. Profil User Normal
```json
{
  "name": "Profil User Normal", 
  "data": {
    "firstName": "Budi",
    "lastName": "Santoso",
    "fullName": "Budi Santoso",
    "email": "budi.santoso@gmail.com",
    "phone": "087654321098",
    "company": "PT. Teknologi Maju",
    "jobTitle": "Software Developer"
  }
}
```

#### 3. Profil Dummy Data
```json
{
  "name": "Profil Dummy Data",
  "data": {
    "firstName": "John",
    "lastName": "Doe", 
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "555-0123",
    "city": "New York",
    "country": "United States"
  }
}
```

## 🛠️ Development

### Prerequisites
- Chrome Browser (versi 88+)
- Text Editor (VS Code recommended)
- Basic knowledge of JavaScript, HTML, CSS

### Development Setup
1. Clone repository
2. Buka folder di text editor
3. Load extension dalam Developer Mode
4. Edit files dan reload extension untuk testing

### File Structure Explanation

#### `manifest.json`
- Configuration file untuk Chrome Extension
- Mendefinisikan permissions, content scripts, dan metadata
- Menggunakan Manifest V3 (latest standard)

#### `content.js`
- Script yang diinjeksi ke halaman web
- Bertugas mendeteksi dan mengisi form elements
- Komunikasi dengan popup melalui Chrome messaging API

#### `background.js` 
- Service worker untuk background tasks
- Handle instalasi extension dan default templates
- Bridge komunikasi antara popup dan content script

#### `popup.html` & `popup.js`
- User interface untuk extension
- Template selection dan form filling controls
- Template management dan settings

#### `style.css`
- Modern, responsive styling untuk popup
- Gradient backgrounds dan smooth animations
- Mobile-friendly design

## 🎨 UI/UX Features

### Modern Interface
- **Gradient Background**: Eye-catching purple gradient
- **Card-based Layout**: Clean, organized sections
- **Smooth Animations**: Hover effects dan transitions
- **Responsive Design**: Works on different screen sizes

### User Experience
- **Real-time Status**: Connection dan form detection status
- **Visual Feedback**: Success/error messages dengan animations
- **Intuitive Controls**: Clear labels dan helpful tooltips
- **Accessibility**: Keyboard navigation dan screen reader support

## 🔒 Security & Permissions

### Required Permissions
- `activeTab`: Akses tab aktif untuk form detection
- `storage`: Simpan template data di local storage
- `scripting`: Inject content script untuk form manipulation

### Host Permissions
- `http://*/*` dan `https://*/*`: Akses semua website (required untuk form detection)

### Privacy
- **No Data Collection**: Extension tidak mengumpulkan data personal
- **Local Storage Only**: Template data disimpan lokal di browser
- **No External Requests**: Tidak ada komunikasi ke server external

## 🧪 Testing Use Cases

### QA Testing Scenarios
1. **Form Validation Testing**
   - Test required field validation
   - Test field format validation (email, phone, etc.)
   - Test character limits dan input restrictions

2. **UI/UX Testing**
   - Test form layout dengan data filled
   - Test responsive design dengan different data lengths
   - Test form submission workflows

3. **Cross-browser Testing**
   - Quick form filling across different environments
   - Consistent test data untuk reproducible results

### Development Scenarios
1. **Frontend Development**
   - Quick form population during development
   - Test different data scenarios
   - Demo preparation dengan realistic data

2. **API Testing**
   - Consistent payload generation
   - Edge case testing dengan predefined data
   - Integration testing dengan various data sets

## 🔄 Changelog

### Version 1.0.0 (Initial Release)
- ✅ Form detection untuk standard HTML inputs
- ✅ Three default templates (QA, User, Dummy)
- ✅ Template management (add, edit, delete)
- ✅ Export/Import functionality
- ✅ Modern popup interface
- ✅ Real-time form counting
- ✅ Smart field mapping based on field names
- ✅ Random selection untuk checkbox/radio

### Planned Features (v1.1.0)
- 🔄 Custom field mapping rules
- 🔄 Form validation testing tools
- 🔄 Batch processing multiple forms
- 🔄 Integration dengan popular testing frameworks
- 🔄 Advanced template editor dengan form builder
- 🔄 Keyboard shortcuts
- 🔄 Dark mode support

## 🤝 Contributing

Kontribusi sangat welcome! Berikut cara berkontribusi:

1. **Fork repository**
2. **Create feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to branch** (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

### Development Guidelines
- Follow JavaScript ES6+ standards
- Maintain consistent code formatting
- Add comments untuk complex logic
- Test thoroughly sebelum submit PR
- Update documentation jika diperlukan

## 🐛 Bug Reports & Feature Requests

### Reporting Bugs
Gunakan GitHub Issues dengan template berikut:
- **Browser Version**: Chrome version yang digunakan
- **Extension Version**: FastFill version
- **Steps to Reproduce**: Langkah-langkah reproduce bug
- **Expected Behavior**: Behavior yang diharapkan  
- **Actual Behavior**: Behavior yang terjadi
- **Screenshots**: Jika applicable

### Feature Requests
- Jelaskan use case dan problem yang ingin diselesaikan
- Berikan contoh konkret penggunaan feature
- Diskusikan alternative solutions yang sudah dicoba

## 📄 License

Project ini dilisensikan under **MIT License** - lihat file [LICENSE](LICENSE) untuk details.

## 👨‍💻 Author

**Farel Rasyah**
- GitHub:https://github.com/farelrasyah
- Email: farelrasyah87@gmail.com


## 🙏 Acknowledgments

- Terima kasih kepada Chrome Extensions API documentation
- Inspiration dari berbagai form filler extensions yang ada
- Community feedback dan suggestions untuk improvements
- QA testing community yang memberikan input valuable

---

## 📊 Stats & Info

![GitHub stars](https://img.shields.io/github/stars/farelrasyah/fastfill-extension?style=social)
![GitHub forks](https://img.shields.io/github/forks/farelrasyah/fastfill-extension?style=social)
![GitHub issues](https://img.shields.io/github/issues/farelrasyah/fastfill-extension)
![GitHub pull requests](https://img.shields.io/github/issues-pr/farelrasyah/fastfill-extension)

**Made with ❤️ for QA Testers and Developers**

---

*Last updated: June 2025*

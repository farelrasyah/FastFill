# FastFill Extension Icons

Folder ini berisi icon untuk ekstensi FastFill dalam berbagai ukuran.

## Required Icons

Untuk Chrome Extension Manifest V3, Anda memerlukan icon dalam ukuran berikut:

- **icon16.png** - 16x16 pixels (toolbar icon)
- **icon32.png** - 32x32 pixels (medium icon)
- **icon48.png** - 48x48 pixels (extension management)
- **icon128.png** - 128x128 pixels (Chrome Web Store)

## Current Status

Saat ini, semua ukuran menggunakan `icon16.png` sebagai placeholder. Untuk production, disarankan untuk membuat icon khusus untuk setiap ukuran.

## Design Guidelines

### Visual Identity
- **Colors**: Gunakan warna utama ekstensi (#4285f4 - Google Blue)
- **Style**: Modern, clean, minimal
- **Theme**: Form/document related (bisa berupa formulir, checklist, atau auto-fill symbol)

### Icon Suggestions
1. **Formulir dengan checkmark** - Menunjukkan form filling
2. **Lightning bolt + document** - Menunjukkan speed/automation
3. **Magic wand + form** - Menunjukkan auto-magic filling
4. **Pencil + lightning** - Fast writing/filling

### Technical Requirements
- **Format**: PNG with transparency
- **Background**: Transparent
- **Quality**: High resolution, crisp edges
- **Optimization**: Compressed for web use

## Creating Icons

### Tools Recommended
- **Adobe Illustrator** - Vector graphics
- **Figma** - Free design tool
- **GIMP** - Free photo editor
- **Canva** - Online design tool

### Export Settings
- Format: PNG
- Background: Transparent
- Quality: Maximum
- Color space: sRGB

## Placeholder Icon

Sementara ini, Anda bisa menggunakan icon placeholder atau membuat icon sederhana dengan:

1. **Background**: Gradient biru (#4285f4 to #34a853)
2. **Symbol**: Huruf "F" putih atau icon formulir sederhana
3. **Border**: Rounded corners untuk modern look

## Implementation

Icons direferensikan dalam `manifest.json`:

```json
{
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png", 
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png", 
      "128": "icons/icon128.png"
    }
  }
}
```

## Notes

- Pastikan icon terlihat jelas pada background terang dan gelap
- Test icon pada berbagai ukuran untuk readability
- Pertimbangkan accessibility dan contrast
- Icon harus representative dari fungsi extension

# 🔒 Development & Security Guide

## API Key Security

### 🔑 How API Key is Hidden

1. **Environment File (.env)**: API key stored separately
2. **Gitignore**: .env file excluded from Git
3. **Config Manager**: Loads API key dynamically
4. **Build Scripts**: Replace placeholder with actual key for production

### 🚧 Development Workflow

#### For Development:
```bash
# 1. Clone repository
git clone https://github.com/your-username/fastfill-ai-extension.git

# 2. The config.js contains placeholder
const EMBEDDED_API_KEY = 'REPLACE_WITH_ACTUAL_API_KEY';

# 3. Extension will use embedded fallback for users
```

#### For Production Build:
```bash
# Windows
npm run build:windows

# Or Node.js
npm run build

# This replaces placeholder with actual API key
```

#### Before Committing:
```bash
# Clean build (restore placeholder)
npm run build:clean

# Then commit safely
git add .
git commit -m "Your changes"
git push
```

### 🛡️ Security Features

1. **No API Key in Git**: Real API key never committed
2. **Automatic Embedding**: Users don't need to enter API key
3. **Fallback System**: Multiple ways to get API key
4. **Build Scripts**: Automated placeholder replacement

### 📁 File Structure

```
📁 FastFill AI Extension
├── 🔒 .env (IGNORED by Git)
├── 🔒 .gitignore
├── ⚙️ config.js (with placeholder)
├── 🤖 content-ai.js
├── 🎨 popup-ai.html
├── 📱 popup-ai.js
├── 🎨 popup-ai.css
├── 📜 manifest.json
├── 🔨 build.bat
├── 🧹 build-clean.bat
└── 📖 README.md
```

### 🔄 API Key Loading Order

1. **Embedded Key** (production) - Seamless for users
2. **Chrome Storage** (fallback) - User-provided key
3. **Hardcoded Fallback** (last resort) - Emergency backup

### 🎯 User Experience

**For End Users:**
- ✅ No API key setup required
- ✅ Click and use immediately
- ✅ Secure and private

**For Developers:**
- ✅ API key hidden from Git
- ✅ Easy development workflow
- ✅ Automated build process

### ⚠️ Important Notes

1. **Never commit config.js** after running build
2. **Always run build:clean** before pushing to Git
3. **Keep .env file local** - never share or commit
4. **Build scripts are automated** - no manual editing needed

### 🔧 Troubleshooting

#### If API key is visible in Git:
```bash
# Remove from staging
git reset config.js

# Restore placeholder
npm run build:clean

# Add to .gitignore if not already
echo "config.js.production" >> .gitignore
```

#### If build fails:
```bash
# Check if files exist
ls -la config.js manifest.json

# Restore from backup if available
cp config.js.backup config.js

# Or run clean and rebuild
npm run build:clean
npm run build
```

This system ensures your API key remains secret while providing seamless user experience!

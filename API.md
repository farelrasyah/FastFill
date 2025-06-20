# FastFill Extension - API Documentation

## 📡 Extension Architecture

FastFill menggunakan arsitektur Chrome Extension Manifest V3 dengan komponen-komponen berikut:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Popup UI      │ ←→ │ Background      │ ←→ │ Content Script  │
│   (popup.js)    │    │ (background.js) │    │ (content.js)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        ↓                        ↓                        ↓
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Template Data   │    │ Storage API     │    │ DOM Manipulation│
│ Management      │    │ Message Bridge  │    │ Form Detection  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔌 Message API

### Popup → Content Script

#### 1. Detect Forms
```javascript
chrome.tabs.sendMessage(tabId, {
  action: 'detectForms'
});

// Response:
{
  success: true,
  formsCount: 15
}
```

#### 2. Fill Forms
```javascript
chrome.tabs.sendMessage(tabId, {
  action: 'fillForms',
  template: {
    name: 'Template Name',
    data: { /* template data object */ }
  }
});

// Response:
{
  success: true
}
```

### Popup → Background Script

#### 1. Get Templates
```javascript
chrome.runtime.sendMessage({
  action: 'getTemplates'
});

// Response:
{
  success: true,
  templates: {
    template_id: {
      name: 'Template Name',
      description: 'Template Description',
      data: { /* template data */ }
    }
  }
}
```

#### 2. Save Template
```javascript
chrome.runtime.sendMessage({
  action: 'saveTemplate',
  template: {
    id: 'unique_template_id',
    name: 'Template Name',
    description: 'Description',
    data: { /* template data */ }
  }
});

// Response:
{
  success: true
}
```

#### 3. Delete Template
```javascript
chrome.runtime.sendMessage({
  action: 'deleteTemplate',
  templateId: 'template_id'
});

// Response:
{
  success: true
}
```

## 📊 Data Structures

### Template Object
```javascript
{
  id: 'unique_template_id',           // String: Unique identifier
  name: 'Template Display Name',      // String: User-friendly name
  description: 'Template description', // String: Brief description
  data: {
    // Personal Information
    firstName: 'John',                // String: First name
    lastName: 'Doe',                  // String: Last name
    fullName: 'John Doe',            // String: Full name
    email: 'john@example.com',       // String: Email address
    phone: '081234567890',           // String: Phone number
    birthDate: '1990-01-01',         // String: Date in YYYY-MM-DD format
    age: '30',                       // String: Age as string
    
    // Address Information
    address: 'Street Address',        // String: Street address
    city: 'City Name',               // String: City
    country: 'Country Name',         // String: Country
    fullAddress: 'Complete Address', // String: Full formatted address
    
    // Professional Information
    company: 'Company Name',         // String: Company name
    jobTitle: 'Job Title',           // String: Job position
    salary: '5000000',              // String: Salary amount
    
    // Security
    password: 'SecurePass123!',      // String: Password
    
    // Additional Fields
    description: 'Bio or description', // String: Long text description
    comment: 'Comments or notes'      // String: Comments or additional notes
  }
}
```

### Form Field Object
```javascript
{
  element: HTMLElement,              // DOM element reference
  type: 'text|email|tel|number|date|password|checkbox|radio|select|textarea',
  name: 'field_name',               // String: Field name attribute
  placeholder: 'Field placeholder', // String: Placeholder text
  id: 'field_id'                   // String: Field ID attribute
}
```

## 🎯 Content Script API

### FastFillContentScript Class

#### Methods

##### `detectForms()`
Mendeteksi semua form elements pada halaman yang dapat diisi.

```javascript
detectForms()
// Returns: Array of form field objects
```

##### `fillFormsWithTemplate(templateData)`
Mengisi form dengan data dari template.

```javascript
fillFormsWithTemplate({
  name: 'Template Name',
  data: { /* template data object */ }
})
```

##### `fillSingleField(formField, templateData)`
Mengisi satu field berdasarkan tipe dan mapping.

```javascript
fillSingleField(
  {
    element: inputElement,
    type: 'text',
    name: 'firstName',
    placeholder: 'Enter first name',
    id: 'fname'
  },
  templateData
)
```

##### `isVisible(element)`
Mengecek apakah element terlihat di halaman.

```javascript
isVisible(element)
// Returns: boolean
```

##### `triggerChangeEvents()`
Memicu events (input, change, blur) untuk validasi form.

```javascript
triggerChangeEvents()
```

## 🎨 Popup API

### FastFillPopup Class

#### Methods

##### `loadTemplates()`
Load templates dari storage dan populate UI.

```javascript
await loadTemplates()
```

##### `detectForms()`
Trigger form detection pada tab aktif.

```javascript
await detectForms()
```

##### `fillForms()`
Trigger form filling dengan template yang dipilih.

```javascript
await fillForms()
```

##### `saveTemplate(template)`
Simpan template baru atau update existing.

```javascript
await saveTemplate({
  id: 'template_id',
  name: 'Template Name',
  description: 'Description',
  data: templateData
})
```

##### `exportTemplates()`
Export templates ke JSON file.

```javascript
exportTemplates()
```

##### `importTemplates()`
Import templates dari JSON file.

```javascript
importTemplates()
```

## 🗄️ Storage API

### Chrome Storage Local

#### Keys Used
- `fastFillTemplates`: Object berisi semua templates
- `selectedTemplate`: String ID template yang terakhir dipilih

#### Data Format
```javascript
{
  fastFillTemplates: {
    'template_id_1': { /* template object */ },
    'template_id_2': { /* template object */ },
    // ...
  },
  selectedTemplate: 'template_id_1'
}
```

## 🔍 Field Mapping Algorithm

### Text Input Mapping
Content script menggunakan algoritma untuk memetakan field berdasarkan:

1. **Field Name** (name attribute)
2. **Placeholder Text** 
3. **Field ID** (id attribute)
4. **Label Text** (associated label)

#### Mapping Rules
```javascript
// Name fields
if (fieldIdentifier.includes('nama') || fieldIdentifier.includes('name')) {
  return templateData.fullName;
}

// Email fields
if (fieldType === 'email') {
  return templateData.email;
}

// Phone fields  
if (fieldType === 'tel' || fieldIdentifier.includes('phone')) {
  return templateData.phone;
}

// Address fields
if (fieldIdentifier.includes('alamat') || fieldIdentifier.includes('address')) {
  return templateData.address;
}
```

### Smart Field Detection
- Case-insensitive matching
- Multiple language support (Indonesian + English)
- Fallback ke default values jika tidak ada match
- Support untuk compound field names

## 🎯 Event System

### Content Script Events
```javascript
// Form detection completed
window.dispatchEvent(new CustomEvent('fastfill:formsDetected', {
  detail: { count: formsCount }
}));

// Form filling completed
window.dispatchEvent(new CustomEvent('fastfill:formsFilled', {
  detail: { template: templateName }
}));
```

### DOM Events Triggered
Setelah mengisi form, content script memicu events berikut:
- `input` - Untuk real-time validation
- `change` - Untuk form state changes
- `blur` - Untuk field blur validation
- `keyup` - Untuk keystroke simulation

## 🔒 Security Considerations

### Content Security Policy
- Menggunakan nonce-based CSP jika diperlukan
- Tidak mengeksekusi eval() atau inline scripts
- Semua resources di-load dari extension bundle

### Data Privacy
- Template data disimpan hanya di local storage
- Tidak ada komunikasi ke server external
- Tidak ada tracking atau analytics

### Permission Model
- `activeTab`: Akses minimal ke tab aktif saja
- `storage`: Local storage untuk templates
- `scripting`: Inject content script on-demand

## 📈 Performance

### Optimization Strategies
1. **Lazy Loading**: Content script di-inject on-demand
2. **Debounced Detection**: Form detection dengan debounce
3. **Minimal DOM Queries**: Cache element references
4. **Event Delegation**: Efficient event handling

### Memory Management
- Cleanup event listeners saat tidak digunakan
- Remove DOM references setelah fill complete
- Garbage collection friendly object patterns

## 🧪 Testing API

### Mock Data Generation
```javascript
// Generate test template
const testTemplate = FastFillBackground.getDefaultTemplates().qa_profile;

// Simulate form filling
await chrome.tabs.sendMessage(tabId, {
  action: 'fillForms', 
  template: testTemplate
});
```

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('fastfill_debug', 'true');

// View detected forms
console.log(fastFillContent.formElements);
```

## 🔄 Version Compatibility

### Manifest V3 Features
- Service Worker instead of background pages
- Promises-based APIs
- Declarative content scripts
- Enhanced security model

### Browser Support
- Chrome 88+
- Edge 88+ (Chromium-based)
- Opera 74+
- Brave Browser

## 📋 Error Handling

### Common Error Scenarios
```javascript
// Template not found
{
  success: false,
  error: 'Template not found: template_id'
}

// No forms detected
{
  success: false,
  error: 'No forms detected on page'
}

// Permission denied
{
  success: false,
  error: 'Cannot access tab: permission denied'
}

// Storage quota exceeded
{
  success: false,
  error: 'Storage quota exceeded'
}
```

### Error Recovery
- Fallback ke default templates jika custom templates corrupt
- Retry mechanism untuk failed injections
- Graceful degradation untuk unsupported pages

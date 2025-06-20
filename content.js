/**
 * Content Script - FastFill Extension
 * Bertugas untuk mendeteksi dan mengisi form input pada halaman web
 */

class FastFillContentScript {
  constructor() {
    this.formElements = [];
    this.initializeContentScript();
  }

  /**
   * Inisialisasi content script
   */
  initializeContentScript() {
    console.log('FastFill Content Script loaded');
    
    // Listen untuk pesan dari popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'detectForms') {
        this.detectForms();
        sendResponse({ success: true, formsCount: this.formElements.length });
      } else if (request.action === 'fillForms') {
        this.fillFormsWithTemplate(request.template);
        sendResponse({ success: true });
      }
    });

    // Deteksi form saat halaman dimuat
    this.detectForms();
  }

  /**
   * Mendeteksi semua form input pada halaman
   */
  detectForms() {
    this.formElements = [];
    
    // Selector untuk berbagai jenis input
    const inputSelectors = [
      'input[type="text"]',
      'input[type="email"]',
      'input[type="tel"]',
      'input[type="number"]',
      'input[type="date"]',
      'input[type="password"]',
      'input[type="url"]',
      'input[type="search"]',
      'input[type="checkbox"]',
      'input[type="radio"]',
      'select',
      'textarea'
    ];

    inputSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (this.isVisible(element) && !element.disabled && !element.readOnly) {
          this.formElements.push({
            element: element,
            type: element.type || element.tagName.toLowerCase(),
            name: element.name || element.id || element.placeholder || '',
            placeholder: element.placeholder || '',
            id: element.id || ''
          });
        }
      });
    });

    console.log(`FastFill: Detected ${this.formElements.length} form elements`);
    return this.formElements;
  }

  /**
   * Mengecek apakah element terlihat di halaman
   */
  isVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           element.offsetParent !== null;
  }

  /**
   * Mengisi form dengan data template
   */
  fillFormsWithTemplate(templateData) {
    if (!templateData) {
      console.error('FastFill: No template data provided');
      return;
    }

    console.log('FastFill: Filling forms with template:', templateData.name);

    this.formElements.forEach(formField => {
      this.fillSingleField(formField, templateData);
    });

    // Trigger change events untuk memastikan form validation
    this.triggerChangeEvents();
  }

  /**
   * Mengisi satu field berdasarkan tipe dan nama
   */
  fillSingleField(formField, templateData) {
    const { element, type, name, placeholder, id } = formField;
    const data = templateData.data;

    try {
      switch (type) {
        case 'text':
        case 'search':
        case 'url':
          this.fillTextInput(element, name, placeholder, id, data);
          break;
        
        case 'email':
          element.value = data.email;
          break;
        
        case 'tel':
          element.value = data.phone;
          break;
        
        case 'number':
          this.fillNumberInput(element, name, data);
          break;
        
        case 'date':
          element.value = data.birthDate;
          break;
        
        case 'password':
          element.value = data.password;
          break;
        
        case 'checkbox':
          element.checked = Math.random() > 0.3; // 70% chance dicentang
          break;
        
        case 'radio':
          this.fillRadioInput(element);
          break;
        
        case 'select':
          this.fillSelectInput(element);
          break;
        
        case 'textarea':
          this.fillTextareaInput(element, name, data);
          break;
      }
    } catch (error) {
      console.error('FastFill: Error filling field:', error);
    }
  }

  /**
   * Mengisi input text berdasarkan nama field
   */
  fillTextInput(element, name, placeholder, id, data) {
    const fieldIdentifier = (name + ' ' + placeholder + ' ' + id).toLowerCase();
    
    if (fieldIdentifier.includes('nama') || fieldIdentifier.includes('name')) {
      element.value = data.fullName;
    } else if (fieldIdentifier.includes('first') || fieldIdentifier.includes('depan')) {
      element.value = data.firstName;
    } else if (fieldIdentifier.includes('last') || fieldIdentifier.includes('belakang')) {
      element.value = data.lastName;
    } else if (fieldIdentifier.includes('alamat') || fieldIdentifier.includes('address')) {
      element.value = data.address;
    } else if (fieldIdentifier.includes('kota') || fieldIdentifier.includes('city')) {
      element.value = data.city;
    } else if (fieldIdentifier.includes('negara') || fieldIdentifier.includes('country')) {
      element.value = data.country;
    } else if (fieldIdentifier.includes('perusahaan') || fieldIdentifier.includes('company')) {
      element.value = data.company;
    } else if (fieldIdentifier.includes('jabatan') || fieldIdentifier.includes('position') || fieldIdentifier.includes('job')) {
      element.value = data.jobTitle;
    } else {
      // Default fallback
      element.value = data.fullName;
    }
  }

  /**
   * Mengisi input number
   */
  fillNumberInput(element, name, data) {
    const fieldName = name.toLowerCase();
    
    if (fieldName.includes('age') || fieldName.includes('umur')) {
      element.value = data.age;
    } else if (fieldName.includes('salary') || fieldName.includes('gaji')) {
      element.value = data.salary;
    } else {
      element.value = Math.floor(Math.random() * 100) + 1;
    }
  }

  /**
   * Mengisi radio input (pilih salah satu dari grup)
   */
  fillRadioInput(element) {
    const radioGroup = document.querySelectorAll(`input[name="${element.name}"]`);
    if (radioGroup.length > 0) {
      const randomIndex = Math.floor(Math.random() * radioGroup.length);
      radioGroup[randomIndex].checked = true;
    }
  }

  /**
   * Mengisi select dropdown
   */
  fillSelectInput(element) {
    const options = element.querySelectorAll('option');
    if (options.length > 1) { // Skip first option (biasanya placeholder)
      const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
      element.selectedIndex = randomIndex;
    }
  }

  /**
   * Mengisi textarea
   */
  fillTextareaInput(element, name, data) {
    const fieldName = name.toLowerCase();
    
    if (fieldName.includes('alamat') || fieldName.includes('address')) {
      element.value = data.fullAddress;
    } else if (fieldName.includes('deskripsi') || fieldName.includes('description') || fieldName.includes('bio')) {
      element.value = data.description;
    } else if (fieldName.includes('komentar') || fieldName.includes('comment')) {
      element.value = data.comment;
    } else {
      element.value = data.description;
    }
  }

  /**
   * Trigger change events untuk semua field yang diisi
   */
  triggerChangeEvents() {
    this.formElements.forEach(formField => {
      const element = formField.element;
      
      // Trigger berbagai events untuk memastikan form validation berjalan
      const events = ['input', 'change', 'blur', 'keyup'];
      
      events.forEach(eventType => {
        const event = new Event(eventType, { bubbles: true });
        element.dispatchEvent(event);
      });
    });
  }

  /**
   * Highlight form elements (untuk debugging)
   */
  highlightFormElements() {
    this.formElements.forEach(formField => {
      formField.element.style.border = '2px solid #4CAF50';
      formField.element.style.backgroundColor = '#E8F5E8';
    });

    // Remove highlight after 3 seconds
    setTimeout(() => {
      this.formElements.forEach(formField => {
        formField.element.style.border = '';
        formField.element.style.backgroundColor = '';
      });
    }, 3000);
  }
}

// Inisialisasi content script
const fastFillContent = new FastFillContentScript();

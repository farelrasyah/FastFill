// Content Script - FastFill Extension
// Bertanggung jawab untuk mendeteksi dan mengisi form pada halaman web
// Designed to be non-invasive and safe for all websites

// Only initialize if we're not already loaded
if (!window.fastFillLoaded) {
    window.fastFillLoaded = true;
    console.log('FastFill content script loaded safely');
  
/**
 * Fungsi untuk mendeteksi semua form input pada halaman dengan proteksi keamanan
 * @returns {Array} Array of form elements
 */
function detectFormInputs() {
    const formElements = [];
    
    try {
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
                // Skip elements that might be part of extension UI or sensitive areas
                if (isElementSafe(element)) {
                    formElements.push({
                        element: element,
                        type: element.type || element.tagName.toLowerCase(),
                        name: element.name || '',
                        id: element.id || '',
                        placeholder: element.placeholder || '',
                        required: element.required || false
                    });
                }
            });
        });
        
        console.log(`FastFill detected ${formElements.length} safe form elements`);
    } catch (error) {
        console.error('FastFill error detecting forms:', error);
    }
    
    return formElements;
}

/**
 * Memeriksa apakah element aman untuk dimodifikasi
 * @param {HTMLElement} element - Element yang akan diperiksa
 * @returns {boolean} True jika aman
 */
function isElementSafe(element) {
    // Skip jika element tidak visible
    if (!element.offsetParent && element.style.display !== 'none') {
        return false;
    }
    
    // Skip element yang mungkin bagian dari extension atau browser UI
    const unsafeSelectors = [
        '[id*="extension"]',
        '[class*="extension"]',
        '[id*="chrome"]',
        '[class*="chrome"]',
        '[id*="browser"]',
        '[class*="browser"]'
    ];
    
    for (const selector of unsafeSelectors) {
        if (element.matches && element.matches(selector)) {
            return false;
        }
    }
    
    // Skip element dalam container yang mungkin sensitive
    const parent = element.closest('[role="banner"], [role="navigation"], [role="search"], .chrome-extension, #chrome-extension');
    if (parent) {
        return false;
    }
    
    return true;
}

/**
 * Fungsi untuk mengisi form berdasarkan template data dengan proteksi keamanan
 * @param {Object} templateData - Data template yang akan digunakan
 */
function fillFormWithTemplate(templateData) {
    if (!templateData || !templateData.data) {
        showNotification('No template data provided');
        return;
    }
    
    const formElements = detectFormInputs();
    let filledCount = 0;
    
    formElements.forEach(({ element, type, name, id, placeholder }) => {
        try {
            // Skip jika element tidak visible, disabled, atau readonly
            if (!element.offsetParent || element.disabled || element.readOnly) {
                return;
            }
            
            // Additional safety check
            if (!isElementSafe(element)) {
                return;
            }
            
            const fieldKey = getFieldKey(name, id, placeholder, type);
            const value = getValueForField(fieldKey, type, templateData);
            
            if (value !== null && value !== undefined) {
                fillField(element, type, value);
                filledCount++;
                
                // Trigger events untuk memastikan form validation berjalan
                triggerEvents(element);
            }
        } catch (error) {
            console.error('FastFill error filling field:', error);
        }
    });
    
    // Show notification
    if (filledCount > 0) {
        showNotification(`✓ ${filledCount} fields filled successfully!`);
        console.log(`FastFill filled ${filledCount} form fields`);
    } else {
        showNotification('No suitable form fields found');
    }
}

/**
 * Menentukan key field berdasarkan atribut element
 * @param {string} name - Name attribute
 * @param {string} id - ID attribute  
 * @param {string} placeholder - Placeholder text
 * @param {string} type - Input type
 * @returns {string} Field key untuk mapping data
 */
function getFieldKey(name, id, placeholder, type) {
    const text = (name + ' ' + id + ' ' + placeholder).toLowerCase();
    
    // Mapping berdasarkan kata kunci yang umum digunakan
    if (text.includes('name') || text.includes('nama')) return 'name';
    if (text.includes('first') && text.includes('name')) return 'firstName';
    if (text.includes('last') && text.includes('name')) return 'lastName';
    if (text.includes('email') || text.includes('mail')) return 'email';
    if (text.includes('phone') || text.includes('tel') || text.includes('mobile')) return 'phone';
    if (text.includes('address') || text.includes('alamat')) return 'address';
    if (text.includes('city') || text.includes('kota')) return 'city';
    if (text.includes('zip') || text.includes('postal')) return 'zipCode';
    if (text.includes('age') || text.includes('umur')) return 'age';
    if (text.includes('birth') || text.includes('lahir')) return 'birthDate';
    if (text.includes('company') || text.includes('perusahaan')) return 'company';
    if (text.includes('job') || text.includes('pekerjaan') || text.includes('position')) return 'jobTitle';
    if (text.includes('website') || text.includes('url')) return 'website';
    if (text.includes('description') || text.includes('deskripsi') || text.includes('bio')) return 'description';
    if (text.includes('gender') || text.includes('jenis kelamin')) return 'gender';
    if (text.includes('country') || text.includes('negara')) return 'country';
    if (text.includes('password') || text.includes('pwd')) return 'password';
    
    // Default fallback berdasarkan type
    if (type === 'email') return 'email';
    if (type === 'tel') return 'phone';
    if (type === 'date') return 'birthDate';
    if (type === 'number') return 'age';
    
    return 'default';
}

/**
 * Mendapatkan value yang sesuai untuk field tertentu
 * @param {string} fieldKey - Key field
 * @param {string} type - Input type
 * @param {Object} templateData - Template data
 * @returns {string|boolean|null} Value untuk field
 */
function getValueForField(fieldKey, type, templateData) {
    if (!templateData || !templateData.data) return null;
    
    const data = templateData.data;
    
    // Handle checkbox dan radio
    if (type === 'checkbox') {
        return Math.random() > 0.5; // Random selection
    }
    
    if (type === 'radio') {
        return true; // Will select first radio in group
    }
    
    // Return specific field value or default
    return data[fieldKey] || data.default || '';
}

/**
 * Mengisi field dengan value yang sesuai
 * @param {HTMLElement} element - Form element
 * @param {string} type - Input type
 * @param {string|boolean} value - Value to fill
 */
function fillField(element, type, value) {
    switch (type) {
        case 'checkbox':
            element.checked = Boolean(value);
            break;
            
        case 'radio':
            if (value && !element.checked) {
                element.checked = true;
            }
            break;
            
        case 'select':
        case 'select-one':
        case 'select-multiple':
            fillSelect(element, value);
            break;
            
        default:
            element.value = String(value);
            break;
    }
}

/**
 * Mengisi select element
 * @param {HTMLSelectElement} selectElement - Select element
 * @param {string} value - Value to select
 */
function fillSelect(selectElement, value) {
    // Coba set value langsung dulu
    selectElement.value = value;
    
    // Jika tidak ada option yang cocok, pilih option pertama yang bukan placeholder
    if (!selectElement.value && selectElement.options.length > 0) {
        for (let i = 0; i < selectElement.options.length; i++) {
            const option = selectElement.options[i];
            if (option.value && option.value !== '' && option.text.toLowerCase() !== 'select') {
                selectElement.selectedIndex = i;
                break;
            }
        }
    }
}

/**
 * Trigger events untuk memastikan form validation dan event handlers berjalan
 * @param {HTMLElement} element - Form element
 */
function triggerEvents(element) {
    try {
        const events = ['input', 'change', 'blur'];
        
        events.forEach(eventType => {
            try {
                const event = new Event(eventType, { 
                    bubbles: true, 
                    cancelable: true 
                });
                element.dispatchEvent(event);
            } catch (eventError) {
                // Fallback for older browsers
                try {
                    const fallbackEvent = document.createEvent('Event');
                    fallbackEvent.initEvent(eventType, true, true);
                    element.dispatchEvent(fallbackEvent);
                } catch (fallbackError) {
                    console.log('FastFill: Could not trigger event', eventType);
                }
            }
        });
    } catch (error) {
        console.error('FastFill error triggering events:', error);
    }
}

/**
 * Menampilkan notifikasi sementara di halaman dengan namespace yang aman
 * @param {string} message - Pesan notifikasi
 */
function showNotification(message) {
    // Remove existing notification
    const existing = document.getElementById('fastfill-ext-notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element with safe positioning
    const notification = document.createElement('div');
    notification.id = 'fastfill-ext-notification';
    
    // Use more specific and safe CSS with !important to avoid conflicts
    notification.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        background: #4CAF50 !important;
        color: white !important;
        padding: 12px 20px !important;
        border-radius: 6px !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        z-index: 2147483647 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        line-height: 1.4 !important;
        max-width: 300px !important;
        pointer-events: none !important;
        transform: translateX(100%) !important;
        transition: transform 0.3s ease-out !important;
        border: 2px solid #45a049 !important;
        text-align: center !important;
    `;
    
    notification.textContent = message;
    
    // Safely append to body
    try {
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0) !important';
        }, 10);
        
        // Auto remove after 3 seconds with fade out
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%) !important';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
        
    } catch (error) {
        console.log('FastFill notification shown:', message);
    }
}

    /**
     * Listen untuk pesan dari popup dengan error handling yang lebih baik
     */
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('FastFill content script received message:', request);
        
        // Validate sender
        if (!sender.id || sender.id !== chrome.runtime.id) {
            sendResponse({ success: false, message: 'Invalid sender' });
            return false;
        }
        
        if (request.action === 'fillForm') {
            try {
                fillFormWithTemplate(request.templateData);
                sendResponse({ success: true, message: 'Form filled successfully' });
            } catch (error) {
                console.error('FastFill error filling form:', error);
                sendResponse({ success: false, message: 'Failed to fill form: ' + error.message });
            }
            return true; // Indicates async response
        }
        
        if (request.action === 'detectForms') {
            try {
                const forms = detectFormInputs();
                sendResponse({ 
                    success: true, 
                    count: forms.length, 
                    message: `Found ${forms.length} form fields` 
                });
            } catch (error) {
                console.error('FastFill error detecting forms:', error);
                sendResponse({ success: false, message: 'Failed to detect forms: ' + error.message });
            }
            return true;
        }
        
        // Unknown action
        sendResponse({ success: false, message: 'Unknown action: ' + request.action });
        return false;
    });

    // Initialize
    console.log('FastFill content script initialized');
}

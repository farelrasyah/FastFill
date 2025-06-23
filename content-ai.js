// Content Script - FastFill AI Extension
// Advanced AI-powered form filling using Gemini Pro
// Detects, analyzes, and fills forms intelligently

// Prevent multiple initialization
if (!window.fastFillAILoaded) {
    window.fastFillAILoaded = true;
    console.log('🤖 FastFill AI content script loaded');

    /**
     * 🔍 FORM DETECTION & EXTRACTION
     * Comprehensive form field detection with AI-ready metadata
     */
    class FormFieldDetector {
        constructor() {
            this.supportedInputTypes = [
                'text', 'email', 'tel', 'number', 'date', 'datetime-local',
                'time', 'url', 'password', 'search', 'color', 'range',
                'checkbox', 'radio'
            ];
            this.supportedElements = ['input', 'textarea', 'select'];
        }

        /**
         * Main detection function - scans entire page for fillable fields
         * @returns {Array} Array of field objects with AI-ready metadata
         */
        detectAllFields() {
            console.log('🔍 Starting comprehensive form field detection...');
            const fields = [];
            let fieldIndex = 0;

            // Get all potential form elements
            const allElements = document.querySelectorAll(
                'input, textarea, select, [contenteditable="true"]'
            );

            allElements.forEach(element => {
                try {
                    if (this.isFieldFillable(element)) {
                        const fieldData = this.extractFieldMetadata(element, fieldIndex);
                        if (fieldData) {
                            fields.push(fieldData);
                            fieldIndex++;
                        }
                    }
                } catch (error) {
                    console.warn('⚠️ Error processing element:', error);
                }
            });

            console.log(`✅ Detected ${fields.length} fillable fields`);
            return fields;
        }

        /**
         * Check if field is safe and fillable
         * @param {HTMLElement} element - Form element to check
         * @returns {boolean} True if field can be filled
         */
        isFieldFillable(element) {
            // Basic visibility and interaction checks
            if (!element.offsetParent && element.style.display === 'none') return false;
            if (element.disabled || element.readOnly) return false;
            if (element.type === 'hidden' || element.type === 'submit' || element.type === 'button') return false;

            // Skip sensitive/system fields
            const sensitivePatterns = [
                'captcha', 'csrf', 'token', 'antiforgery', 'viewstate',
                'extension', 'chrome', 'browser', 'system'
            ];
            
            const elementText = (
                element.name + ' ' + 
                element.id + ' ' + 
                element.className + ' ' + 
                (element.placeholder || '')
            ).toLowerCase();

            return !sensitivePatterns.some(pattern => elementText.includes(pattern));
        }

        /**
         * Extract comprehensive metadata from field for AI processing
         * @param {HTMLElement} element - Form element
         * @param {number} index - Field index for reference
         * @returns {Object} Field metadata object
         */
        extractFieldMetadata(element, index) {
            const metadata = {
                index: index,
                element: element, // Keep reference for filling
                
                // Basic attributes
                type: this.getElementType(element),
                name: element.name || '',
                id: element.id || '',
                className: element.className || '',
                placeholder: element.placeholder || '',
                
                // Labels and context
                label: this.findFieldLabel(element),
                ariaLabel: element.getAttribute('aria-label') || '',
                title: element.title || '',
                
                // Validation and constraints
                required: element.required || false,
                maxLength: element.maxLength > 0 ? element.maxLength : null,
                minLength: element.minLength > 0 ? element.minLength : null,
                pattern: element.pattern || '',
                min: element.min || '',
                max: element.max || '',
                step: element.step || '',
                
                // Options for select/radio/checkbox
                options: this.getFieldOptions(element),
                
                // Context clues
                parentForm: this.getParentFormInfo(element),
                nearbyText: this.getNearbyText(element),
                
                // Current value
                currentValue: element.value || ''
            };

            return metadata;
        }

        /**
         * Determine element type consistently
         * @param {HTMLElement} element
         * @returns {string} Normalized element type
         */
        getElementType(element) {
            if (element.tagName.toLowerCase() === 'textarea') return 'textarea';
            if (element.tagName.toLowerCase() === 'select') return 'select';
            if (element.contentEditable === 'true') return 'contenteditable';
            return element.type || 'text';
        }

        /**
         * Find associated label for the field
         * @param {HTMLElement} element
         * @returns {string} Label text
         */
        findFieldLabel(element) {
            // Method 1: label[for] pointing to this element
            if (element.id) {
                const label = document.querySelector(`label[for="${element.id}"]`);
                if (label) return label.textContent.trim();
            }

            // Method 2: element inside label
            const parentLabel = element.closest('label');
            if (parentLabel) {
                return parentLabel.textContent.replace(element.value || '', '').trim();
            }

            // Method 3: aria-labelledby
            if (element.getAttribute('aria-labelledby')) {
                const labelId = element.getAttribute('aria-labelledby');
                const labelElement = document.getElementById(labelId);
                if (labelElement) return labelElement.textContent.trim();
            }

            // Method 4: nearby text (common patterns)
            const nearbyLabel = this.findNearbyLabel(element);
            return nearbyLabel;
        }

        /**
         * Find nearby text that might be a label
         * @param {HTMLElement} element
         * @returns {string} Nearby label text
         */
        findNearbyLabel(element) {
            // Check previous sibling text
            let sibling = element.previousElementSibling;
            while (sibling) {
                if (sibling.textContent.trim()) {
                    return sibling.textContent.trim();
                }
                sibling = sibling.previousElementSibling;
            }

            // Check parent's previous sibling
            const parent = element.parentElement;
            if (parent) {
                const parentPrev = parent.previousElementSibling;
                if (parentPrev && parentPrev.textContent.trim()) {
                    return parentPrev.textContent.trim();
                }
            }

            return '';
        }

        /**
         * Get options for select, radio, or checkbox elements
         * @param {HTMLElement} element
         * @returns {Array} Array of options
         */
        getFieldOptions(element) {
            if (element.tagName.toLowerCase() === 'select') {
                return Array.from(element.options).map(option => ({
                    value: option.value,
                    text: option.textContent.trim(),
                    selected: option.selected
                }));
            }

            if (element.type === 'radio') {
                const radioGroup = document.querySelectorAll(`input[name="${element.name}"]`);
                return Array.from(radioGroup).map(radio => ({
                    value: radio.value,
                    text: this.findFieldLabel(radio) || radio.value,
                    checked: radio.checked
                }));
            }

            return [];
        }

        /**
         * Get parent form information for context
         * @param {HTMLElement} element
         * @returns {Object} Form context info
         */
        getParentFormInfo(element) {
            const form = element.closest('form');
            if (form) {
                return {
                    action: form.action || '',
                    method: form.method || 'get',
                    name: form.name || '',
                    id: form.id || ''
                };
            }
            return null;
        }

        /**
         * Get nearby text for additional context
         * @param {HTMLElement} element
         * @returns {string} Nearby contextual text
         */
        getNearbyText(element) {
            const parent = element.parentElement;
            if (parent) {
                return parent.textContent.replace(element.value || '', '').trim().substring(0, 100);
            }
            return '';
        }
    }    /**
     * 🤖 GEMINI AI INTEGRATION
     * Handles communication with Gemini Pro API for intelligent form filling
     * Uses embedded API key for seamless user experience
     */
    class GeminiFormFiller {
        constructor() {
            this.apiKey = null;
            this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
            this.detector = new FormFieldDetector();
            this.config = window.FastFillConfig || null;
        }

        /**
         * Initialize with embedded API key
         */
        async initialize() {
            // Use embedded API key from config
            if (this.config && this.config.hasApiKey()) {
                this.apiKey = this.config.getApiKey();
                console.log('✅ Using embedded API key');
                return this.apiKey;
            }

            // Fallback to user-provided API key from storage
            return new Promise((resolve) => {
                chrome.storage.sync.get(['geminiApiKey'], (result) => {
                    if (result.geminiApiKey) {
                        this.apiKey = result.geminiApiKey;
                        console.log('✅ Using user-provided API key from storage');
                    } else {
                        // Use hardcoded API key as final fallback
                        this.apiKey = 'AIzaSyARIKwnlrUeIxpGvTS5VhRxuR2HhWQCxoY';
                        console.log('✅ Using fallback API key');
                    }
                    resolve(this.apiKey);
                });
            });
        }        /**
         * 🎯 MAIN FUNCTION - AI-powered form filling
         * This is the main entry point for AI form filling
         * No API key setup required - uses embedded key
         */
        async fillFormWithAI() {
            try {
                console.log('🚀 Starting AI-powered form filling...');
                
                // Initialize with embedded API key
                await this.initialize();
                if (!this.apiKey) {
                    this.showNotification('❌ API configuration error. Please contact developer.', 'error');
                    return { success: false, message: 'API key configuration error' };
                }

                // Step 1: Detect all fillable fields
                const fields = this.detector.detectAllFields();
                if (fields.length === 0) {
                    this.showNotification('🔍 No fillable form fields found on this page', 'warning');
                    return { success: false, message: 'No fields found' };
                }

                this.showNotification(`🔍 Found ${fields.length} fields, analyzing with AI...`, 'info');

                // Step 2: Prepare data for AI
                const aiInput = this.prepareAIInput(fields);
                console.log('📋 AI Input prepared:', aiInput);

                // Step 3: Get AI response
                const aiResponse = await this.callGeminiAPI(aiInput);
                if (!aiResponse || !aiResponse.success) {
                    throw new Error(aiResponse?.error || 'AI request failed');
                }

                // Step 4: Fill form with AI-generated data
                const fillResult = await this.fillFieldsWithAIData(fields, aiResponse.data);
                
                this.showNotification(`✅ Successfully filled ${fillResult.filledCount}/${fields.length} fields!`, 'success');
                return { success: true, filledCount: fillResult.filledCount, totalFields: fields.length };

            } catch (error) {
                console.error('❌ AI form filling failed:', error);
                this.showNotification(`❌ AI filling failed: ${error.message}`, 'error');
                
                // Fallback to template-based filling
                return await this.fallbackTemplateFilling();
            }
        }

        /**
         * Prepare field data for AI processing
         * @param {Array} fields - Array of field metadata
         * @returns {Object} Structured input for AI
         */
        prepareAIInput(fields) {
            // Create clean field descriptions for AI
            const fieldDescriptions = fields.map(field => ({
                index: field.index,
                type: field.type,
                label: field.label || field.placeholder || field.name || 'Unknown field',
                placeholder: field.placeholder,
                name: field.name,
                required: field.required,
                options: field.options && field.options.length > 0 ? field.options.map(opt => opt.text || opt.value) : null,
                constraints: {
                    maxLength: field.maxLength,
                    minLength: field.minLength,
                    pattern: field.pattern,
                    min: field.min,
                    max: field.max
                },
                context: field.nearbyText || field.parentForm?.action || ''
            }));

            return {
                fields: fieldDescriptions,
                pageTitle: document.title,
                pageURL: window.location.href,
                formContext: this.getPageContext()
            };
        }

        /**
         * Get page context for better AI understanding
         * @returns {string} Page context description
         */
        getPageContext() {
            const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
                .map(h => h.textContent.trim())
                .slice(0, 3)
                .join(', ');
            
            return headings || document.title || 'General form';
        }

        /**
         * Call Gemini API with prepared input
         * @param {Object} aiInput - Structured field data
         * @returns {Object} AI response with generated data
         */
        async callGeminiAPI(aiInput) {
            const prompt = this.constructPrompt(aiInput);
            
            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            };

            try {
                console.log('🤖 Calling Gemini API...');
                const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                console.log('🤖 Gemini API response:', result);

                if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
                    const generatedText = result.candidates[0].content.parts[0].text;
                    const parsedData = this.parseAIResponse(generatedText);
                    
                    return { success: true, data: parsedData, rawText: generatedText };
                } else {
                    throw new Error('Invalid response format from Gemini API');
                }

            } catch (error) {
                console.error('❌ Gemini API error:', error);
                return { success: false, error: error.message };
            }
        }

        /**
         * Construct intelligent prompt for Gemini
         * @param {Object} aiInput - Field data and context
         * @returns {string} Optimized prompt for AI
         */
        constructPrompt(aiInput) {
            const { fields, pageTitle, pageURL, formContext } = aiInput;
            
            const prompt = `You are an expert form-filling assistant. I need you to generate realistic, appropriate data for a web form.

CONTEXT:
- Page: "${pageTitle}"
- URL: ${pageURL}
- Form Context: ${formContext}

FORM FIELDS (${fields.length} total):
${fields.map((field, i) => 
    `${i + 1}. ${field.label || field.name || 'Field ' + (i + 1)}
   - Type: ${field.type}
   - Name: ${field.name}
   - Placeholder: ${field.placeholder || 'None'}
   - Required: ${field.required ? 'Yes' : 'No'}
   ${field.options ? `- Options: ${field.options.join(', ')}` : ''}
   ${field.constraints.maxLength ? `- Max Length: ${field.constraints.maxLength}` : ''}
   ${field.context ? `- Context: ${field.context}` : ''}`
).join('\n\n')}

INSTRUCTIONS:
1. Generate realistic, diverse, and appropriate data for each field
2. Consider field labels, types, and constraints
3. For select/radio fields, choose from available options
4. For email fields, use realistic email formats
5. For phone fields, use proper phone number formats
6. For dates, use realistic dates in appropriate format
7. For text areas, provide meaningful content (2-3 sentences)
8. For names, use diverse, realistic names
9. Make data coherent (if there's first name and last name, they should match)

RESPONSE FORMAT:
Return ONLY a JSON array with values in the exact same order as the fields above. No additional text, explanations, or formatting.

Example format: ["John Doe", "john.doe@email.com", "555-123-4567", "123 Main St"]

Generate data now:`;

            return prompt;
        }

        /**
         * Parse AI response into usable data array
         * @param {string} responseText - Raw AI response
         * @returns {Array} Parsed data array
         */
        parseAIResponse(responseText) {
            try {
                // Try to extract JSON from response
                const jsonMatch = responseText.match(/\[.*\]/s);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }

                // Fallback: split by lines and clean
                const lines = responseText.split('\n')
                    .map(line => line.trim())
                    .filter(line => line && !line.startsWith('//') && !line.startsWith('#'))
                    .map(line => line.replace(/^["']|["']$/g, '')); // Remove quotes

                return lines;

            } catch (error) {
                console.warn('⚠️ Failed to parse AI response, using fallback');
                return responseText.split('\n').filter(line => line.trim());
            }
        }

        /**
         * Fill form fields with AI-generated data
         * @param {Array} fields - Original field metadata
         * @param {Array} aiData - AI-generated data array
         * @returns {Object} Fill result summary
         */
        async fillFieldsWithAIData(fields, aiData) {
            let filledCount = 0;
            const errors = [];

            for (let i = 0; i < fields.length && i < aiData.length; i++) {
                try {
                    const field = fields[i];
                    const value = aiData[i];

                    if (value !== null && value !== undefined && String(value).trim() !== '') {
                        const success = this.fillSingleField(field, value);
                        if (success) {
                            filledCount++;
                            
                            // Add small delay for better UX and to avoid overwhelming the page
                            if (i % 5 === 0) {
                                await new Promise(resolve => setTimeout(resolve, 100));
                            }
                        }
                    }
                } catch (error) {
                    errors.push({ field: i, error: error.message });
                    console.warn(`⚠️ Failed to fill field ${i}:`, error);
                }
            }

            return { filledCount, errors, totalAttempted: Math.min(fields.length, aiData.length) };
        }

        /**
         * Fill a single form field with appropriate value
         * @param {Object} fieldMeta - Field metadata
         * @param {*} value - Value to fill
         * @returns {boolean} Success status
         */
        fillSingleField(fieldMeta, value) {
            const element = fieldMeta.element;
            
            try {
                switch (fieldMeta.type) {
                    case 'checkbox':
                        element.checked = this.parseBoolean(value);
                        break;
                        
                    case 'radio':
                        if (fieldMeta.options) {
                            const matchingOption = fieldMeta.options.find(opt => 
                                opt.text.toLowerCase().includes(String(value).toLowerCase()) ||
                                opt.value.toLowerCase().includes(String(value).toLowerCase())
                            );
                            if (matchingOption) {
                                const radioElement = document.querySelector(
                                    `input[name="${fieldMeta.name}"][value="${matchingOption.value}"]`
                                );
                                if (radioElement) radioElement.checked = true;
                            }
                        }
                        break;
                        
                    case 'select':
                        this.fillSelectField(element, value, fieldMeta.options);
                        break;
                        
                    case 'contenteditable':
                        element.innerHTML = String(value);
                        break;
                        
                    default:
                        element.value = String(value);
                        break;
                }

                // Trigger events to ensure proper form validation
                this.triggerFieldEvents(element);
                return true;

            } catch (error) {
                console.warn('⚠️ Error filling field:', error);
                return false;
            }
        }

        /**
         * Fill select field intelligently
         * @param {HTMLSelectElement} selectElement
         * @param {*} value
         * @param {Array} options
         */
        fillSelectField(selectElement, value, options) {
            const valueStr = String(value).toLowerCase();
            
            // Try exact value match
            if (selectElement.querySelector(`option[value="${value}"]`)) {
                selectElement.value = value;
                return;
            }

            // Try fuzzy matching with option text
            const matchingOption = Array.from(selectElement.options).find(option => 
                option.textContent.toLowerCase().includes(valueStr) ||
                valueStr.includes(option.textContent.toLowerCase())
            );

            if (matchingOption) {
                selectElement.value = matchingOption.value;
            } else if (selectElement.options.length > 1) {
                // Select first non-empty option as fallback
                selectElement.selectedIndex = 1;
            }
        }

        /**
         * Parse boolean values from various formats
         * @param {*} value
         * @returns {boolean}
         */
        parseBoolean(value) {
            const str = String(value).toLowerCase();
            return ['true', 'yes', '1', 'on', 'checked', 'selected'].includes(str);
        }

        /**
         * Trigger appropriate events on form field
         * @param {HTMLElement} element
         */
        triggerFieldEvents(element) {
            const events = ['input', 'change', 'blur'];
            events.forEach(eventType => {
                try {
                    const event = new Event(eventType, { bubbles: true, cancelable: true });
                    element.dispatchEvent(event);
                } catch (error) {
                    // Fallback for older browsers
                    try {
                        const event = document.createEvent('Event');
                        event.initEvent(eventType, true, true);
                        element.dispatchEvent(event);
                    } catch (fallbackError) {
                        console.log('Could not trigger event:', eventType);
                    }
                }
            });
        }

        /**
         * Fallback to template-based filling if AI fails
         * @returns {Object} Fallback result
         */
        async fallbackTemplateFilling() {
            console.log('🔄 Using fallback template filling...');
            
            // Simple fallback data
            const fallbackData = {
                name: "John Doe",
                firstName: "John",
                lastName: "Doe", 
                email: "john.doe@example.com",
                phone: "555-123-4567",
                address: "123 Main Street",
                city: "New York",
                zipCode: "10001",
                age: "30",
                company: "Tech Corp",
                default: "Sample Data"
            };

            const fields = this.detector.detectAllFields();
            let filledCount = 0;

            fields.forEach(field => {
                try {
                    const key = this.getTemplateKey(field);
                    const value = fallbackData[key] || fallbackData.default;
                    
                    if (this.fillSingleField(field, value)) {
                        filledCount++;
                    }
                } catch (error) {
                    console.warn('Fallback fill error:', error);
                }
            });

            this.showNotification(`🔄 Fallback: filled ${filledCount} fields with template data`, 'warning');
            return { success: true, filledCount, fallback: true };
        }

        /**
         * Get template key for fallback filling
         * @param {Object} field
         * @returns {string}
         */
        getTemplateKey(field) {
            const text = (field.label + ' ' + field.name + ' ' + field.placeholder).toLowerCase();
            
            if (text.includes('email')) return 'email';
            if (text.includes('phone') || text.includes('tel')) return 'phone';
            if (text.includes('first') && text.includes('name')) return 'firstName';
            if (text.includes('last') && text.includes('name')) return 'lastName';
            if (text.includes('name')) return 'name';
            if (text.includes('address')) return 'address';
            if (text.includes('city')) return 'city';
            if (text.includes('zip')) return 'zipCode';
            if (text.includes('age')) return 'age';
            if (text.includes('company')) return 'company';
            
            return 'default';
        }

        /**
         * Show user notification with different styles
         * @param {string} message
         * @param {string} type - 'success', 'error', 'warning', 'info'
         */
        showNotification(message, type = 'info') {
            // Remove existing notification
            const existing = document.getElementById('fastfill-ai-notification');
            if (existing) existing.remove();

            const notification = document.createElement('div');
            notification.id = 'fastfill-ai-notification';

            const colors = {
                success: '#4CAF50',
                error: '#f44336',
                warning: '#ff9800',
                info: '#2196F3'
            };

            notification.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                background: ${colors[type]} !important;
                color: white !important;
                padding: 16px 24px !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
                z-index: 2147483647 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                max-width: 350px !important;
                line-height: 1.4 !important;
                transform: translateX(100%) !important;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                border-left: 5px solid rgba(255,255,255,0.3) !important;
            `;

            notification.textContent = message;

            try {
                document.body.appendChild(notification);
                
                // Animate in
                setTimeout(() => {
                    notification.style.transform = 'translateX(0) !important';
                }, 10);

                // Auto remove with animation
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.style.transform = 'translateX(100%) !important';
                        setTimeout(() => {
                            if (notification.parentNode) {
                                notification.remove();
                            }
                        }, 300);
                    }
                }, type === 'error' ? 5000 : 4000);

            } catch (error) {
                console.log('FastFill AI:', message);
            }
        }
    }

    // 🎯 GLOBAL INSTANCE AND EVENT HANDLERS
    const formFiller = new GeminiFormFiller();

    /**
     * 📨 Message listener for popup communication
     */
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('🎯 FastFill AI received message:', request);

        // Validate sender
        if (!sender.id || sender.id !== chrome.runtime.id) {
            sendResponse({ success: false, message: 'Invalid sender' });
            return false;
        }

        // Handle AI form filling request
        if (request.action === 'fillFormWithAI') {
            formFiller.fillFormWithAI()
                .then(result => {
                    sendResponse(result);
                })
                .catch(error => {
                    console.error('❌ AI fill error:', error);
                    sendResponse({ 
                        success: false, 
                        message: error.message,
                        error: true 
                    });
                });
            return true; // Indicates async response
        }

        // Handle form detection request
        if (request.action === 'detectForms') {
            try {
                const fields = formFiller.detector.detectAllFields();
                sendResponse({ 
                    success: true, 
                    count: fields.length,
                    message: `Found ${fields.length} fillable fields`
                });
            } catch (error) {
                sendResponse({ 
                    success: false, 
                    message: 'Failed to detect forms: ' + error.message 
                });
            }
            return true;
        }

        // Handle API key update
        if (request.action === 'updateApiKey') {
            formFiller.apiKey = request.apiKey;
            sendResponse({ success: true, message: 'API key updated' });
            return true;
        }

        // Unknown action
        sendResponse({ success: false, message: 'Unknown action: ' + request.action });
        return false;
    });

    /**
     * 🎹 KEYBOARD SHORTCUT SUPPORT
     * Alt + Shift + F to trigger AI form filling
     */
    document.addEventListener('keydown', (event) => {
        if (event.altKey && event.shiftKey && event.key.toLowerCase() === 'f') {
            event.preventDefault();
            console.log('🎹 Keyboard shortcut triggered: AI form filling');
            formFiller.fillFormWithAI();
        }
    });

    /**
     * 🎯 CONTEXT MENU SUPPORT (if needed)
     * Can be triggered by right-click context menu
     */
    window.fastFillAI = {
        fillForm: () => formFiller.fillFormWithAI(),
        detectFields: () => formFiller.detector.detectAllFields(),
        version: '2.0.0-ai'
    };

    // Initialize
    console.log('✅ FastFill AI content script initialized successfully');
    console.log('💡 Use Alt+Shift+F to trigger AI form filling, or use the extension popup');
}

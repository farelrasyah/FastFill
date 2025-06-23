// FastFill AI Extension - Popup JavaScript
// Handles popup UI interactions and communication with content script

console.log('🤖 FastFill AI popup loaded');

/**
 * 🎛️ POPUP CONTROLLER
 * Main class for managing popup UI and interactions
 */
class FastFillAIPopup {
    constructor() {
        this.isApiKeyVisible = false;
        this.currentTab = null;
        this.lastDetectedFields = 0;
        this.templates = this.getDefaultTemplates();
        
        this.init();
    }

    /**
     * Initialize popup functionality
     */
    async init() {
        await this.loadApiKeyStatus();
        await this.getCurrentTab();
        await this.detectFormsOnLoad();
        this.bindEvents();
        this.updateUI();
        
        console.log('✅ FastFill AI popup initialized');
    }

    /**
     * 🔗 EVENT BINDINGS
     * Bind all UI event handlers
     */
    bindEvents() {
        // AI Form Fill button
        document.getElementById('aiFormFill').addEventListener('click', () => {
            this.handleAIFormFill();
        });

        // API Key management
        document.getElementById('saveApiKey').addEventListener('click', () => {
            this.saveApiKey();
        });

        document.getElementById('clearApiKey').addEventListener('click', () => {
            this.clearApiKey();
        });

        document.getElementById('toggleApiKey').addEventListener('click', () => {
            this.toggleApiKeyVisibility();
        });

        // Template filling (fallback)
        document.getElementById('templateFormFill').addEventListener('click', () => {
            this.handleTemplateFill();
        });

        // Form detection
        document.getElementById('detectFields').addEventListener('click', () => {
            this.detectForms();
        });

        // Settings and help
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.toggleApiSection();
        });

        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showHelp();
        });

        document.getElementById('aboutBtn').addEventListener('click', () => {
            this.showAbout();
        });

        // API key input enter key
        document.getElementById('apiKeyInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveApiKey();
            }
        });

        // Template selector change
        document.getElementById('templateSelect').addEventListener('change', () => {
            this.updateTemplatePreview();
        });
    }

    /**
     * 🗝️ API KEY MANAGEMENT
     * Handle Gemini API key storage and validation
     */
    async loadApiKeyStatus() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['geminiApiKey'], (result) => {
                const hasApiKey = !!result.geminiApiKey;
                
                if (hasApiKey) {
                    this.updateApiKeyStatus('ready', '✅ API Key Configured');
                    document.getElementById('aiFormFill').disabled = false;
                    document.getElementById('apiKeyInput').value = '••••••••••••••••';
                } else {
                    this.updateApiKeyStatus('error', '⚠️ API Key Required');
                    document.getElementById('aiFormFill').disabled = true;
                }
                
                resolve(hasApiKey);
            });
        });
    }

    async saveApiKey() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const apiKey = apiKeyInput.value.trim();

        if (!apiKey || apiKey === '••••••••••••••••') {
            this.showMessage('Please enter a valid API key', 'error');
            return;
        }

        // Basic validation
        if (!apiKey.startsWith('AIza') || apiKey.length < 35) {
            this.showMessage('Invalid API key format', 'error');
            return;
        }

        // Test API key by making a simple request
        this.showLoading(true);
        
        try {
            const testResult = await this.testApiKey(apiKey);
            
            if (testResult.success) {
                // Save to storage
                chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
                    this.updateApiKeyStatus('ready', '✅ API Key Saved Successfully');
                    document.getElementById('aiFormFill').disabled = false;
                    apiKeyInput.value = '••••••••••••••••';
                    this.showMessage('API key saved and validated!', 'success');
                    
                    // Send to content script
                    this.sendMessageToTab({
                        action: 'updateApiKey',
                        apiKey: apiKey
                    });
                });
            } else {
                this.showMessage('API key validation failed: ' + testResult.error, 'error');
            }
        } catch (error) {
            this.showMessage('Failed to validate API key: ' + error.message, 'error');
        }
        
        this.showLoading(false);
    }

    async testApiKey(apiKey) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: 'Hello' }] }],
                    generationConfig: { maxOutputTokens: 10 }
                })
            });

            if (response.ok) {
                return { success: true };
            } else {
                const errorData = await response.json();
                return { 
                    success: false, 
                    error: errorData.error?.message || `HTTP ${response.status}` 
                };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    clearApiKey() {
        chrome.storage.sync.remove(['geminiApiKey'], () => {
            this.updateApiKeyStatus('error', '⚠️ API Key Required');
            document.getElementById('aiFormFill').disabled = true;
            document.getElementById('apiKeyInput').value = '';
            this.showMessage('API key cleared', 'info');
        });
    }

    toggleApiKeyVisibility() {
        const input = document.getElementById('apiKeyInput');
        const button = document.getElementById('toggleApiKey');
        
        if (this.isApiKeyVisible) {
            input.type = 'password';
            button.textContent = '👁️';
            this.isApiKeyVisible = false;
        } else {
            input.type = 'text';
            button.textContent = '🙈';
            this.isApiKeyVisible = true;
        }
    }

    updateApiKeyStatus(status, message) {
        const statusElement = document.getElementById('aiStatus');
        const indicatorElement = document.getElementById('statusIndicator');
        const textElement = document.getElementById('statusText');

        statusElement.className = `ai-status ${status}`;
        textElement.textContent = message;

        switch (status) {
            case 'ready':
                indicatorElement.textContent = '✅';
                break;
            case 'error':
                indicatorElement.textContent = '❌';
                break;
            default:
                indicatorElement.textContent = '⚠️';
        }
    }

    /**
     * 🤖 AI FORM FILLING
     * Handle AI-powered form filling requests
     */
    async handleAIFormFill() {
        try {
            this.showLoading(true);
            this.setButtonLoading('aiFormFill', true);

            const response = await this.sendMessageToTab({
                action: 'fillFormWithAI'
            });

            if (response && response.success) {
                this.showMessage(
                    `🎉 AI successfully filled ${response.filledCount}/${response.totalFields} fields!`,
                    'success'
                );
                
                // Update stats
                document.getElementById('lastFilled').textContent = response.filledCount;
                
                if (response.fallback) {
                    this.showMessage('ℹ️ Used fallback template due to AI limitations', 'info');
                }
            } else {
                throw new Error(response?.message || 'AI form filling failed');
            }

        } catch (error) {
            console.error('❌ AI form fill error:', error);
            this.showMessage(`❌ AI filling failed: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
            this.setButtonLoading('aiFormFill', false);
        }
    }

    /**
     * 📋 TEMPLATE FILLING (FALLBACK)
     * Handle traditional template-based form filling
     */
    async handleTemplateFill() {
        const templateSelect = document.getElementById('templateSelect');
        const selectedTemplate = templateSelect.value;

        if (!selectedTemplate) {
            this.showMessage('Please select a template first', 'warning');
            return;
        }

        try {
            this.setButtonLoading('templateFormFill', true);

            const templateData = this.templates[selectedTemplate];
            const response = await this.sendMessageToTab({
                action: 'fillForm',
                templateData: templateData
            });

            if (response && response.success) {
                this.showMessage(`📋 Template filled successfully!`, 'success');
            } else {
                throw new Error(response?.message || 'Template filling failed');
            }

        } catch (error) {
            console.error('❌ Template fill error:', error);
            this.showMessage(`❌ Template filling failed: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading('templateFormFill', false);
        }
    }

    /**
     * 🔍 FORM DETECTION
     * Detect forms on current page
     */
    async detectForms() {
        try {
            this.setButtonLoading('detectFields', true);

            const response = await this.sendMessageToTab({
                action: 'detectForms'
            });

            if (response && response.success) {
                this.lastDetectedFields = response.count;
                document.getElementById('detectedFields').textContent = response.count;
                this.showMessage(`🔍 Found ${response.count} fillable fields`, 'info');
            } else {
                throw new Error(response?.message || 'Form detection failed');
            }

        } catch (error) {
            console.error('❌ Form detection error:', error);
            this.showMessage(`❌ Detection failed: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading('detectFields', false);
        }
    }

    async detectFormsOnLoad() {
        // Auto-detect forms when popup opens
        setTimeout(() => {
            this.detectForms();
        }, 500);
    }

    /**
     * 📨 COMMUNICATION
     * Handle communication with content script
     */
    async getCurrentTab() {
        return new Promise((resolve) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                this.currentTab = tabs[0];
                resolve(this.currentTab);
            });
        });
    }

    async sendMessageToTab(message) {
        if (!this.currentTab) {
            await this.getCurrentTab();
        }

        return new Promise((resolve) => {
            chrome.tabs.sendMessage(this.currentTab.id, message, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Message sending error:', chrome.runtime.lastError);
                    resolve({ success: false, message: chrome.runtime.lastError.message });
                } else {
                    resolve(response);
                }
            });
        });
    }

    /**
     * 🎨 UI MANAGEMENT
     * Handle UI updates and interactions
     */
    updateUI() {
        // Update version display
        document.querySelector('.version').textContent = 'v2.0.0-ai';
        
        // Set initial stats
        document.getElementById('detectedFields').textContent = '-';
        document.getElementById('lastFilled').textContent = '-';
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = show ? 'flex' : 'none';
    }

    setButtonLoading(buttonId, loading) {
        const button = document.getElementById(buttonId);
        const text = button.querySelector('.btn-text');
        const loader = button.querySelector('.btn-loader');

        if (loading) {
            button.disabled = true;
            if (text) text.style.opacity = '0.5';
            if (loader) loader.style.display = 'inline';
        } else {
            button.disabled = false;
            if (text) text.style.opacity = '1';
            if (loader) loader.style.display = 'none';
        }
    }

    showMessage(message, type = 'info') {
        // Remove existing message
        const existing = document.querySelector('.message');
        if (existing) existing.remove();

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}-message`;
        messageEl.textContent = message;

        // Insert after first section
        const firstSection = document.querySelector('.section');
        firstSection.insertAdjacentElement('afterend', messageEl);

        // Auto remove after delay
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, type === 'error' ? 6000 : 4000);
    }

    toggleApiSection() {
        const apiSection = document.getElementById('apiSection');
        const isHidden = apiSection.style.display === 'none';
        
        apiSection.style.display = isHidden ? 'block' : 'none';
        document.getElementById('settingsBtn').textContent = isHidden ? '⚙️' : '❌';
    }

    updateTemplatePreview() {
        // This could show a preview of selected template data
        const templateSelect = document.getElementById('templateSelect');
        const selectedTemplate = templateSelect.value;
        
        if (selectedTemplate && this.templates[selectedTemplate]) {
            console.log('Template selected:', selectedTemplate);
        }
    }

    /**
     * 📄 TEMPLATES
     * Default template data for fallback filling
     */
    getDefaultTemplates() {
        return {
            'qa-profile': {
                name: 'QA Tester Profile',
                data: {
                    name: 'Alex QA Tester',
                    firstName: 'Alex',
                    lastName: 'Tester',
                    email: 'alex.qa@testmail.com',
                    phone: '555-TEST-001',
                    address: '123 QA Testing Street',
                    city: 'Test City',
                    zipCode: '12345',
                    age: '28',
                    company: 'QA Testing Corp',
                    jobTitle: 'Senior QA Engineer',
                    website: 'https://qa-testing.example.com',
                    description: 'Experienced QA professional specializing in automated testing and quality assurance processes.',
                    default: 'QA Test Data'
                }
            },
            'user-profile': {
                name: 'Standard User Profile',
                data: {
                    name: 'John Smith',
                    firstName: 'John',
                    lastName: 'Smith',
                    email: 'john.smith@example.com',
                    phone: '555-123-4567',
                    address: '456 Main Avenue',
                    city: 'New York',
                    zipCode: '10001',
                    age: '32',
                    company: 'Tech Solutions Inc',
                    jobTitle: 'Software Developer',
                    website: 'https://johnsmith.dev',
                    description: 'Passionate software developer with experience in full-stack development.',
                    default: 'Standard User Data'
                }
            },
            'dummy-profile': {
                name: 'Dummy Profile',
                data: {
                    name: 'Jane Dummy',
                    firstName: 'Jane',
                    lastName: 'Dummy',
                    email: 'jane.dummy@placeholder.com',
                    phone: '555-DUMMY-99',
                    address: '789 Placeholder Road',
                    city: 'Dummy City',
                    zipCode: '99999',
                    age: '25',
                    company: 'Placeholder LLC',
                    jobTitle: 'Dummy Position',
                    website: 'https://placeholder.dummy',
                    description: 'This is dummy placeholder text for testing form filling functionality.',
                    default: 'Dummy Data'
                }
            }
        };
    }

    /**
     * 📖 HELP & ABOUT
     * Show help and about information
     */
    showHelp() {
        const helpText = `
🤖 FastFill AI Help

MAIN FEATURES:
• AI-powered form filling using Google Gemini
• Intelligent field detection and mapping
• Template-based fallback filling
• Keyboard shortcut: Alt+Shift+F

SETUP:
1. Get free Gemini API key from Google AI Studio
2. Enter API key in settings (⚙️ button)
3. Click "Fill Form with AI" on any page with forms

TIPS:
• Works best on standard web forms
• AI analyzes field labels and context
• Falls back to templates if AI fails
• Data is not stored or shared

SHORTCUTS:
• Alt+Shift+F: Fill form with AI
• Settings button: Toggle API configuration
        `.trim();

        alert(helpText);
    }

    showAbout() {
        const aboutText = `
🤖 FastFill AI v2.0.0

An intelligent Chrome extension that uses Google Gemini Pro AI to automatically fill web forms with realistic, contextually appropriate data.

Perfect for:
• QA Testing & Development
• Form Testing & Validation
• Survey Automation
• UI/UX Testing

Powered by Google Gemini AI
Created for developers and testers

Privacy: Your data stays local. API key stored securely in browser.
        `.trim();

        alert(aboutText);
    }
}

// 🚀 INITIALIZE POPUP
document.addEventListener('DOMContentLoaded', () => {
    new FastFillAIPopup();
});

// 🔧 ERROR HANDLING
window.addEventListener('error', (error) => {
    console.error('FastFill AI Popup Error:', error);
});

console.log('✅ FastFill AI popup script loaded');

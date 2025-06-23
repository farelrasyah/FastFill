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
    }    /**
     * Initialize popup functionality
     */
    async init() {
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

        // Form detection
        document.getElementById('detectFields').addEventListener('click', () => {
            this.detectForms();
        });

        // Help and about
        document.getElementById('aboutBtn').addEventListener('click', () => {
            this.showAbout();
        });

        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showHelp();
        });
    }    /**
     * 🎨 UI MANAGEMENT
     * Handle UI updates and interactions
     */
    updateUI() {
        // Update version display
        document.querySelector('.version').textContent = 'v2.0.0-ai';
        
        // Set initial stats
        document.getElementById('detectedFields').textContent = '-';
        document.getElementById('lastFilled').textContent = '-';
        
        // Update AI status to ready
        this.updateAIStatus('ready', '✅ Ready to Fill Forms');
    }

    updateAIStatus(status, message) {
        const statusElement = document.getElementById('aiStatus');
        const indicatorElement = document.getElementById('statusIndicator');
        const textElement = document.getElementById('statusText');

        statusElement.className = `ai-status ${status}`;
        textElement.textContent = message;

        switch (status) {
            case 'ready':
                indicatorElement.textContent = '✅';
                break;
            case 'processing':
                indicatorElement.textContent = '�';
                break;
            case 'error':
                indicatorElement.textContent = '❌';
                break;
            default:
                indicatorElement.textContent = '⚠️';
        }
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
    }    showMessage(message, type = 'info') {
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

    /**
     * 🤖 AI FORM FILLING
     * Handle AI-powered form filling requests
     */
    async handleAIFormFill() {
        try {
            this.showLoading(true);
            this.setButtonLoading('aiFormFill', true);
            this.updateAIStatus('processing', '🔄 Processing...');

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
                this.updateAIStatus('ready', '✅ Form Filled Successfully');
                
                if (response.fallback) {
                    this.showMessage('ℹ️ Used fallback template due to AI limitations', 'info');
                }
            } else {
                throw new Error(response?.message || 'AI form filling failed');
            }

        } catch (error) {
            console.error('❌ AI form fill error:', error);
            this.showMessage(`❌ AI filling failed: ${error.message}`, 'error');
            this.updateAIStatus('error', '❌ Fill Failed');
        } finally {
            this.showLoading(false);
            this.setButtonLoading('aiFormFill', false);
            
            // Reset status after delay
            setTimeout(() => {
                this.updateAIStatus('ready', '✅ Ready to Fill Forms');
            }, 3000);
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

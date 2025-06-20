// Background Script - FastFill Extension
// Service Worker untuk Manifest V3
// Menangani komunikasi antar komponen dan storage management

console.log('FastFill background script loaded');

/**
 * Default template data untuk form filling
 */
const DEFAULT_TEMPLATES = {
    qa_profile: {
        name: 'QA Testing Profile',
        data: {
            name: 'John Doe QA',
            firstName: 'John',
            lastName: 'Doe',
            email: 'qa.tester@example.com',
            phone: '081234567890',
            address: 'Jl. Testing QA No. 123',
            city: 'Jakarta',
            zipCode: '12345',
            age: '25',
            birthDate: '1999-01-15',
            company: 'QA Testing Corp',
            jobTitle: 'Quality Assurance Engineer',
            website: 'https://qa-testing.com',
            description: 'Experienced QA engineer specializing in automated testing and quality assurance processes.',
            gender: 'male',
            country: 'Indonesia',
            password: 'TestingQA123!',
            default: 'QA Test Data'
        }
    },
    user_profile: {
        name: 'Regular User Profile',
        data: {
            name: 'Jane Smith',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@email.com',
            phone: '081987654321',
            address: 'Jl. User Friendly No. 456',
            city: 'Bandung',
            zipCode: '54321',
            age: '28',
            birthDate: '1996-05-20',
            company: 'Tech Solutions Inc',
            jobTitle: 'Software Developer',
            website: 'https://janesmith.dev',
            description: 'Passionate software developer with expertise in web technologies and user experience design.',
            gender: 'female',
            country: 'Indonesia',
            password: 'UserPass456!',
            default: 'User Test Data'
        }
    },
    dummy_profile: {
        name: 'Dummy Test Profile',
        data: {
            name: 'Test Dummy',
            firstName: 'Test',
            lastName: 'Dummy',
            email: 'dummy.test@placeholder.com',
            phone: '08111111111',
            address: 'Jl. Dummy Test No. 999',
            city: 'Surabaya',
            zipCode: '99999',
            age: '30',
            birthDate: '1994-12-31',
            company: 'Dummy Corp',
            jobTitle: 'Test Specialist',
            website: 'https://dummy-test.com',
            description: 'This is a dummy profile used for testing purposes only. All data is fictional.',
            gender: 'other',
            country: 'Indonesia',
            password: 'DummyTest789!',
            default: 'Dummy Data'
        }
    }
};

/**
 * Installation handler - Setup default templates
 */
chrome.runtime.onInstalled.addListener((details) => {
    console.log('FastFill extension installed/updated:', details);
    
    if (details.reason === 'install') {
        // Set default templates on first install
        setupDefaultTemplates();
        console.log('Default templates initialized');
    }
});

/**
 * Setup default templates dalam storage
 */
async function setupDefaultTemplates() {
    try {
        await chrome.storage.local.set({
            templates: DEFAULT_TEMPLATES,
            selectedTemplate: 'qa_profile',
            settings: {
                autoDetect: true,
                showNotifications: true,
                fillMode: 'smart' // smart, aggressive, conservative
            }
        });
        console.log('Default templates saved to storage');
    } catch (error) {
        console.error('Error setting up default templates:', error);
    }
}

/**
 * Get templates from storage
 * @returns {Promise<Object>} Templates object
 */
async function getTemplates() {
    try {
        const result = await chrome.storage.local.get(['templates']);
        return result.templates || DEFAULT_TEMPLATES;
    } catch (error) {
        console.error('Error getting templates:', error);
        return DEFAULT_TEMPLATES;
    }
}

/**
 * Save template to storage
 * @param {string} templateId - Template ID
 * @param {Object} templateData - Template data
 */
async function saveTemplate(templateId, templateData) {
    try {
        const templates = await getTemplates();
        templates[templateId] = templateData;
        await chrome.storage.local.set({ templates });
        console.log('Template saved:', templateId);
    } catch (error) {
        console.error('Error saving template:', error);
        throw error;
    }
}

/**
 * Delete template from storage
 * @param {string} templateId - Template ID to delete
 */
async function deleteTemplate(templateId) {
    try {
        const templates = await getTemplates();
        delete templates[templateId];
        await chrome.storage.local.set({ templates });
        console.log('Template deleted:', templateId);
    } catch (error) {
        console.error('Error deleting template:', error);
        throw error;
    }
}

/**
 * Get current settings
 * @returns {Promise<Object>} Settings object
 */
async function getSettings() {
    try {
        const result = await chrome.storage.local.get(['settings']);
        return result.settings || {
            autoDetect: true,
            showNotifications: true,
            fillMode: 'smart'
        };
    } catch (error) {
        console.error('Error getting settings:', error);
        return {
            autoDetect: true,
            showNotifications: true,
            fillMode: 'smart'
        };
    }
}

/**
 * Update settings
 * @param {Object} newSettings - New settings to save
 */
async function updateSettings(newSettings) {
    try {
        const currentSettings = await getSettings();
        const updatedSettings = { ...currentSettings, ...newSettings };
        await chrome.storage.local.set({ settings: updatedSettings });
        console.log('Settings updated:', updatedSettings);
    } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
}

/**
 * Message listener untuk komunikasi dengan content script dan popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request);
    
    // Handle different message types
    switch (request.action) {
        case 'getTemplates':
            getTemplates()
                .then(templates => sendResponse({ success: true, templates }))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true; // Indicates async response
            
        case 'saveTemplate':
            saveTemplate(request.templateId, request.templateData)
                .then(() => sendResponse({ success: true }))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true;
            
        case 'deleteTemplate':
            deleteTemplate(request.templateId)
                .then(() => sendResponse({ success: true }))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true;
            
        case 'getSettings':
            getSettings()
                .then(settings => sendResponse({ success: true, settings }))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true;
            
        case 'updateSettings':
            updateSettings(request.settings)
                .then(() => sendResponse({ success: true }))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true;
            
        case 'fillFormOnCurrentTab':
            fillFormOnCurrentTab(request.templateData)
                .then(result => sendResponse(result))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true;
            
        default:
            console.warn('Unknown action:', request.action);
            sendResponse({ success: false, error: 'Unknown action' });
    }
});

/**
 * Fill form pada tab yang aktif
 * @param {Object} templateData - Template data untuk filling
 */
async function fillFormOnCurrentTab(templateData) {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab) {
            throw new Error('No active tab found');
        }
        
        // Inject content script jika belum ada
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });
        } catch (error) {
            // Content script mungkin sudah ada, ignore error
            console.log('Content script might already be injected');
        }
        
        // Send message ke content script
        const response = await chrome.tabs.sendMessage(tab.id, {
            action: 'fillForm',
            templateData: templateData
        });
        
        return response;
    } catch (error) {
        console.error('Error filling form on current tab:', error);
        throw error;
    }
}

/**
 * Check if content script is loaded on tab
 * @param {number} tabId - Tab ID
 * @returns {Promise<boolean>} True if content script is loaded
 */
async function isContentScriptLoaded(tabId) {
    try {
        const response = await chrome.tabs.sendMessage(tabId, { action: 'ping' });
        return response && response.success;
    } catch (error) {
        return false;
    }
}

/**
 * Action button click handler
 */
chrome.action.onClicked.addListener(async (tab) => {
    console.log('Extension icon clicked on tab:', tab.url);
    // Popup akan handle ini, tapi kita bisa log untuk debugging
});

/**
 * Tab update listener untuk auto-detect forms (jika enabled)
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const settings = await getSettings();
        
        if (settings.autoDetect) {
            // Auto inject content script pada halaman baru
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content.js']
                });
                console.log('Content script auto-injected on:', tab.url);
            } catch (error) {
                // Ignore errors (seperti chrome:// pages)
                console.log('Could not inject content script on:', tab.url);
            }
        }
    }
});

console.log('FastFill background script initialized');

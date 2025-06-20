// Popup Script - FastFill Extension
// Menangani UI popup dan komunikasi dengan background script

console.log('FastFill popup script loaded');

// DOM Elements
let templateSelect, fillFormBtn, detectFormsBtn, statusMessage, formStats;
let templatePreview, refreshTemplatesBtn;
let autoDetectEnabled, showNotifications, fillMode;
let addTemplateBtn, editTemplateBtn, deleteTemplateBtn, exportTemplatesBtn, importTemplatesBtn;
let templateModal, modalClose, saveTemplateBtn, cancelTemplateBtn;
let templateName, templateData;
let fileInput;

// Global state
let currentTemplates = {};
let currentSettings = {};
let selectedTemplateId = '';

/**
 * Initialize popup when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        initializeElements();
        setupEventListeners();
        await loadTemplates();
        await loadSettings();
        updateUI();
        console.log('Popup initialized successfully');
    } catch (error) {
        console.error('Error initializing popup:', error);
        showStatus('Error initializing popup', 'error');
    }
});

/**
 * Initialize DOM element references
 */
function initializeElements() {
    // Main elements
    templateSelect = document.getElementById('templateSelect');
    fillFormBtn = document.getElementById('fillFormBtn');
    detectFormsBtn = document.getElementById('detectFormsBtn');
    statusMessage = document.getElementById('statusMessage');
    formStats = document.getElementById('formStats');
    templatePreview = document.getElementById('templatePreview');
    refreshTemplatesBtn = document.getElementById('refreshTemplates');
    
    // Settings elements
    autoDetectEnabled = document.getElementById('autoDetectEnabled');
    showNotifications = document.getElementById('showNotifications');
    fillMode = document.getElementById('fillMode');
    
    // Template management elements
    addTemplateBtn = document.getElementById('addTemplateBtn');
    editTemplateBtn = document.getElementById('editTemplateBtn');
    deleteTemplateBtn = document.getElementById('deleteTemplateBtn');
    exportTemplatesBtn = document.getElementById('exportTemplatesBtn');
    importTemplatesBtn = document.getElementById('importTemplatesBtn');
    
    // Modal elements
    templateModal = document.getElementById('templateModal');
    modalClose = document.getElementById('modalClose');
    saveTemplateBtn = document.getElementById('saveTemplateBtn');
    cancelTemplateBtn = document.getElementById('cancelTemplateBtn');
    templateName = document.getElementById('templateName');
    templateData = document.getElementById('templateData');
    
    // File input
    fileInput = document.getElementById('fileInput');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Main actions
    templateSelect.addEventListener('change', onTemplateSelectionChange);
    fillFormBtn.addEventListener('click', onFillFormClick);
    detectFormsBtn.addEventListener('click', onDetectFormsClick);
    refreshTemplatesBtn.addEventListener('click', onRefreshTemplatesClick);
    
    // Settings
    autoDetectEnabled.addEventListener('change', onSettingsChange);
    showNotifications.addEventListener('change', onSettingsChange);
    fillMode.addEventListener('change', onSettingsChange);
    
    // Template management
    addTemplateBtn.addEventListener('click', onAddTemplateClick);
    editTemplateBtn.addEventListener('click', onEditTemplateClick);
    deleteTemplateBtn.addEventListener('click', onDeleteTemplateClick);
    exportTemplatesBtn.addEventListener('click', onExportTemplatesClick);
    importTemplatesBtn.addEventListener('click', onImportTemplatesClick);
    
    // Modal
    modalClose.addEventListener('click', closeModal);
    saveTemplateBtn.addEventListener('click', onSaveTemplateClick);
    cancelTemplateBtn.addEventListener('click', closeModal);
    
    // File input
    fileInput.addEventListener('change', onFileInputChange);
    
    // Collapsible sections
    setupCollapsibleSections();
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === templateModal) {
            closeModal();
        }
    });
}

/**
 * Setup collapsible sections
 */
function setupCollapsibleSections() {
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    
    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('.toggle-icon');
            
            if (content.style.display === 'block') {
                content.style.display = 'none';
                icon.textContent = '▼';
            } else {
                content.style.display = 'block';
                icon.textContent = '▲';
            }
        });
    });
}

/**
 * Load templates from background script
 */
async function loadTemplates() {
    try {
        const response = await sendMessageToBackground({ action: 'getTemplates' });
        
        if (response.success) {
            currentTemplates = response.templates;
            populateTemplateSelect();
            console.log('Templates loaded:', currentTemplates);
        } else {
            throw new Error(response.error || 'Failed to load templates');
        }
    } catch (error) {
        console.error('Error loading templates:', error);
        showStatus('Error loading templates', 'error');
    }
}

/**
 * Load settings from background script
 */
async function loadSettings() {
    try {
        const response = await sendMessageToBackground({ action: 'getSettings' });
        
        if (response.success) {
            currentSettings = response.settings;
            applySettings();
            console.log('Settings loaded:', currentSettings);
        } else {
            throw new Error(response.error || 'Failed to load settings');
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        showStatus('Error loading settings', 'error');
    }
}

/**
 * Populate template select dropdown
 */
function populateTemplateSelect() {
    templateSelect.innerHTML = '<option value="">Select a template...</option>';
    
    Object.keys(currentTemplates).forEach(templateId => {
        const template = currentTemplates[templateId];
        const option = document.createElement('option');
        option.value = templateId;
        option.textContent = template.name || templateId;
        templateSelect.appendChild(option);
    });
}

/**
 * Apply loaded settings to UI
 */
function applySettings() {
    autoDetectEnabled.checked = currentSettings.autoDetect || false;
    showNotifications.checked = currentSettings.showNotifications !== false;
    fillMode.value = currentSettings.fillMode || 'smart';
}

/**
 * Update UI state
 */
function updateUI() {
    const hasTemplate = selectedTemplateId && currentTemplates[selectedTemplateId];
    
    fillFormBtn.disabled = !hasTemplate;
    editTemplateBtn.disabled = !hasTemplate;
    deleteTemplateBtn.disabled = !hasTemplate || Object.keys(currentTemplates).length <= 1;
    
    updateTemplatePreview();
}

/**
 * Update template preview
 */
function updateTemplatePreview() {
    if (!selectedTemplateId || !currentTemplates[selectedTemplateId]) {
        templatePreview.innerHTML = '<p class="preview-placeholder">Select a template to see preview</p>';
        return;
    }
    
    const template = currentTemplates[selectedTemplateId];
    const data = template.data || {};
    
    let previewHTML = `<div class="template-info">
        <h4>${template.name}</h4>
        <div class="template-fields">`;
    
    const importantFields = ['name', 'email', 'phone', 'address', 'company'];
    
    importantFields.forEach(field => {
        if (data[field]) {
            previewHTML += `<div class="field-preview">
                <span class="field-label">${field}:</span>
                <span class="field-value">${data[field]}</span>
            </div>`;
        }
    });
    
    previewHTML += `</div></div>`;
    templatePreview.innerHTML = previewHTML;
}

/**
 * Event handlers
 */
async function onTemplateSelectionChange() {
    selectedTemplateId = templateSelect.value;
    updateUI();
}

async function onFillFormClick() {
    if (!selectedTemplateId || !currentTemplates[selectedTemplateId]) {
        showStatus('Please select a template first', 'error');
        return;
    }
    
    try {
        showStatus('Filling form...', 'loading');
        fillFormBtn.disabled = true;
        
        const response = await sendMessageToBackground({
            action: 'fillFormOnCurrentTab',
            templateData: currentTemplates[selectedTemplateId]
        });
        
        if (response.success) {
            showStatus('Form filled successfully!', 'success');
        } else {
            throw new Error(response.error || 'Failed to fill form');
        }
    } catch (error) {
        console.error('Error filling form:', error);
        showStatus('Error filling form: ' + error.message, 'error');
    } finally {
        fillFormBtn.disabled = false;
    }
}

async function onDetectFormsClick() {
    try {
        showStatus('Detecting forms...', 'loading');
        detectFormsBtn.disabled = true;
        
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'detectForms' });
        
        if (response.success) {
            const count = response.count || 0;
            showStatus(`Found ${count} form elements`, 'success');
            formStats.innerHTML = `<div class="stats-info">📊 ${count} form fields detected</div>`;
        } else {
            throw new Error(response.message || 'Failed to detect forms');
        }
    } catch (error) {
        console.error('Error detecting forms:', error);
        showStatus('Error detecting forms. Make sure you\'re on a valid webpage.', 'error');
        formStats.innerHTML = '';
    } finally {
        detectFormsBtn.disabled = false;
    }
}

async function onRefreshTemplatesClick() {
    await loadTemplates();
    showStatus('Templates refreshed', 'success');
}

async function onSettingsChange() {
    const newSettings = {
        autoDetect: autoDetectEnabled.checked,
        showNotifications: showNotifications.checked,
        fillMode: fillMode.value
    };
    
    try {
        const response = await sendMessageToBackground({
            action: 'updateSettings',
            settings: newSettings
        });
        
        if (response.success) {
            currentSettings = { ...currentSettings, ...newSettings };
            showStatus('Settings saved', 'success');
        } else {
            throw new Error(response.error || 'Failed to save settings');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        showStatus('Error saving settings', 'error');
    }
}

function onAddTemplateClick() {
    openModal('Add New Template', '', {});
}

function onEditTemplateClick() {
    if (!selectedTemplateId || !currentTemplates[selectedTemplateId]) {
        showStatus('Please select a template to edit', 'error');
        return;
    }
    
    const template = currentTemplates[selectedTemplateId];
    openModal('Edit Template', template.name, template.data);
}

async function onDeleteTemplateClick() {
    if (!selectedTemplateId || !currentTemplates[selectedTemplateId]) {
        showStatus('Please select a template to delete', 'error');
        return;
    }
    
    if (Object.keys(currentTemplates).length <= 1) {
        showStatus('Cannot delete the last template', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this template?')) {
        return;
    }
    
    try {
        const response = await sendMessageToBackground({
            action: 'deleteTemplate',
            templateId: selectedTemplateId
        });
        
        if (response.success) {
            await loadTemplates();
            selectedTemplateId = '';
            templateSelect.value = '';
            updateUI();
            showStatus('Template deleted successfully', 'success');
        } else {
            throw new Error(response.error || 'Failed to delete template');
        }
    } catch (error) {
        console.error('Error deleting template:', error);
        showStatus('Error deleting template', 'error');
    }
}

function onExportTemplatesClick() {
    try {
        const exportData = {
            templates: currentTemplates,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `fastfill-templates-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        showStatus('Templates exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting templates:', error);
        showStatus('Error exporting templates', 'error');
    }
}

function onImportTemplatesClick() {
    fileInput.click();
}

async function onFileInputChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        const text = await file.text();
        const importData = JSON.parse(text);
        
        if (!importData.templates) {
            throw new Error('Invalid template file format');
        }
        
        // Merge with existing templates
        const mergedTemplates = { ...currentTemplates, ...importData.templates };
        
        // Save merged templates
        await chrome.storage.local.set({ templates: mergedTemplates });
        await loadTemplates();
        
        showStatus('Templates imported successfully', 'success');
    } catch (error) {
        console.error('Error importing templates:', error);
        showStatus('Error importing templates: ' + error.message, 'error');
    }
    
    // Clear file input
    fileInput.value = '';
}

async function onSaveTemplateClick() {
    const name = templateName.value.trim();
    const dataText = templateData.value.trim();
    
    if (!name) {
        showStatus('Please enter a template name', 'error');
        return;
    }
    
    let parsedData;
    try {
        parsedData = JSON.parse(dataText);
    } catch (error) {
        showStatus('Invalid JSON format in template data', 'error');
        return;
    }
    
    const templateId = name.toLowerCase().replace(/\s+/g, '_');
    const templateObj = {
        name: name,
        data: parsedData
    };
    
    try {
        const response = await sendMessageToBackground({
            action: 'saveTemplate',
            templateId: templateId,
            templateData: templateObj
        });
        
        if (response.success) {
            await loadTemplates();
            selectedTemplateId = templateId;
            templateSelect.value = templateId;
            updateUI();
            closeModal();
            showStatus('Template saved successfully', 'success');
        } else {
            throw new Error(response.error || 'Failed to save template');
        }
    } catch (error) {
        console.error('Error saving template:', error);
        showStatus('Error saving template', 'error');
    }
}

/**
 * Modal functions
 */
function openModal(title, name = '', data = {}) {
    document.getElementById('modalTitle').textContent = title;
    templateName.value = name;
    templateData.value = JSON.stringify(data, null, 2);
    templateModal.style.display = 'block';
}

function closeModal() {
    templateModal.style.display = 'none';
    templateName.value = '';
    templateData.value = '';
}

/**
 * Utility functions
 */
function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = 'status-message';
        }, 3000);
    }
}

function sendMessageToBackground(message) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, resolve);
    });
}

console.log('FastFill popup script initialized');

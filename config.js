// FastFill AI - Configuration Manager
// Handles API key management and environment configuration

/**
 * Configuration Manager Class
 * Manages API keys and environment settings securely
 */
class ConfigManager {
    constructor() {
        this.config = {
            // Default configuration
            apiKey: null,
            apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            retryCount: 3,
            timeout: 30000,
            debugMode: false
        };
        
        this.init();
    }

    /**
     * Initialize configuration
     * Loads API key from multiple sources
     */
    init() {
        // Try to load from embedded configuration
        this.loadEmbeddedConfig();
        
        // Fallback to environment or user-provided key
        this.loadFromStorage();
    }

    /**
     * Load embedded configuration (for production)
     * API key is embedded in the extension for seamless user experience
     */
    loadEmbeddedConfig() {
        // Production API key - embedded in extension
        // This will be replaced with actual key during build process
        const EMBEDDED_API_KEY = 'REPLACE_WITH_ACTUAL_API_KEY';
        
        if (EMBEDDED_API_KEY && EMBEDDED_API_KEY !== 'REPLACE_WITH_ACTUAL_API_KEY') {
            this.config.apiKey = EMBEDDED_API_KEY;
            console.log('✅ Using embedded API key');
        }
    }

    /**
     * Load configuration from Chrome storage (fallback)
     */
    async loadFromStorage() {
        return new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.sync.get(['geminiApiKey'], (result) => {
                    if (result.geminiApiKey && !this.config.apiKey) {
                        this.config.apiKey = result.geminiApiKey;
                        console.log('✅ Loaded API key from storage');
                    }
                    resolve(this.config.apiKey);
                });
            } else {
                resolve(this.config.apiKey);
            }
        });
    }

    /**
     * Get API key with fallback mechanism
     * @returns {string} API key
     */
    getApiKey() {
        return this.config.apiKey;
    }

    /**
     * Check if API key is available
     * @returns {boolean} True if API key is configured
     */
    hasApiKey() {
        return !!this.config.apiKey && this.config.apiKey !== 'REPLACE_WITH_ACTUAL_API_KEY';
    }

    /**
     * Get full configuration object
     * @returns {Object} Configuration object
     */
    getConfig() {
        return { ...this.config };
    }

    /**
     * Save API key to storage (for user-provided keys)
     * @param {string} apiKey - API key to save
     */
    async saveApiKey(apiKey) {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            return new Promise((resolve) => {
                chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
                    this.config.apiKey = apiKey;
                    console.log('✅ API key saved to storage');
                    resolve(true);
                });
            });
        }
    }

    /**
     * Get API endpoint URL
     * @returns {string} API endpoint
     */
    getApiEndpoint() {
        return this.config.apiEndpoint;
    }

    /**
     * Get request configuration
     * @returns {Object} Request config object
     */
    getRequestConfig() {
        return {
            timeout: this.config.timeout,
            retryCount: this.config.retryCount,
            debugMode: this.config.debugMode
        };
    }
}

// Create global instance
const configManager = new ConfigManager();

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.FastFillConfig = configManager;
}

// For Node.js/module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = configManager;
}

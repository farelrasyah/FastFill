// FastFill AI Extension - Production Build Script
// Replaces API key placeholder with actual key for production

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    apiKeyPlaceholder: 'REPLACE_WITH_ACTUAL_API_KEY',
    actualApiKey: 'AIzaSyARIKwnlrUeIxpGvTS5VhRxuR2HhWQCxoY',
    configFile: 'config.js',
    manifestFile: 'manifest.json'
};

console.log('🔨 FastFill AI Extension - Production Build');
console.log('==========================================');

/**
 * Main build function
 */
function buildProduction() {
    try {
        // Step 1: Validate files exist
        validateFiles();
        
        // Step 2: Create backup
        createBackup();
        
        // Step 3: Replace API key
        replaceApiKey();
        
        // Step 4: Update version info
        updateVersionInfo();
        
        console.log('✅ Production build completed successfully!');
        console.log('📦 Extension ready for distribution');
        console.log('');
        console.log('⚠️  IMPORTANT REMINDERS:');
        console.log('   1. Do NOT commit config.js after running this script');
        console.log('   2. Run "npm run build:clean" before committing to Git');
        console.log('   3. Test the extension before distributing');
        console.log('   4. Remove .backup files before packaging');
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

/**
 * Validate that required files exist
 */
function validateFiles() {
    console.log('📁 Validating required files...');
    
    const requiredFiles = [
        CONFIG.configFile,
        CONFIG.manifestFile,
        'content-ai.js',
        'popup-ai.html',
        'popup-ai.js',
        'popup-ai.css'
    ];
    
    for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
            throw new Error(`Required file not found: ${file}`);
        }
    }
    
    console.log('✅ All required files found');
}

/**
 * Create backup of original files
 */
function createBackup() {
    console.log('💾 Creating backup files...');
    
    try {
        fs.copyFileSync(CONFIG.configFile, `${CONFIG.configFile}.backup`);
        console.log(`✅ Backup created: ${CONFIG.configFile}.backup`);
    } catch (error) {
        throw new Error(`Failed to create backup: ${error.message}`);
    }
}

/**
 * Replace API key placeholder with actual key
 */
function replaceApiKey() {
    console.log('🔑 Replacing API key placeholder...');
    
    try {
        // Read config file
        let configContent = fs.readFileSync(CONFIG.configFile, 'utf8');
        
        // Check if placeholder exists
        if (!configContent.includes(CONFIG.apiKeyPlaceholder)) {
            console.log('⚠️  Placeholder not found, API key might already be replaced');
            return;
        }
        
        // Replace placeholder with actual API key
        configContent = configContent.replace(
            new RegExp(CONFIG.apiKeyPlaceholder, 'g'),
            CONFIG.actualApiKey
        );
        
        // Write back to file
        fs.writeFileSync(CONFIG.configFile, configContent, 'utf8');
        
        console.log('✅ API key replaced successfully');
        
    } catch (error) {
        throw new Error(`Failed to replace API key: ${error.message}`);
    }
}

/**
 * Update version info and build timestamp
 */
function updateVersionInfo() {
    console.log('📝 Updating version information...');
    
    try {
        // Read manifest file
        const manifestContent = fs.readFileSync(CONFIG.manifestFile, 'utf8');
        const manifest = JSON.parse(manifestContent);
        
        // Add build timestamp to description
        const buildDate = new Date().toISOString().split('T')[0];
        const originalDescription = manifest.description;
        
        if (!originalDescription.includes('(Build:')) {
            manifest.description = `${originalDescription} (Build: ${buildDate})`;
            
            // Write back to manifest
            fs.writeFileSync(
                CONFIG.manifestFile,
                JSON.stringify(manifest, null, 2),
                'utf8'
            );
            
            console.log(`✅ Build timestamp added: ${buildDate}`);
        }
        
    } catch (error) {
        console.warn('⚠️  Failed to update version info:', error.message);
        // Don't fail the build for this
    }
}

/**
 * Clean function to restore placeholders
 */
function cleanBuild() {
    console.log('🧹 FastFill AI Extension - Clean Build');
    console.log('====================================');
    
    try {
        // Check if backup exists
        if (!fs.existsSync(`${CONFIG.configFile}.backup`)) {
            console.log('ℹ️  No backup found, restoring from template...');
            restoreFromTemplate();
        } else {
            // Restore from backup
            fs.copyFileSync(`${CONFIG.configFile}.backup`, CONFIG.configFile);
            console.log('✅ Original config restored from backup');
            
            // Remove backup
            fs.unlinkSync(`${CONFIG.configFile}.backup`);
            console.log('🗑️  Backup file removed');
        }
        
        console.log('✅ Clean completed - safe to commit to Git');
        
    } catch (error) {
        console.error('❌ Clean failed:', error.message);
        process.exit(1);
    }
}

/**
 * Restore config from template if backup doesn't exist
 */
function restoreFromTemplate() {
    try {
        let configContent = fs.readFileSync(CONFIG.configFile, 'utf8');
        
        // Replace actual API key back with placeholder
        configContent = configContent.replace(
            new RegExp(CONFIG.actualApiKey, 'g'),
            CONFIG.apiKeyPlaceholder
        );
        
        fs.writeFileSync(CONFIG.configFile, configContent, 'utf8');
        console.log('✅ API key placeholder restored');
        
    } catch (error) {
        throw new Error(`Failed to restore from template: ${error.message}`);
    }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'clean') {
    cleanBuild();
} else {
    buildProduction();
}

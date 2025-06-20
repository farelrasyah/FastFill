/**
 * Simple validation script for FastFill Extension
 * Checks if all required files exist and manifest is valid
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating FastFill Extension...\n');

// Required files check
const requiredFiles = [
  'manifest.json',
  'content.js',
  'background.js',
  'popup.html',
  'popup.js',
  'style.css',
  'README.md'
];

let isValid = true;

// Check if all required files exist
console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
    isValid = false;
  }
});

// Validate manifest.json
console.log('\n📋 Validating manifest.json:');
try {
  const manifestContent = fs.readFileSync('manifest.json', 'utf8');
  const manifest = JSON.parse(manifestContent);
  
  // Check required manifest fields
  const requiredFields = [
    'manifest_version',
    'name', 
    'version',
    'description',
    'permissions',
    'action',
    'background',
    'content_scripts'
  ];
  
  requiredFields.forEach(field => {
    if (manifest[field]) {
      console.log(`✅ ${field}: ${JSON.stringify(manifest[field]).substring(0, 50)}...`);
    } else {
      console.log(`❌ ${field} - Missing!`);
      isValid = false;
    }
  });
  
  // Check manifest version
  if (manifest.manifest_version === 3) {
    console.log('✅ Using Manifest V3');
  } else {
    console.log('❌ Must use Manifest V3');
    isValid = false;
  }
  
} catch (error) {
  console.log('❌ manifest.json is not valid JSON');
  isValid = false;
}

// Check JavaScript syntax
console.log('\n🔧 Checking JavaScript syntax:');
const jsFiles = ['content.js', 'background.js', 'popup.js'];

jsFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    // Basic syntax check - just try to parse it
    new Function(content);
    console.log(`✅ ${file} - Syntax OK`);
  } catch (error) {
    console.log(`❌ ${file} - Syntax Error: ${error.message}`);
    isValid = false;
  }
});

// Check HTML structure
console.log('\n🌐 Checking HTML structure:');
try {
  const htmlContent = fs.readFileSync('popup.html', 'utf8');
  
  // Basic HTML checks
  if (htmlContent.includes('<html') && htmlContent.includes('</html>')) {
    console.log('✅ popup.html - Valid HTML structure');
  } else {
    console.log('❌ popup.html - Invalid HTML structure');
    isValid = false;
  }
  
  // Check for required elements
  const requiredElements = [
    'templateSelect',
    'detectFormsBtn', 
    'fillFormsBtn',
    'connectionStatus',
    'formsCount'
  ];
  
  requiredElements.forEach(id => {
    if (htmlContent.includes(`id="${id}"`)) {
      console.log(`✅ Element #${id} found`);
    } else {
      console.log(`❌ Element #${id} missing`);
      isValid = false;
    }
  });
  
} catch (error) {
  console.log('❌ popup.html could not be read');
  isValid = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (isValid) {
  console.log('🎉 All validations passed! Extension is ready to load.');
  console.log('\n📖 Next steps:');
  console.log('1. Open Chrome and go to chrome://extensions/');
  console.log('2. Enable Developer mode');
  console.log('3. Click "Load unpacked" and select this directory');
  console.log('4. Test the extension on test-form.html');
  process.exit(0);
} else {
  console.log('❌ Validation failed! Please fix the issues above.');
  process.exit(1);
}

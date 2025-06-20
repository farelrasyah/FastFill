/**
 * Background Script - FastFill Extension
 * Menangani komunikasi antar komponen dan instalasi ekstensi
 */

class FastFillBackground {
  constructor() {
    this.initializeBackground();
  }

  /**
   * Inisialisasi background script
   */
  initializeBackground() {
    console.log('FastFill Background Script loaded');

    // Event listener untuk instalasi ekstensi
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    // Event listener untuk pesan dari popup dan content script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
    });
  }

  /**
   * Menangani instalasi ekstensi
   */
  handleInstallation(details) {
    if (details.reason === 'install') {
      console.log('FastFill: Extension installed');
      this.initializeDefaultTemplates();
    } else if (details.reason === 'update') {
      console.log('FastFill: Extension updated');
    }
  }

  /**
   * Inisialisasi template default saat pertama kali install
   */
  async initializeDefaultTemplates() {
    try {
      const defaultTemplates = this.getDefaultTemplates();
      
      await chrome.storage.local.set({
        fastFillTemplates: defaultTemplates,
        selectedTemplate: 'qa_profile'
      });
      
      console.log('FastFill: Default templates initialized');
    } catch (error) {
      console.error('FastFill: Error initializing templates:', error);
    }
  }

  /**
   * Mendapatkan template default
   */
  getDefaultTemplates() {
    return {
      qa_profile: {
        name: 'Profil QA Tester',
        description: 'Data untuk testing QA',
        data: {
          firstName: 'Ahmad',
          lastName: 'Tester',
          fullName: 'Ahmad Tester',
          email: 'ahmad.tester@qa.com',
          phone: '081234567890',
          birthDate: '1990-05-15',
          age: '33',
          address: 'Jl. Testing No. 123',
          city: 'Jakarta',
          country: 'Indonesia',
          company: 'QA Testing Corp',
          jobTitle: 'Senior QA Engineer',
          salary: '8000000',
          password: 'TestPass123!',
          fullAddress: 'Jl. Testing No. 123, RT/RW 01/02, Kelurahan Testing, Kecamatan QA, Jakarta Selatan 12345',
          description: 'Ini adalah deskripsi untuk keperluan testing QA. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          comment: 'Komentar testing untuk form validasi dan fungsionalitas aplikasi.'
        }
      },
      user_profile: {
        name: 'Profil User Normal',
        description: 'Data user biasa',
        data: {
          firstName: 'Budi',
          lastName: 'Santoso',
          fullName: 'Budi Santoso',
          email: 'budi.santoso@gmail.com',
          phone: '087654321098',
          birthDate: '1985-12-20',
          age: '38',
          address: 'Jl. Mawar No. 45',
          city: 'Bandung',
          country: 'Indonesia',
          company: 'PT. Teknologi Maju',
          jobTitle: 'Software Developer',
          salary: '12000000',
          password: 'UserPass456!',
          fullAddress: 'Jl. Mawar No. 45, RT/RW 03/04, Kelurahan Sukajadi, Kecamatan Coblong, Bandung 40132',
          description: 'Seorang developer yang berpengalaman dalam mengembangkan aplikasi web dan mobile.',
          comment: 'Tertarik dengan teknologi terbaru dan selalu ingin belajar hal baru.'
        }
      },
      dummy_profile: {
        name: 'Profil Dummy Data',
        description: 'Data dummy untuk testing',
        data: {
          firstName: 'John',
          lastName: 'Doe',
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          phone: '555-0123',
          birthDate: '1995-01-01',
          age: '29',
          address: '123 Main Street',
          city: 'New York',
          country: 'United States',
          company: 'Example Corp',
          jobTitle: 'Test Manager',
          salary: '75000',
          password: 'DummyPass789!',
          fullAddress: '123 Main Street, Apt 4B, Manhattan, New York, NY 10001, United States',
          description: 'This is a dummy profile created for testing purposes. All information is fictional.',
          comment: 'This is a sample comment for testing form submissions and validations.'
        }
      }
    };
  }

  /**
   * Menangani pesan dari popup dan content script
   */
  handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case 'getTemplates':
        this.getStoredTemplates().then(templates => {
          sendResponse({ success: true, templates: templates });
        });
        return true; // Keep message channel open for async response

      case 'saveTemplate':
        this.saveTemplate(request.template).then(() => {
          sendResponse({ success: true });
        }).catch(error => {
          sendResponse({ success: false, error: error.message });
        });
        return true;

      case 'deleteTemplate':
        this.deleteTemplate(request.templateId).then(() => {
          sendResponse({ success: true });
        }).catch(error => {
          sendResponse({ success: false, error: error.message });
        });
        return true;

      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  }

  /**
   * Mendapatkan template yang disimpan
   */
  async getStoredTemplates() {
    try {
      const result = await chrome.storage.local.get(['fastFillTemplates']);
      return result.fastFillTemplates || this.getDefaultTemplates();
    } catch (error) {
      console.error('FastFill: Error getting templates:', error);
      return this.getDefaultTemplates();
    }
  }

  /**
   * Menyimpan template baru
   */
  async saveTemplate(template) {
    try {
      const templates = await this.getStoredTemplates();
      templates[template.id] = template;
      
      await chrome.storage.local.set({
        fastFillTemplates: templates
      });
      
      console.log('FastFill: Template saved:', template.name);
    } catch (error) {
      console.error('FastFill: Error saving template:', error);
      throw error;
    }
  }

  /**
   * Menghapus template
   */
  async deleteTemplate(templateId) {
    try {
      const templates = await this.getStoredTemplates();
      delete templates[templateId];
      
      await chrome.storage.local.set({
        fastFillTemplates: templates
      });
      
      console.log('FastFill: Template deleted:', templateId);
    } catch (error) {
      console.error('FastFill: Error deleting template:', error);
      throw error;
    }
  }
}

// Inisialisasi background script
const fastFillBackground = new FastFillBackground();

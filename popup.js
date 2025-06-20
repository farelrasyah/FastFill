/**
 * Popup Script - FastFill Extension
 * Menangani UI dan interaksi user di popup
 */

class FastFillPopup {
  constructor() {
    this.templates = {};
    this.selectedTemplate = null;
    this.formsCount = 0;
    this.initializePopup();
  }

  /**
   * Inisialisasi popup
   */
  async initializePopup() {
    console.log('FastFill Popup initialized');
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Load templates dan update UI
    await this.loadTemplates();
    await this.checkTabStatus();
    
    // Auto-detect forms saat popup dibuka
    this.detectForms();
  }

  /**
   * Setup event listeners untuk semua elemen UI
   */
  setupEventListeners() {
    // Template selection
    document.getElementById('templateSelect').addEventListener('change', (e) => {
      this.onTemplateChange(e.target.value);
    });

    // Action buttons
    document.getElementById('detectFormsBtn').addEventListener('click', () => {
      this.detectForms();
    });

    document.getElementById('fillFormsBtn').addEventListener('click', () => {
      this.fillForms();
    });

    // Advanced options toggle
    document.getElementById('advancedToggle').addEventListener('click', () => {
      this.toggleAdvancedOptions();
    });

    // Template management toggle
    document.getElementById('manageTemplatesBtn').addEventListener('click', () => {
      this.toggleTemplateManagement();
    });

    // Template management actions
    document.getElementById('addTemplateBtn').addEventListener('click', () => {
      this.showAddTemplateDialog();
    });

    document.getElementById('exportTemplatesBtn').addEventListener('click', () => {
      this.exportTemplates();
    });

    document.getElementById('importTemplatesBtn').addEventListener('click', () => {
      this.importTemplates();
    });

    // File input untuk import
    document.getElementById('importFileInput').addEventListener('change', (e) => {
      this.handleImportFile(e.target.files[0]);
    });

    // Footer buttons
    document.getElementById('helpBtn').addEventListener('click', () => {
      this.showHelp();
    });

    document.getElementById('aboutBtn').addEventListener('click', () => {
      this.showAbout();
    });
  }

  /**
   * Load templates dari storage
   */
  async loadTemplates() {
    try {
      const response = await this.sendMessage({ action: 'getTemplates' });
      
      if (response.success) {
        this.templates = response.templates;
        this.populateTemplateSelect();
      } else {
        this.showMessage('Error loading templates', 'error');
      }
    } catch (error) {
      console.error('FastFill: Error loading templates:', error);
      this.showMessage('Gagal memuat template', 'error');
    }
  }

  /**
   * Populate template select dropdown
   */
  populateTemplateSelect() {
    const select = document.getElementById('templateSelect');
    select.innerHTML = '<option value="">Pilih template...</option>';

    Object.keys(this.templates).forEach(templateId => {
      const template = this.templates[templateId];
      const option = document.createElement('option');
      option.value = templateId;
      option.textContent = template.name;
      select.appendChild(option);
    });
  }

  /**
   * Handle perubahan template selection
   */
  onTemplateChange(templateId) {
    if (templateId) {
      this.selectedTemplate = this.templates[templateId];
      this.updateTemplateInfo(this.selectedTemplate);
      this.updateFillButton();
    } else {
      this.selectedTemplate = null;
      this.hideTemplateInfo();
      this.updateFillButton();
    }
  }

  /**
   * Update template information display
   */
  updateTemplateInfo(template) {
    const infoDiv = document.getElementById('templateInfo');
    const descriptionP = document.getElementById('templateDescription');
    
    descriptionP.textContent = template.description;
    infoDiv.style.display = 'block';
  }

  /**
   * Hide template information
   */
  hideTemplateInfo() {
    document.getElementById('templateInfo').style.display = 'none';
  }

  /**
   * Check status tab aktif
   */
  async checkTabStatus() {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];
      
      if (tab && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
        this.updateStatus('Terhubung', 'connected');
      } else {
        this.updateStatus('Tidak dapat terhubung', 'disconnected');
        this.showMessage('Ekstensi hanya bekerja pada halaman web (http/https)', 'warning');
      }
    } catch (error) {
      this.updateStatus('Error', 'error');
      console.error('FastFill: Error checking tab status:', error);
    }
  }

  /**
   * Update status connection
   */
  updateStatus(status, type) {
    const statusElement = document.getElementById('connectionStatus');
    statusElement.textContent = status;
    statusElement.className = `status-value ${type}`;
  }

  /**
   * Deteksi form pada halaman aktif
   */
  async detectForms() {
    try {
      this.showMessage('Mendeteksi form...', 'info');
      
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];

      if (!tab || (!tab.url.startsWith('http://') && !tab.url.startsWith('https://'))) {
        this.showMessage('Halaman tidak didukung', 'error');
        return;
      }

      // Inject content script jika belum ada
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });

      // Kirim pesan untuk deteksi form
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'detectForms' });
      
      if (response && response.success) {
        this.formsCount = response.formsCount;
        this.updateFormsCount(this.formsCount);
        
        if (this.formsCount > 0) {
          this.showMessage(`Berhasil mendeteksi ${this.formsCount} form field`, 'success');
        } else {
          this.showMessage('Tidak ada form yang ditemukan', 'warning');
        }
      } else {
        this.showMessage('Gagal mendeteksi form', 'error');
      }

      this.updateFillButton();
    } catch (error) {
      console.error('FastFill: Error detecting forms:', error);
      this.showMessage('Error saat mendeteksi form', 'error');
    }
  }

  /**
   * Update forms count display
   */
  updateFormsCount(count) {
    document.getElementById('formsCount').textContent = count;
  }

  /**
   * Isi form dengan template yang dipilih
   */
  async fillForms() {
    if (!this.selectedTemplate) {
      this.showMessage('Pilih template terlebih dahulu', 'warning');
      return;
    }

    if (this.formsCount === 0) {
      this.showMessage('Tidak ada form untuk diisi', 'warning');
      return;
    }

    try {
      this.showMessage('Mengisi form...', 'info');
      
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];

      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'fillForms',
        template: this.selectedTemplate
      });

      if (response && response.success) {
        this.showMessage(`Form berhasil diisi dengan template "${this.selectedTemplate.name}"`, 'success');
      } else {
        this.showMessage('Gagal mengisi form', 'error');
      }
    } catch (error) {
      console.error('FastFill: Error filling forms:', error);
      this.showMessage('Error saat mengisi form', 'error');
    }
  }

  /**
   * Update status tombol Fill Forms
   */
  updateFillButton() {
    const fillBtn = document.getElementById('fillFormsBtn');
    const canFill = this.selectedTemplate && this.formsCount > 0;
    
    fillBtn.disabled = !canFill;
    fillBtn.textContent = canFill ? '✏️ Isi Form' : '✏️ Isi Form (Tidak tersedia)';
  }

  /**
   * Toggle advanced options panel
   */
  toggleAdvancedOptions() {
    const panel = document.getElementById('advancedOptions');
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
    
    const toggleBtn = document.getElementById('advancedToggle');
    toggleBtn.textContent = isVisible ? '⚙️ Opsi Lanjutan' : '⚙️ Sembunyikan Opsi';
  }

  /**
   * Toggle template management panel
   */
  toggleTemplateManagement() {
    const panel = document.getElementById('templateManagement');
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
    
    const toggleBtn = document.getElementById('manageTemplatesBtn');
    toggleBtn.textContent = isVisible ? '📝 Kelola Template' : '📝 Sembunyikan Panel';
    
    if (!isVisible) {
      this.populateTemplateList();
    }
  }

  /**
   * Populate template list untuk management
   */
  populateTemplateList() {
    const listContainer = document.getElementById('templateList');
    listContainer.innerHTML = '';

    Object.keys(this.templates).forEach(templateId => {
      const template = this.templates[templateId];
      const templateItem = document.createElement('div');
      templateItem.className = 'template-item';
      
      templateItem.innerHTML = `
        <div class="template-item-info">
          <strong>${template.name}</strong>
          <small>${template.description}</small>
        </div>
        <div class="template-item-actions">
          <button class="btn btn-small" onclick="fastFillPopup.editTemplate('${templateId}')">Edit</button>
          <button class="btn btn-small btn-danger" onclick="fastFillPopup.deleteTemplate('${templateId}')">Hapus</button>
        </div>
      `;
      
      listContainer.appendChild(templateItem);
    });
  }

  /**
   * Show add template dialog
   */
  showAddTemplateDialog() {
    const name = prompt('Nama template:');
    if (!name) return;
    
    const description = prompt('Deskripsi template:');
    if (!description) return;
    
    // Untuk simplicity, kita buat template dengan data default
    // Di implementasi yang lebih advanced, bisa buat form builder
    const newTemplate = {
      id: Date.now().toString(),
      name: name,
      description: description,
      data: {
        firstName: 'Nama',
        lastName: 'Belakang',
        fullName: 'Nama Lengkap',
        email: 'email@example.com',
        phone: '081234567890',
        birthDate: '1990-01-01',
        age: '30',
        address: 'Alamat Lengkap',
        city: 'Kota',
        country: 'Indonesia',
        company: 'Nama Perusahaan',
        jobTitle: 'Jabatan',
        salary: '5000000',
        password: 'Password123!',
        fullAddress: 'Alamat lengkap dengan detail',
        description: 'Deskripsi atau bio',
        comment: 'Komentar atau catatan'
      }
    };
    
    this.saveTemplate(newTemplate);
  }

  /**
   * Save template
   */
  async saveTemplate(template) {
    try {
      const response = await this.sendMessage({
        action: 'saveTemplate',
        template: template
      });
      
      if (response.success) {
        this.showMessage('Template berhasil disimpan', 'success');
        await this.loadTemplates();
        this.populateTemplateList();
      } else {
        this.showMessage('Gagal menyimpan template', 'error');
      }
    } catch (error) {
      console.error('FastFill: Error saving template:', error);
      this.showMessage('Error menyimpan template', 'error');
    }
  }

  /**
   * Delete template
   */
  async deleteTemplate(templateId) {
    if (!confirm('Yakin ingin menghapus template ini?')) {
      return;
    }
    
    try {
      const response = await this.sendMessage({
        action: 'deleteTemplate',
        templateId: templateId
      });
      
      if (response.success) {
        this.showMessage('Template berhasil dihapus', 'success');
        await this.loadTemplates();
        this.populateTemplateList();
      } else {
        this.showMessage('Gagal menghapus template', 'error');
      }
    } catch (error) {
      console.error('FastFill: Error deleting template:', error);
      this.showMessage('Error menghapus template', 'error');
    }
  }

  /**
   * Export templates
   */
  exportTemplates() {
    const dataStr = JSON.stringify(this.templates, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'fastfill-templates.json';
    link.click();
    
    this.showMessage('Template berhasil diekspor', 'success');
  }

  /**
   * Import templates
   */
  importTemplates() {
    document.getElementById('importFileInput').click();
  }

  /**
   * Handle import file
   */
  async handleImportFile(file) {
    if (!file) return;
    
    try {
      const text = await file.text();
      const importedTemplates = JSON.parse(text);
      
      // Merge dengan template yang ada
      Object.assign(this.templates, importedTemplates);
      
      // Save to storage
      const response = await this.sendMessage({
        action: 'saveTemplate',
        template: this.templates
      });
      
      if (response.success) {
        this.showMessage('Template berhasil diimpor', 'success');
        await this.loadTemplates();
        this.populateTemplateList();
      }
    } catch (error) {
      console.error('FastFill: Error importing templates:', error);
      this.showMessage('Gagal mengimpor template', 'error');
    }
  }

  /**
   * Show help dialog
   */
  showHelp() {
    const helpText = `
FastFill - Auto Form Filler

Cara Penggunaan:
1. Buka halaman web yang memiliki form
2. Klik ekstensi FastFill
3. Pilih template data yang diinginkan
4. Klik "Deteksi Form" untuk mencari form
5. Klik "Isi Form" untuk mengisi form otomatis

Fitur:
- Deteksi otomatis berbagai jenis input
- Template data yang dapat dikustomisasi
- Dukungan untuk checkbox dan radio button
- Export/Import template data

Tips:
- Pastikan halaman sudah selesai dimuat
- Beberapa form mungkin memerlukan validasi manual
- Gunakan template yang sesuai dengan jenis form
    `;
    
    alert(helpText);
  }

  /**
   * Show about dialog
   */
  showAbout() {
    const aboutText = `
FastFill v1.0.0
Auto Form Filler untuk Testing QA & Development

Dibuat untuk membantu QA tester dan developer dalam mengisi form secara otomatis untuk keperluan testing UI/UX.

Fitur utama:
- Deteksi form otomatis
- Multiple template data
- Support berbagai jenis input
- Template management
- Export/Import data

© 2025 FastFill Extension
    `;
    
    alert(aboutText);
  }

  /**
   * Show message notification
   */
  showMessage(message, type = 'info') {
    const container = document.getElementById('messageContainer');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    container.appendChild(messageDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 3000);
  }

  /**
   * Send message to background script
   */
  async sendMessage(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, resolve);
    });
  }
}

// Global instance
let fastFillPopup;

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  fastFillPopup = new FastFillPopup();
});

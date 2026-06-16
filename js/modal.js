// Modal and Form Module

const ModalModule = {
  modal: null,
  overlay: null,
  form: null,
  imageFiles: [],

  // Initialize module
  init() {
    this.modal = document.getElementById('modal-overlay');
    this.overlay = this.modal;
    this.form = document.getElementById('report-form');
    
    const btnLeaveReport = document.getElementById('btn-leave-report');
    const btnClose = document.getElementById('modal-close');
    const btnCancel = document.getElementById('form-cancel');

    // Open modal
    btnLeaveReport.addEventListener('click', () => this.open());

    // Close modal
    btnClose.addEventListener('click', () => this.close());
    btnCancel.addEventListener('click', () => this.close());
    
    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });

    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Image preview
    const imageInput = document.getElementById('report-images');
    imageInput.addEventListener('change', (e) => this.handleImageSelect(e));

    // Focus trap
    this.setupFocusTrap();
  },

  // Open modal
  open() {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = this.form.querySelector('select, input, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  },

  // Close modal
  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.resetForm();
  },

  // Reset form
  resetForm() {
    this.form.reset();
    this.imageFiles = [];
    this.clearImagePreviews();
    
    // Remove validation errors
    const errorElements = this.form.querySelectorAll('.error');
    errorElements.forEach(el => el.classList.remove('error'));
  },

  // Handle image selection
  handleImageSelect(e) {
    const files = Array.from(e.target.files).slice(0, 2); // Max 2 images
    this.imageFiles = files;
    this.displayImagePreviews(files);
  },

  // Display image previews
  displayImagePreviews(files) {
    const container = document.getElementById('image-preview-container');
    container.innerHTML = '';

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        preview.innerHTML = `
          <img src="${e.target.result}" alt="Preview">
          <button type="button" class="image-preview-remove" data-index="${index}">×</button>
        `;
        container.appendChild(preview);

        // Remove button handler
        preview.querySelector('.image-preview-remove').addEventListener('click', () => {
          this.removeImage(index);
        });
      };
      reader.readAsDataURL(file);
    });
  },

  // Remove image
  removeImage(index) {
    this.imageFiles.splice(index, 1);
    
    // Update file input
    const input = document.getElementById('report-images');
    const dt = new DataTransfer();
    this.imageFiles.forEach(file => dt.items.add(file));
    input.files = dt.files;
    
    // Update previews
    this.displayImagePreviews(this.imageFiles);
  },

  // Clear image previews
  clearImagePreviews() {
    const container = document.getElementById('image-preview-container');
    container.innerHTML = '';
  },

  // Handle form submission
  async handleSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('form-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Validate form
    if (!this.form.checkValidity()) {
      this.form.reportValidity();
      // Focus first invalid field
      const firstInvalid = this.form.querySelector(':invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Get form data
    const formData = {
      reportType: document.getElementById('report-type').value,
      category: document.getElementById('report-category').value,
      district: document.getElementById('report-district').value,
      address: document.getElementById('report-address').value.trim(),
      description: document.getElementById('report-description').value.trim(),
      contact: document.getElementById('report-contact').value.trim(),
      images: []
    };

    // Convert images to base64
    if (this.imageFiles.length > 0) {
      formData.images = await this.convertImagesToBase64(this.imageFiles);
    }

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    try {
      // Geocode address
      const coordinates = await this.geocodeAddress(formData.address);
      
      if (!coordinates) {
        throw new Error('Не вдалося знайти координати для вказаної адреси. Перевірте правильність адреси.');
      }

      formData.coordinates = coordinates;

      // Add report
      const newReport = ReportsData.add(formData);

      // Update UI
      ReportsModule.addNewReport(newReport);
      MapModule.addNewReport(newReport);

      // Show success notification
      this.showNotification('Звіт успішно додано!', 'success');

      // Close modal
      this.close();

    } catch (error) {
      console.error('Error submitting report:', error);
      this.showNotification(error.message || 'Помилка при додаванні звіту', 'error');
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  },

  // Geocode address using Nominatim API
  async geocodeAddress(address) {
    const baseUrl = 'https://nominatim.openstreetmap.org/search';
    const params = new URLSearchParams({
      q: `${address}, Львів, Україна`,
      format: 'json',
      limit: 1,
      addressdetails: 1
    });

    try {
      const response = await fetch(`${baseUrl}?${params}`, {
        headers: {
          'User-Agent': 'LvivReportsApp/1.0'
        }
      });

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        return [lat, lon];
      }

      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Помилка геокодування адреси. Спробуйте ще раз.');
    }
  },

  // Convert images to base64
  async convertImagesToBase64(files) {
    const promises = Array.from(files).map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    return Promise.all(promises);
  },

  // Show notification
  showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');

    notificationText.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
      notification.classList.remove('show');
    }, 4000);
  },

  // Setup focus trap for accessibility
  setupFocusTrap() {
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    this.modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !this.modal.classList.contains('active')) {
        return;
      }

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }
};

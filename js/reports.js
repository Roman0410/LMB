// Reports List Module

const ReportsModule = {
  currentFilters: {
    type: '',
    category: '',
    district: '',
    search: ''
  },

  // Initialize module
  init() {
    this.setupFilters();
    this.renderReports();
  },

  // Setup filter event listeners
  setupFilters() {
    const filterType = document.getElementById('filter-type');
    const filterCategory = document.getElementById('filter-category');
    const filterDistrict = document.getElementById('filter-district');
    const filterSearch = document.getElementById('filter-search');

    filterType.addEventListener('change', () => {
      this.currentFilters.type = filterType.value;
      this.applyFilters();
    });

    filterCategory.addEventListener('change', () => {
      this.currentFilters.category = filterCategory.value;
      this.applyFilters();
    });

    filterDistrict.addEventListener('change', () => {
      this.currentFilters.district = filterDistrict.value;
      this.applyFilters();
    });

    filterSearch.addEventListener('input', () => {
      this.currentFilters.search = filterSearch.value;
      this.applyFilters();
    });
  },

  // Apply filters and update display
  applyFilters() {
    const filtered = ReportsData.filter(this.currentFilters);
    this.renderReports(filtered);
    
    // Update map markers
    MapModule.loadReports(filtered);
    
    // Update count
    this.updateCount(filtered.length);
  },

  // Update reports count
  updateCount(count) {
    const countElement = document.getElementById('reports-count');
    if (countElement) {
      countElement.textContent = count;
    }
  },

  // Render reports list
  renderReports(reports = null) {
    const reportsToShow = reports || ReportsData.getAll();
    const listContainer = document.getElementById('reports-list');
    const emptyState = document.getElementById('empty-state');

    if (!listContainer) return;

    // Clear existing content
    listContainer.innerHTML = '';

    if (reportsToShow.length === 0) {
      listContainer.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    listContainer.style.display = 'flex';
    if (emptyState) emptyState.style.display = 'none';

    // Sort by date (newest first)
    const sorted = [...reportsToShow].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    sorted.forEach(report => {
      const card = this.createReportCard(report);
      listContainer.appendChild(card);
    });

    this.updateCount(reportsToShow.length);
  },

  // Create report card element
  createReportCard(report) {
    const card = document.createElement('div');
    card.className = 'report-card';
    card.setAttribute('data-report-id', report.id);

    const categoryLabel = ReportsData.getCategoryLabel(report.category);
    const typeLabel = ReportsData.getReportTypeLabel(report.reportType);
    const date = new Date(report.date).toLocaleDateString('uk-UA');

    let imageHtml = '';
    if (report.images && report.images.length > 0) {
      imageHtml = `<img src="${report.images[0]}" alt="Report image" class="report-card-image">`;
    }

    card.innerHTML = `
      ${imageHtml}
      <div class="report-card-header">
        <span class="report-card-category ${report.category}">${categoryLabel}</span>
        <span class="report-card-type">${typeLabel}</span>
      </div>
      <div class="report-card-address">${report.address}</div>
      <div class="report-card-description">${report.description}</div>
      <div class="report-card-footer">
        <span>${report.district}</span>
        <span>${date}</span>
      </div>
    `;

    // Add click handler
    card.addEventListener('click', () => {
      MapModule.centerOnReport(report);
    });

    return card;
  },

  // Add new report to list
  addNewReport(report) {
    // Reset filters
    this.resetFilters();
    
    // Re-render with new report
    this.renderReports();
    
    // Scroll to top of list
    const sidebar = document.querySelector('.reports-sidebar');
    if (sidebar) {
      sidebar.scrollTop = 0;
    }
  },

  // Reset filters
  resetFilters() {
    this.currentFilters = {
      type: '',
      category: '',
      district: '',
      search: ''
    };

    document.getElementById('filter-type').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-district').value = '';
    document.getElementById('filter-search').value = '';
  }
};

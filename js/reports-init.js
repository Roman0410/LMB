// Reports Page Initialization

document.addEventListener('DOMContentLoaded', () => {
  // Initialize map
  MapModule.init();

  // Initialize reports list
  ReportsModule.init();

  // Initialize modal
  ModalModule.init();

  // Mobile: open/close filters sidebar
  const mobileFiltersBtn = document.querySelector('.mobile-open-filters');
  const closeFiltersBtn = document.querySelector('.close-filters');
  const sidebar = document.querySelector('.reports-sidebar');

  if (sidebar) {
    if (mobileFiltersBtn) {
      mobileFiltersBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    if (closeFiltersBtn) {
      closeFiltersBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
      });
    }

    // On widths <= 1024px, hide sidebar when a report card is clicked
    sidebar.addEventListener('click', (event) => {
      const card = event.target.closest('.report-card');
      if (card && window.innerWidth <= 1024) {
        sidebar.classList.remove('open');
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (window.GlobalCityOxford) window.GlobalCityOxford.init();
  if (window.GlobalCityMckinsey) window.GlobalCityMckinsey.init();
  if (window.GlobalCityGpci) window.GlobalCityGpci.init();

  initBannerMobileFlip();

  const modal = document.getElementById('registration-modal');
  const openModalBtn = document.getElementById('open-registration-modal');
  const closeModalBtn = document.getElementById('close-registration-modal');
  const form = document.getElementById('registration-form');

  function openModal() {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      alert('Дякуємо! Реєстрацію отримано. Завантаження буде доступне після підтвердження.');
      form.reset();
      closeModal();
    });
  }
});

function initBannerMobileFlip() {
  const banners = document.querySelectorAll('.gc-banner');
  if (!banners.length) return;

  const mobileQuery = window.matchMedia('(max-width: 768px)');

  function isMobileView() {
    return mobileQuery.matches;
  }

  function closeAllExcept(except) {
    banners.forEach((banner) => {
      if (banner !== except) banner.classList.remove('is-flipped');
    });
  }

  banners.forEach((banner) => {
    // capture: перехоплюємо до jQuery-обробника якорів у main.js (scroll по #)
    banner.addEventListener(
      'click',
      (event) => {
        if (!isMobileView()) return;

        if (!banner.classList.contains('is-flipped')) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          closeAllExcept(banner);
          banner.classList.add('is-flipped');
        }
      },
      true
    );
  });

  document.addEventListener('click', (event) => {
    if (!isMobileView()) return;
    if (event.target.closest('.gc-banner')) return;
    banners.forEach((banner) => banner.classList.remove('is-flipped'));
  });

  mobileQuery.addEventListener('change', () => {
    if (!mobileQuery.matches) {
      banners.forEach((banner) => banner.classList.remove('is-flipped'));
    }
  });
}

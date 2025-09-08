Fancybox.bind('[data-fancybox]', {
  Thumbs: {
    showOnStart: false,
  },
});
$('.copyright-year').text(new Date().getFullYear());

$('.burger-menu').click(function () {
  $(this).toggleClass('active');
  $('.header-links').toggleClass('active');
  $('body').toggleClass('lock');
});

function debounce(fn, wait) {
  let t;
  return function () {
    clearTimeout(t);
    const ctx = this,
      args = arguments;
    t = setTimeout(function () {
      fn.apply(ctx, args);
    }, wait);
  };
}

function equalizeTeamInfoHeights() {
  const $infos = $('.team-member .member-info');
  if (!$infos.length) return;
  $infos.css('min-height', '');
  let maxH = 0;
  $infos.each(function () {
    const h = $(this).outerHeight();
    if (h > maxH) maxH = h;
  });
  $infos.css('min-height', maxH);
}

$(function () {
  // Wait for all resources to load before initializing AOS
  $(window).on('load', function () {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        offset: 100,
        delay: 0,
        anchorPlacement: 'top-bottom',
      });
      console.log('AOS initialized successfully');
    } else {
      console.error('AOS library not found');
      $('body').addClass('aos-not-loaded');
    }
  });

  if ($('.team-list').length && typeof $.fn.slick === 'function') {
    const $slider = $('.team-list');
    $slider.on('init', equalizeTeamInfoHeights);
    $slider.on('setPosition', equalizeTeamInfoHeights);
    $slider.on('reInit', equalizeTeamInfoHeights);
    $slider.on('breakpoint', equalizeTeamInfoHeights);

    $slider.slick({
      slidesToShow: 4,
      slidesToScroll: 4,
      rows: 2,
      arrows: true,
      dots: true,
      adaptiveHeight: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            rows: 2,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            rows: 2,
          },
        },
      ],
    });

    // Refresh AOS after Slick initialization
    setTimeout(function () {
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }, 100);

    $(window).on('resize', debounce(equalizeTeamInfoHeights, 150));
    setTimeout(equalizeTeamInfoHeights, 0);
  }

  if (
    document.getElementById('contactForm') &&
    typeof window.JustValidate !== 'undefined'
  ) {
    const validate = new window.JustValidate('#contactForm', {
      errorFieldCssClass: 'is-invalid',
      successFieldCssClass: 'is-valid',
      validateBeforeSubmitting: true,
    });

    validate
      .addField('#cf-lastname', [
        { rule: 'required', errorMessage: 'Вкажіть прізвище' },
      ])
      .addField('#cf-firstname', [
        { rule: 'required', errorMessage: "Вкажіть ім'я" },
      ])
      .addField('#cf-email', [
        { rule: 'required', errorMessage: 'Вкажіть email' },
        { rule: 'email', errorMessage: 'Некоректний email' },
      ])
      .addField('#cf-phone', [
        { rule: 'required', errorMessage: 'Вкажіть телефон' },
      ])
      .addField('#cf-age', [
        { rule: 'required', errorMessage: 'Вкажіть вік' },
        { rule: 'number', errorMessage: 'Лише число' },
      ])
      .addField('#cf-correction', [
        { rule: 'required', errorMessage: 'Зробіть вибір' },
      ])
      .onSuccess((event) => {
        event.preventDefault();
        if (window.Fancybox) {
          window.Fancybox.show([{ src: '#contact-success', type: 'inline' }]);
        }
        event.target.reset();
      });
    $('input[name="correction"]').on('change', function () {
      $('#cf-correction').val($(this).val());
    });
  }
});

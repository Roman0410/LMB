// Функція валідації та санітизації даних
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;

  // Видаляємо HTML теги
  input = input.replace(/<[^>]*>/g, '');

  // Видаляємо підозрілі символи
  input = input.replace(/[<>'"&]/g, '');

  // Обмежуємо довжину
  return input.substring(0, 2000);
}

// Функція перевірки на спам
function isSpam(formData) {
  const spamKeywords = ['viagra', 'casino', 'loan', 'free money', 'click here'];
  const allText = Object.values(formData).join(' ').toLowerCase();

  return spamKeywords.some((keyword) => allText.includes(keyword));
}

// Функція відправки в Telegram через PHP проксі
// Функція для відправки форми на email
function sendToEmail(formData) {
  // Санітизація даних
  const sanitizedData = {};
  for (const [key, value] of Object.entries(formData)) {
    sanitizedData[key] = sanitizeInput(value);
  }

  // Перевірка на спам
  if (isSpam(sanitizedData)) {
    throw new Error('Підозрілий контент виявлено');
  }

  // Відправляємо на сервер
  return fetch('send-email.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sanitizedData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(
            err.error || `HTTP error! status: ${response.status}`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        return { success: true };
      } else {
        throw new Error(data.error || 'Помилка відправки');
      }
    })
    .catch((error) => {
      throw error;
    });
}

function sendToTelegram(formData) {
  // Санітизація даних
  const sanitizedData = {};
  for (const [key, value] of Object.entries(formData)) {
    sanitizedData[key] = sanitizeInput(value);
  }

  // Перевірка на спам
  if (isSpam(sanitizedData)) {
    throw new Error('Підозрілий контент виявлено');
  }

  // Додаємо reCAPTCHA токен (якщо доступний)
  if (typeof grecaptcha !== 'undefined') {
    return new Promise((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha
          .execute('6LfPfMwrAAAAAGGsURCe6Fc8DjJUBeNNPsFeR11C', {
            action: 'submit',
          })
          .then((token) => {
            sanitizedData.recaptcha_token = token;
            return fetch('telegram-proxy-secure.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(sanitizedData),
            });
          })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
          })
          .then((text) => {
            try {
              const data = JSON.parse(text);
              if (data.success) {
                resolve({ success: true });
              } else {
                throw new Error(data.error || 'Помилка відправки');
              }
            } catch (parseError) {
              throw new Error('Сервер повернув некоректну відповідь');
            }
          })
          .catch((error) => reject(error));
      });
    });
  }

  // Fallback без reCAPTCHA
  return fetch('telegram-proxy-secure.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sanitizedData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      try {
        const data = JSON.parse(text);
        if (data.success) {
          return { success: true };
        } else {
          throw new Error(data.error || 'Помилка відправки');
        }
      } catch (parseError) {
        throw new Error('Сервер повернув некоректну відповідь');
      }
    })
    .catch((error) => {
      throw error;
    });
}

Fancybox.bind('[data-fancybox]', {
  Thumbs: {
    showOnStart: false,
  },
  trapFocus: true,
  autoFocus: false,
  placeFocusBack: true,
});
$('.copyright-year').text(new Date().getFullYear());

// Визначення активної сторінки в навігації
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  const currentHash = window.location.hash || '';

  // Спочатку видаляємо всі активні класи
  $('.nav-link').removeClass('active');

  $('.nav-link').each(function () {
    const linkHref = $(this).attr('href');
    const linkPage = linkHref.split('/').pop();

    // Видаляємо якір, якщо є
    const linkPageWithoutAnchor = linkPage.split('#')[0];
    const linkHash = linkHref.includes('#') ? linkHref.split('#')[1] : '';

    // Перевіряємо чи це поточна сторінка
    const isCurrentPage =
      linkPageWithoutAnchor === currentPage ||
      (currentPage === '' && linkPageWithoutAnchor === 'index.html');

    // Якщо це index.html
    if (
      linkPageWithoutAnchor === 'index.html' &&
      currentPage === 'index.html'
    ) {
      // Якщо є якір в посиланні
      if (linkHash) {
        // Якщо є поточний якір і він відповідає
        if (currentHash && linkHash === currentHash.replace('#', '')) {
          $(this).addClass('active');
        }
      } else {
        // Якщо немає якоря в посиланні і немає поточного якоря - це "Головна"
        if (!currentHash) {
          $(this).addClass('active');
        }
      }
    } else if (isCurrentPage && !linkHash && !currentHash) {
      // Для інших сторінок без якорів
      $(this).addClass('active');
    }
  });
}

// Викликаємо при завантаженні сторінки
setActiveNavLink();

// Викликаємо при зміні hash (якоря)
$(window).on('hashchange', function () {
  setActiveNavLink();
});

// Викликаємо при кліку на посилання з якорями (для миттєвого оновлення)
$(document).on('click', 'a[href*="#"]', function () {
  setTimeout(function () {
    setActiveNavLink();
  }, 100);
});

$('.burger-menu').click(function (e) {
  e.stopPropagation();
  $(this).toggleClass('active');
  $('.header-links').toggleClass('active');
  $('body').toggleClass('lock').toggleClass('menu-open');
});

function closeMobileMenu() {
  $('.burger-menu').removeClass('active');
  $('.header-links').removeClass('active');
  $('body').removeClass('lock').removeClass('menu-open');
}

$('.mobile-nav .nav-link, .mobile-nav .btn, .mobile-btn').click(function () {
  closeMobileMenu();
});

// Закриття меню при кліку поза меню (на overlay)
$(document).on('click', function (e) {
  if ($('body').hasClass('menu-open')) {
    if (!$(e.target).closest('.header-links, .burger-menu').length) {
      closeMobileMenu();
    }
  }
});

// Запобігання закриттю при кліку всередині меню
$('.header-links').on('click', function (e) {
  e.stopPropagation();
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
    } else {
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

  // Слайдер учасників платформи
  if ($('.participants-slider').length && typeof $.fn.slick === 'function') {
    const $participantsSlider = $('.participants-slider');
    const $participantsArrows = $('.participants-arrows');

    // Функція для перевірки кількості слайдів та приховування стрілок
    function checkParticipantsCount() {
      const slideCount = $participantsSlider.find('.participant-card').length;
      const windowWidth = $(window).width();

      // Якщо слайдів менше 5 і екран більше 768px (ПК версія), приховуємо стрілки
      if (slideCount < 5 && windowWidth > 768) {
        $participantsArrows.addClass('hide-on-desktop');
      } else {
        $participantsArrows.removeClass('hide-on-desktop');
      }
    }

    $participantsSlider.slick({
      slidesToShow: 4,
      slidesToScroll: 4,
      arrows: true,
      dots: false,
      infinite: true,
      adaptiveHeight: false,
      prevArrow: '.participants-arrow-prev',
      nextArrow: '.participants-arrow-next',
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });

    // Перевіряємо кількість після ініціалізації
    $participantsSlider.on('init', checkParticipantsCount);
    $participantsSlider.on('reInit', checkParticipantsCount);
    $participantsSlider.on('breakpoint', checkParticipantsCount);

    // Перевіряємо при зміні розміру вікна
    $(window).on('resize', debounce(checkParticipantsCount, 150));

    // Викликаємо одразу після ініціалізації
    setTimeout(checkParticipantsCount, 100);
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

        // Збираємо дані форми
        const formData = {
          lastname: $('#cf-lastname').val(),
          firstname: $('#cf-firstname').val(),
          email: $('#cf-email').val(),
          phone: $('#cf-phone').val(),
          age: $('#cf-age').val(),
          correction: $('#cf-correction').val(),
          purpose: $('#cf-purpose').val() || 'Не вказано',
          message: $('#cf-message').val() || 'Не вказано',
        };

        // Відправляємо в Telegram
        sendToTelegram(formData)
          .then(() => {
            // Показуємо модальне вікно успіху
            if (typeof Fancybox !== 'undefined') {
              Fancybox.show([{ src: '#contact-success', type: 'inline' }]);
            } else if (typeof $.fancybox !== 'undefined') {
              $.fancybox.open('#contact-success');
            } else {
              // Fallback - показуємо alert
              alert(
                "Дякуємо! Ваше повідомлення надіслано. Ми зв'яжемось з Вами найближчим часом."
              );
            }
            // Очищаємо форму
            $('#contactForm')[0].reset();
          })
          .catch((error) => {
            alert(
              'Помилка відправки форми: ' +
                error.message +
                "\nСпробуйте пізніше або зв'яжіться з нами по телефону."
            );
          });
      });
    $('input[name="correction"]').on('change', function () {
      $('#cf-correction').val($(this).val());
    });
  }

  // Валідація простої форми контактів (name, email, message)
  if (
    document.getElementById('contactForm') &&
    document.getElementById('name') &&
    typeof window.JustValidate !== 'undefined'
  ) {
    const simpleContactForm = new window.JustValidate('#contactForm', {
      errorFieldCssClass: 'is-invalid',
      successFieldCssClass: 'is-valid',
      validateBeforeSubmitting: true,
    });

    simpleContactForm
      .addField('#name', [{ rule: 'required', errorMessage: "Вкажіть ім'я" }])
      .addField('#email', [
        { rule: 'required', errorMessage: 'Вкажіть email' },
        { rule: 'email', errorMessage: 'Некоректний email' },
      ])
      .addField('#message', [
        { rule: 'required', errorMessage: 'Введіть повідомлення' },
      ])
      .onSuccess((event) => {
        event.preventDefault();

        // Збираємо дані форми
        const formData = {
          name: $('#name').val(),
          email: $('#email').val(),
          message: $('#message').val(),
        };

        // Відправляємо на email
        sendToEmail(formData)
          .then(() => {
            // Показуємо модальне вікно успіху
            if (typeof Fancybox !== 'undefined') {
              Fancybox.show([{ src: '#contact-success', type: 'inline' }]);
            } else if (typeof $.fancybox !== 'undefined') {
              $.fancybox.open('#contact-success');
            } else {
              // Fallback - показуємо alert
              alert(
                "Дякуємо! Ваше повідомлення надіслано. Ми зв'яжемось з Вами найближчим часом."
              );
            }
            // Очищаємо форму
            $('#contactForm')[0].reset();
          })
          .catch((error) => {
            alert(
              'Помилка відправки форми: ' +
                error.message +
                "\nСпробуйте пізніше або зв'яжіться з нами по телефону."
            );
          });
      });
  }

  function scrollToCenterWithHeader(element, headerHeight = 0) {
    if (!element) return;

    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const elementHeight = elementRect.height;
    const windowHeight = window.innerHeight;

    // Центрування з урахуванням header
    const centerPosition =
      absoluteElementTop - windowHeight / 2 + elementHeight / 2 - headerHeight;

    window.scrollTo({
      top: Math.max(0, centerPosition),
      behavior: 'smooth',
    });
  }

  // Використання з header висотою 80px
  $(document).on('click', 'a[href^="#"]', function (e) {
    e.preventDefault();
    const targetId = $(this).attr('href');
    const targetElement = document.querySelector(targetId);
    scrollToCenterWithHeader(targetElement, 80);
  });
});

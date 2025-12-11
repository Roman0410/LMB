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
    $('.participants-slider').slick({
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
  // Завантаження відео з YouTube через Google API
  function loadYouTubeVideos() {
    const videosContainer = document.getElementById('videosContainer');
    if (!videosContainer) return;

    // YouTube Data API v3 ключ
    const API_KEY = 'AIzaSyAbMm6H1BfglY0F7_JWA7LMtRNERQ6PC0I';
    const channelHandle = '@lmb_2056'; // Handle каналу з @

    // Для нових каналів з handle (@username) використовуємо пошук
    // Спочатку знаходимо канал через пошук
    fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${encodeURIComponent(
        channelHandle
      )}&part=snippet&type=channel&maxResults=1`
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.error?.message || 'API Error');
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.items && data.items.length > 0) {
          const channelId = data.items[0].id.channelId;
          // Отримуємо відео через videos.list (краще для фільтрації)
          // Спочатку отримуємо uploads playlist ID
          return fetch(
            `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${channelId}&part=contentDetails`
          );
        } else {
          throw new Error('Канал не знайдено');
        }
      })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.error?.message || 'API Error');
          });
        }
        return response.json();
      })
      .then((channelData) => {
        if (channelData.items && channelData.items.length > 0) {
          const uploadsPlaylistId =
            channelData.items[0].contentDetails.relatedPlaylists.uploads;
          // Отримуємо відео з uploads playlist
          return fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${uploadsPlaylistId}&part=snippet,contentDetails&maxResults=50&order=date`
          );
        } else {
          throw new Error('Playlist не знайдено');
        }
      })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.error?.message || 'API Error');
          });
        }
        return response.json();
      })
      .then((playlistData) => {
        if (playlistData.items && playlistData.items.length > 0) {
          // Отримуємо деталі відео для фільтрації Shorts
          const videoIds = playlistData.items
            .slice(0, 10)
            .map((item) => item.contentDetails.videoId)
            .join(',');

          return fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=contentDetails,snippet`
          );
        } else {
          throw new Error('Відео не знайдено');
        }
      })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.error?.message || 'API Error');
          });
        }
        return response.json();
      })
      .then((videosData) => {
        if (videosData.items && videosData.items.length > 0) {
          // Фільтруємо Shorts (відео менше 60 секунд)
          const regularVideos = videosData.items.filter((video) => {
            const duration = video.contentDetails.duration;
            // Парсимо ISO 8601 duration (наприклад, PT1M30S = 90 секунд)
            const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            if (match) {
              const hours = parseInt(match[1] || 0);
              const minutes = parseInt(match[2] || 0);
              const seconds = parseInt(match[3] || 0);
              const totalSeconds = hours * 3600 + minutes * 60 + seconds;
              // Виключаємо відео коротші за 60 секунд (Shorts)
              return totalSeconds >= 60;
            }
            return true;
          });

          // Беремо перші 3 регулярні відео
          const topVideos = regularVideos.slice(0, 3);
          if (topVideos.length > 0) {
            displayVideos(topVideos);
          } else {
            showVideoError('Регулярні відео не знайдено');
          }
        } else {
          showVideoError('Відео не знайдено на каналі');
        }
      })
      .catch((error) => {
        console.error('Error loading videos:', error);
        let errorMessage = 'Помилка завантаження відео';

        if (error.message.includes('API key')) {
          errorMessage = 'Невірний API ключ. Перевірте налаштування.';
        } else if (error.message.includes('quota')) {
          errorMessage = 'Перевищено квоту API. Спробуйте пізніше.';
        } else if (error.message) {
          errorMessage = error.message;
        }

        showVideoError(errorMessage);
      });
  }

  function displayVideos(videos) {
    const videosContainer = document.getElementById('videosContainer');
    if (!videosContainer) return;

    videosContainer.innerHTML = '';

    videos.forEach((video) => {
      const videoId = video.id || video.id.videoId;
      const title = video.snippet.title;
      const thumbnail =
        video.snippet.thumbnails.medium?.url ||
        video.snippet.thumbnails.high?.url ||
        video.snippet.thumbnails.default?.url;

      const videoElement = createVideoCard(videoId, title, thumbnail);
      videosContainer.appendChild(videoElement);
    });
  }

  function createVideoCard(videoId, title, thumbnail) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <div class="video-thumbnail-wrapper">
        <div class="video-thumbnail" data-video-id="${videoId}">
          <img src="${thumbnail}" alt="${title}" loading="lazy" />
          <div class="video-play-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="rgba(0, 0, 0, 0.6)"/>
              <path d="M26 20L26 44L42 32L26 20Z" fill="white"/>
            </svg>
          </div>
        </div>
        <div class="video-player-container" id="player-${videoId}" style="display: none;">
        </div>
      </div>
      <h3 class="video-title">${title}</h3>
    `;

    // Додаємо обробник кліку для відтворення відео
    const thumbnailEl = card.querySelector('.video-thumbnail');
    const playerContainer = card.querySelector('.video-player-container');
    let isVideoLoaded = false;

    thumbnailEl.addEventListener('click', function () {
      // Приховуємо thumbnail і показуємо плеєр
      thumbnailEl.style.display = 'none';
      playerContainer.style.display = 'block';
      playerContainer.style.aspectRatio = '16 / 9';

      // Створюємо iframe тільки при кліку
      if (!isVideoLoaded) {
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        iframe.frameBorder = '0';
        iframe.allow =
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        playerContainer.appendChild(iframe);
        isVideoLoaded = true;
      }
    });

    return card;
  }

  function showVideoError(message) {
    const videosContainer = document.getElementById('videosContainer');
    if (videosContainer) {
      videosContainer.innerHTML = `<p class="video-error">${
        message || 'Не вдалося завантажити відео'
      }</p>`;
    }
  }

  // Завантажуємо відео при завантаженні сторінки
  if (document.getElementById('videosContainer')) {
    loadYouTubeVideos();
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

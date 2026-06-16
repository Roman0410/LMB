window.GlobalCityGpci = (function () {
  let radarChart = null;
  let benchmarkChart = null;
  let selectedCities = ['Львів', 'Краків'];
  let selectedDirection = 'Економіка';

  function cityColor(city) {
    const palette = {
      Львів: '#2456f4',
      Краків: '#dc2626',
      Гданськ: '#0891b2',
      Порто: '#ca8a04',
      Вроцлав: '#7c3aed',
    };
    return palette[city] || '#64748b';
  }

  function colorWithAlpha(hex, alpha) {
    const normalized = hex.replace('#', '');
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function cityFill(city) {
    const alpha = city === 'Львів' ? 0.24 : 0.16;
    return colorWithAlpha(cityColor(city), alpha);
  }

  function radarCityOrder(cities) {
    return [...cities].sort((a, b) => {
      if (a === 'Львів') return 1;
      if (b === 'Львів') return -1;
      return 0;
    });
  }

  function getRadarScale(cityList, cityData) {
    const values = cityList.flatMap((city) => cityData[city]);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const spread = maxVal - minVal;
    const padding = Math.max(5, Math.round(spread * 0.1));
    let min = Math.max(0, Math.floor((minVal - padding) / 5) * 5);
    let max = Math.min(100, Math.ceil((maxVal + padding) / 5) * 5);

    if (max - min < 35) {
      const center = (minVal + maxVal) / 2;
      min = Math.max(0, Math.floor(center - 17.5));
      max = Math.min(100, Math.ceil(center + 17.5));
    }

    return { min, max };
  }

  function renderCityToggles() {
    const wrap = document.getElementById('city-toggles');
    if (!wrap) return;
    const cities = Object.keys(window.GlobalCityData.gpci.cities);
    wrap.innerHTML = cities
      .map((city) => {
        const active = selectedCities.includes(city);
        return `<button type="button" class="city-toggle ${active ? 'active' : ''}" data-city="${city}" style="--city-accent: ${cityColor(city)}">${city}</button>`;
      })
      .join('');

    wrap.querySelectorAll('.city-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const city = btn.dataset.city;
        if (city === 'Львів') return;
        if (selectedCities.includes(city)) {
          selectedCities = selectedCities.filter((item) => item !== city);
        } else {
          selectedCities.push(city);
        }
        renderCityToggles();
        renderRadar();
        renderBenchmark();
        renderIndicatorTable();
      });
    });
  }

  function renderDirections() {
    const list = document.getElementById('direction-list');
    if (!list) return;
    list.innerHTML = window.GlobalCityData.gpci.directions
      .map(
        (name) =>
          `<button type="button" class="direction-btn ${name === selectedDirection ? 'active' : ''}" data-direction="${name}">${name}</button>`
      )
      .join('');

    list.querySelectorAll('.direction-btn').forEach((button) => {
      button.addEventListener('click', () => {
        selectedDirection = button.dataset.direction;
        renderDirections();
        renderBenchmark();
        renderIndicatorTable();
      });
    });
  }

  function isMobileView() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function getRadarLabels(directions) {
    if (!isMobileView()) return directions;

    const shortLabels = {
      'Освіта та інновації': ['Освіта та', 'інновації'],
      'Культурна взаємодія': ['Культурна', 'взаємодія'],
      'Якість проживання': ['Якість', 'проживання'],
      'Навколишнє середовище': ['Навколишнє', 'середовище'],
    };

    return directions.map((label) => shortLabels[label] || label);
  }

  function renderRadar() {
    const canvas = document.getElementById('gpciRadarChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const { directions, cities } = window.GlobalCityData.gpci;
    const mobile = isMobileView();

    const radarScale = getRadarScale(selectedCities, cities);
    const tickStep = Math.max(5, Math.round((radarScale.max - radarScale.min) / 5));

    const datasets = radarCityOrder(selectedCities).map((city) => ({
      label: city,
      data: cities[city],
      borderColor: cityColor(city),
      backgroundColor: cityFill(city),
      pointBackgroundColor: cityColor(city),
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      pointHoverBackgroundColor: cityColor(city),
      fill: true,
      pointRadius: mobile ? 4 : 3,
      borderWidth: city === 'Львів' ? 3 : 2.5,
    }));

    if (radarChart) radarChart.destroy();
    radarChart = new Chart(canvas, {
      type: 'radar',
      data: { labels: getRadarLabels(directions), datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: mobile
            ? { top: 10, bottom: 10, left: 12, right: 12 }
            : { top: 16, bottom: 16, left: 20, right: 20 },
        },
        plugins: {
          legend: {
            position: mobile ? 'bottom' : 'top',
            labels: {
              boxWidth: 14,
              padding: mobile ? 12 : 16,
              font: { size: mobile ? 12 : 13 },
            },
          },
        },
        scales: {
          r: {
            min: radarScale.min,
            max: radarScale.max,
            ticks: {
              stepSize: tickStep,
              font: { size: mobile ? 10 : 11 },
              backdropPadding: 2,
            },
            pointLabels: {
              font: { size: mobile ? 12 : 13, weight: '600' },
              padding: mobile ? 16 : 22,
              color: '#3d4a5c',
            },
            grid: { circular: false },
            angleLines: { display: true },
          },
        },
      },
    });
  }

  function renderBenchmark() {
    const canvas = document.getElementById('gpciBenchmarkChart');
    const wrap = document.querySelector('.gpci-benchmark-wrap');
    if (!canvas || typeof Chart === 'undefined') return;
    const cities = Object.keys(window.GlobalCityData.gpci.cities);
    const directionIndex = window.GlobalCityData.gpci.directions.indexOf(selectedDirection);
    const values = cities.map((city) => window.GlobalCityData.gpci.cities[city][directionIndex]);

    if (wrap) {
      wrap.style.height = `${Math.max(240, cities.length * 52 + 48)}px`;
      wrap.style.minHeight = wrap.style.height;
    }

    if (benchmarkChart) benchmarkChart.destroy();
    benchmarkChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: cities,
        datasets: [
          {
            label: selectedDirection,
            data: values,
            backgroundColor: cities.map((city) => colorWithAlpha(cityColor(city), 0.82)),
            borderColor: cities.map((city) => cityColor(city)),
            borderWidth: 1,
            barThickness: 28,
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 8, right: 16, bottom: 8, left: 4 },
        },
        plugins: { legend: { display: false } },
        scales: {
          x: {
            min: 0,
            max: 100,
            grid: { color: 'rgba(0, 0, 0, 0.07)' },
            ticks: { font: { size: 11 }, stepSize: 20 },
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 13, weight: '600' },
              color: '#3d4a5c',
              padding: 10,
              autoSkip: false,
            },
          },
        },
      },
    });
  }

  function updateIndicatorTableScroll() {
    const scrollWrap = document.getElementById('indicator-table-scroll');
    if (!scrollWrap) return;

    scrollWrap.classList.toggle('is-compact', selectedCities.length >= 3);
  }

  function renderIndicatorTable() {
    const table = document.getElementById('indicator-table');
    if (!table) return;
    const indicators = window.GlobalCityData.gpci.indicatorsByDirection[selectedDirection] || [];
    table.innerHTML = `
      <thead>
        <tr>
          <th>Індикатор (${selectedDirection})</th>
          ${selectedCities.map((city) => `<th>${city}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${indicators
          .map(
            (indicator) =>
              `<tr><td>${indicator.name}</td>${selectedCities
                .map((city) => `<td>${indicator.values[city] ?? '-'}</td>`)
                .join('')}</tr>`
          )
          .join('')}
      </tbody>
    `;

    updateIndicatorTableScroll();
  }

  function init() {
    renderCityToggles();
    renderDirections();
    renderRadar();
    renderBenchmark();
    renderIndicatorTable();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderRadar, 150);
    });
  }

  return { init };
})();

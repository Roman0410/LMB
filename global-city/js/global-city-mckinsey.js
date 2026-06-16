window.GlobalCityMckinsey = (function () {
  let state = {
    scenario: 'conservative',
    year: 2026,
  };
  let trendChart = null;

  function getScenarioData() {
    return window.GlobalCityData.mckinsey.scenarios[state.scenario];
  }

  function getCurrentPoint() {
    const scenario = getScenarioData();
    const years = Object.keys(scenario.years).map(Number).sort((a, b) => a - b);
    const selected = years.reduce((acc, year) => (year <= state.year ? year : acc), years[0]);
    return { year: selected, data: scenario.years[selected], scenario };
  }

  function updateTrack() {
    const progress = document.getElementById('track-progress');
    const gapFootnote = document.getElementById('gap-years');
    const currentYear = document.getElementById('current-year');
    const rankEl = document.getElementById('mck-current-rank');
    const percentileEl = document.getElementById('mck-percentile');

    if (!progress || !gapFootnote || !currentYear) return;

    const baseYear = window.GlobalCityData.mckinsey.startYear;
    const { scenario, data } = getCurrentPoint();
    const span = scenario.targetYear - baseYear;
    const passed = Math.max(0, state.year - baseYear);
    const ratio = Math.min(100, (passed / span) * 100);

    progress.style.width = `${ratio}%`;

    const yearsLeft = Math.max(0, scenario.targetYear - state.year);
    gapFootnote.textContent = `До цілі «Top-250» за обраним сценарієм залишилось ${yearsLeft} років (рік на шкалі: ${state.year}). Абсолютний розрив — різниця між прискореною та консервативною траєкторією без візії.`;

    currentYear.textContent = state.year;

    if (rankEl) rankEl.textContent = String(data.rank);
    if (percentileEl) {
      const pct = Math.max(1, Math.min(99, Math.round(100 - (data.rank / 1000) * 100)));
      percentileEl.textContent = `${pct}-й персентиль (оцінка)`;
    }
  }

  function updateTable() {
    const table = document.getElementById('mckinsey-table');
    if (!table) return;

    const { data } = getCurrentPoint();
    table.innerHTML = `
      <thead><tr><th>Показник</th><th>Значення (${state.year})</th></tr></thead>
      <tbody>
        <tr><td>Номінальний ВВП, млрд $</td><td>${data.gdpNominal}</td></tr>
        <tr><td>ВВП на душу, $</td><td>${data.gdpPerCapita}</td></tr>
        <tr><td>Зростання ВВП, %</td><td>${data.growth}</td></tr>
        <tr><td>Працевлаштування, %</td><td>${data.employment}</td></tr>
        <tr><td>Працівники бізнес-підтримки, %</td><td>${data.supportJobs}</td></tr>
        <tr><td>Економічна свобода</td><td>${data.freedom}</td></tr>
      </tbody>
    `;
  }

  function renderTrendChart() {
    const canvas = document.getElementById('mckinseyTrendChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const scenario = getScenarioData();
    const years = Object.keys(scenario.years).map(Number).sort((a, b) => a - b);
    const ranks = years.map((year) => scenario.years[year].rank);

    if (trendChart) trendChart.destroy();
    trendChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Позиція Львова',
            data: ranks,
            borderColor: '#2456f4',
            backgroundColor: 'rgba(36, 86, 244, 0.15)',
            tension: 0.25,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { reverse: true } },
      },
    });
  }

  function syncUiState() {
    const slider = document.getElementById('year-slider');
    if (!slider) return;
    const target = getScenarioData().targetYear;
    slider.max = String(target);
    if (state.year > target) state.year = target;
    slider.value = String(state.year);
  }

  function bindControls() {
    document.querySelectorAll('.scenario-btn').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.scenario-btn').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        state.scenario = button.dataset.scenario;
        syncUiState();
        refresh();
      });
    });

    const slider = document.getElementById('year-slider');
    if (slider) {
      slider.addEventListener('input', () => {
        state.year = Number(slider.value);
        refresh({ fullChart: false });
      });
    }
  }

  function refresh({ fullChart = true } = {}) {
    if (fullChart) renderTrendChart();
    updateTrack();
    updateTable();
  }

  function init() {
    bindControls();
    syncUiState();
    refresh();
  }

  return { init };
})();

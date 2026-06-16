window.GlobalCityOxford = (function () {
  let benchmarkChart = null;

  function getTierByRank(rank) {
    if (rank > 600) return 'frontier';
    if (rank > 300) return 'emerging';
    if (rank > 150) return 'regional';
    if (rank > 50) return 'advanced';
    return 'global';
  }

  function renderTierGrid() {
    const grid = document.getElementById('oxford-tier-grid');
    if (!grid) return;

    const { tiers, lvivRank, benchmarks } = window.GlobalCityData.oxford;
    const activeTier = getTierByRank(lvivRank);

    grid.innerHTML = tiers
      .map((tier, index) => {
        const stepClass = `tier-step--n${index + 1}`;
        const isActive = tier.key === activeTier;
        const inTier = benchmarks
          .filter((b) => getTierByRank(b.rank) === tier.key)
          .map((b) => `${b.city} #${b.rank}`)
          .join(' · ');
        const hint = inTier ? `Міста в цьому tier: ${inTier}` : 'Немає бенчмарків у демо-даних для цього tier';
        return `
          <div
            class="tier-step ${stepClass} ${isActive ? 'tier-step--active' : ''}"
            title="${hint}"
          >
            <span class="tier-step__label">${tier.label}</span>
            <span class="tier-step__range">${tier.range}</span>
            ${
              isActive
                ? `<span class="tier-step__badge">Львів #${lvivRank}</span>`
                : ''
            }
          </div>
        `;
      })
      .join('');
  }

  function renderBenchmarkChart() {
    const canvas = document.getElementById('oxfordBenchmarkChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const points = [...window.GlobalCityData.oxford.benchmarks].sort((a, b) => b.rank - a.rank);
    const labels = points.map((item) => item.city);
    const data = points.map((item) => item.rank);
    const colors = points.map((item) => (item.city === 'Львів' ? '#2456f4' : '#d4dbe6'));

    if (benchmarkChart) benchmarkChart.destroy();

    benchmarkChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: 'Позиція у рейтингу (менше = краще)', data, backgroundColor: colors }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 4, right: 8, bottom: 4, left: 0 },
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              font: { size: 11 },
            },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            reverse: true,
            ticks: { font: { size: 11 } },
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  function init() {
    renderTierGrid();
    renderBenchmarkChart();
  }

  return { init };
})();

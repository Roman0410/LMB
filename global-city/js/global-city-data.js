window.GlobalCityData = {
  oxford: {
    lvivRank: 512,
    tiers: [
      { key: 'frontier', label: 'Frontier', range: '600+' },
      { key: 'emerging', label: 'Emerging', range: '300-600' },
      { key: 'regional', label: 'Regional hubs', range: '150-300' },
      { key: 'advanced', label: 'Advanced', range: '50-150' },
      { key: 'global', label: 'Global cities', range: 'Top 50' },
    ],
    benchmarks: [
      { city: 'Львів', rank: 512 },
      { city: 'Краків', rank: 215 },
      { city: 'Гданськ', rank: 217 },
      { city: 'Порто', rank: 200 },
      { city: 'Вроцлав', rank: 175 },
      { city: 'Мюнхен', rank: 22 },
      { city: 'Гетеборг', rank: 49 },
    ],
  },
  mckinsey: {
    startYear: 2026,
    scenarios: {
      conservative: {
        targetYear: 2056,
        years: {
          2026: { rank: 512, gdpNominal: 12.1, gdpPerCapita: 9200, growth: 2.8, employment: 63.4, supportJobs: 8.1, freedom: 52 },
          2030: { rank: 480, gdpNominal: 13.8, gdpPerCapita: 9800, growth: 3.0, employment: 64.1, supportJobs: 8.5, freedom: 54 },
          2035: { rank: 420, gdpNominal: 15.9, gdpPerCapita: 10800, growth: 3.2, employment: 65.3, supportJobs: 9.1, freedom: 57 },
          2040: { rank: 360, gdpNominal: 18.2, gdpPerCapita: 12200, growth: 3.1, employment: 66.5, supportJobs: 9.8, freedom: 60 },
          2045: { rank: 320, gdpNominal: 20.7, gdpPerCapita: 13500, growth: 2.9, employment: 67.4, supportJobs: 10.3, freedom: 63 },
          2050: { rank: 285, gdpNominal: 23.0, gdpPerCapita: 14800, growth: 2.8, employment: 68.0, supportJobs: 10.8, freedom: 66 },
          2056: { rank: 250, gdpNominal: 25.5, gdpPerCapita: 16200, growth: 2.7, employment: 69.1, supportJobs: 11.2, freedom: 69 },
        },
      },
      accelerated: {
        targetYear: 2040,
        years: {
          2026: { rank: 512, gdpNominal: 12.1, gdpPerCapita: 9200, growth: 2.8, employment: 63.4, supportJobs: 8.1, freedom: 52 },
          2030: { rank: 430, gdpNominal: 14.7, gdpPerCapita: 10600, growth: 4.2, employment: 65.0, supportJobs: 9.2, freedom: 58 },
          2035: { rank: 330, gdpNominal: 18.6, gdpPerCapita: 13200, growth: 4.8, employment: 67.8, supportJobs: 11.1, freedom: 67 },
          2040: { rank: 250, gdpNominal: 23.8, gdpPerCapita: 16800, growth: 4.6, employment: 70.9, supportJobs: 13.4, freedom: 74 },
        },
      },
    },
  },
  gpci: {
    directions: [
      'Економіка',
      'Освіта та інновації',
      'Культурна взаємодія',
      'Якість проживання',
      'Навколишнє середовище',
      'Доступність',
    ],
    cities: {
      'Львів': [43, 39, 34, 45, 42, 40],
      'Краків': [58, 54, 52, 57, 48, 55],
      'Гданськ': [52, 50, 46, 53, 49, 51],
      'Порто': [55, 47, 58, 56, 52, 54],
      'Вроцлав': [61, 56, 50, 59, 47, 57],
    },
    indicatorsByDirection: {
      'Економіка': [
        { name: 'Валовий міський продукт', values: { 'Львів': 43, 'Краків': 58, 'Гданськ': 52, 'Порто': 55, 'Вроцлав': 61 } },
        { name: 'Продуктивність праці', values: { 'Львів': 38, 'Краків': 57, 'Гданськ': 49, 'Порто': 53, 'Вроцлав': 60 } },
        { name: 'Інвестиційна динаміка', values: { 'Львів': 46, 'Краків': 59, 'Гданськ': 54, 'Порто': 57, 'Вроцлав': 62 } },
      ],
      'Освіта та інновації': [
        { name: 'R&D витрати', values: { 'Львів': 36, 'Краків': 55, 'Гданськ': 49, 'Порто': 45, 'Вроцлав': 56 } },
        { name: 'Концентрація талантів', values: { 'Львів': 41, 'Краків': 53, 'Гданськ': 50, 'Порто': 48, 'Вроцлав': 58 } },
      ],
      'Культурна взаємодія': [
        { name: 'Міжнародні події', values: { 'Львів': 34, 'Краків': 52, 'Гданськ': 44, 'Порто': 59, 'Вроцлав': 50 } },
        { name: 'Культурні інституції', values: { 'Львів': 33, 'Краків': 51, 'Гданськ': 45, 'Порто': 57, 'Вроцлав': 49 } },
      ],
      'Якість проживання': [
        { name: 'Безпека', values: { 'Львів': 44, 'Краків': 58, 'Гданськ': 56, 'Порто': 55, 'Вроцлав': 60 } },
        { name: 'Житлова доступність', values: { 'Львів': 47, 'Краків': 56, 'Гданськ': 50, 'Порто': 54, 'Вроцлав': 58 } },
      ],
      'Навколишнє середовище': [
        { name: 'Якість повітря', values: { 'Львів': 39, 'Краків': 47, 'Гданськ': 53, 'Порто': 51, 'Вроцлав': 45 } },
        { name: 'Зелені зони', values: { 'Львів': 45, 'Краків': 49, 'Гданськ': 45, 'Порто': 53, 'Вроцлав': 49 } },
      ],
      'Доступність': [
        { name: 'Транспортна звʼязність', values: { 'Львів': 40, 'Краків': 56, 'Гданськ': 52, 'Порто': 55, 'Вроцлав': 58 } },
        { name: 'Авіа/залізничний хаб', values: { 'Львів': 39, 'Краків': 54, 'Гданськ': 50, 'Порто': 53, 'Вроцлав': 56 } },
      ],
    },
  },
};

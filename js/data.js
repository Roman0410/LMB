// Data Management Module

const ReportsData = {
  // Category colors mapping
  categoryColors: {
    infrastructure: '#1976d2', // Blue
    housing: '#f57c00',         // Orange
    education: '#7b1fa2',       // Purple
    ecology: '#388e3c',         // Green
    social: '#c62828',          // Red
    other: '#616161'            // Gray
  },

  // Category labels
  categoryLabels: {
    infrastructure: 'Інфраструктура',
    housing: 'ЖКХ',
    education: 'Освіта',
    ecology: 'Екологія',
    social: 'Соціальний захист',
    other: 'Інше'
  },

  // Report type labels
  reportTypeLabels: {
    problem: 'Проблема',
    improvement: 'Покращення'
  },

  // Lviv districts
  districts: [
    'Галицький',
    'Залізничний',
    'Личаківський',
    'Сихівський',
    'Франківський',
    'Шевченківський'
  ],

  // Demo reports data
  demoReports: [
    {
      id: 1,
      reportType: 'problem',
      category: 'infrastructure',
      district: 'Галицький',
      address: 'вул. Свободи, 15',
      description: 'Пошкоджене покриття тротуару, небезпечно для пішоходів. Потрібен ремонт.',
      images: [],
      contact: 'Іван Петренко, +380501234567',
      coordinates: [49.8397, 24.0297],
      date: '2025-01-15'
    },
    {
      id: 2,
      reportType: 'improvement',
      category: 'ecology',
      district: 'Франківський',
      address: 'вул. Городоцька, 120',
      description: 'Пропоную встановити додаткові контейнери для сортування сміття біля житлових будинків.',
      images: [],
      contact: 'Марія Коваль, maria.koval@email.com',
      coordinates: [49.8150, 23.9900],
      date: '2025-01-20'
    },
    {
      id: 3,
      reportType: 'problem',
      category: 'housing',
      district: 'Сихівський',
      address: 'вул. Володимира Великого, 45',
      description: 'Протікання даху у під\'їзді. Потрібен терміновий ремонт.',
      images: [],
      contact: 'Олександр Мельник, +380671234567',
      coordinates: [49.7900, 24.0500],
      date: '2025-01-25'
    },
    {
      id: 4,
      reportType: 'improvement',
      category: 'education',
      district: 'Личаківський',
      address: 'вул. Личаківська, 200',
      description: 'Пропоную організувати додаткові гуртки для дітей у школі.',
      images: [],
      contact: 'Наталія Шевченко, natalia@email.com',
      coordinates: [49.8500, 24.0400],
      date: '2025-02-01'
    },
    {
      id: 5,
      reportType: 'problem',
      category: 'social',
      district: 'Залізничний',
      address: 'вул. Городоцька, 200',
      description: 'Відсутність пандусів для людей з обмеженими можливостями.',
      images: [],
      contact: 'Володимир Бондар, +380501111111',
      coordinates: [49.8200, 23.9800],
      date: '2025-02-03'
    },
    {
      id: 6,
      reportType: 'problem',
      category: 'infrastructure',
      district: 'Шевченківський',
      address: 'просп. Чорновола, 50',
      description: 'Несправне освітлення на тротуарі. Темно ввечері, небезпечно.',
      images: [],
      contact: 'Оксана Іваненко, oxana@email.com',
      coordinates: [49.8300, 24.0100],
      date: '2025-02-04'
    }
  ],

  // Initialize data from localStorage or use demo data
  init() {
    const stored = localStorage.getItem('lvivReports');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.reports = parsed.length > 0 ? parsed : this.demoReports;
      } catch (e) {
        this.reports = this.demoReports;
      }
    } else {
      this.reports = this.demoReports;
      this.save();
    }
  },

  // Get all reports
  getAll() {
    return this.reports;
  },

  // Get report by ID
  getById(id) {
    return this.reports.find(r => r.id === id);
  },

  // Add new report
  add(report) {
    const newReport = {
      ...report,
      id: this.getNextId(),
      date: new Date().toISOString().split('T')[0]
    };
    this.reports.unshift(newReport); // Add to beginning (newest first)
    this.save();
    return newReport;
  },

  // Get next available ID
  getNextId() {
    if (this.reports.length === 0) return 1;
    return Math.max(...this.reports.map(r => r.id)) + 1;
  },

  // Save to localStorage
  save() {
    localStorage.setItem('lvivReports', JSON.stringify(this.reports));
  },

  // Filter reports
  filter(filters) {
    let filtered = [...this.reports];

    if (filters.type) {
      filtered = filtered.filter(r => r.reportType === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter(r => r.category === filters.category);
    }

    if (filters.district) {
      filtered = filtered.filter(r => r.district === filters.district);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(r =>
        r.address.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower) ||
        r.district.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  },

  // Get category color
  getCategoryColor(category) {
    return this.categoryColors[category] || this.categoryColors.other;
  },

  // Get category label
  getCategoryLabel(category) {
    return this.categoryLabels[category] || 'Інше';
  },

  // Get report type label
  getReportTypeLabel(type) {
    return this.reportTypeLabels[type] || type;
  }
};

// Initialize on load
ReportsData.init();

// Map Module - Leaflet Integration

const MapModule = {
  map: null,
  markers: [],
  currentPopup: null,

  // Initialize map
  init() {
    // Center on Lviv
    this.map = L.map('map', { zoomControl: false }).setView(
      [49.8397, 24.0297],
      13,
    );

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    // Add zoom control at the bottom-left
    L.control
      .zoom({
        position: 'bottomleft',
      })
      .addTo(this.map);

    // Load reports and add markers
    this.loadReports();
  },

  // Load reports and create markers
  loadReports(reports = null) {
    // Clear existing markers
    this.clearMarkers();

    const reportsToShow = reports || ReportsData.getAll();

    reportsToShow.forEach((report) => {
      this.addMarker(report);
    });
  },

  // Add marker for a report
  addMarker(report) {
    const color = ReportsData.getCategoryColor(report.category);

    // Create custom icon
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const marker = L.marker(report.coordinates, { icon })
      .addTo(this.map)
      .bindPopup(this.createPopupContent(report), {
        maxWidth: 320,
        className: 'custom-popup',
      });

    // Store report data in marker
    marker.reportId = report.id;
    this.markers.push(marker);
  },

  // Create popup content
  createPopupContent(report) {
    const categoryLabel = ReportsData.getCategoryLabel(report.category);
    const typeLabel = ReportsData.getReportTypeLabel(report.reportType);
    const date = new Date(report.date).toLocaleDateString('uk-UA');

    let imagesHtml = '';
    if (report.images && report.images.length > 0) {
      imagesHtml = `
        <div class="map-popup-images">
          <div class="map-popup-image-slider">
            ${report.images
              .map(
                (img) => `
              <img src="${img}" alt="Report image" class="map-popup-image" onclick="window.open('${img}', '_blank')">
            `,
              )
              .join('')}
          </div>
        </div>
      `;
    }

    return `
      <div class="map-popup-content">
        <div class="map-popup-header">
          <span class="map-popup-category ${report.category}">${categoryLabel}</span>
          <span class="report-card-type">${typeLabel}</span>
        </div>
        <div class="map-popup-address">${report.address}</div>
        <div class="map-popup-description">${report.description}</div>
        <div class="map-popup-info">
          <div>Район: ${report.district}</div>
          <div>Дата: ${date}</div>
        </div>
        ${imagesHtml}
        <div class="map-popup-contact">
          <strong>Контакт:</strong> ${report.contact}
        </div>
      </div>
    `;
  },

  // Center map on report
  centerOnReport(report) {
    if (!this.map) return;

    this.map.setView(report.coordinates, 15, {
      animate: true,
      duration: 0.5,
    });

    // Find and open marker popup
    const marker = this.markers.find((m) => m.reportId === report.id);
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 500);
    }
  },

  // Clear all markers
  clearMarkers() {
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
  },

  // Add new report marker
  addNewReport(report) {
    this.addMarker(report);
    this.centerOnReport(report);
  },
};

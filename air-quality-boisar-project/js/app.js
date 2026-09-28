/**
 * Main Application Logic
 * - Navigation routing (Home, Information, Findings)
 * - Location -> Area strict automated synchronization
 * - UI event handling and lifecycle coordination
 */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  currentView: 'home',
  selectedLocationId: 1,

  init() {
    this.setupNavigation();
    this.populateLocationSelect();
    this.setupLocationChangeListener();
    this.setupChartToggleListeners();
    
    // Initialize charts with default location 1 (Boisar Railway Station)
    ChartsService.init(this.selectedLocationId);
    
    // Initialize findings page
    FindingsService.renderFindings();

    // Handle initial hash in URL
    const initialHash = window.location.hash.replace('#', '') || 'home';
    this.navigateTo(initialHash);
  },

  // 1. Navigation Routing
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-view');
        window.location.hash = targetView;
        this.navigateTo(targetView);
      });
    });

    window.addEventListener('hashchange', () => {
      const targetView = window.location.hash.replace('#', '') || 'home';
      this.navigateTo(targetView);
    });

    // Also handle any in-page buttons that switch views (e.g. CTA button on Home)
    const ctaButtons = document.querySelectorAll('[data-navigate]');
    ctaButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = btn.getAttribute('data-navigate');
        window.location.hash = targetView;
        this.navigateTo(targetView);
      });
    });
  },

  navigateTo(viewId) {
    const validViews = ['home', 'information', 'findings'];
    if (!validViews.includes(viewId)) viewId = 'home';
    this.currentView = viewId;

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-view') === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Toggle view sections
    document.querySelectorAll('.page-view').forEach(view => {
      if (view.id === `view-${viewId}`) {
        view.classList.add('active-view');
      } else {
        view.classList.remove('active-view');
      }
    });

    // Scroll to top of view
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh charts or findings if navigating into them
    if (viewId === 'information') {
      setTimeout(() => {
        ChartsService.init(this.selectedLocationId);
      }, 50);
    } else if (viewId === 'findings') {
      FindingsService.renderFindings();
    }
  },

  // 2. Populate Location Dropdown with exactly 9 locations
  populateLocationSelect() {
    const locationSelect = document.getElementById('select-location');
    const areaSelect = document.getElementById('select-area');
    if (!locationSelect || !areaSelect) return;

    locationSelect.innerHTML = '';
    const locations = DataService.getAllLocations();
    locations.forEach(loc => {
      const option = document.createElement('option');
      option.value = loc.id;
      option.textContent = `${loc.id}. ${loc.name}`;
      locationSelect.appendChild(option);
    });

    // Populate Area dropdown with exactly 3 options
    areaSelect.innerHTML = '';
    const areas = DataService.getAllAreas();
    areas.forEach((area, idx) => {
      const option = document.createElement('option');
      option.value = area.name;
      option.textContent = `${idx + 1}. ${area.name}`;
      areaSelect.appendChild(option);
    });

    // Synchronize initial area and info banner
    this.syncAreaWithLocation(this.selectedLocationId);
    this.updateLocationInfoBanner(this.selectedLocationId);
  },

  // 3. Location Change Listener & Strict Automatic Area Mapping
  setupLocationChangeListener() {
    const locationSelect = document.getElementById('select-location');
    if (!locationSelect) return;

    locationSelect.addEventListener('change', (e) => {
      const newLocId = Number(e.target.value);
      this.selectedLocationId = newLocId;

      // Automatically update Box 2 (Area)
      this.syncAreaWithLocation(newLocId);

      // Dynamically update Graph 1 & Graph 2
      ChartsService.updateLocationSpecificCharts(newLocId);

      // Update location description banner
      this.updateLocationInfoBanner(newLocId);
    });
  },

  /**
   * Automatic Location -> Area Mapping Logic:
   * Location 1, 2, 3 -> AM-31 / SRO Office Side
   * Location 4, 5, 6 -> AM-8 / Police Chowky Side
   * Location 7, 8, 9 -> O-34 / Sports Stadium Side
   */
  syncAreaWithLocation(locationId) {
    const areaSelect = document.getElementById('select-area');
    const areaBadge = document.getElementById('area-badge-info');
    if (!areaSelect) return;

    const mappedArea = DataService.getAreaForLocation(locationId);
    areaSelect.value = mappedArea;

    if (areaBadge) {
      let areaType = "";
      if (mappedArea.includes("AM-31")) areaType = "Commercial & Traffic Belt";
      else if (mappedArea.includes("AM-8")) areaType = "Industrial Corridor (MIDC)";
      else areaType = "Sports & Institutional Green Belt";

      areaBadge.innerHTML = `<span><strong>Active Zone:</strong> ${mappedArea}</span> <span class="tag-zone">${areaType}</span>`;
    }
  },

  updateLocationInfoBanner(locationId) {
    const loc = DataService.getLocationById(locationId);
    const banner = document.getElementById('location-quick-meta');
    if (!banner || !loc) return;

    const avg = DataService.getLocationAverage(locationId);
    
    // Determine highest month for this station
    let highestM = "June";
    let maxAqi = -1;
    AIR_QUALITY_DATA.months.forEach(m => {
      if (loc.monthlyData[m].AQI > maxAqi) {
        maxAqi = loc.monthlyData[m].AQI;
        highestM = m;
      }
    });

    let aqiCategory = "";
    let aqiCatClass = "";
    if (avg.AQI <= 50) { aqiCategory = "Good"; aqiCatClass = "kpi-good"; }
    else if (avg.AQI <= 100) { aqiCategory = "Satisfactory"; aqiCatClass = "kpi-satisfactory"; }
    else if (avg.AQI <= 200) { aqiCategory = "Moderate"; aqiCatClass = "kpi-moderate"; }
    else { aqiCategory = "Poor"; aqiCatClass = "kpi-poor"; }

    banner.innerHTML = `
      <div class="station-kpi-grid">
        <div class="station-kpi-card kpi-card-station">
          <div class="kpi-icon">&#128205;</div>
          <div class="kpi-info">
            <span class="kpi-label">Active Station</span>
            <span class="kpi-value">${loc.name}</span>
          </div>
        </div>

        <div class="station-kpi-card kpi-card-zone">
          <div class="kpi-icon">&#127962;</div>
          <div class="kpi-info">
            <span class="kpi-label">Monitoring Area</span>
            <span class="kpi-value">${loc.area}</span>
          </div>
        </div>

        <div class="station-kpi-card ${aqiCatClass}">
          <div class="kpi-icon">&#127777;</div>
          <div class="kpi-info">
            <span class="kpi-label">Station Mean AQI</span>
            <span class="kpi-value">${avg.AQI} <span class="kpi-badge">${aqiCategory}</span></span>
          </div>
        </div>

        <div class="station-kpi-card kpi-card-pollutant">
          <div class="kpi-icon">&#9888;</div>
          <div class="kpi-info">
            <span class="kpi-label">Peak Month &amp; PM2.5</span>
            <span class="kpi-value">${highestM} (${maxAqi} AQI) &bull; ${avg.PM25} µg/m³</span>
          </div>
        </div>
      </div>

      <div class="station-env-box">
        <span class="env-tag">Environmental Context:</span>
        <span class="env-text">${loc.description}</span>
      </div>
    `;
  },

  setupChartToggleListeners() {
    const toggleBtns = document.querySelectorAll('.btn-chart-toggle');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const chartType = btn.getAttribute('data-chart-type');
        ChartsService.createGraph3(chartType);
      });
    });
  }
};


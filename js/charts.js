/**
 * Charts Engine for Air Quality Analysis Project
 * Manages Chart.js instances for the 5 independent graphs.
 */

const ChartsService = {
  chart1: null,
  chart2: null,
  chart3: null,
  chart4: null,
  chart5: null,

  // Common Academic Styling Config
  commonOptions: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: "'Inter', sans-serif", size: 12, weight: '500' },
          color: '#334155'
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { family: "'Inter', sans-serif", size: 13 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        padding: 10,
        cornerRadius: 6
      }
    },
    scales: {
      x: {
        grid: { color: '#f1f5f9' },
        ticks: { color: '#475569', font: { family: "'Inter', sans-serif" } }
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { color: '#475569', font: { family: "'Inter', sans-serif" } }
      }
    }
  },

  // Initialize all 5 charts
  init(defaultLocationId = 1) {
    this.createGraph1(defaultLocationId);
    this.createGraph2(defaultLocationId);
    this.createGraph3();
    this.createGraph4();
    this.createGraph5();
  },

  // GRAPH 1 — MONTHLY AQI TREND (Line Chart)
  // Dynamic: updates when Location in Box 1 changes
  createGraph1(locationId) {
    const ctx = document.getElementById('chart-monthly-aqi');
    if (!ctx) return;

    const loc = DataService.getLocationById(locationId);
    const months = AIR_QUALITY_DATA.months;
    const aqiValues = months.map(m => loc.monthlyData[m].AQI);

    const config = {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: `AQI Index (${loc.name})`,
          data: aqiValues,
          borderColor: '#0284c7', // vibrant blue/slate
          backgroundColor: 'rgba(2, 132, 199, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#0284c7',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        ...this.commonOptions,
        scales: {
          ...this.commonOptions.scales,
          y: {
            ...this.commonOptions.scales.y,
            title: { display: true, text: 'Air Quality Index (AQI)', color: '#475569', font: { weight: '600' } },
            suggestedMin: 40,
            suggestedMax: 200
          }
        }
      }
    };

    if (this.chart1) this.chart1.destroy();
    this.chart1 = new Chart(ctx, config);
  },

  // GRAPH 2 — POLLUTANTS COMPARISON (Bar Chart)
  // Dynamic: updates when Location in Box 1 changes
  createGraph2(locationId) {
    const ctx = document.getElementById('chart-pollutants-comparison');
    if (!ctx) return;

    const locAvg = DataService.getLocationAverage(locationId);
    const pollutants = ['PM2.5 (µg/m³)', 'PM10 (µg/m³)', 'NO₂ (µg/m³)', 'SO₂ (µg/m³)', 'CO (mg/m³)'];
    const values = [locAvg.PM25, locAvg.PM10, locAvg.NO2, locAvg.SO2, locAvg.CO];

    const config = {
      type: 'bar',
      data: {
        labels: pollutants,
        datasets: [{
          label: `3-Month Mean Level (${locAvg.name})`,
          data: values,
          backgroundColor: [
            'rgba(239, 68, 68, 0.85)',   // PM2.5 - Red/Coral (high health concern)
            'rgba(249, 115, 22, 0.85)',  // PM10 - Orange
            'rgba(234, 179, 8, 0.85)',   // NO2 - Amber
            'rgba(16, 185, 129, 0.85)',  // SO2 - Emerald
            'rgba(99, 102, 241, 0.85)'   // CO - Indigo
          ],
          borderColor: [
            '#dc2626',
            '#ea580c',
            '#ca8a04',
            '#059669',
            '#4f46e5'
          ],
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        ...this.commonOptions,
        scales: {
          ...this.commonOptions.scales,
          y: {
            ...this.commonOptions.scales.y,
            title: { display: true, text: 'Concentration Level', color: '#475569', font: { weight: '600' } },
            beginAtZero: true
          }
        }
      }
    };

    if (this.chart2) this.chart2.destroy();
    this.chart2 = new Chart(ctx, config);
  },

  graph3Type: 'polarArea',

  // GRAPH 3 — LOCATION-WISE AQI (Polar Area / Radial Spatial Chart)
  // Static: Compares all 9 locations using overall June-August dataset
  createGraph3(chartType = this.graph3Type) {
    this.graph3Type = chartType;
    const ctx = document.getElementById('chart-location-wise');
    if (!ctx) return;

    const locAverages = DataService.getAllLocationsAverageAQI();
    const labels = [
      "1. Boisar Rly Station",
      "2. Boisar Bhaji Market",
      "3. Boisar/Tarapur Rd",
      "4. Boisar MIDC Police Stn",
      "5. Tarapur MIDC Main Rd",
      "6. Navapur Rd - MIDC",
      "7. PDTSA",
      "8. Tarapur Vidya Mandir",
      "9. Friend's Cricket Club"
    ];
    const dataValues = locAverages.map(l => l.averageAQI);

    // Color code according to Area
    const colors = locAverages.map(l => {
      if (l.area.includes('AM-31')) return 'rgba(14, 116, 144, 0.75)'; // AM-31 Cyan/Teal
      if (l.area.includes('AM-8')) return 'rgba(225, 29, 72, 0.75)';   // AM-8 Rose/Crimson (Industrial)
      return 'rgba(16, 149, 108, 0.75)';                             // O-34 Emerald (Sports/Green)
    });

    const borderColors = locAverages.map(l => {
      if (l.area.includes('AM-31')) return '#0e7490';
      if (l.area.includes('AM-8')) return '#be123c';
      return '#10956c';
    });

    let config;

    if (chartType === 'polarArea') {
      config = {
        type: 'polarArea',
        data: {
          labels: labels,
          datasets: [{
            label: 'Average AQI (June – August)',
            data: dataValues,
            backgroundColor: colors,
            borderColor: '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                font: { family: "'Inter', sans-serif", size: 11 },
                color: '#334155',
                padding: 10
              }
            },
            tooltip: {
              backgroundColor: '#1e293b',
              padding: 10,
              callbacks: {
                label(context) {
                  return ` ${context.label}: ${context.raw} AQI`;
                }
              }
            }
          },
          scales: {
            r: {
              grid: { color: '#e2e8f0' },
              ticks: {
                backdropColor: 'transparent',
                color: '#64748b',
                font: { size: 10 }
              },
              suggestedMin: 40
            }
          }
        }
      };
    } else if (chartType === 'radar') {
      config = {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Average AQI (June – August)',
            data: dataValues,
            backgroundColor: 'rgba(15, 118, 110, 0.25)',
            borderColor: '#0f766e',
            pointBackgroundColor: borderColors,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            borderWidth: 2.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: { family: "'Inter', sans-serif", size: 12 },
                color: '#334155'
              }
            },
            tooltip: {
              backgroundColor: '#1e293b',
              padding: 10
            }
          },
          scales: {
            r: {
              grid: { color: '#e2e8f0' },
              ticks: {
                backdropColor: 'transparent',
                color: '#64748b',
                font: { size: 10 }
              },
              suggestedMin: 40
            }
          }
        }
      };
    } else {
      // Horizontal Bar Chart
      config = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Overall Average AQI (June – August)',
            data: dataValues,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 1.5,
            borderRadius: 6
          }]
        },
        options: {
          ...this.commonOptions,
          indexAxis: 'y',
          scales: {
            x: {
              grid: { color: '#f1f5f9' },
              title: { display: true, text: 'Average AQI', color: '#475569', font: { weight: '600' } },
              beginAtZero: true,
              suggestedMax: 160
            },
            y: {
              grid: { display: false },
              ticks: { color: '#1e293b', font: { family: "'Inter', sans-serif", weight: '500', size: 11 } }
            }
          }
        }
      };
    }

    if (this.chart3) this.chart3.destroy();
    this.chart3 = new Chart(ctx, config);
  },

  // GRAPH 4 — AREA-WISE AQI (Bar Chart)
  // Static: Compares AM-31, AM-8, and O-34 using overall June-August dataset
  // Shows highest and lowest areas
  createGraph4() {
    const ctx = document.getElementById('chart-area-wise');
    if (!ctx) return;

    const areaAverages = DataService.getAreaWiseAverageAQI();
    const labels = areaAverages.map(a => `${a.areaId}: ${a.name.split('/')[1]?.trim() || a.name}`);
    const dataValues = areaAverages.map(a => a.averageAQI);

    // Identify highest and lowest
    const highestVal = Math.max(...dataValues);
    const lowestVal = Math.min(...dataValues);

    const backgroundColors = dataValues.map(v => {
      if (v === highestVal) return 'rgba(225, 29, 72, 0.85)';  // High - Rose Red
      if (v === lowestVal) return 'rgba(16, 185, 129, 0.85)';  // Low - Emerald Safe
      return 'rgba(2, 132, 199, 0.85)';                       // Moderate - Blue
    });

    const borderColors = dataValues.map(v => {
      if (v === highestVal) return '#be123c';
      if (v === lowestVal) return '#047857';
      return '#0369a1';
    });

    const config = {
      type: 'bar',
      data: {
        labels: [
          'AM-31: SRO Office Side (Commercial)',
          'AM-8: Police Chowky Side (Industrial Belt)',
          'O-34: Sports Stadium Side (Recreational)'
        ],
        datasets: [{
          label: 'Area Average AQI (June – August)',
          data: dataValues,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1.5,
          borderRadius: 8
        }]
      },
      options: {
        ...this.commonOptions,
        scales: {
          ...this.commonOptions.scales,
          y: {
            ...this.commonOptions.scales.y,
            title: { display: true, text: 'Average AQI', color: '#475569', font: { weight: '600' } },
            beginAtZero: true,
            suggestedMax: 150
          }
        },
        plugins: {
          ...this.commonOptions.plugins,
          tooltip: {
            ...this.commonOptions.plugins.tooltip,
            callbacks: {
              afterLabel(context) {
                const val = context.parsed.y;
                if (val === highestVal) return '⚠ HIGHEST REGIONAL AQI';
                if (val === lowestVal) return '✓ LOWEST REGIONAL AQI';
                return '';
              }
            }
          }
        }
      }
    };

    if (this.chart4) this.chart4.destroy();
    this.chart4 = new Chart(ctx, config);
  },

  // GRAPH 5 — PM2.5 MONTHLY TREND (Line Chart)
  // Static: Overall dataset June-August trend highlighting PM2.5 health significance
  createGraph5() {
    const ctx = document.getElementById('chart-pm25-trend');
    if (!ctx) return;

    const monthlyPM25 = DataService.getMonthlyOverallPM25();
    const months = monthlyPM25.map(m => m.month);
    const pmValues = monthlyPM25.map(m => m.averagePM25);
    const standardLimit = AIR_QUALITY_DATA.metadata.standardPermissibleLimits.PM25.limit;

    const config = {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Overall Regional PM2.5 Mean (µg/m³)',
            data: pmValues,
            borderColor: '#e11d48', // Red highlight
            backgroundColor: 'rgba(225, 29, 72, 0.12)',
            borderWidth: 3.5,
            fill: true,
            tension: 0.25,
            pointBackgroundColor: '#e11d48',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 7,
            pointHoverRadius: 9
          },
          {
            label: `NAAQS Permissible Threshold (${standardLimit} µg/m³)`,
            data: [standardLimit, standardLimit, standardLimit],
            borderColor: '#94a3b8',
            borderWidth: 2,
            borderDash: [6, 6],
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        ...this.commonOptions,
        scales: {
          ...this.commonOptions.scales,
          y: {
            ...this.commonOptions.scales.y,
            title: { display: true, text: 'PM2.5 Concentration (µg/m³)', color: '#475569', font: { weight: '600' } },
            beginAtZero: true,
            suggestedMax: 80
          }
        }
      }
    };

    if (this.chart5) this.chart5.destroy();
    this.chart5 = new Chart(ctx, config);
  },

  // Dynamic update when Location is changed in Box 1
  updateLocationSpecificCharts(locationId) {
    this.createGraph1(locationId);
    this.createGraph2(locationId);
  }
};

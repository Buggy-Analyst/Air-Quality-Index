/**
 * Air Quality Trend Analysis Using Open Environmental Data
 * Boisar / Tarapur Region (June, July, August)
 * B.Sc. Data Science Project
 * 
 * Dataset Architecture:
 * - 9 Locations grouped into 3 Areas
 * - Months: June, July, August
 * - Parameters: AQI, PM2.5 (µg/m³), PM10 (µg/m³), NO2 (µg/m³), SO2 (µg/m³), CO (mg/m³)
 */

const AIR_QUALITY_DATA = {
  metadata: {
    region: "Boisar / Tarapur, Palghar District, Maharashtra",
    period: "June, July, August",
    academicProject: "B.Sc. Data Science - Air Quality Trend Analysis",
    dataSource: "Open Environmental Monitoring Data (CPCB / MPCB Open Ambient Stations)",
    standardPermissibleLimits: {
      PM25: { limit: 60, unit: "µg/m³", standard: "NAAQS 24h" },
      PM10: { limit: 100, unit: "µg/m³", standard: "NAAQS 24h" },
      NO2: { limit: 80, unit: "µg/m³", standard: "NAAQS 24h" },
      SO2: { limit: 80, unit: "µg/m³", standard: "NAAQS 24h" },
      CO: { limit: 2.0, unit: "mg/m³", standard: "NAAQS 8h" }
    }
  },

  areas: [
    { id: "AM-31", name: "AM-31 / SRO Office Side", type: "Commercial & Traffic Belt" },
    { id: "AM-8", name: "AM-8 / Police Chowky Side", type: "Heavy Industrial Belt (MIDC)" },
    { id: "O-34", name: "O-34 / Sports Stadium Side", type: "Institutional & Recreational Zone" }
  ],

  months: ["June", "July", "August"],

  // Exactly 9 Locations mapped strictly to 3 Areas
  locations: [
    // Area 1: AM-31 / SRO Office Side (Locations 1, 2, 3)
    {
      id: 1,
      name: "Boisar Railway Station",
      area: "AM-31 / SRO Office Side",
      areaId: "AM-31",
      description: "High vehicular transit hub and railway passenger corridor.",
      monthlyData: {
        June:   { AQI: 128, PM25: 58.4, PM10: 114.2, NO2: 34.6, SO2: 22.1, CO: 1.45 },
        July:   { AQI: 76,  PM25: 32.1, PM10: 64.8,  NO2: 21.8, SO2: 14.5, CO: 0.92 },
        August: { AQI: 84,  PM25: 36.5, PM10: 72.3,  NO2: 24.2, SO2: 16.0, CO: 1.05 }
      }
    },
    {
      id: 2,
      name: "Boisar Bhaji Market",
      area: "AM-31 / SRO Office Side",
      areaId: "AM-31",
      description: "Dense commercial market with persistent localized traffic and pedestrian density.",
      monthlyData: {
        June:   { AQI: 136, PM25: 62.1, PM10: 122.5, NO2: 38.2, SO2: 24.8, CO: 1.58 },
        July:   { AQI: 82,  PM25: 35.8, PM10: 71.2,  NO2: 23.5, SO2: 15.2, CO: 0.98 },
        August: { AQI: 91,  PM25: 39.4, PM10: 78.6,  NO2: 26.1, SO2: 17.5, CO: 1.12 }
      }
    },
    {
      id: 3,
      name: "Boisar/Tarapur Road",
      area: "AM-31 / SRO Office Side",
      areaId: "AM-31",
      description: "Major connecting arterial road with mixed heavy commercial and commuter traffic.",
      monthlyData: {
        June:   { AQI: 142, PM25: 65.8, PM10: 129.4, NO2: 41.5, SO2: 26.4, CO: 1.64 },
        July:   { AQI: 88,  PM25: 38.6, PM10: 76.5,  NO2: 25.4, SO2: 16.8, CO: 1.08 },
        August: { AQI: 96,  PM25: 42.2, PM10: 83.1,  NO2: 28.0, SO2: 18.9, CO: 1.19 }
      }
    },

    // Area 2: AM-8 / Police Chowky Side (Locations 4, 5, 6)
    {
      id: 4,
      name: "Boisar MIDC Police Station",
      area: "AM-8 / Police Chowky Side",
      areaId: "AM-8",
      description: "Gateway junction to the MIDC industrial corridor with heavy multi-axle freight movement.",
      monthlyData: {
        June:   { AQI: 154, PM25: 72.3, PM10: 142.8, NO2: 46.2, SO2: 34.5, CO: 1.72 },
        July:   { AQI: 94,  PM25: 43.1, PM10: 84.6,  NO2: 29.8, SO2: 21.4, CO: 1.15 },
        August: { AQI: 106, PM25: 48.7, PM10: 95.3,  NO2: 33.1, SO2: 24.8, CO: 1.28 }
      }
    },
    {
      id: 5,
      name: "Tarapur MIDC Main Road / Industrial Belt",
      area: "AM-8 / Police Chowky Side",
      areaId: "AM-8",
      description: "Core industrial spine with chemical, textile, and manufacturing plant emissions.",
      monthlyData: {
        June:   { AQI: 172, PM25: 81.5, PM10: 161.4, NO2: 52.8, SO2: 41.2, CO: 1.92 },
        July:   { AQI: 108, PM25: 49.6, PM10: 98.2,  NO2: 34.2, SO2: 26.5, CO: 1.31 },
        August: { AQI: 119, PM25: 55.3, PM10: 109.8, NO2: 38.6, SO2: 30.1, CO: 1.44 }
      }
    },
    {
      id: 6,
      name: "Navapur Road – MIDC Side",
      area: "AM-8 / Police Chowky Side",
      areaId: "AM-8",
      description: "Industrial transit route adjoining chemical and manufacturing plots.",
      monthlyData: {
        June:   { AQI: 148, PM25: 69.4, PM10: 137.6, NO2: 44.1, SO2: 32.7, CO: 1.68 },
        July:   { AQI: 91,  PM25: 41.2, PM10: 81.9,  NO2: 28.5, SO2: 20.3, CO: 1.10 },
        August: { AQI: 102, PM25: 46.8, PM10: 91.5,  NO2: 31.7, SO2: 23.4, CO: 1.22 }
      }
    },

    // Area 3: O-34 / Sports Stadium Side (Locations 7, 8, 9)
    {
      id: 7,
      name: "Palghar Dahanu Taluka Sports Association (PDTSA)",
      area: "O-34 / Sports Stadium Side",
      areaId: "O-34",
      description: "Large open sports complex and green belt with minimized vehicular exposure.",
      monthlyData: {
        June:   { AQI: 92,  PM25: 41.2, PM10: 82.5,  NO2: 22.4, SO2: 14.1, CO: 0.82 },
        July:   { AQI: 54,  PM25: 23.4, PM10: 46.8,  NO2: 14.2, SO2: 9.3,  CO: 0.54 },
        August: { AQI: 62,  PM25: 26.8, PM10: 53.4,  NO2: 16.5, SO2: 10.8, CO: 0.61 }
      }
    },
    {
      id: 8,
      name: "Tarapur Vidya Mandir Ground",
      area: "O-34 / Sports Stadium Side",
      areaId: "O-34",
      description: "Educational campus ground located away from heavy industrial stacks.",
      monthlyData: {
        June:   { AQI: 98,  PM25: 44.5, PM10: 87.9,  NO2: 24.1, SO2: 15.2, CO: 0.88 },
        July:   { AQI: 58,  PM25: 25.1, PM10: 50.2,  NO2: 15.4, SO2: 10.1, CO: 0.58 },
        August: { AQI: 67,  PM25: 28.9, PM10: 57.6,  NO2: 17.8, SO2: 11.5, CO: 0.66 }
      }
    },
    {
      id: 9,
      name: "Friend's Cricket Club Ground",
      area: "O-34 / Sports Stadium Side",
      areaId: "O-34",
      description: "Open recreational field with optimal sea breeze dispersion and low traffic.",
      monthlyData: {
        June:   { AQI: 86,  PM25: 38.2, PM10: 76.4,  NO2: 20.8, SO2: 13.0, CO: 0.76 },
        July:   { AQI: 51,  PM25: 21.8, PM10: 43.5,  NO2: 13.1, SO2: 8.7,  CO: 0.49 },
        August: { AQI: 59,  PM25: 24.6, PM10: 49.8,  NO2: 15.0, SO2: 9.9,  CO: 0.56 }
      }
    }
  ]
};

/**
 * Data Access & Analytical Helper Functions
 */
const DataService = {
  // Get all locations
  getAllLocations() {
    return AIR_QUALITY_DATA.locations;
  },

  // Get location by id
  getLocationById(id) {
    return AIR_QUALITY_DATA.locations.find(loc => loc.id === Number(id));
  },

  // Get all unique areas
  getAllAreas() {
    return AIR_QUALITY_DATA.areas;
  },

  // Compute 3-month overall average for a single location
  getLocationAverage(locationId) {
    const loc = this.getLocationById(locationId);
    if (!loc) return null;
    const months = AIR_QUALITY_DATA.months;
    const count = months.length;

    const totals = { AQI: 0, PM25: 0, PM10: 0, NO2: 0, SO2: 0, CO: 0 };
    months.forEach(m => {
      const data = loc.monthlyData[m];
      totals.AQI += data.AQI;
      totals.PM25 += data.PM25;
      totals.PM10 += data.PM10;
      totals.NO2 += data.NO2;
      totals.SO2 += data.SO2;
      totals.CO += data.CO;
    });

    return {
      id: loc.id,
      name: loc.name,
      area: loc.area,
      areaId: loc.areaId,
      AQI: +(totals.AQI / count).toFixed(1),
      PM25: +(totals.PM25 / count).toFixed(1),
      PM10: +(totals.PM10 / count).toFixed(1),
      NO2: +(totals.NO2 / count).toFixed(1),
      SO2: +(totals.SO2 / count).toFixed(1),
      CO: +(totals.CO / count).toFixed(2)
    };
  },

  // Compute overall average AQI for all 9 locations across June-August
  getAllLocationsAverageAQI() {
    return AIR_QUALITY_DATA.locations.map(loc => {
      const avg = this.getLocationAverage(loc.id);
      return {
        id: loc.id,
        name: loc.name,
        area: loc.area,
        averageAQI: avg.AQI
      };
    });
  },

  // Compute overall average AQI per area across June-August
  getAreaWiseAverageAQI() {
    return AIR_QUALITY_DATA.areas.map(area => {
      const locsInArea = AIR_QUALITY_DATA.locations.filter(loc => loc.areaId === area.id);
      let totalAQI = 0;
      let dataPoints = 0;

      locsInArea.forEach(loc => {
        AIR_QUALITY_DATA.months.forEach(m => {
          totalAQI += loc.monthlyData[m].AQI;
          dataPoints++;
        });
      });

      const avgAQI = +(totalAQI / dataPoints).toFixed(1);
      return {
        areaId: area.id,
        name: area.name,
        type: area.type,
        averageAQI: avgAQI
      };
    });
  },

  // Compute overall monthly averages for PM2.5 across all 9 locations
  getMonthlyOverallPM25() {
    return AIR_QUALITY_DATA.months.map(month => {
      let totalPM25 = 0;
      AIR_QUALITY_DATA.locations.forEach(loc => {
        totalPM25 += loc.monthlyData[month].PM25;
      });
      return {
        month,
        averagePM25: +(totalPM25 / AIR_QUALITY_DATA.locations.length).toFixed(1)
      };
    });
  },

  // Compute overall monthly average AQI across all 9 locations
  getMonthlyOverallAQI() {
    return AIR_QUALITY_DATA.months.map(month => {
      let totalAQI = 0;
      AIR_QUALITY_DATA.locations.forEach(loc => {
        totalAQI += loc.monthlyData[month].AQI;
      });
      return {
        month,
        averageAQI: +(totalAQI / AIR_QUALITY_DATA.locations.length).toFixed(1)
      };
    });
  },

  // Location -> Area strict mapping logic
  getAreaForLocation(locationId) {
    const id = Number(locationId);
    if (id >= 1 && id <= 3) {
      return "AM-31 / SRO Office Side";
    } else if (id >= 4 && id <= 6) {
      return "AM-8 / Police Chowky Side";
    } else if (id >= 7 && id <= 9) {
      return "O-34 / Sports Stadium Side";
    }
    return "AM-31 / SRO Office Side";
  }
};

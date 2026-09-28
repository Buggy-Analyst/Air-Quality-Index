/**
 * Analytical Engine for Findings Page
 * Computes all 6 key findings dynamically from the dataset.
 */

const FindingsService = {
  calculateAll() {
    const locations = DataService.getAllLocations();
    const areas = DataService.getAllAreas();
    const months = AIR_QUALITY_DATA.months;

    // 1. Compute 3-month average for each location
    const locationAverages = locations.map(loc => {
      const avg = DataService.getLocationAverage(loc.id);
      return {
        id: loc.id,
        name: loc.name,
        area: loc.area,
        averageAQI: avg.AQI
      };
    });

    // 1. Highest AQI Location
    let highestLoc = locationAverages[0];
    let lowestLoc = locationAverages[0];
    locationAverages.forEach(loc => {
      if (loc.averageAQI > highestLoc.averageAQI) highestLoc = loc;
      if (loc.averageAQI < lowestLoc.averageAQI) lowestLoc = loc;
    });

    // 2. Monthly Averages across all locations
    const monthlyOverallAQI = DataService.getMonthlyOverallAQI();
    let highestMonth = monthlyOverallAQI[0];
    monthlyOverallAQI.forEach(m => {
      if (m.averageAQI > highestMonth.averageAQI) highestMonth = m;
    });

    // 3. Area Comparison
    const areaAverages = DataService.getAreaWiseAverageAQI();
    let highestArea = areaAverages[0];
    let lowestArea = areaAverages[0];
    areaAverages.forEach(area => {
      if (area.averageAQI > highestArea.averageAQI) highestArea = area;
      if (area.averageAQI < lowestArea.averageAQI) lowestArea = area;
    });

    // 4. Most Concerning Pollutant
    // Evaluates average concentrations relative to permissible regulatory limits (NAAQS)
    // rather than raw numeric scale (e.g. CO is in mg/m³, PM in µg/m³)
    const limits = AIR_QUALITY_DATA.metadata.standardPermissibleLimits;
    const pollutantTotals = { PM25: 0, PM10: 0, NO2: 0, SO2: 0, CO: 0 };
    let sampleCount = 0;

    locations.forEach(loc => {
      months.forEach(m => {
        const d = loc.monthlyData[m];
        pollutantTotals.PM25 += d.PM25;
        pollutantTotals.PM10 += d.PM10;
        pollutantTotals.NO2 += d.NO2;
        pollutantTotals.SO2 += d.SO2;
        pollutantTotals.CO += d.CO;
        sampleCount++;
      });
    });

    const pollutantAvgs = {
      PM25: +(pollutantTotals.PM25 / sampleCount).toFixed(1),
      PM10: +(pollutantTotals.PM10 / sampleCount).toFixed(1),
      NO2: +(pollutantTotals.NO2 / sampleCount).toFixed(1),
      SO2: +(pollutantTotals.SO2 / sampleCount).toFixed(1),
      CO: +(pollutantTotals.CO / sampleCount).toFixed(2)
    };

    // Severity ratio = average / standard limit
    const severityRatios = {
      PM25: { name: "PM2.5", ratio: pollutantAvgs.PM25 / limits.PM25.limit, avg: pollutantAvgs.PM25, limit: limits.PM25.limit, unit: limits.PM25.unit },
      PM10: { name: "PM10", ratio: pollutantAvgs.PM10 / limits.PM10.limit, avg: pollutantAvgs.PM10, limit: limits.PM10.limit, unit: limits.PM10.unit },
      NO2:  { name: "NO₂", ratio: pollutantAvgs.NO2 / limits.NO2.limit, avg: pollutantAvgs.NO2, limit: limits.NO2.limit, unit: limits.NO2.unit },
      SO2:  { name: "SO₂", ratio: pollutantAvgs.SO2 / limits.SO2.limit, avg: pollutantAvgs.SO2, limit: limits.SO2.limit, unit: limits.SO2.unit },
      CO:   { name: "CO", ratio: pollutantAvgs.CO / limits.CO.limit, avg: pollutantAvgs.CO, limit: limits.CO.limit, unit: limits.CO.unit }
    };

    // Identify pollutant with highest severity ratio
    let mostConcerning = severityRatios.PM25;
    Object.values(severityRatios).forEach(p => {
      if (p.ratio > mostConcerning.ratio) {
        mostConcerning = p;
      }
    });

    // 5. Overall Observation (Trend: Increasing, Decreasing, or Fluctuating)
    const juneAvg = monthlyOverallAQI.find(m => m.month === "June").averageAQI;
    const julyAvg = monthlyOverallAQI.find(m => m.month === "July").averageAQI;
    const augustAvg = monthlyOverallAQI.find(m => m.month === "August").averageAQI;

    let trendClassification = "";
    let trendExplanation = "";

    if (juneAvg < julyAvg && julyAvg < augustAvg) {
      trendClassification = "Increasing";
      trendExplanation = "Air quality levels show a continuous upward trend across the three-month period.";
    } else if (juneAvg > julyAvg && julyAvg > augustAvg) {
      trendClassification = "Decreasing";
      trendExplanation = "Air quality levels consistently decreased from June through August.";
    } else {
      trendClassification = "Fluctuating";
      trendExplanation = `AQI drops significantly from June (${juneAvg}) to July (${julyAvg}) due to heavy monsoon rain wash-out (wet scavenging), followed by a slight rebound in August (${augustAvg}).`;
    }

    return {
      highestLocation: {
        name: highestLoc.name,
        aqi: highestLoc.averageAQI,
        area: highestLoc.area
      },
      lowestLocation: {
        name: lowestLoc.name,
        aqi: lowestLoc.averageAQI,
        area: lowestLoc.area
      },
      mostConcerningPollutant: {
        name: mostConcerning.name,
        average: mostConcerning.avg,
        unit: mostConcerning.unit,
        limit: mostConcerning.limit,
        ratio: +(mostConcerning.ratio * 100).toFixed(1),
        rationale: "Evaluated by comparing ambient concentrations against National Ambient Air Quality Standards (NAAQS). Due to its microscopic aerodynamic diameter (≤ 2.5 µm), it easily bypasses upper airway filtration and penetrates deep into the pulmonary alveoli."
      },
      highestMonth: {
        name: highestMonth.month,
        aqi: highestMonth.averageAQI,
        comparison: monthlyOverallAQI
      },
      highestArea: {
        name: highestArea.name,
        aqi: highestArea.averageAQI,
        lowestArea: lowestArea.name,
        lowestAqi: lowestArea.averageAQI,
        allAreas: areaAverages
      },
      overallTrend: {
        classification: trendClassification,
        explanation: trendExplanation,
        monthlyValues: {
          June: juneAvg,
          July: julyAvg,
          August: augustAvg
        }
      },
      locationAverages
    };
  },

  renderFindings() {
    const findings = this.calculateAll();
    const container = document.getElementById("dynamic-findings-content");
    if (!container) return;

    // Calculate Monsoon Rain Wash-out drop %
    const juneAvg = findings.overallTrend.monthlyValues.June;
    const julyAvg = findings.overallTrend.monthlyValues.July;
    const washoutReduction = +(((juneAvg - julyAvg) / juneAvg) * 100).toFixed(1);

    container.innerHTML = `
      <!-- 4-Box Executive Analytical Summary Strip -->
      <div class="executive-kpis-grid">
        <div class="exec-kpi-card exec-kpi-crimson">
          <span class="exec-kpi-label">Peak Station AQI</span>
          <div class="exec-kpi-value">${findings.highestLocation.aqi}</div>
          <span class="exec-kpi-desc">${findings.highestLocation.name}</span>
        </div>

        <div class="exec-kpi-card exec-kpi-emerald">
          <span class="exec-kpi-label">Cleanest Station AQI</span>
          <div class="exec-kpi-value">${findings.lowestLocation.aqi}</div>
          <span class="exec-kpi-desc">${findings.lowestLocation.name}</span>
        </div>

        <div class="exec-kpi-card exec-kpi-blue">
          <span class="exec-kpi-label">Monsoon Wash-out Drop</span>
          <div class="exec-kpi-value">-${washoutReduction}%</div>
          <span class="exec-kpi-desc">Regional reduction June &rarr; July</span>
        </div>

        <div class="exec-kpi-card exec-kpi-amber">
          <span class="exec-kpi-label">Primary Health Hazard</span>
          <div class="exec-kpi-value">${findings.mostConcerningPollutant.name}</div>
          <span class="exec-kpi-desc">${findings.mostConcerningPollutant.average} ${findings.mostConcerningPollutant.unit} Regional Mean</span>
        </div>
      </div>

      <div class="findings-grid">
        <!-- 1. Highest AQI Location -->
        <div class="finding-card finding-card-crimson">
          <div class="finding-badge-pill pill-crimson">01</div>
          <div class="finding-body">
            <div class="finding-label">Highest Average AQI</div>
            <div class="finding-value highlight-warning">${findings.highestLocation.name}</div>
            <div class="finding-detail">
              <strong>Calculated Average AQI:</strong> ${findings.highestLocation.aqi}
              <span class="badge badge-warning">${findings.highestLocation.area}</span>
            </div>
          </div>
        </div>

        <!-- 2. Lowest AQI Location -->
        <div class="finding-card finding-card-emerald">
          <div class="finding-badge-pill pill-emerald">02</div>
          <div class="finding-body">
            <div class="finding-label">Lowest Average AQI</div>
            <div class="finding-value highlight-safe">${findings.lowestLocation.name}</div>
            <div class="finding-detail">
              <strong>Calculated Average AQI:</strong> ${findings.lowestLocation.aqi}
              <span class="badge badge-safe">${findings.lowestLocation.area}</span>
            </div>
          </div>
        </div>

        <!-- 3. Most Concerning Pollutant -->
        <div class="finding-card finding-card-rose">
          <div class="finding-badge-pill pill-rose">03</div>
          <div class="finding-body">
            <div class="finding-label">Most Concerning Pollutant</div>
            <div class="finding-value highlight-danger">${findings.mostConcerningPollutant.name}</div>
            <div class="finding-detail">
              <strong>Mean Level:</strong> ${findings.mostConcerningPollutant.average} ${findings.mostConcerningPollutant.unit} 
              (NAAQS standard: ${findings.mostConcerningPollutant.limit} ${findings.mostConcerningPollutant.unit})
              <p class="finding-note">${findings.mostConcerningPollutant.rationale}</p>
            </div>
          </div>
        </div>

        <!-- 4. Highest Pollution Month -->
        <div class="finding-card finding-card-amber">
          <div class="finding-badge-pill pill-amber">04</div>
          <div class="finding-body">
            <div class="finding-label">Highest Pollution Month</div>
            <div class="finding-value highlight-amber">${findings.highestMonth.name}</div>
            <div class="finding-detail">
              <strong>Regional Average AQI:</strong> ${findings.highestMonth.aqi}
              <span class="finding-subtext">Pre-monsoon / monsoon onset window prior to intense wet scavenging.</span>
            </div>
          </div>
        </div>

        <!-- 5. Area Comparison -->
        <div class="finding-card finding-card-indigo">
          <div class="finding-badge-pill pill-indigo">05</div>
          <div class="finding-body">
            <div class="finding-label">Highest AQI Area</div>
            <div class="finding-value highlight-indigo">${findings.highestArea.name}</div>
            <div class="finding-detail">
              <strong>Calculated Average AQI:</strong> ${findings.highestArea.aqi}
              <span class="finding-subtext">Compared to lowest area: <em>${findings.highestArea.lowestArea}</em> (${findings.highestArea.lowestAqi} AQI).</span>
            </div>
          </div>
        </div>

        <!-- 6. Overall Observation -->
        <div class="finding-card finding-card-teal">
          <div class="finding-badge-pill pill-teal">06</div>
          <div class="finding-body">
            <div class="finding-label">Overall AQI Trend</div>
            <div class="finding-value highlight-obs">${findings.overallTrend.classification}</div>
            <div class="finding-detail">
              <p class="finding-note">
                <strong>Trend Dynamics:</strong> ${findings.overallTrend.explanation}
              </p>
              <div class="month-chips">
                <span class="chip chip-june">June: <strong>${findings.overallTrend.monthlyValues.June}</strong></span>
                <span class="chip chip-july">July: <strong>${findings.overallTrend.monthlyValues.July}</strong></span>
                <span class="chip chip-august">August: <strong>${findings.overallTrend.monthlyValues.August}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Supporting Analytical Summary Table -->
      <div class="findings-table-wrapper">
        <h4 class="table-heading">Station-wise Computed Averages (June – August)</h4>
        <div class="table-responsive">
          <table class="academic-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Monitoring Location</th>
                <th>Assigned Area</th>
                <th>Average AQI</th>
                <th>Avg PM2.5 (µg/m³)</th>
                <th>Avg PM10 (µg/m³)</th>
                <th>Avg NO₂ (µg/m³)</th>
                <th>Avg SO₂ (µg/m³)</th>
                <th>Avg CO (mg/m³)</th>
              </tr>
            </thead>
            <tbody>
              ${findings.locationAverages.map(loc => {
                const fullAvg = DataService.getLocationAverage(loc.id);
                return `
                  <tr>
                    <td>${loc.id}</td>
                    <td><strong>${loc.name}</strong></td>
                    <td><span class="table-area-tag">${loc.area.split('/')[0].trim()}</span></td>
                    <td><span class="aqi-badge aqi-${getAqiClass(fullAvg.AQI)}">${fullAvg.AQI}</span></td>
                    <td>${fullAvg.PM25}</td>
                    <td>${fullAvg.PM10}</td>
                    <td>${fullAvg.NO2}</td>
                    <td>${fullAvg.SO2}</td>
                    <td>${fullAvg.CO}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};

function getAqiClass(aqi) {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "satisfactory";
  if (aqi <= 200) return "moderate";
  return "poor";
}

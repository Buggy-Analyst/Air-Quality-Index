# Air Quality Trend Analysis Using Open Environmental Data (Boisar / Tarapur)
**B.Sc. Data Science Project**

## 1. Project Overview
This project presents an ambient air-quality trend analysis for the **Boisar / Tarapur** industrial region in Palghar district, Maharashtra, during the monsoon period (**June, July, and August**). 

The platform evaluates spatial and temporal dynamics of air pollution across:
- **9 Strategic Environmental Monitoring Locations**
- **3 Designated Operational Areas / Belts**
- **5 Critical Pollutants**: $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{SO}_2$, and $\text{CO}$, alongside computed **AQI (Air Quality Index)**.

---

## 2. Directory Structure
```
air-quality-boisar-project/
├── index.html              # Main single-page application structure with 3 views
├── README.md               # Project documentation & usage guide
├── css/
│   └── style.css           # Academic, clean, responsive stylesheet
└── js/
    ├── chart.min.js        # Local Chart.js library (supports offline presentations)
    ├── data.js             # Structured open environmental dataset & helper services
    ├── charts.js           # Chart.js initialization & dynamic update engine for the 5 charts
    ├── findings.js         # Analytical engine calculating key findings dynamically
    └── app.js              # Routing, Location -> Area auto-mapping, and event listeners
```

---

## 3. How to Run the Website
1. **Direct Browser Launch (Zero Setup Required)**:
   - Simply double-click `index.html` in your file explorer, or right-click and choose **Open with > Chrome / Edge / Firefox**.
   - The application works completely offline as `chart.min.js` is bundled locally.
2. **Via Local Web Server (Optional)**:
   - If you prefer running via a local server (e.g., Live Server in VS Code):
     ```bash
     # Example using python if installed:
     python -m http.server 8000
     ```
   - Open `http://localhost:8000` in your web browser.

---

## 4. Key Functional Features

### Navigation
- Top navigation bar with exactly 3 options:
  - **Home**: Project title, academic context, study scope, and navigation guide.
  - **Information**: Detailed environmental study box, 2 side-by-side control boxes, 5 interactive charts, and 2 advisory notices.
  - **Findings**: Data science analytical summary box with 6 dynamically calculated findings and station-wise average data table.

### Automatic Location &rarr; Area Logic
- Selecting a location in **Box 1** immediately updates the read-only **Box 2 (Area)**:
  - **Locations 1, 2, 3** &rarr; `AM-31 / SRO Office Side`
  - **Locations 4, 5, 6** &rarr; `AM-8 / Police Chowky Side`
  - **Locations 7, 8, 9** &rarr; `O-34 / Sports Stadium Side`

### 5 Separate Independent Charts
1. **Graph 1 — Monthly AQI Trend (Line Chart)**: Tracks June, July, August AQI for the selected station (dynamically updates when Location changes).
2. **Graph 2 — Pollutants Comparison (Bar Chart)**: Compares $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{SO}_2$, and $\text{CO}$ for the selected station (dynamically updates when Location changes).
3. **Graph 3 — Location-wise Average AQI (Polar Area / Radial Spatial Chart)**: Visualizes the spatial radial reach of air pollution across all 9 stations around Boisar/Tarapur with interactive toggle support for **Polar Area**, **Radar**, and **Bar Chart** views.
4. **Graph 4 — Area-wise Average AQI (Bar Chart)**: Compares the 3 operational areas and identifies highest vs. lowest pollution zones.
5. **Graph 5 — Monthly PM2.5 Trend (Line Chart)**: Regional $\text{PM}_{2.5}$ trajectory across June, July, and August against NAAQS permissible limit ($60\ \mu\text{g/m}^3$).

### Key Findings (Computed Dynamically)
1. **Highest Average AQI**: Identifies station with peak pollution (`Tarapur MIDC Main Road / Industrial Belt` - 133.0 AQI).
2. **Lowest Average AQI**: Identifies cleanest station (`Friend's Cricket Club Ground` - 65.3 AQI).
3. **Most Concerning Pollutant**: Evaluates pollutant exceedance relative to NAAQS standards, highlighting $\text{PM}_{2.5}$ due to fine particulate respirability.
4. **Highest Pollution Month**: Identifies peak month (`June` - 128.4 regional AQI) prior to intense monsoon precipitation.
5. **Highest AQI Area**: Identifies `AM-8 / Police Chowky Side` (121.3 AQI) as the primary industrial belt.
6. **Overall AQI Trend**: Automatically classifies trajectory as `Fluctuating` (reflecting monsoon wet scavenging wash-out in July followed by late-August stabilization).

---

## 5. Replacing / Modifying Data
To add or modify environmental readings, open [js/data.js](file:///C:/Users/acer/.gemini/antigravity/scratch/air-quality-boisar-project/js/data.js). The dataset is cleanly formatted with self-explanatory keys (`AQI`, `PM25`, `PM10`, `NO2`, `SO2`, `CO`) under each month. All 5 charts and the Findings page will automatically recalculate and update immediately.

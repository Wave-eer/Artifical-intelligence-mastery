# Brent Crude Oil Bayesian Analytics Dashboard (React Frontend)

Modern React dashboard interface for visualizing Brent Crude spot prices, PyMC Bayesian change point model outputs, MCMC convergence statistics, and geopolitical event overlays.

## Features
- **Interactive Price Chart**: Responsive line chart with change point vertical marker ($\tau$), 95% HDI shaded credible interval area, and event overlay pins built with Recharts.
- **Dynamic Date & Category Filtering**: Date range selectors (`start_date`, `end_date`), quick range presets, and event category filtering (Geopolitical, OPEC, Economic).
- **MCMC Diagnostics & Model Summary**: Key KPI metrics ($\mu_1, \mu_2, \sigma_1, \sigma_2$, $R_{\hat{}}$ diagnostics, regime shift %).
- **Event Correlation Matrix**: Searchable and filterable table connecting historical shocks to crude oil spot prices.

## Setup & Running Instructions

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)

### Installation
```bash
cd frontend
npm install
```

### Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build Production Bundle
```bash
npm run build
```

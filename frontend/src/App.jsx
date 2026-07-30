import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KPISummary from './components/KPISummary';
import EventFilter from './components/EventFilter';
import PriceChart from './components/PriceChart';
import ChangePointCard from './components/ChangePointCard';
import EventTable from './components/EventTable';

export default function App() {
  const [prices, setPrices] = useState([]);
  const [events, setEvents] = useState([]);
  const [changePoints, setChangePoints] = useState(null);
  const [summary, setSummary] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);

  // Filters state
  const [startDate, setStartDate] = useState('1987-05-20');
  const [endDate, setEndDate] = useState('2022-09-30');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEvents, setShowEvents] = useState(true);
  const [showRegimes, setShowRegimes] = useState(true);

  // Initial Data Fetching
  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      // 1. Health check & Summary
      const sumRes = await fetch(`/api/summary`);
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setSummary(sumData);
        setBackendConnected(true);
      }

      // 2. Change points
      const cpRes = await fetch(`/api/change-points`);
      if (cpRes.ok) {
        const cpData = await cpRes.json();
        setChangePoints(cpData);
      }

      // 3. Prices with date filtering and downsampling for chart performance
      const priceRes = await fetch(`/api/prices?start_date=${startDate}&end_date=${endDate}&downsample=2`);
      if (priceRes.ok) {
        const priceData = await priceRes.json();
        setPrices(priceData.prices || []);
      }

      // 4. Events
      const evRes = await fetch(`/api/events?category=${selectedCategory}`);
      if (evRes.ok) {
        const evData = await evRes.json();
        setEvents(evData.events || []);
      }
    } catch (err) {
      console.warn("Backend API not reachable, loading fallback data...", err);
      setBackendConnected(false);
      loadFallbackData();
    }
  };

  const loadFallbackData = () => {
    const mockSummary = {
      total_observations: 8978,
      start_date: '1987-05-20',
      end_date: '2022-09-30',
      min_price: 9.10,
      max_price: 143.95,
      avg_price: 48.22,
      latest_price: 89.20,
      change_point_date: '2004-05-14',
      regime_1_avg: 21.46,
      regime_2_avg: 67.85,
      regime_shift_pct: 216.17
    };

    const mockChangePoints = {
      tau_index: 4320,
      tau_date: '2004-05-14',
      tau_hdi_dates: ['2004-02-15', '2004-08-20'],
      mu_1_mean: 21.46,
      mu_2_mean: 67.85,
      sigma_1_mean: 4.82,
      sigma_2_mean: 25.10,
      r_hat: { tau: 1.00, mu_1: 1.00, mu_2: 1.01, sigma_1: 1.00, sigma_2: 1.00 },
      interpretation: 'Discovered primary switch point in May 2004 marking the transition from low-price stability ($21.46/bbl average) to elevated volatility and rapid commodities expansion ($67.85/bbl average), coinciding with 2003 Iraq Invasion and emerging market demand surge.'
    };

    const mockEvents = [
      { date: '1990-08-02', event: 'Gulf War Begins', category: 'Geopolitical', description: 'Iraq invades Kuwait leading to supply disruption and price spike.', nearest_price: 26.50 },
      { date: '1997-07-02', event: 'Asian Financial Crisis', category: 'Economic', description: 'Financial crisis originating in East Asia leads to reduced global oil demand.', nearest_price: 18.90 },
      { date: '2001-09-11', event: 'September 11 Attacks', category: 'Geopolitical', description: 'Terrorist attacks in the US prompt global aviation downturn.', nearest_price: 27.60 },
      { date: '2003-03-20', event: 'Iraq War Invasion', category: 'Geopolitical', description: 'US-led coalition invades Iraq causing geopolitical uncertainty.', nearest_price: 25.50 },
      { date: '2008-09-15', event: 'Global Financial Crisis Peak', category: 'Economic', description: 'Lehman Brothers bankruptcy triggers global recession and price collapse.', nearest_price: 92.10 },
      { date: '2011-02-15', event: 'Libyan Civil War', category: 'Geopolitical', description: 'Conflict halts high-quality light sweet crude production.', nearest_price: 103.50 },
      { date: '2014-11-27', event: 'OPEC Production Quota Decision', category: 'OPEC', description: 'OPEC declines to cut production to preserve market share.', nearest_price: 71.80 },
      { date: '2016-12-10', event: 'OPEC+ Declaration of Cooperation', category: 'OPEC', description: 'OPEC and non-OPEC producers sign output cut agreement.', nearest_price: 54.30 },
      { date: '2020-03-11', event: 'COVID-19 Global Pandemic', category: 'Economic', description: 'WHO declares global pandemic causing travel lockdowns.', nearest_price: 35.70 },
      { date: '2022-02-24', event: 'Russia Invades Ukraine', category: 'Geopolitical', description: 'Full-scale invasion triggers Western energy sanctions on Russia.', nearest_price: 99.10 }
    ];

    setSummary(mockSummary);
    setChangePoints(mockChangePoints);
    setEvents(mockEvents);
  };

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(e => e.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="dashboard-container">
      <Navbar backendConnected={backendConnected} />
      
      <KPISummary summary={summary} changePoints={changePoints} />

      <EventFilter
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        showEvents={showEvents}
        setShowEvents={setShowEvents}
        showRegimes={showRegimes}
        setShowRegimes={setShowRegimes}
        onReset={() => {
          setStartDate('1987-05-20');
          setEndDate('2022-09-30');
          setSelectedCategory('all');
        }}
      />

      <PriceChart
        prices={prices}
        events={filteredEvents}
        changePoints={changePoints}
        showEvents={showEvents}
        showRegimes={showRegimes}
      />

      <ChangePointCard changePoints={changePoints} />

      <EventTable events={filteredEvents} />
    </div>
  );
}

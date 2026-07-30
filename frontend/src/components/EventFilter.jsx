import React from 'react';
import { Filter, Calendar, Eye, RefreshCw } from 'lucide-react';

export default function EventFilter({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedCategory,
  setSelectedCategory,
  showEvents,
  setShowEvents,
  showRegimes,
  setShowRegimes,
  onReset
}) {
  const categories = [
    { label: 'All Events', value: 'all' },
    { label: 'Geopolitical', value: 'Geopolitical' },
    { label: 'OPEC Decisions', value: 'OPEC' },
    { label: 'Economic Shocks', value: 'Economic' }
  ];

  const presets = [
    { label: 'Full History (1987-2022)', start: '1987-05-20', end: '2022-09-30' },
    { label: '2000s Bull Run (2000-2008)', start: '2000-01-01', end: '2008-12-31' },
    { label: 'OPEC Market War (2014-2016)', start: '2014-01-01', end: '2016-12-31' },
    { label: 'COVID & Ukraine (2020-2022)', start: '2020-01-01', end: '2022-09-30' }
  ];

  return (
    <div className="glass-card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Date Range Inputs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Calendar size={16} color="var(--accent-blue)" />
            <span>Date Range:</span>
          </div>
          <input
            type="date"
            className="control-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span style={{ color: 'var(--text-muted)' }}>to</span>
          <input
            type="date"
            className="control-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Event Category Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Filter size={16} color="var(--accent-cyan)" />
            <span>Category:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              style={{
                background: selectedCategory === cat.value ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
                color: selectedCategory === cat.value ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid ' + (selectedCategory === cat.value ? 'var(--accent-blue)' : 'var(--border-color)'),
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: selectedCategory === cat.value ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showEvents}
              onChange={(e) => setShowEvents(e.target.checked)}
              style={{ accentColor: 'var(--accent-blue)' }}
            />
            Overlay Events
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showRegimes}
              onChange={(e) => setShowRegimes(e.target.checked)}
              style={{ accentColor: 'var(--accent-rose)' }}
            />
            Show PyMC Change Point
          </label>
        </div>
      </div>

      {/* Preset Buttons Bar */}
      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Range Presets:</span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setStartDate(preset.start);
              setEndDate(preset.end);
            }}
            style={{
              background: 'transparent',
              color: 'var(--accent-cyan)',
              border: '1px dashed var(--border-glow)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

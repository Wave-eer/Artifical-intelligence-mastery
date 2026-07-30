import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea
} from 'recharts';

export default function PriceChart({ prices, events, changePoints, showEvents, showRegimes }) {
  if (!prices || prices.length === 0) {
    return (
      <div className="glass-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Brent crude price time series...</p>
      </div>
    );
  }

  // Format data for chart
  const chartData = prices.map((item) => ({
    date: item.date,
    price: item.price,
    log_return: item.log_return,
    volatility: item.vol_30d
  }));

  const tauDate = changePoints?.tau_date;
  const tauHdi = changePoints?.tau_hdi_dates || [];
  const mu1 = changePoints?.mu_1_mean;
  const mu2 = changePoints?.mu_2_mean;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const matchedEvent = events?.find((e) => e.date === label);
      return (
        <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid var(--border-glow)', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <p style={{ fontWeight: 700, color: '#f3f4f6', marginBottom: '6px' }}>{label}</p>
          <p style={{ color: '#3b82f6', fontSize: '0.9rem' }}>Spot Price: <strong>${data.price}/bbl</strong></p>
          {data.log_return !== undefined && (
            <p style={{ color: '#06b6d4', fontSize: '0.8rem' }}>Log Return: {(data.log_return * 100).toFixed(2)}%</p>
          )}
          {matchedEvent && (
            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
              <span className={`badge badge-${matchedEvent.category?.toLowerCase() || 'geopolitical'}`}>
                {matchedEvent.category}: {matchedEvent.event}
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '240px' }}>
                {matchedEvent.description}
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Brent Crude Spot Price & Bayesian Change Point Overlay</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing {chartData.length.toLocaleString()} daily observations with PyMC MCMC regime detection
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem' }}>
          <span style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%' }}></span>
            Spot Price
          </span>
          {showRegimes && tauDate && (
            <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', background: '#f43f5e', borderRadius: '50%' }}></span>
              PyMC Switch Point (τ = {tauDate})
            </span>
          )}
        </div>
      </div>

      <div style={{ width: '100%', height: 420 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 11 }} />
            <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} domain={['auto', 'auto']} unit="$" />
            <Tooltip content={<CustomTooltip />} />

            {/* Price Line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={1.8}
              dot={false}
              activeDot={{ r: 6, fill: '#60a5fa' }}
            />

            {/* Change Point Line */}
            {showRegimes && tauDate && (
              <ReferenceLine
                x={tauDate}
                stroke="#f43f5e"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                label={{ value: `PyMC Switch Point (${tauDate})`, fill: '#f43f5e', position: 'top', fontSize: 12, fontWeight: 700 }}
              />
            )}

            {/* HDI Shaded Credible Interval Area */}
            {showRegimes && tauHdi.length === 2 && (
              <ReferenceArea
                x1={tauHdi[0]}
                x2={tauHdi[1]}
                fill="rgba(244, 63, 94, 0.15)"
                stroke="rgba(244, 63, 94, 0.3)"
              />
            )}

            {/* Before / After Mean Reference Lines */}
            {showRegimes && mu1 && (
              <ReferenceLine
                y={mu1}
                stroke="#10b981"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                label={{ value: `Regime 1 Mean ($${mu1})`, fill: '#10b981', position: 'insideBottomLeft', fontSize: 11 }}
              />
            )}
            {showRegimes && mu2 && (
              <ReferenceLine
                y={mu2}
                stroke="#8b5cf6"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                label={{ value: `Regime 2 Mean ($${mu2})`, fill: '#8b5cf6', position: 'insideTopRight', fontSize: 11 }}
              />
            )}

            {/* Event Pins Overlay */}
            {showEvents && events && events.map((ev, idx) => (
              <ReferenceLine
                key={idx}
                x={ev.date}
                stroke={ev.category === 'Geopolitical' ? '#f43f5e' : ev.category === 'OPEC' ? '#f59e0b' : '#10b981'}
                strokeWidth={1}
                strokeDasharray="2 2"
                opacity={0.7}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

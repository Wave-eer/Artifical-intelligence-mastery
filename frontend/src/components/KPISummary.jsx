import React from 'react';
import { TrendingUp, DollarSign, Calendar, Zap, ShieldCheck } from 'lucide-react';

export default function KPISummary({ summary, changePoints }) {
  if (!summary) return null;

  const kpis = [
    {
      title: 'Historical Date Range',
      value: `${summary.start_date?.split('-')[0]} – ${summary.end_date?.split('-')[0]}`,
      sub: `${summary.total_observations?.toLocaleString()} Daily Records`,
      icon: Calendar,
      color: '#3b82f6'
    },
    {
      title: 'Spot Price Range',
      value: `$${summary.min_price} – $${summary.max_price}`,
      sub: `Historical Avg: $${summary.avg_price}/bbl`,
      icon: DollarSign,
      color: '#06b6d4'
    },
    {
      title: 'Primary Switch Point (τ)',
      value: changePoints?.tau_date || summary.change_point_date,
      sub: `MCMC R_hat: ${changePoints?.r_hat?.tau || 1.0}`,
      icon: Zap,
      color: '#f43f5e'
    },
    {
      title: 'Regime Mean Shift',
      value: `$${summary.regime_1_avg} → $${summary.regime_2_avg}`,
      sub: `+${summary.regime_shift_pct}% Price Shift`,
      icon: TrendingUp,
      color: '#10b981'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      {kpis.map((kpi, idx) => {
        const IconComponent = kpi.icon;
        return (
          <div key={idx} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}30`, padding: '14px', borderRadius: '14px' }}>
              <IconComponent size={22} color={kpi.color} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{kpi.title}</p>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '2px 0 4px 0' }}>{kpi.value}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{kpi.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import React from 'react';
import { Activity, Flame, ShieldAlert } from 'lucide-react';

export default function Navbar({ backendConnected }) {
  return (
    <header className="glass-card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
          <Flame size={24} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, background: 'linear-gradient(90deg, #f3f4f6, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Brent Crude Oil Bayesian Analytics
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            PyMC Change Point Modeling & Geopolitical Shock Analysis (1987 – 2022)
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <Activity size={14} color={backendConnected ? '#10b981' : '#f43f5e'} />
          <span style={{ color: backendConnected ? '#10b981' : '#f43f5e', fontWeight: 600 }}>
            {backendConnected ? 'Flask API Online' : 'Offline / Standalone Mode'}
          </span>
        </div>
        <div className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          PyMC v5 MCMC
        </div>
      </div>
    </header>
  );
}

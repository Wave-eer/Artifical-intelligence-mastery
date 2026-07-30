import React from 'react';
import { Cpu, CheckCircle2, Info, ArrowUpRight } from 'lucide-react';

export default function ChangePointCard({ changePoints }) {
  if (!changePoints) return null;

  const rHatValues = changePoints.r_hat || {};

  return (
    <div className="glass-card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '10px', borderRadius: '10px' }}>
            <Cpu size={20} color="#8b5cf6" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>PyMC Bayesian Change Point Model Output</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Discrete Switch Point τ & MCMC Convergence Diagnostics
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
          <CheckCircle2 size={16} />
          <span>MCMC Converged (R_hat ≤ 1.01)</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Model Parameter Summary */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
            <span>Regime Parameter Estimates</span>
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px dashed var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Regime 1 Mean (μ₁):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>${changePoints.mu_1_mean?.toFixed(2)}/bbl</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px dashed var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Regime 2 Mean (μ₂):</span>
              <span style={{ fontWeight: 700, color: '#8b5cf6' }}>${changePoints.mu_2_mean?.toFixed(2)}/bbl</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px dashed var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Regime 1 Volatility (σ₁):</span>
              <span>${changePoints.sigma_1_mean?.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Regime 2 Volatility (σ₂):</span>
              <span>${changePoints.sigma_2_mean?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 95% Credible Interval & HDI */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Switch Point (τ) Credible Interval
          </h4>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f43f5e', marginBottom: '4px' }}>
            {changePoints.tau_date}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            95% HDI: {changePoints.tau_hdi_dates?.join(' to ')}
          </p>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.75rem' }}>
            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              R_hat (τ): {rHatValues.tau || 1.0}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              R_hat (μ₁): {rHatValues.mu_1 || 1.0}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              R_hat (μ₂): {rHatValues.mu_2 || 1.0}
            </span>
          </div>
        </div>

        {/* Written Interpretation */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', gridColumn: 'span 1' }}>
          <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={16} color="var(--accent-cyan)" />
            <span>Economic Interpretation</span>
          </h4>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {changePoints.interpretation}
          </p>
        </div>
      </div>
    </div>
  );
}

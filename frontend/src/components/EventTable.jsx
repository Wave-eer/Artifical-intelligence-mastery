import React, { useState } from 'react';
import { Search, ExternalLink, Globe } from 'lucide-react';

export default function EventTable({ events }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!events) return null;

  const filteredEvents = events.filter((ev) => {
    const term = searchTerm.toLowerCase();
    return (
      ev.event.toLowerCase().includes(term) ||
      ev.category.toLowerCase().includes(term) ||
      ev.description.toLowerCase().includes(term) ||
      ev.date.includes(term)
    );
  });

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Geopolitical & OPEC Event Correlation Matrix</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Key historical shocks compiled for correlation analysis ({filteredEvents.length} events matching filter)
          </p>
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="control-input"
            placeholder="Search events or dates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '32px', width: '100%' }}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 12px' }}>Date</th>
              <th style={{ padding: '10px 12px' }}>Category</th>
              <th style={{ padding: '10px 12px' }}>Event Name</th>
              <th style={{ padding: '10px 12px' }}>Spot Price at Event</th>
              <th style={{ padding: '10px 12px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} className="table-row-hover">
                <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                  {row.date}
                </td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${row.category?.toLowerCase()}`}>
                    {row.category}
                  </span>
                </td>
                <td style={{ padding: '12px', fontWeight: 600, color: '#f3f4f6' }}>
                  {row.event}
                </td>
                <td style={{ padding: '12px', fontWeight: 700, color: '#3b82f6' }}>
                  ${row.nearest_price ? row.nearest_price.toFixed(2) : 'N/A'}/bbl
                </td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)', maxWidth: '420px' }}>
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

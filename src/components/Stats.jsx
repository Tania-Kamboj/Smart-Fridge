import React from 'react';
import { useSelector } from 'react-redux';
import { selectStats } from '../features/inventory/inventorySlice';

const Stats = () => {
  const stats = useSelector(selectStats);
  
  const statCards = [
    { label: 'Total Items', value: stats.total, emoji: '📦', color: 'stat-total' },
    { label: 'Fresh', value: stats.fresh, emoji: '✅', color: 'stat-fresh' },
    { label: 'Expiring Soon', value: stats.expiring, emoji: '⚠️', color: 'stat-expiring' },
    { label: 'Expired', value: stats.expired, emoji: '❌', color: 'stat-expired' },
  ];
  
  return (
    <div className="stats-container">
      {statCards.map((stat, index) => (
        <div key={index} className={`stat-card ${stat.color}`}>
          <span className="stat-icon">{stat.emoji}</span>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
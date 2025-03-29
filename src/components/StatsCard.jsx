
import React from 'react';

const StatsCard = ({ title, value, icon, change, changeType, suffix }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-600';
    if (changeType === 'negative') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm card-hover">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">
            {value}{suffix && <span className="text-sm ml-1">{suffix}</span>}
          </h3>
          {change && (
            <p className={`text-xs mt-1 ${getChangeColor()}`}>
              {changeType === 'positive' && '↑'}
              {changeType === 'negative' && '↓'}
              {` ${change}`}
            </p>
          )}
        </div>
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

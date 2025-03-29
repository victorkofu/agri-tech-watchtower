
import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const ControlPanel = ({ title, controls, onControlChange }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="space-y-4">
        {controls.map((control) => (
          <div key={control.id} className="border-b pb-4 last:border-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {control.icon}
                <span className="ml-2 text-sm">{control.label}</span>
              </div>
              
              <div className="flex items-center">
                {control.type === 'switch' && (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={control.value}
                      onChange={() => onControlChange(control.id, !control.value)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                )}
                
                {control.type === 'slider' && (
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    value={control.value}
                    onChange={(e) => onControlChange(control.id, parseInt(e.target.value))}
                    className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                )}
              </div>
            </div>
            
            {control.status === 'warning' && (
              <div className="mt-2 flex items-center text-amber-600 text-xs">
                <AlertCircle size={14} className="mr-1" />
                <span>{control.statusMessage}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;

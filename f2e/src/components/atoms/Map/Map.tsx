import React from 'react';
import { cn } from '../../../lib/utils';

export interface MapProps {
  width?: string;
  height?: string;
  className?: string;
  location?: string;
}

export const Map: React.FC<MapProps> = ({
  width = "100%",
  height = "200px",
  className = '',
  location = "Training Center Location"
}) => {
  return (
    <div 
      className={cn('bg-gray-600 rounded border border-gray-500 flex items-center justify-center text-gray-300', className)}
      style={{ width, height }}
    >
      <div className="text-center">
        <i className="fa-solid fa-map-marker-alt text-2xl mb-2 block"></i>
        <p className="text-sm">{location}</p>
        <p className="text-xs mt-1">Interactive Map Coming Soon</p>
      </div>
    </div>
  );
};

export default Map;
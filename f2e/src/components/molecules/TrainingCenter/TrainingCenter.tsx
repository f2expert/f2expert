import React from 'react';
import { Map } from '../../atoms/Map';
import { cn } from '../../../lib/utils';

export interface TrainingCenterProps {
  title?: string;
  mapWidth?: string;
  mapHeight?: string;
  location?: string;
  className?: string;
}

export const TrainingCenter: React.FC<TrainingCenterProps> = ({
  title = "Training Center",
  mapWidth = "320px",
  mapHeight = "200px",
  location = "F2Expert Training Center",
  className = ''
}) => {
  return (
    <div className={cn('', className)}>
      <h2 className="text-lg text-gray-300 py-2 mb-4 font-semibold w-80">
        {title}
      </h2>
      
      <div className="w-80">
        <Map
          width={mapWidth}
          height={mapHeight}
          location={location}
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default TrainingCenter;
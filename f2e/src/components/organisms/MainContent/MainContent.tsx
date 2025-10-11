import React from 'react';
import { Counter } from '../../molecules/Counter';
import { Text } from '../../atoms/Text';

export interface MainContentProps {
  className?: string;
}

export const MainContent: React.FC<MainContentProps> = ({ className = '' }) => {
  return (
    <main className={`flex flex-col items-center gap-8 ${className}`}>
      <div className="p-8">
        <Counter />
      </div>
      <Text variant="caption">
        Click on the Vite and React logos to learn more
      </Text>
    </main>
  );
};

export default MainContent;
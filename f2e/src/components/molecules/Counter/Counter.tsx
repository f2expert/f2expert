import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';

export interface CounterProps {
  initialCount?: number;
  className?: string;
}

export const Counter: React.FC<CounterProps> = ({ 
  initialCount = 0, 
  className = '' 
}) => {
  const [count, setCount] = useState(initialCount);

  return (
    <div className={`p-8 flex flex-col items-center gap-4 ${className}`}>
      <Button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </Button>
      <Text variant="body">
        Edit <Text variant="code" as="span">src/App.tsx</Text> and save to test HMR
      </Text>
    </div>
  );
};

export default Counter;
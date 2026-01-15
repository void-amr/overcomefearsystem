import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentDay: number;
  totalDays?: number;
}

/**
 * Visual progress bar showing completed days as segments
 * Each segment represents one day of the 10-day challenge
 */
const ProgressBar = memo(function ProgressBar({ currentDay, totalDays = 10 }: ProgressBarProps) {
  return (
    <div className="flex gap-2 justify-center" role="progressbar" aria-valuenow={currentDay} aria-valuemin={1} aria-valuemax={totalDays}>
      {Array.from({ length: totalDays }, (_, i) => {
        const dayNumber = i + 1;
        const isComplete = dayNumber < currentDay;
        const isCurrent = dayNumber === currentDay;
        
        return (
          <div
            key={dayNumber}
            className={cn(
              'progress-segment',
              isComplete || isCurrent ? 'progress-segment-complete' : 'progress-segment-incomplete',
              isCurrent && 'animate-pulse-subtle'
            )}
            aria-label={`Day ${dayNumber}: ${isComplete ? 'completed' : isCurrent ? 'current' : 'upcoming'}`}
          />
        );
      })}
    </div>
  );
});

export default ProgressBar;

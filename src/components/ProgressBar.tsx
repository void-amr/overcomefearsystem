import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentDay: number;
  totalDays?: number;
}

/**
 * Visual progress bar with glowing segments
 * Each segment represents one day of the 10-day challenge
 */
const ProgressBar = memo(function ProgressBar({ currentDay, totalDays = 10 }: ProgressBarProps) {
  const completedDays = Math.min(currentDay - 1, totalDays);
  const percentComplete = Math.round((completedDays / totalDays) * 100);
  
  return (
    <div className="space-y-3">
      {/* Progress segments */}
      <div 
        className="flex gap-1.5 sm:gap-2 justify-center" 
        role="progressbar" 
        aria-valuenow={currentDay} 
        aria-valuemin={1} 
        aria-valuemax={totalDays}
      >
        {Array.from({ length: totalDays }, (_, i) => {
          const dayNumber = i + 1;
          const isComplete = dayNumber < currentDay;
          const isCurrent = dayNumber === currentDay;
          
          return (
            <div
              key={dayNumber}
              className={cn(
                'progress-segment',
                isComplete && 'progress-segment-complete',
                isCurrent && 'progress-segment-current animate-pulse-glow',
                !isComplete && !isCurrent && 'progress-segment-incomplete'
              )}
              aria-label={`Day ${dayNumber}: ${isComplete ? 'completed' : isCurrent ? 'current' : 'upcoming'}`}
            />
          );
        })}
      </div>
      
      {/* Percentage indicator */}
      <p className="text-center text-sm text-muted-foreground">
        <span className="text-primary font-bold">{percentComplete}%</span> complete
      </p>
    </div>
  );
});

export default ProgressBar;

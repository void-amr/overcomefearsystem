import React, { memo, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import QuoteBanner from './QuoteBanner';
import DayCard from './DayCard';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { UserData, DayData, DayTasks, DayReflection } from '@/types/app';

interface DashboardScreenProps {
  userData: UserData;
  currentDay: number;
  getDayData: (dayNumber: number) => DayData;
  onTaskChange: (dayNumber: number, tasks: Partial<DayTasks>) => void;
  onReflectionChange: (dayNumber: number, reflection: Partial<DayReflection>) => void;
  onReset: () => void;
}

/**
 * Main dashboard showing the 10-day challenge progress
 * Displays progress bar, quote banner, and day cards
 */
const DashboardScreen = memo(function DashboardScreen({
  userData,
  currentDay,
  getDayData,
  onTaskChange,
  onReflectionChange,
  onReset,
}: DashboardScreenProps) {
  const handleResetClick = useCallback(() => {
    if (window.confirm('Are you sure you want to reset? All progress will be lost.')) {
      onReset();
    }
  }, [onReset]);

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header with day counter */}
        <div className="text-center space-y-4">
          <h1 className="text-hero">
            DAY {Math.min(currentDay, 10)} / 10
          </h1>
          <ProgressBar currentDay={currentDay} />
        </div>

        {/* Quote banner */}
        <QuoteBanner
          quote={userData.quote}
          skill={userData.skill}
          distraction={userData.distraction}
        />

        {/* Day cards */}
        <div className="space-y-3">
          {Array.from({ length: 10 }, (_, i) => {
            const dayNumber = i + 1;
            return (
              <DayCard
                key={dayNumber}
                dayNumber={dayNumber}
                currentDay={currentDay}
                startDate={userData.startDate}
                dayData={getDayData(dayNumber)}
                skill={userData.skill}
                distraction={userData.distraction}
                onTaskChange={(tasks) => onTaskChange(dayNumber, tasks)}
                onReflectionChange={(reflection) => onReflectionChange(dayNumber, reflection)}
                defaultExpanded={dayNumber === currentDay}
              />
            );
          })}
        </div>

        {/* Reset button */}
        <div className="pt-8 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleResetClick}
            className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
});

export default DashboardScreen;

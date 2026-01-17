import React, { memo, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import QuoteBanner from './QuoteBanner';
import DayCard from './DayCard';
import { Button } from '@/components/ui/button';
import { RotateCcw, Flame, Clock } from 'lucide-react';
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
 * Main dashboard - Command center for the 10-day challenge
 * Designed for emotional engagement and clear action paths
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

  const daysRemaining = Math.max(0, 10 - currentDay + 1);

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header section - Dramatic day counter */}
        <div className="text-center space-y-6">
          {/* Urgency indicator */}
          <div className="flex justify-center gap-3">
            <div className="badge-urgent flex items-center gap-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Day {Math.min(currentDay, 10)} of 10</span>
            </div>
            {daysRemaining > 0 && daysRemaining <= 3 && (
              <div className="badge-urgent flex items-center gap-2 animate-urgent">
                <Clock className="w-3.5 h-3.5" />
                <span>{daysRemaining} days left</span>
              </div>
            )}
          </div>
          
          <h1 className="text-hero leading-none">
            DAY {Math.min(currentDay, 10)}
          </h1>
          
          <ProgressBar currentDay={currentDay} />
        </div>

        {/* Quote banner - Motivation center */}
        <QuoteBanner
          quote={userData.quote}
          skill={userData.skill}
          distraction={userData.distraction}
        />

        {/* Day cards - Action items */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span>Your Journey</span>
            <span className="text-muted-foreground text-sm font-normal">
              — tap a day to expand
            </span>
          </h2>
          
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
        </div>

        {/* Reset button - Secondary action */}
        <div className="pt-8 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={handleResetClick}
            className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 rounded-xl h-12"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Fresh
          </Button>
        </div>
      </div>
    </div>
  );
});

export default DashboardScreen;

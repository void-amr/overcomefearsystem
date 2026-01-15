import React, { memo, useMemo, useCallback } from 'react';
import { Trophy, RotateCcw, Flame, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserData, DayData } from '@/types/app';

interface VictoryScreenProps {
  userData: UserData;
  getDayData: (dayNumber: number) => DayData;
  onReset: () => void;
}

/**
 * Victory screen shown when user completes all 10 days
 * Displays stats and celebrates the achievement
 */
const VictoryScreen = memo(function VictoryScreen({
  userData,
  getDayData,
  onReset,
}: VictoryScreenProps) {
  // Calculate total completed tasks across all days
  const stats = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    let perfectDays = 0;

    for (let day = 1; day <= 10; day++) {
      const dayData = getDayData(day);
      const dayCompleted = Object.values(dayData.tasks).filter(Boolean).length;
      totalTasks += 3;
      completedTasks += dayCompleted;
      if (dayCompleted === 3) perfectDays++;
    }

    return {
      totalTasks,
      completedTasks,
      perfectDays,
      completionRate: Math.round((completedTasks / totalTasks) * 100),
    };
  }, [getDayData]);

  const handleResetClick = useCallback(() => {
    if (window.confirm('Ready for another 10-day challenge? This will reset all progress.')) {
      onReset();
    }
  }, [onReset]);

  return (
    <div className="min-h-screen flex items-center justify-center p-5 animate-fade-in">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Trophy icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 animate-pulse-glow">
          <Trophy className="w-12 h-12 text-primary" />
        </div>

        {/* Victory message */}
        <div className="space-y-3">
          <h1 className="text-hero">YOU DID IT!</h1>
          <p className="text-xl text-muted-foreground">
            10 days of fighting {userData.distraction}.
          </p>
          <p className="text-xl text-muted-foreground">
            10 days of learning {userData.skill}.
          </p>
        </div>

        {/* Quote reminder */}
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-quote">"{userData.quote}"</p>
          <p className="text-sm text-muted-foreground mt-4">
            This is what kept you going.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Check className="w-5 h-5 text-success" />
            </div>
            <p className="text-2xl font-bold">{stats.completedTasks}</p>
            <p className="text-xs text-muted-foreground">Tasks Done</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">{stats.perfectDays}</p>
            <p className="text-xs text-muted-foreground">Perfect Days</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">{stats.completionRate}%</p>
            <p className="text-xs text-muted-foreground">Completion</p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4 pt-4">
          <p className="text-muted-foreground">
            Ready for another round?
          </p>
          <Button
            onClick={handleResetClick}
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-200"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            START NEW CHALLENGE
          </Button>
        </div>
      </div>
    </div>
  );
});

export default VictoryScreen;

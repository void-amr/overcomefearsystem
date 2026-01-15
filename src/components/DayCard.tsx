import React, { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { ChevronDown, Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, getDateForDay, isDayCurrent, isDayPast, isDayFuture } from '@/lib/dateUtils';
import { useDebouncedCallback } from '@/lib/useDebounce';
import TaskCheckbox from './TaskCheckbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { DayData, DayTasks, DayReflection } from '@/types/app';
import { TASK_LABELS } from '@/types/app';

interface DayCardProps {
  dayNumber: number;
  currentDay: number;
  startDate: string;
  dayData: DayData;
  skill: string;
  distraction: string;
  onTaskChange: (tasks: Partial<DayTasks>) => void;
  onReflectionChange: (reflection: Partial<DayReflection>) => void;
  defaultExpanded?: boolean;
}

/**
 * Day card component that shows tasks and reflections for a single day
 * Supports expand/collapse for current and past days
 */
const DayCard = memo(function DayCard({
  dayNumber,
  currentDay,
  startDate,
  dayData,
  skill,
  distraction,
  onTaskChange,
  onReflectionChange,
  defaultExpanded = false,
}: DayCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [whatStopped, setWhatStopped] = useState(dayData.reflection.whatStopped);
  const [whatWorked, setWhatWorked] = useState(dayData.reflection.whatWorked);

  const isCurrent = isDayCurrent(dayNumber, currentDay);
  const isPast = isDayPast(dayNumber, currentDay);
  const isFuture = isDayFuture(dayNumber, currentDay);
  const isAccessible = isCurrent || isPast;

  // Calculate date for this day
  const date = useMemo(() => getDateForDay(startDate, dayNumber), [startDate, dayNumber]);
  const formattedDate = useMemo(() => formatDate(date), [date]);

  // Calculate completed tasks count
  const completedCount = useMemo(() => {
    return Object.values(dayData.tasks).filter(Boolean).length;
  }, [dayData.tasks]);

  // Auto-expand current day
  useEffect(() => {
    if (isCurrent && !isExpanded) {
      setIsExpanded(true);
    }
  }, [isCurrent]);

  // Debounced reflection save (500ms)
  const debouncedSaveWhatStopped = useDebouncedCallback(
    useCallback((value: string) => {
      onReflectionChange({ whatStopped: value });
    }, [onReflectionChange]),
    500
  );

  const debouncedSaveWhatWorked = useDebouncedCallback(
    useCallback((value: string) => {
      onReflectionChange({ whatWorked: value });
    }, [onReflectionChange]),
    500
  );

  const handleWhatStoppedChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setWhatStopped(value);
    debouncedSaveWhatStopped(value);
  }, [debouncedSaveWhatStopped]);

  const handleWhatWorkedChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setWhatWorked(value);
    debouncedSaveWhatWorked(value);
  }, [debouncedSaveWhatWorked]);

  const toggleExpand = useCallback(() => {
    if (isAccessible) {
      setIsExpanded(prev => !prev);
    }
  }, [isAccessible]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && isAccessible) {
      e.preventDefault();
      toggleExpand();
    }
  }, [isAccessible, toggleExpand]);

  // Dynamic task labels with user's skill/distraction
  const taskLabels = useMemo(() => ({
    learnSkill: `Spend 15 min learning ${skill}`,
    avoidDistraction: `Avoid ${distraction} for 1 hour`,
    documentProgress: TASK_LABELS.documentProgress,
  }), [skill, distraction]);

  return (
    <div
      className={cn(
        'day-card',
        isCurrent && 'day-card-current',
        isPast && 'day-card-past',
        isFuture && 'day-card-future'
      )}
    >
      {/* Header - Always visible */}
      <div
        role="button"
        tabIndex={isAccessible ? 0 : -1}
        aria-expanded={isExpanded}
        aria-disabled={!isAccessible}
        onClick={toggleExpand}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex items-center justify-between p-4 transition-colors duration-200',
          isAccessible && 'hover:bg-secondary/30 cursor-pointer'
        )}
      >
        <div className="flex items-center gap-3">
          {/* Day number badge */}
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
            isCurrent ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
          )}>
            {dayNumber}
          </div>
          
          {/* Date and status */}
          <div>
            <p className="font-medium">{formattedDate}</p>
            <p className="text-xs text-muted-foreground">
              {isCurrent ? 'TODAY' : isPast ? `Day ${dayNumber}` : 'LOCKED'}
            </p>
          </div>
        </div>

        {/* Right side - Status/Progress */}
        <div className="flex items-center gap-3">
          {isAccessible ? (
            <>
              <span className={cn(
                'text-sm',
                completedCount === 3 ? 'text-success' : 'text-muted-foreground'
              )}>
                {completedCount}/3 {completedCount === 3 && <Check className="inline w-4 h-4" />}
              </span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-muted-foreground transition-transform duration-300',
                  isExpanded && 'rotate-180'
                )}
              />
            </>
          ) : (
            <Lock className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Expandable content */}
      {isExpanded && isAccessible && (
        <div className="border-t border-border p-4 space-y-6 animate-fade-in">
          {/* Tasks section */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Today's Actions
            </h4>
            <div className="space-y-1">
              <TaskCheckbox
                label={taskLabels.learnSkill}
                checked={dayData.tasks.learnSkill}
                onChange={(checked) => onTaskChange({ learnSkill: checked })}
              />
              <TaskCheckbox
                label={taskLabels.avoidDistraction}
                checked={dayData.tasks.avoidDistraction}
                onChange={(checked) => onTaskChange({ avoidDistraction: checked })}
              />
              <TaskCheckbox
                label={taskLabels.documentProgress}
                checked={dayData.tasks.documentProgress}
                onChange={(checked) => onTaskChange({ documentProgress: checked })}
              />
            </div>
          </div>

          {/* Reflection section */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Reflection
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor={`stopped-${dayNumber}`} className="text-sm text-muted-foreground">
                What stopped you today?
              </Label>
              <Textarea
                id={`stopped-${dayNumber}`}
                value={whatStopped}
                onChange={handleWhatStoppedChange}
                placeholder="Be honest with yourself..."
                className="min-h-[80px] max-h-[200px] resize-y bg-surface-dim border-border focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`worked-${dayNumber}`} className="text-sm text-muted-foreground">
                What worked for you?
              </Label>
              <Textarea
                id={`worked-${dayNumber}`}
                value={whatWorked}
                onChange={handleWhatWorkedChange}
                placeholder="Celebrate small wins..."
                className="min-h-[80px] max-h-[200px] resize-y bg-surface-dim border-border focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default DayCard;

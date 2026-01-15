import React, { memo, useCallback } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * Custom checkbox for daily tasks
 * Provides a large touch target (44px+) for mobile users
 */
const TaskCheckbox = memo(function TaskCheckbox({ 
  label, 
  checked, 
  onChange, 
  disabled = false 
}: TaskCheckboxProps) {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onChange(!checked);
    }
  }, [checked, disabled, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onChange(!checked);
    }
  }, [checked, disabled, onChange]);

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'task-row min-h-[48px]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Checkbox */}
      <div
        className={cn(
          'w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0',
          checked 
            ? 'bg-success border-success' 
            : 'bg-surface-dim border-muted-foreground/50'
        )}
      >
        {checked && <Check className="w-4 h-4 text-success-foreground" />}
      </div>
      
      {/* Label */}
      <span className={cn(
        'text-sm sm:text-base transition-all duration-200',
        checked && 'line-through text-muted-foreground'
      )}>
        {label}
      </span>
    </div>
  );
});

export default TaskCheckbox;

import React, { memo } from 'react';
import { Target, Zap } from 'lucide-react';

interface QuoteBannerProps {
  quote: string;
  skill: string;
  distraction: string;
}

/**
 * Displays the user's mantra and their goal/obstacle
 * Serves as daily motivation at the top of the dashboard
 */
const QuoteBanner = memo(function QuoteBanner({ quote, skill, distraction }: QuoteBannerProps) {
  return (
    <div className="bg-card border-2 border-border rounded-lg p-6 sm:p-8 space-y-6">
      {/* Quote */}
      <p className="text-quote text-center">"{quote}"</p>
      
      {/* Goal and Obstacle */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Your Goal</p>
            <p className="font-medium truncate">{skill}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Fighting</p>
            <p className="font-medium truncate">{distraction}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default QuoteBanner;

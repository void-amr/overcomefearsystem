import React, { memo } from 'react';
import { Target, Sword, Quote } from 'lucide-react';

interface QuoteBannerProps {
  quote: string;
  skill: string;
  distraction: string;
}

/**
 * Displays the user's mantra and their goal/obstacle
 * Responsive quote sizing that scales to fit container
 */
const QuoteBanner = memo(function QuoteBanner({ quote, skill, distraction }: QuoteBannerProps) {
  return (
    <div className="quote-banner space-y-6">
      {/* Decorative quote icon */}
      <Quote className="w-8 h-8 text-primary/30 absolute top-4 right-4" />
      
      {/* Quote - Responsive sizing with proper wrapping */}
      <div className="relative z-10 py-2">
        <p className="text-quote text-center px-2">
          "{quote}"
        </p>
      </div>
      
      {/* Goal and Obstacle - Visual separation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border/50">
        <div className="flex items-center gap-4 p-3 rounded-xl bg-background/30 hover:bg-background/50 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-success" />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Fighting for</p>
            <p className="font-semibold truncate text-foreground">{skill}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-3 rounded-xl bg-background/30 hover:bg-background/50 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Sword className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Defeating</p>
            <p className="font-semibold truncate text-foreground">{distraction}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default QuoteBanner;

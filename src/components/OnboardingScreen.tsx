import React, { useState, useCallback, memo } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTodayISO } from '@/lib/dateUtils';

interface OnboardingScreenProps {
  onComplete: (data: { quote: string; skill: string; distraction: string; startDate: string }) => void;
}

/**
 * Onboarding screen shown to first-time users
 * Collects: mantra/quote, skill to learn, distraction to fight
 */
const OnboardingScreen = memo(function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [quote, setQuote] = useState('');
  const [skill, setSkill] = useState('');
  const [distraction, setDistraction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ quote?: string; skill?: string; distraction?: string }>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: typeof errors = {};
    
    if (!quote.trim()) {
      newErrors.quote = 'Please enter your mantra';
    } else if (quote.trim().length > 200) {
      newErrors.quote = 'Mantra must be under 200 characters';
    }
    
    if (!skill.trim()) {
      newErrors.skill = 'Please enter the skill you\'re learning';
    } else if (skill.trim().length > 200) {
      newErrors.skill = 'Skill must be under 200 characters';
    }
    
    if (!distraction.trim()) {
      newErrors.distraction = 'Please enter what\'s stopping you';
    } else if (distraction.trim().length > 200) {
      newErrors.distraction = 'Response must be under 200 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [quote, skill, distraction]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Small delay for visual feedback
    setTimeout(() => {
      onComplete({
        quote: quote.trim(),
        skill: skill.trim(),
        distraction: distraction.trim(),
        startDate: getTodayISO(),
      });
    }, 150);
  }, [quote, skill, distraction, validateForm, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center p-5 animate-fade-in">
      <div className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-hero">10 DAYS TO ACTION</h1>
            <p className="text-lg text-muted-foreground">
              Stop researching. Start doing.
            </p>
          </div>

          {/* Form fields */}
          <div className="space-y-6">
            {/* Quote/Mantra field */}
            <div className="space-y-2">
              <Label htmlFor="quote" className="text-xs uppercase tracking-wider text-muted-foreground">
                Your Mantra
              </Label>
              <Input
                id="quote"
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Enter a quote that will fuel you..."
                className="h-12 text-lg bg-surface-dim border-border focus:border-primary focus:ring-1 focus:ring-primary"
                maxLength={200}
                aria-describedby={errors.quote ? 'quote-error' : undefined}
              />
              {errors.quote && (
                <p id="quote-error" className="text-sm text-destructive">{errors.quote}</p>
              )}
            </div>

            {/* Skill field */}
            <div className="space-y-2">
              <Label htmlFor="skill" className="text-xs uppercase tracking-wider text-muted-foreground">
                The Skill You're Learning
              </Label>
              <Input
                id="skill"
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="Video editing, coding, drawing..."
                className="h-12 text-lg bg-surface-dim border-border focus:border-primary focus:ring-1 focus:ring-primary"
                maxLength={200}
                aria-describedby={errors.skill ? 'skill-error' : undefined}
              />
              {errors.skill && (
                <p id="skill-error" className="text-sm text-destructive">{errors.skill}</p>
              )}
            </div>

            {/* Distraction field */}
            <div className="space-y-2">
              <Label htmlFor="distraction" className="text-xs uppercase tracking-wider text-muted-foreground">
                What's Stopping You
              </Label>
              <Input
                id="distraction"
                type="text"
                value={distraction}
                onChange={(e) => setDistraction(e.target.value)}
                placeholder="Fear, perfectionism, YouTube..."
                className="h-12 text-lg bg-surface-dim border-border focus:border-primary focus:ring-1 focus:ring-primary"
                maxLength={200}
                aria-describedby={errors.distraction ? 'distraction-error' : undefined}
              />
              {errors.distraction && (
                <p id="distraction-error" className="text-sm text-destructive">{errors.distraction}</p>
              )}
            </div>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 animate-pulse-glow"
            size="lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Starting...' : 'START THE JOURNEY'}
          </Button>
        </form>
      </div>
    </div>
  );
});

export default OnboardingScreen;

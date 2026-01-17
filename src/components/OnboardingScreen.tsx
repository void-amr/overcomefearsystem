import React, { useState, useCallback, memo } from 'react';
import { Flame, ArrowRight, Target, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTodayISO } from '@/lib/dateUtils';

interface OnboardingScreenProps {
  onComplete: (data: { quote: string; skill: string; distraction: string; startDate: string }) => void;
}

/**
 * Onboarding screen - Emotionally charged entry point
 * Designed to trigger immediate action and commitment
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
      newErrors.quote = 'You need a battle cry';
    } else if (quote.trim().length > 200) {
      newErrors.quote = 'Keep it under 200 characters';
    }
    
    if (!skill.trim()) {
      newErrors.skill = 'What are you fighting for?';
    } else if (skill.trim().length > 200) {
      newErrors.skill = 'Keep it under 200 characters';
    }
    
    if (!distraction.trim()) {
      newErrors.distraction = 'Name your enemy';
    } else if (distraction.trim().length > 200) {
      newErrors.distraction = 'Keep it under 200 characters';
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
    
    setTimeout(() => {
      onComplete({
        quote: quote.trim(),
        skill: skill.trim(),
        distraction: distraction.trim(),
        startDate: getTodayISO(),
      });
    }, 200);
  }, [quote, skill, distraction, validateForm, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background gradient accent */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, hsl(0 84% 60% / 0.15) 0%, transparent 60%)'
        }}
      />
      
      <div className="w-full max-w-lg relative z-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Header - Dramatic and urgent */}
          <div className="text-center space-y-4 animate-fade-in">
            {/* Urgency badge */}
            <div className="inline-flex items-center gap-2 badge-urgent mb-4 animate-float">
              <Flame className="w-3.5 h-3.5" />
              <span>10 days. No excuses.</span>
            </div>
            
            <h1 className="text-hero leading-none">
              STOP<br />WAITING
            </h1>
            <p className="text-urgent max-w-sm mx-auto">
              Your future self is counting on the next 10 days. Start now or stay stuck forever.
            </p>
          </div>

          {/* Form fields with emotional labels */}
          <div className="space-y-6">
            {/* Quote/Mantra field */}
            <div className="space-y-3 animate-fade-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
              <Label htmlFor="quote" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                Your Battle Cry
              </Label>
              <Input
                id="quote"
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="The words that will push you through..."
                className="h-14 text-lg input-action rounded-xl"
                maxLength={200}
                aria-describedby={errors.quote ? 'quote-error' : undefined}
              />
              {errors.quote && (
                <p id="quote-error" className="text-sm text-destructive font-medium">{errors.quote}</p>
              )}
            </div>

            {/* Skill field */}
            <div className="space-y-3 animate-fade-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
              <Label htmlFor="skill" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Target className="w-4 h-4 text-primary" />
                What You're Fighting For
              </Label>
              <Input
                id="skill"
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="The skill that will change everything..."
                className="h-14 text-lg input-action rounded-xl"
                maxLength={200}
                aria-describedby={errors.skill ? 'skill-error' : undefined}
              />
              {errors.skill && (
                <p id="skill-error" className="text-sm text-destructive font-medium">{errors.skill}</p>
              )}
            </div>

            {/* Distraction field */}
            <div className="space-y-3 animate-fade-up stagger-3 opacity-0" style={{ animationFillMode: 'forwards' }}>
              <Label htmlFor="distraction" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Shield className="w-4 h-4 text-primary" />
                Your Enemy
              </Label>
              <Input
                id="distraction"
                type="text"
                value={distraction}
                onChange={(e) => setDistraction(e.target.value)}
                placeholder="The thing holding you back..."
                className="h-14 text-lg input-action rounded-xl"
                maxLength={200}
                aria-describedby={errors.distraction ? 'distraction-error' : undefined}
              />
              {errors.distraction && (
                <p id="distraction-error" className="text-sm text-destructive font-medium">{errors.distraction}</p>
              )}
            </div>
          </div>

          {/* Submit button - Maximum urgency */}
          <div className="animate-fade-up stagger-4 opacity-0 pt-4" style={{ animationFillMode: 'forwards' }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 text-xl font-bold btn-cta rounded-xl transition-all duration-300"
              size="lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚡</span>
                  Starting...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  BEGIN THE WAR
                  <ArrowRight className="w-6 h-6" />
                </span>
              )}
            </Button>
            
            <p className="text-center text-muted-foreground text-sm mt-4">
              No account needed. Your progress is saved locally.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
});

export default OnboardingScreen;

import React, { memo } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Warning displayed when cookies are disabled
 */
const CookieWarning = memo(function CookieWarning() {
  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/20">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">Cookies Required</h1>
          <p className="text-muted-foreground">
            This app uses cookies to save your progress. Please enable cookies in your browser settings and refresh the page.
          </p>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>We only store your challenge data locally.</p>
          <p>No tracking, no third parties.</p>
        </div>
      </div>
    </div>
  );
});

export default CookieWarning;

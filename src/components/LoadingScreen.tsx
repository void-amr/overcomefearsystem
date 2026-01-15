import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading screen shown while app data is being loaded
 */
const LoadingScreen = memo(function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
});

export default LoadingScreen;

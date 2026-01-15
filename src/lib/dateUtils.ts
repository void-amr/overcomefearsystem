/**
 * Date utility functions for the 10 Days to Action app
 */

/**
 * Get the current day number (1-10) based on start date
 */
export function getCurrentDayNumber(startDate: string): number {
  const start = new Date(startDate);
  const today = new Date();
  
  // Reset time components to compare dates only
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Day 1 is the start date, so add 1
  return Math.min(Math.max(diffDays + 1, 1), 11);
}

/**
 * Get the date for a specific day number
 */
export function getDateForDay(startDate: string, dayNumber: number): Date {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const date = new Date(start);
  date.setDate(date.getDate() + (dayNumber - 1));
  return date;
}

/**
 * Format a date for display (e.g., "Jan 15, 2026")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Check if a day is in the past (relative to current day)
 */
export function isDayPast(dayNumber: number, currentDayNumber: number): boolean {
  return dayNumber < currentDayNumber;
}

/**
 * Check if a day is the current day
 */
export function isDayCurrent(dayNumber: number, currentDayNumber: number): boolean {
  return dayNumber === currentDayNumber;
}

/**
 * Check if a day is in the future
 */
export function isDayFuture(dayNumber: number, currentDayNumber: number): boolean {
  return dayNumber > currentDayNumber;
}

/**
 * Check if the challenge is complete (day 11+)
 */
export function isChallengeComplete(startDate: string): boolean {
  return getCurrentDayNumber(startDate) > 10;
}

/**
 * Get today's date as ISO string
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

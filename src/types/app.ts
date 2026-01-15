/**
 * Type definitions for the 10 Days to Action app
 */

export interface UserData {
  quote: string;
  skill: string;
  distraction: string;
  startDate: string;
  onboarded: boolean;
}

export interface DayTasks {
  learnSkill: boolean;
  avoidDistraction: boolean;
  documentProgress: boolean;
}

export interface DayReflection {
  whatStopped: string;
  whatWorked: string;
}

export interface DayData {
  tasks: DayTasks;
  reflection: DayReflection;
}

export interface AllDaysData {
  [key: string]: DayData; // key format: "day_1", "day_2", etc.
}

export const DEFAULT_DAY_DATA: DayData = {
  tasks: {
    learnSkill: false,
    avoidDistraction: false,
    documentProgress: false,
  },
  reflection: {
    whatStopped: '',
    whatWorked: '',
  },
};

export const TASK_LABELS = {
  learnSkill: 'Spend 15 min learning your skill',
  avoidDistraction: 'Avoid your distraction for 1 hour',
  documentProgress: 'Document your progress',
} as const;

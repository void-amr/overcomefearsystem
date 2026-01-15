import { useState, useEffect, useCallback } from 'react';
import { getCookie, setCookie, getCookieJSON, setCookieJSON } from '@/lib/cookies';
import { getCurrentDayNumber, isChallengeComplete } from '@/lib/dateUtils';
import type { UserData, DayData, AllDaysData, DayTasks, DayReflection } from '@/types/app';
import { DEFAULT_DAY_DATA } from '@/types/app';

interface UseAppDataReturn {
  userData: UserData | null;
  currentDay: number;
  isComplete: boolean;
  isLoading: boolean;
  saveUserData: (data: Omit<UserData, 'onboarded'>) => boolean;
  getDayData: (dayNumber: number) => DayData;
  updateDayTasks: (dayNumber: number, tasks: Partial<DayTasks>) => boolean;
  updateDayReflection: (dayNumber: number, reflection: Partial<DayReflection>) => boolean;
  resetApp: () => void;
}

export function useAppData(): UseAppDataReturn {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [daysData, setDaysData] = useState<AllDaysData>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load data from cookies on mount
  useEffect(() => {
    const loadData = () => {
      const onboarded = getCookie('onboarded') === 'true';
      
      if (onboarded) {
        const quote = getCookie('quote') || '';
        const skill = getCookie('skill') || '';
        const distraction = getCookie('distraction') || '';
        const startDate = getCookie('startDate') || new Date().toISOString().split('T')[0];

        setUserData({
          quote,
          skill,
          distraction,
          startDate,
          onboarded: true,
        });

        // Load days data
        const storedDaysData = getCookieJSON<AllDaysData>('daysData');
        if (storedDaysData) {
          setDaysData(storedDaysData);
        }
      }
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  const currentDay = userData?.startDate ? getCurrentDayNumber(userData.startDate) : 1;
  const isComplete = userData?.startDate ? isChallengeComplete(userData.startDate) : false;

  const saveUserData = useCallback((data: Omit<UserData, 'onboarded'>): boolean => {
    const success = 
      setCookie('quote', data.quote) &&
      setCookie('skill', data.skill) &&
      setCookie('distraction', data.distraction) &&
      setCookie('startDate', data.startDate) &&
      setCookie('onboarded', 'true');

    if (success) {
      setUserData({ ...data, onboarded: true });
    }
    
    return success;
  }, []);

  const getDayData = useCallback((dayNumber: number): DayData => {
    const key = `day_${dayNumber}`;
    return daysData[key] || { ...DEFAULT_DAY_DATA };
  }, [daysData]);

  const updateDayTasks = useCallback((dayNumber: number, tasks: Partial<DayTasks>): boolean => {
    const key = `day_${dayNumber}`;
    const currentDayData = daysData[key] || { ...DEFAULT_DAY_DATA };
    const updatedDayData: DayData = {
      ...currentDayData,
      tasks: { ...currentDayData.tasks, ...tasks },
    };
    
    const updatedDaysData = { ...daysData, [key]: updatedDayData };
    const success = setCookieJSON('daysData', updatedDaysData);
    
    if (success) {
      setDaysData(updatedDaysData);
    }
    
    return success;
  }, [daysData]);

  const updateDayReflection = useCallback((dayNumber: number, reflection: Partial<DayReflection>): boolean => {
    const key = `day_${dayNumber}`;
    const currentDayData = daysData[key] || { ...DEFAULT_DAY_DATA };
    const updatedDayData: DayData = {
      ...currentDayData,
      reflection: { ...currentDayData.reflection, ...reflection },
    };
    
    const updatedDaysData = { ...daysData, [key]: updatedDayData };
    const success = setCookieJSON('daysData', updatedDaysData);
    
    if (success) {
      setDaysData(updatedDaysData);
    }
    
    return success;
  }, [daysData]);

  const resetApp = useCallback(() => {
    setCookie('onboarded', '', { days: -1 });
    setCookie('quote', '', { days: -1 });
    setCookie('skill', '', { days: -1 });
    setCookie('distraction', '', { days: -1 });
    setCookie('startDate', '', { days: -1 });
    setCookie('daysData', '', { days: -1 });
    
    setUserData(null);
    setDaysData({});
  }, []);

  return {
    userData,
    currentDay,
    isComplete,
    isLoading,
    saveUserData,
    getDayData,
    updateDayTasks,
    updateDayReflection,
    resetApp,
  };
}

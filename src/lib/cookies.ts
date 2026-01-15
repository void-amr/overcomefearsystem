/**
 * Cookie utility functions for data persistence
 * Handles all cookie operations with proper error handling
 */

export interface CookieOptions {
  days?: number;
  path?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

const DEFAULT_OPTIONS: CookieOptions = {
  days: 365,
  path: '/',
  secure: true,
  sameSite: 'Lax',
};

/**
 * Set a cookie with the given name, value, and options
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): boolean {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const expires = new Date();
    expires.setTime(expires.getTime() + (opts.days || 365) * 24 * 60 * 60 * 1000);

    const cookieValue = encodeURIComponent(value);
    
    // Check if value exceeds 4KB limit
    if (cookieValue.length > 4000) {
      console.warn(`Cookie "${name}" exceeds 4KB limit`);
      return false;
    }

    document.cookie = `${name}=${cookieValue};expires=${expires.toUTCString()};path=${opts.path};SameSite=${opts.sameSite}${opts.secure ? ';Secure' : ''}`;
    return true;
  } catch (error) {
    console.error('Failed to set cookie:', error);
    return false;
  }
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  try {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to get cookie:', error);
    return null;
  }
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  } catch (error) {
    console.error('Failed to delete cookie:', error);
  }
}

/**
 * Check if cookies are enabled in the browser
 */
export function areCookiesEnabled(): boolean {
  try {
    setCookie('__test_cookie__', 'test', { days: 1 });
    const result = getCookie('__test_cookie__') === 'test';
    deleteCookie('__test_cookie__');
    return result;
  } catch {
    return false;
  }
}

/**
 * Store JSON data in a cookie (with automatic stringification)
 */
export function setCookieJSON<T>(name: string, value: T, options?: CookieOptions): boolean {
  try {
    const jsonString = JSON.stringify(value);
    return setCookie(name, jsonString, options);
  } catch (error) {
    console.error('Failed to stringify value for cookie:', error);
    return false;
  }
}

/**
 * Get JSON data from a cookie (with automatic parsing)
 */
export function getCookieJSON<T>(name: string): T | null {
  try {
    const value = getCookie(name);
    if (value === null) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Failed to parse cookie JSON:', error);
    return null;
  }
}

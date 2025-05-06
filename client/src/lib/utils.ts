import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate age from date of birth
 * @param dateOfBirth Date string in ISO format or Date object
 * @returns Age in years as a number, or null if invalid date
 */
export function calculateAge(dateOfBirth: string | Date | null): number | null {
  if (!dateOfBirth) return null;
  
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  
  // Check if date is valid
  if (isNaN(dob.getTime())) return null;
  
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  // Adjust age if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Filter an array of objects by a search query
 * @param items Array of objects to filter
 * @param query Search query string
 * @param keys Array of object keys to search in
 * @returns Filtered array of objects
 */
export function filterBySearchQuery<T>(items: T[], query: string, keys: (keyof T)[]): T[] {
  if (!query || query.trim() === '') return items;
  
  const lowerCaseQuery = query.toLowerCase().trim();
  
  return items.filter(item => {
    return keys.some(key => {
      const value = item[key];
      if (value === null || value === undefined) return false;
      
      const stringValue = String(value).toLowerCase();
      return stringValue.includes(lowerCaseQuery);
    });
  });
}

/**
 * Group appointments by date
 * @param appointments Array of appointment objects
 * @returns Object with dates as keys and arrays of appointments as values
 */
export function groupAppointmentsByDate<T extends { dateTime: Date | string }>(appointments: T[]): Record<string, T[]> {
  return appointments.reduce((groups, appointment) => {
    const date = typeof appointment.dateTime === 'string' 
      ? new Date(appointment.dateTime).toLocaleDateString() 
      : appointment.dateTime.toLocaleDateString();
      
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(appointment);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Format a date with various options
 * @param date Date to format
 * @param options Formatting options
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | null, options: { format?: 'short' | 'long' | 'time' | 'datetime' } = {}): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  const { format = 'short' } = options;
  
  switch (format) {
    case 'long':
      return dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'time':
      return dateObj.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    case 'datetime':
      return dateObj.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      });
    case 'short':
    default:
      return dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
  }
}

/**
 * Format a date and time for display in UI
 * @param date Date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  return dateObj.toLocaleString('en-US', { 
    weekday: 'short',
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  });
}

/**
 * Generate a random staff ID with a specific format
 * @returns Formatted staff ID string
 */
export function generateStaffId(): string {
  const prefix = 'STF';
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const timestamp = Date.now().toString().substring(8, 13);
  return `${prefix}-${randomDigits}-${timestamp}`;
}

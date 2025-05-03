import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format a date and time string to a human-readable format
 */
export function formatDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Generate a patient ID with format PAT-YYYY-XXX
 */
export function generatePatientId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `PAT-${year}-${randomNum}`;
}

/**
 * Generate a staff ID with format STAFF-YYYY-XXX
 */
export function generateStaffId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `STAFF-${year}-${randomNum}`;
}

/**
 * Filter items based on search query
 */
export function filterBySearchQuery<T extends Record<string, any>>(
  items: T[],
  query: string,
  fields: string[]
): T[] {
  if (!query.trim()) return items;
  
  const lowercaseQuery = query.toLowerCase().trim();
  
  return items.filter(item => {
    return fields.some(field => {
      const value = item[field];
      if (!value) return false;
      return String(value).toLowerCase().includes(lowercaseQuery);
    });
  });
}

/**
 * Sort items by a specific field
 */
export function sortByField<T extends Record<string, any>>(
  items: T[],
  field: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];
    
    if (valueA === valueB) return 0;
    
    if (valueA === null || valueA === undefined) return direction === 'asc' ? -1 : 1;
    if (valueB === null || valueB === undefined) return direction === 'asc' ? 1 : -1;
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    return direction === 'asc' 
      ? (valueA < valueB ? -1 : 1) 
      : (valueA < valueB ? 1 : -1);
  });
}

/**
 * Group appointments by date
 */
export function groupAppointmentsByDate<T extends { dateTime: string }>(
  appointments: T[]
): Record<string, T[]> {
  return appointments.reduce((groups, appointment) => {
    const date = new Date(appointment.dateTime).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(appointment);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Check if a date is today
 */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * Get today's appointments from a list of appointments
 */
export function getTodayAppointments<T extends { dateTime: string }>(
  appointments: T[]
): T[] {
  return appointments.filter(appointment => isToday(appointment.dateTime));
}

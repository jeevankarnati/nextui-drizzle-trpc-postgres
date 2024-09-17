import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function luxonDate(date: string) {
  return DateTime.fromISO(date.replace(" ", "T")).setZone("system");
}

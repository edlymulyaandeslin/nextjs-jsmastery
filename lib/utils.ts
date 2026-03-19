import { techMap } from "@/constants/TechMap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDeviconClassname = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLocaleLowerCase();

  return techMap[normalizedTechName] ? `${techMap[normalizedTechName]} colored` : "devicon-devicon-plain";
};

export const getTimestamp = (createdAt: Date): string => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const timeUnits = [
    { limit: 60 * 1000, divisor: 1000, unit: "second" },
    { limit: 60 * 60 * 1000, divisor: 60 * 1000, unit: "minute" },
    { limit: 24 * 60 * 60 * 1000, divisor: 60 * 60 * 1000, unit: "hour" },
    { limit: 7 * 24 * 60 * 60 * 1000, divisor: 24 * 60 * 60 * 1000, unit: "day" },
    { limit: 30 * 24 * 60 * 60 * 1000, divisor: 7 * 24 * 60 * 60 * 1000, unit: "week" },
    { limit: 365 * 24 * 60 * 60 * 1000, divisor: 30 * 24 * 60 * 60 * 1000, unit: "month" },
  ];

  for (const { limit, divisor, unit } of timeUnits) {
    if (diffMs < limit) {
      const value = Math.floor(diffMs / divisor);
      if (value === 0) return "just now";
      const suffix = value === 1 ? "" : "s";
      return `${value} ${unit}${suffix} ago`;
    }
  }

  const years = Math.floor(diffMs / (365 * 24 * 60 * 60 * 1000));
  const suffix = years === 1 ? "" : "s";
  return `${years} year${suffix} ago`;
};

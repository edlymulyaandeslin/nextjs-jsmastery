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

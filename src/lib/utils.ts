import { date } from "drizzle-orm/mysql-core";
import { get } from "http";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const equipments = [
  "None",
  "Weapon",
  "ar",
  "co",
  "ba",
  "he",
  "pe",
  "mi",
  "td",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRoles(access: number) {
  if (access == 1) return "Player";
  if (access == 10) return "VIP";
  if (access == 40) return "<font color='orange'>Moderator</font>";
  if (access == 60) return "<font color='red'>Administrator</font>";
  if (access == 90) return "<font color='gold'>Game Developer</font>";
  if (access == 100) return "<font color='green'>Owner</font>";

  return "Unknown";
}

export function coreValue(core: string) {
  return "";
}

export function getClassCategory(cat: string) {
  switch (cat.toLowerCase()) {
    case "m1":
      return "Tank Melee";
    case "m2":
      return "Dodge Melee";
    case "m3":
      return "Full Hybrid";
    case "m4":
      return "Power Melee";
    case "s1":
      return "Luck Hybrid";
    case "c1":
      return "Offensive Caster";
    case "c2":
      return "Defensive Caster";
    case "c3":
      return "Power Caster";
  }
}

export function getEquipmentByType(type: string) {
  switch (type.toLowerCase()) {
    case "item":
      return "None";
    case "class":
      return "ar";
    case "armor":
      return "co";
    case "axe":
      return "Weapon";
    case "bow":
      return "Weapon";
    case "cape":
      return "ba";
    case "dagger":
      return "Weapon";
    case "gauntlet":
      return "Weapon";
    case "ground":
      return "mi";
    case "gun":
      return "Weapon";
    case "helm":
      return "he";
    case "house":
      return "ho";
    case "floor item":
      return "hi";
    case "mace":
      return "Weapon";
    case "pet":
      return "pe";
    case "staff":
      return "Weapon";
    case "sword":
      return "Weapon";
    case "title":
      return "td";
    case "enhancement":
    case "serveruse":
      return "None";
    default:
      return "Unknown";
  }
}

export function stat(stat: string) {
  switch (stat.toLowerCase()) {
    case "cai":
      return "Damage Resistance";
    case "cao":
      return "Damage Boosts";
    case "cpi":
      return "Physical Resistance";
    case "cpo":
      return "Physical Boosts";
    case "cmi":
      return "Magical Resistance";
    case "cmo":
      return "Magical Boosts";
    case "chi":
      return "Healing Intake";
    case "cho":
      return "Healing Boosts";
    case "tdo":
      return "Evasion";
    case "tha":
      return "Haste";
    case "thi":
      return "Accuracy";
    case "tcr":
      return "Critical Chance";
    case "scm":
      return "Critical Multiplier";
    case "str":
      return "Strength";
    case "end":
      return "Endurance";
    case "dex":
      return "Dexterity";
    case "int":
      return "Intellect";
    case "wis":
      return "Wisdom";
    case "lck":
      return "Luck";
    case "ap":
      return "Attack Power";
    case "sp":
      return "Spell Power";
  }

  return "None";
}

export function displayDate(date: string) {
  const dateObj = new Date(date);
  return `${dateObj.getFullYear()}-${
    dateObj.getMonth() + 1
  }-${dateObj.getDate()}`;
}

// export function getLastSeenMessage(lastLogin: Date | null): string {
//   if (!lastLogin) return "Never logged in";

//   const diff = Date.now() - lastLogin.getTime();
//   const minutes = Math.floor(diff / (1000 * 60));
//   const hours = Math.floor(diff / (1000 * 60 * 60));
//   const days = Math.floor(diff / (1000 * 60 * 60 * 24));

//   if (minutes < 60) return `${minutes}m ago`;
//   if (hours < 24) return `${hours}h ago`;
//   return `${days}d ago`;
// }

export function getLastSeenMessage(lastLogin: string): string {
  const lastSeen = new Date(lastLogin);
  const now = new Date();

  const diffMs = now.getTime() - lastSeen.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) return `${diffYears} year(s) ago`;
  if (diffMonths > 0) return `${diffMonths} month(s) ago`;
  if (diffDays > 0) return `${diffDays} day(s) ago`;
  if (diffHours > 0) return `${diffHours} hour(s) ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute(s) ago`;
  return "Just now";
}

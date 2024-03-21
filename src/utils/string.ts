import { shuffleArray } from "./array";

export const shuffleString = (str: string) =>
  shuffleArray(Array.from(str)).join("");

export const sanitize = (str: string) => {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  const reg = /[&<>"'`=\/]/gi;
  return str.replace(reg, (match) => map[match] || match);
};

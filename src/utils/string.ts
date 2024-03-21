export const shuffleString = (str: string) =>
  str
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

export function shuffleArray<T>(array: T[]) {
  return array.concat().sort(() => Math.random() - 0.5);
}

export const isButtonTarget = (
  target: EventTarget | null,
): target is HTMLButtonElement =>
  Boolean(target) && target instanceof HTMLButtonElement;

import { twMerge } from "tailwind-merge";

export const cn = (...classes: (string | undefined | boolean)[]): string =>
  twMerge(...(classes.filter(Boolean) as string[]));

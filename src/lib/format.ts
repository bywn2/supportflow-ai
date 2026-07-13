import { formatDistanceToNow, format } from "date-fns";

export const money = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

export const compact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);

export const relTime = (d: Date | string | number) => {
  const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  return formatDistanceToNow(date, { addSuffix: true });
};

export const absTime = (d: Date | string | number) => {
  const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  return format(date, "PPpp");
};

export const ms = (n: number) => (n < 1000 ? `${n}ms` : `${(n / 1000).toFixed(2)}s`);

export const delay = (min = 200, max = 400) =>
  new Promise((r) => setTimeout(r, Math.random() * (max - min) + min));

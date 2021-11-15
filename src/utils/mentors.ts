import { Time } from "../collections/times";

export function filterAndSortTimes(times: Time[]) {
  return times
    .filter((time) => time.date.getTime() > Date.now())
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

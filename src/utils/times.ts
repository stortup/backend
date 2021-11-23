import { Time } from "../collections/times.js";

function canTimeBeInserted(time: Time, newTime: Time) {
  const timeEnd = time.date.getTime() + time.duration * 60 * 1000;
  const newTimeStart = newTime.date.getTime();
  const delta = newTimeStart - timeEnd;
  return delta >= 0;
}

export function addTime(array: Time[], newDate: Time) {
  if (newDate.date.getTime() < Date.now()) return;

  if (array.length === 0) {
    array.push(newDate);
    return;
  }

  let exist = false;
  for (let i = 0; i < array.length; i++) {
    if (array[i].date.getTime() > newDate.date.getTime()) {
      exist = true;
      if (!canTimeBeInserted(array[i - 1], newDate)) return;

      array.splice(i, 0, newDate);
      return;
    }
  }

  if (!exist) {
    if (!canTimeBeInserted(array[array.length - 1], newDate)) return;
    array.push(newDate);
  }
}

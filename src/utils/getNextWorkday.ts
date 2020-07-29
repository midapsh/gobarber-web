export default function getNextWork(currentDate: Date): Date {
  currentDate.setDate(currentDate.getDate() + 1); // tomorrow
  if (currentDate.getDay() === 0)
    currentDate.setDate(currentDate.getDate() + 1);
  else if (currentDate.getDay() === 6)
    currentDate.setDate(currentDate.getDate() + 2);
  return currentDate;
}

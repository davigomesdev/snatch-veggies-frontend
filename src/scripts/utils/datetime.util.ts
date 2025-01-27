import { differenceInHours, differenceInMinutes, differenceInSeconds, isBefore } from 'date-fns';

export const countdown = (
  targetDate: string | Date,
): { isCompleted: boolean; dateTime: string } => {
  const now = new Date();
  const target = new Date(targetDate);

  if (isBefore(target, now)) {
    return { isCompleted: true, dateTime: '00:00:00' };
  }

  const totalHours = differenceInHours(target, now);
  const totalMinutes = differenceInMinutes(target, now);
  const totalSeconds = differenceInSeconds(target, now);

  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  const formatNumber = (num: number): string => String(num).padStart(2, '0');

  return {
    isCompleted: false,
    dateTime: `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`,
  };
};

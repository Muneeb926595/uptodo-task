import dayjs from 'dayjs';

export const generateWeekDays = (startDate: dayjs.Dayjs) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(startDate.add(i, 'day'));
  }
  return days;
};

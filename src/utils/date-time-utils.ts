import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isYesterday from 'dayjs/plugin/isYesterday';

export const initializeDayjsPlugins = () => {
  dayjs.extend(utc);
  dayjs.extend(isToday);
  dayjs.extend(isTomorrow);
  dayjs.extend(isYesterday);
  dayjs.extend(timezone);
};

// to convert backend date object into frontend calendar object
export const convertDateStringToObj = (dateString: any) => {
  if (dateString) {
    // Convert date string to Date object
    const date = new Date(dateString);

    // Get year, month, and day from the Date object
    const year = date.getFullYear();
    // Months are zero-based in JavaScript, so we add 1 to get the correct month
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Create the desired object
    const result = {
      [`${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`]:
        {
          marked: true,
          selected: true,
        },
    };

    return result;
  } else {
    return null;
  }
};

export const formatTodoDateTime = (
  date: Date | number | string,
  timeFormat = 'HH:mm',
) => {
  // Parse the timestamp in local timezone
  const d = dayjs(date);

  if (d.isToday()) {
    return `Today At ${d.format(timeFormat)}`;
  }

  if (d.isTomorrow()) {
    return `Tomorrow At ${d.format(timeFormat)}`;
  }

  if (d.isYesterday()) {
    return `Yesterday At ${d.format(timeFormat)}`;
  }

  return d.format(`DD MMM YYYY [At] ${timeFormat}`);
};

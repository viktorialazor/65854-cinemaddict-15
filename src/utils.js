import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {MAX_SHORT_DESCRIPTIONS} from './const.js';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomNumber = (a = 0, b = 1, floating = 'false') => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  let result = 0;

  if (floating === 'true') {
    result = Math.round((lower + Math.random() * (upper - lower))*10)/10;
  } else {
    result = Math.floor(lower + Math.random() * (upper - lower + 1));
  }

  return result;
};

const humanizeDate = (date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};

const changeFormatDate = (date, format) => dayjs(date).format(format);

const durationFilm = (duration) => {
  let durationName = '';

  if (duration >= 61) {
    const hours = parseInt((duration / 60), 10);
    const minutes = duration % 60;
    durationName = `${hours}h ${minutes}m`;
  } else {
    durationName = `${duration}m`;
  }

  return durationName;
};

const generateShortDescription = (description) => {
  let shortDescription = '';

  if (description.length >= MAX_SHORT_DESCRIPTIONS) {
    shortDescription = `${description.slice(0, (MAX_SHORT_DESCRIPTIONS - 1))}...`;
  } else {
    shortDescription = description.slice();
  }

  return shortDescription;
};

export {getRandomNumber, humanizeDate, changeFormatDate, durationFilm, generateShortDescription};

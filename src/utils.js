import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {MAX_SHORT_DESCRIPTIONS, MINUTES_IN_HOUR} from './const.js';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

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

const durationFilm = (duration = 0) => {
  let durationName = '';

  if ((duration >= MINUTES_IN_HOUR) && ((duration % MINUTES_IN_HOUR) === 0)) {
    const hours = parseInt((duration / MINUTES_IN_HOUR), 10);
    durationName = `${hours}h`;
  } else if (duration > MINUTES_IN_HOUR && ((duration % MINUTES_IN_HOUR) !== 0)) {
    const hours = parseInt((duration / MINUTES_IN_HOUR), 10);
    const minutes = duration % MINUTES_IN_HOUR;
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

const getPopupData = (card, commentsList) => {
  const cardCommentsId = card.commentsId;

  const filmComments = [];

  cardCommentsId.forEach((commentId) => {
    commentsList.forEach((comment) => {
      if (comment.id === commentId) {
        filmComments.push(comment);
      }
    });
  });

  return [card, filmComments];
};

export {RenderPosition, render, createElement, getRandomNumber, humanizeDate, changeFormatDate, durationFilm, generateShortDescription, getPopupData};

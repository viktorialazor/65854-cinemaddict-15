import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {MAX_SHORT_DESCRIPTIONS, MINUTES_IN_HOUR, FilterType} from '../const.js';
import {getRandomNumber} from './common.js';

const getProfileRating = (cards) => {
  let profileRating = '';
  let watchedAmount = 0;

  cards.forEach((card) => {
    if (card.isWatched) {
      watchedAmount += 1;
    }
  });

  if (watchedAmount > 0 && watchedAmount < 11) {
    profileRating = 'Novice';
  } else if (watchedAmount > 10 && watchedAmount < 20) {
    profileRating = 'Fan';
  } else if (watchedAmount > 20){
    profileRating = 'Movie Buff';
  } else {
    profileRating = '';
  }

  return profileRating;
};

const humanizeDate = (date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};

const getCurrentDate = () => {
  dayjs.extend(relativeTime);
  const date = dayjs().toDate();
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

const getDurationWatchedFilm = (duration = 0) => {
  const hours = parseInt((duration / MINUTES_IN_HOUR), 10);
  const minutes = duration % MINUTES_IN_HOUR;

  return {hours, minutes};
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

const generateCommentAuthor = () => {
  const authors = ['Tim Macoveev', 'John Doe', 'Mary Beth', 'John Call', 'Eleanor Parker'];

  const randomIndex = getRandomNumber(0, authors.length - 1);

  return authors[randomIndex];
};

const sortFilmsDate = (filmA, filmB) => dayjs(filmA.release).diff(dayjs(filmB.release));

const sortFilmsRating = (filmA, filmB) => filmB.rating - filmA.rating;

const getNoFilmsMessage = (filterType) => {
  let message = '';

  switch(filterType) {
    case FilterType.ALL:
      message = 'There are no movies in our database';
      break;
    case FilterType.WATCHLIST:
      message = 'There are no watchlist movies';
      break;
    case FilterType.HISTORY:
      message = 'There are no watched movies';
      break;
    case FilterType.FAVORITES:
      message = 'There are no favorites movies';
      break;
  }

  return message;
};

const generateWatchingDate = () => {
  const maxDaysGap = 365;
  const daysGap = getRandomNumber(-maxDaysGap, 0);
  const date = dayjs().add(daysGap, 'day').toDate();
  return date;
};

export {getProfileRating, humanizeDate, getCurrentDate, changeFormatDate, durationFilm, getDurationWatchedFilm, generateShortDescription, getPopupData, generateCommentAuthor, sortFilmsDate, sortFilmsRating, getNoFilmsMessage, generateWatchingDate};

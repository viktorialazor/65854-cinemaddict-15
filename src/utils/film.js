import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {MAX_SHORT_DESCRIPTIONS, MINUTES_IN_HOUR, ProfileRating, ProfileRatingType, NoFilmsMessage, FilterType} from '../const.js';

const getProfileRating = (cards) => {
  let watchedAmount = 0;

  cards.forEach((card) => {
    if (card.isWatched) {
      watchedAmount += 1;
    }
  });

  if (watchedAmount > ProfileRating.NOVICE && watchedAmount <= ProfileRating.FAN) {
    return ProfileRatingType.NOVICE;
  } else if (watchedAmount > ProfileRating.FAN && watchedAmount <= ProfileRating.MOVIE_BUFF) {
    return ProfileRatingType.FAN;
  } else if (watchedAmount > ProfileRating.MOVIE_BUFF){
    return ProfileRatingType.MOVIE_BUFF;
  }

  return ProfileRatingType.NO_RATING;
};

const humanizeDate = (date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};

const changeFormatDate = (date, format) => dayjs(date).format(format);

const durationFilm = (duration = 0) => {
  if ((duration >= MINUTES_IN_HOUR) && ((duration % MINUTES_IN_HOUR) === 0)) {
    const hours = parseInt((duration / MINUTES_IN_HOUR), 10);
    return `${hours}h`;
  } else if (duration > MINUTES_IN_HOUR && ((duration % MINUTES_IN_HOUR) !== 0)) {
    const hours = parseInt((duration / MINUTES_IN_HOUR), 10);
    const minutes = duration % MINUTES_IN_HOUR;
    return `${hours}h ${minutes}m`;
  }

  return `${duration}m`;
};

const getDurationWatchedFilm = (duration = 0) => {
  const hours = parseInt((duration / MINUTES_IN_HOUR), 10);
  const minutes = duration % MINUTES_IN_HOUR;

  return {hours, minutes};
};

const generateShortDescription = (description) => {
  if (description.length >= MAX_SHORT_DESCRIPTIONS) {
    return `${description.slice(0, (MAX_SHORT_DESCRIPTIONS - 1))}...`;
  }

  return description.slice();
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

const sortFilmsDate = (filmA, filmB) => dayjs(filmB.release).diff(dayjs(filmA.release));

const sortFilmsRating = (filmA, filmB) => filmB.rating - filmA.rating;

const getNoFilmsMessage = (filterType) => {
  switch(filterType) {
    case FilterType.ALL:
      return NoFilmsMessage.ALL;
    case FilterType.WATCHLIST:
      return NoFilmsMessage.WATCHLIST;
    case FilterType.HISTORY:
      return NoFilmsMessage.HISTORY;
    case FilterType.FAVORITES:
      return NoFilmsMessage.FAVORITES;
  }
};

export {getProfileRating, humanizeDate, changeFormatDate, durationFilm, getDurationWatchedFilm, generateShortDescription, getPopupData, sortFilmsDate, sortFilmsRating, getNoFilmsMessage};

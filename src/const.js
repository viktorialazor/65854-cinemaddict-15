const QUANTITY_CARDS_PER_STEP = 5;
const QUANTITY_EXTRA_CARDS = 2;
const MAX_SHORT_DESCRIPTIONS = 140;
const MINUTES_IN_HOUR = 60;
const BUTTON_ENTER = 'Enter';
const ProfileRating = {
  NOVICE: 0,
  FAN: 10,
  MOVIE_BUFF: 20,
};
const ProfileRatingType = {
  NO_RATING: '',
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};
const NoFilmsMessage = {
  ALL: 'There are no movies in our database',
  WATCHLIST: 'There are no watchlist movies',
  HISTORY: 'There are no watched movies',
  FAVORITES: 'There are no favorites movies',
};
const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};
const UserAction = {
  UPDATE_CARD: 'UPDATE_CARD',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};
const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};
const MenuItem = {
  FILTER: 'FILTER',
  STATISTICS: 'STATISTICS',
};
const FilterStatisticRange = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};
const AUTHORIZATION = 'Basic F2XxaAt3kFb836A';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const SHOW_TIME = 5000;

export {QUANTITY_CARDS_PER_STEP, QUANTITY_EXTRA_CARDS, MAX_SHORT_DESCRIPTIONS, MINUTES_IN_HOUR, BUTTON_ENTER, ProfileRating, ProfileRatingType, NoFilmsMessage, SortType, UserAction, UpdateType, FilterType, MenuItem, FilterStatisticRange, AUTHORIZATION, END_POINT, STORE_NAME, SHOW_TIME};

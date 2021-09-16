const QUANTITY_CARDS = 20;
const QUANTITY_CARDS_PER_STEP = 5;
const QUANTITY_EXTRA_CARDS = 2;
const QUANTITY_FILM_VARIANT = 6;
const MIN_RATING = 1;
const MAX_RATING = 10;
const MIN_DESCRIPTIONS = 1;
const MAX_DESCRIPTIONS = 5;
const MAX_SHORT_DESCRIPTIONS = 140;
const MAX_COMMENTS = 5;
const MAX_ID_NUMBER = 1000;
const MINUTES_IN_HOUR = 60;
const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};
const CommentEmotion = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};
const CommentEmojiLabel = {
  EMOJI_SMILE: 'emoji-smile',
  EMOJI_SLEEPING: 'emoji-sleeping',
  EMOJI_PUKE: 'emoji-puke',
  EMOJI_ANGRY: 'emoji-angry',
};
const UserAction = {
  UPDATE_CARD: 'UPDATE_CARD', // добавление и удаление фильмов в "хочу посмотреть",  просмотренные и избранное - MINOR
  ADD_COMMENT: 'ADD_COMMENT', // добавление комментария  - MAJOR
  DELETE_COMMENT: 'DELETE_COMMENT', // удаление комментария  - MAJOR
};
const UpdateType = {
  PATCH: 'PATCH', // ??? удалить
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export {QUANTITY_CARDS, QUANTITY_CARDS_PER_STEP, QUANTITY_EXTRA_CARDS, QUANTITY_FILM_VARIANT, MIN_RATING, MAX_RATING, MIN_DESCRIPTIONS, MAX_DESCRIPTIONS, MAX_SHORT_DESCRIPTIONS, MAX_COMMENTS, MAX_ID_NUMBER, MINUTES_IN_HOUR, SortType, CommentEmotion, CommentEmojiLabel, UserAction, UpdateType, FilterType};

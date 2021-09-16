import {FilterType} from '../const';

const filter = {
  [FilterType.ALL]: (cards) => cards,
  [FilterType.WATCHLIST]: (cards) => cards.slice().filter((card) => card.isInWatchlist),
  [FilterType.HISTORY]: (cards) => cards.slice().filter((card) => card.isWatched),
  [FilterType.FAVORITES]: (cards) => cards.slice().filter((card) => card.isInFavorites),
};

export {filter};

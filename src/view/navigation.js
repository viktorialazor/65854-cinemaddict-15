import AbstractView from './abstract.js';

const createNavigationTemplate = (cards) => {
  const watchlist = cards.slice().filter((card) => card.isInWatchlist);
  const watched = cards.slice().filter((card) => card.isWatched);
  const favorites = cards.slice().filter((card) => card.isInFavorites);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist.length}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${watched.length}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites.length}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Navigation extends AbstractView {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createNavigationTemplate(this._cards);
  }
}

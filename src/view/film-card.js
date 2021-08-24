import {createElement, changeFormatDate, generateShortDescription} from '../utils.js';

const createFilmCardTemplate = (card = {}) => {
  const {
    poster,
    title,
    rating,
    release,
    duration,
    genres,
    description,
    isInWatchlist,
    isWatched,
    isInFavorites,
    commentsId,
  } = card;

  const year = changeFormatDate(release, 'YYYY');
  const genre = genres[0];
  const shortDescription = generateShortDescription(description);
  const commentsAmount = commentsId.length;
  const watchlist = isInWatchlist ? 'film-card__controls-item--active ' : '';
  const watched = isWatched ? 'film-card__controls-item--active ' : '';
  const favorites = isInFavorites ? 'film-card__controls-item--active ' : '';

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src=${poster} alt="" class="film-card__poster">
    <p class="film-card__description">${shortDescription}</p>
    <a class="film-card__comments">${commentsAmount} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item ${watchlist}film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item ${watched}film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item ${favorites}film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard {
  constructor(card) {
    this._card = card;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._card);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

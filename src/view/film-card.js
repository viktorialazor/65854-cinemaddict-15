import {durationFilm, changeFormatDate, generateShortDescription} from '../utils/film.js';
import AbstractView from './abstract.js';

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

  const filmDuration = durationFilm(duration);
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
      <span class="film-card__duration">${filmDuration}</span>
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

export default class FilmCard extends AbstractView {
  constructor(card) {
    super();
    this._card = card;
    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._clickCardWatchlistHandler = this._clickCardWatchlistHandler.bind(this);
    this._clickCardWatchedHandler = this._clickCardWatchedHandler.bind(this);
    this._clickCardFavoritesHandler = this._clickCardFavoritesHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._card);
  }

  _clickCardWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.clickCardWatchlist();
  }

  _clickCardWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.clickCardWatched();
  }

  _clickCardFavoritesHandler(evt) {
    evt.preventDefault();
    this._callback.clickCardFavorites();
  }

  _openPopupHandler(evt) {
    evt.preventDefault();
    this._callback.openDetailsPopup();
  }

  setOpenPopupHandler(callback) {
    this._callback.openDetailsPopup = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openPopupHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openPopupHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openPopupHandler);
  }

  setCardWatchlistClickHandler(callback) {
    this._callback.clickCardWatchlist = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._clickCardWatchlistHandler);
  }

  setCardWatchedHandler(callback) {
    this._callback.clickCardWatched = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._clickCardWatchedHandler);
  }

  setCardFavoritesHandler(callback) {
    this._callback.clickCardFavorites = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._clickCardFavoritesHandler);
  }
}

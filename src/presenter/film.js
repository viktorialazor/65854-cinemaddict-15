import {RenderPosition, render, remove, replace} from '../utils/render.js';
import {getPopupData} from '../utils/film.js';
import Abstract from '../view/abstract.js';
import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Film {
  constructor(bodyContainer, filmsComments, changeData, changeMode) {
    this._bodyContainer = bodyContainer;
    this._filmsComments = filmsComments;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;

    this._clickPopupOpen = this._clickPopupOpen.bind(this);
    this._clickPopupClose = this._clickPopupClose.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
  }

  init(cardListElement, card) {
    this._cardListElement = cardListElement;
    this._card = card;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmCardComponent = new FilmCardView(card);
    this._filmPopupData = getPopupData(card, this._filmsComments);
    this._filmPopupComponent = new PopupView(this._filmPopupData);

    this._filmCardComponent.setOpenPopupHandler(this._clickPopupOpen);
    this._filmCardComponent.setCardWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setCardWatchedHandler(this._handleWatchedClick);
    this._filmCardComponent.setCardFavoritesHandler(this._handleFavoritesClick);

    this._filmPopupComponent.setClosePopupHandler(this._clickPopupClose);
    this._filmPopupComponent.setPopupWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopupComponent.setPopupWatchedHandler(this._handleWatchedClick);
    this._filmPopupComponent.setPopupFavoritesHandler(this._handleFavoritesClick);

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      render(this._cardListElement, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if(this._cardListElement instanceof Abstract) {
      this._cardListElement = this._cardListElement.getElement();
    }

    if (this._cardListElement.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this._bodyContainer.contains(prevFilmPopupComponent.getElement())) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmPopupComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmPopupComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._clickPopupClose();
    }
  }

  _clickPopupOpen() {
    this._openPopup();
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _clickPopupClose() {
    this._closePopup();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _openPopup() {
    this._bodyContainer.appendChild(this._filmPopupComponent.getElement());
    this._bodyContainer.classList.add('hide-overflow');
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _closePopup() {
    this._bodyContainer.removeChild(this._filmPopupComponent.getElement());
    this._bodyContainer.classList.remove('hide-overflow');
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        {
          isInWatchlist: !this._card.isInWatchlist,
        },
      ),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        {
          isWatched: !this._card.isWatched,
        },
      ),
    );
  }

  _handleFavoritesClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        {
          isInFavorites: !this._card.isInFavorites,
        },
      ),
    );
  }
}

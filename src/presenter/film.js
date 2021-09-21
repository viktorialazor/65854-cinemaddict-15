import dayjs from 'dayjs';
import {UserAction, UpdateType, FilterType} from '../const.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';
import {getPopupData} from '../utils/film.js';
import Abstract from '../view/abstract.js';
import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  DELETING: 'ABORTING_DELETE',
  ABORTING: 'ABORTING_ADD',
};

export default class Film {
  constructor(bodyContainer, filmsComments, changeData, changeMode, updateCommentCards, updateFilteredList) {
    this._bodyContainer = bodyContainer;
    this._filmsComments = filmsComments;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._updateCommentCards = updateCommentCards;
    this._updateFilteredList = updateFilteredList;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;

    this._clickPopupOpen = this._clickPopupOpen.bind(this);
    this._clickPopupClose = this._clickPopupClose.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
    this._handleNewComment = this._handleNewComment.bind(this);
    this._handleDeleteComment = this._handleDeleteComment.bind(this);
  }

  init(cardListElement, card, filmsComments = this._filmsComments) {
    this._cardListElement = cardListElement;
    this._card = card;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmCardComponent = new FilmCardView(this._card);
    this._filmPopupData = getPopupData(this._card, filmsComments);
    this._filmPopupComponent = new PopupView(this._filmPopupData);

    this._filmCardComponent.setOpenPopupHandler(this._clickPopupOpen);
    this._filmCardComponent.setCardWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setCardWatchedHandler(this._handleWatchedClick);
    this._filmCardComponent.setCardFavoritesHandler(this._handleFavoritesClick);

    this._filmPopupComponent.setClosePopupHandler(this._clickPopupClose);
    this._filmPopupComponent.setPopupWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopupComponent.setPopupWatchedHandler(this._handleWatchedClick);
    this._filmPopupComponent.setPopupFavoritesHandler(this._handleFavoritesClick);
    this._filmPopupComponent.setPopupNewCommentHandler(this._handleNewComment);
    this._filmPopupComponent.setPopupDeleteCommentHandler(this._handleDeleteComment);

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

  setSavingComment() {
    this._filmPopupComponent.updateData({
      isCommentDisabled: true,
    });
    this._filmPopupComponent.setSavingCommentHandler();
  }

  setDeletingComment() {
    this._filmPopupComponent.setDetetingCommentHandler();
  }

  setCancelDeleteComment() {
    this._filmPopupComponent.setAbordingDeleteCommentHandler();
  }

  setCancelAddComment() {
    this._filmPopupComponent.setAbordingAddCommentHandler();
  }

  setPopupScrollPosition(scrollPosition) {
    if (this._mode === 'EDITING') {
      this._filmPopupComponent.setScrollPosition(scrollPosition);
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
    this._card = this._filmPopupComponent.getDefaultCard();
    this._filmPopupComponent.reset(this._filmPopupData);
    this._bodyContainer.removeChild(this._filmPopupComponent.getElement());
    this._bodyContainer.classList.remove('hide-overflow');
    this._mode = Mode.DEFAULT;
    this._updateCommentCards();
    this._updateFilteredList();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handleWatchlistClick(popupPosition = null) {
    if (this._mode === Mode.EDITING) {
      this._card = this._filmPopupComponent.getFilmPopupData();
    }
    this._changeData(
      UserAction.UPDATE_CARD,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._card,
        {
          isInWatchlist: !this._card.isInWatchlist,
        },
      ),
      null,
      this._mode,
      FilterType.WATCHLIST,
      popupPosition,
    );
    if (popupPosition !== null) {
      this._filmPopupComponent.setScrollPosition(popupPosition);
    }
  }

  _handleWatchedClick(popupPosition = null) {
    if (this._mode === Mode.EDITING) {
      this._card = this._filmPopupComponent.getFilmPopupData();
    }
    if (!this._card.isWatched) {
      this._card = Object.assign(
        {},
        this._card,
        {
          isWatched: true,
          watchingDate: dayjs().toDate(),
        },
      );
    } else {
      this._card = Object.assign(
        {},
        this._card,
        {
          isWatched: false,
          watchingDate: '',
        },
      );
    }
    this._changeData(
      UserAction.UPDATE_CARD,
      UpdateType.PATCH,
      this._card,
      null,
      this._mode,
      FilterType.HISTORY,
      popupPosition,
    );
    if (popupPosition !== null) {
      this._filmPopupComponent.setScrollPosition(popupPosition);
    }
  }

  _handleFavoritesClick(popupPosition = null) {
    if (this._mode === Mode.EDITING) {
      this._card = this._filmPopupComponent.getFilmPopupData();
    }
    this._changeData(
      UserAction.UPDATE_CARD,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._card,
        {
          isInFavorites: !this._card.isInFavorites,
        },
      ),
      null,
      this._mode,
      FilterType.FAVORITES,
      popupPosition,
    );
    if (popupPosition !== null) {
      this._filmPopupComponent.setScrollPosition(popupPosition);
    }
  }

  _handleNewComment(popupPosition = null, card, comment) {
    if (this._mode === Mode.EDITING) {
      this._card = this._filmPopupComponent.getFilmPopupData();
    }
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      card,
      comment,
      this._mode,
      FilterType.ALL,
      popupPosition,
    );
    if (popupPosition !== null) {
      this._filmPopupComponent.setScrollPosition(popupPosition);
    }
  }

  _handleDeleteComment(popupPosition = null, card, comment) {
    if (this._mode === Mode.EDITING) {
      this._card = this._filmPopupComponent.getFilmPopupData();
    }
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      card,
      comment,
      this._mode,
      FilterType.ALL,
      popupPosition,
    );
    if (popupPosition !== null) {
      this._filmPopupComponent.setScrollPosition(popupPosition);
    }
  }
}

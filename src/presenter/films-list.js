import {QUANTITY_CARDS_PER_STEP, QUANTITY_EXTRA_CARDS, SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {sortFilmsDate, sortFilmsRating, getNoFilmsMessage} from '../utils/film.js';
import {filter} from '../utils/filter.js';
import SortView from '../view/sort.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import FilmsListContainer from '../view/films-list-container.js';
import FilmsTopRatedListView from '../view/films-top-rated-list.js';
import FilmsMostCommentedListView from '../view/films-most-commented-list.js';
import ShowMoreView from '../view/show-more.js';
import FilmPresenter from './film.js';

export default class FilmsList {
  constructor(bodyContainer, cardsModel, filterModel, api) {
    this._bodyContainer = bodyContainer;
    this._cardsModel = cardsModel;
    this._filterModel = filterModel;
    this._api = api;
    this._mainContainer = bodyContainer.querySelector('.main');
    this._sortedCardsByRating = [];
    this._sortedCardsByComments = [];
    this._filmsListTopRatedContainerElement = null;
    this._filmsListMostCommentedContainerElement = null;
    this._renderedCardCount = QUANTITY_CARDS_PER_STEP;
    this._filmPresenter = new Map();
    this._filmRatedPresenter = new Map();
    this._filmCommentedPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;
    this._updatedCardComment = false;
    this._filterType = FilterType.ALL;
    this._filterCard = '';
    this._isLoading = true;

    this._sortComponent = null;
    this._showMoreComponent = null;
    this._mode = 'DEFAULT';

    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._updateMostCommented = this._updateMostCommented.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._updateFilteredCardList = this._updateFilteredCardList.bind(this);
  }

  init() {
    render(this._mainContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    const cards = this._cardsModel.getCards().slice();
    const filtredCards = filter[this._filterType](cards);
    this._quantityCardsOnPage = Math.min(filtredCards.length, QUANTITY_CARDS_PER_STEP);

    this._cardsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderFilmsBoard();
    this._renderFilmsExtra();
  }

  destroy() {
    this._clearFilmList({resetRenderedCardCount: true, resetSortType: true});

    remove(this._filmsComponent);
    remove(this._filmsListContainerComponent);

    this._cardsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getComments() {
    return this._cardsModel.getComments();
  }

  _getCards() {
    this._filterType = this._filterModel.getFilter();
    const cards = this._cardsModel.getCards().slice();
    const filtredCards = filter[this._filterType](cards);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredCards.sort(sortFilmsDate);
      case SortType.RATING:
        return filtredCards.sort(sortFilmsRating);
    }

    return filtredCards;
  }

  _getCardsForExtraComponent() {
    return this._cardsModel.getCards().slice();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearFilmList({resetRenderedCardCount: true});
    this._renderCardsList();
  }

  _updateMostCommented() {
    if(this._updatedCardComment) {
      this._clearCardCommentedCards();
      this._updateSortedCardsByComments();
    }
    this._updatedCardComment = false;
  }

  _updateFilteredCardList() {
    this._clearFilmList({resetRenderedCardCount: false, resetSortType: false});
    this._renderFilteredCardsList();
  }

  _handleViewAction(actionType, updateType, updateCard, updateComment, mode, filterType = FilterType.ALL, scrollPosition = 0) {
    this._mode = mode;
    this._filterCard = filterType === 'watched' ? 'history' : filterType;
    switch (actionType) {
      case UserAction.UPDATE_CARD:
        this._api.updateCard(updateCard).then((response) => {
          this._cardsModel.updateCard(updateType, response, filterType);
          if (this._mode === 'EDITING') {
            this._filmPresenter.get(updateCard.id).setPopupScrollPosition(scrollPosition);
            if(this._filmRatedPresenter.has(updateCard.id)) {
              this._filmRatedPresenter.get(updateCard.id).setPopupScrollPosition(scrollPosition);
            }
            if(this._filmCommentedPresenter.has(updateCard.id)) {
              this._filmCommentedPresenter.get(updateCard.id).setPopupScrollPosition(scrollPosition);
            }
          }
        });
        break;
      case UserAction.ADD_COMMENT:
        this._filmPresenter.get(updateCard.id).setSavingComment();
        if(this._filmRatedPresenter.has(updateCard.id)) {
          this._filmRatedPresenter.get(updateCard.id).setSavingComment();
        }
        if(this._filmCommentedPresenter.has(updateCard.id)) {
          this._filmCommentedPresenter.get(updateCard.id).setSavingComment();
        }
        this._api.addComment(updateCard, updateComment).then((response) => {
          this._cardsModel.addComment(updateType, updateCard, response);
          this._filmPresenter.get(updateCard.id).setPopupScrollPosition(scrollPosition);
          if(this._filmRatedPresenter.has(updateCard.id)) {
            this._filmRatedPresenter.get(updateCard.id).setPopupScrollPosition(scrollPosition);
          }
          if(this._filmCommentedPresenter.has(updateCard.id)) {
            this._filmCommentedPresenter.get(updateCard.id).setPopupScrollPosition(scrollPosition);
          }
        })
          .catch(() => {
            this._filmPresenter.get(updateCard.id).setCancelAddComment();
            if(this._filmRatedPresenter.has(updateCard.id)) {
              this._filmRatedPresenter.get(updateCard.id).setCancelAddComment();
            }
            if(this._filmCommentedPresenter.has(updateCard.id)) {
              this._filmCommentedPresenter.get(updateCard.id).setCancelAddComment();
            }
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._filmPresenter.get(updateCard.id).setDeletingComment();
        if(this._filmRatedPresenter.has(updateCard.id)) {
          this._filmRatedPresenter.get(updateCard.id).setDeletingComment();
        }
        if(this._filmCommentedPresenter.has(updateCard.id)) {
          this._filmCommentedPresenter.get(updateCard.id).setDeletingComment();
        }
        this._api.deleteComment(updateComment).then(() => {
          this._cardsModel.deleteComment(updateType, updateCard, updateComment);
          this._filmPresenter.get(updateCard.id).setPopupScrollPosition(scrollPosition);
          if(this._filmRatedPresenter.has(updateCard.id)) {
            this._filmRatedPresenter.get(updateCard.id).setPopupScrollPosition(scrollPosition);
          }
          if(this._filmCommentedPresenter.has(updateCard.id)) {
            this._filmCommentedPresenter.get(updateCard.id).setPopupScrollPosition(scrollPosition);
          }
        })
          .catch(() => {
            this._filmPresenter.get(updateCard.id).setCancelDeleteComment();
            if(this._filmRatedPresenter.has(updateCard.id)) {
              this._filmRatedPresenter.get(updateCard.id).setCancelDeleteComment();
            }
            if(this._filmCommentedPresenter.has(updateCard.id)) {
              this._filmCommentedPresenter.get(updateCard.id).setCancelDeleteComment();
            }
          });
        break;
    }
  }

  _handleModelEvent(updateType, dataCard) {
    const comments = this._getComments();

    switch (updateType) {
      case UpdateType.PATCH:
        if (this._filterCard === this._filterType) {
          this._filterCard = '';
          if (this._mode === 'DEFAULT') {
            this._updateFilteredCardList();
          }
        }
        if(this._filmPresenter.has(dataCard.id)) {
          this._filmPresenter.get(dataCard.id).init(this._filmsListContainerComponent, dataCard, comments);
        }
        if(this._filmRatedPresenter.has(dataCard.id)) {
          this._filmRatedPresenter.get(dataCard.id).init(this._filmsListTopRatedContainerElement, dataCard, comments);
        }
        if(this._filmCommentedPresenter.has(dataCard.id)) {
          this._filmCommentedPresenter.get(dataCard.id).init(this._filmsListMostCommentedContainerElement, dataCard, comments);
        }
        break;
      case UpdateType.MINOR:
        this._updatedCardComment = true;

        if(this._filmPresenter.has(dataCard.id)) {
          this._filmPresenter.get(dataCard.id).init(this._filmsListContainerComponent, dataCard, comments);
        }
        if(this._filmRatedPresenter.has(dataCard.id)) {
          this._filmRatedPresenter.get(dataCard.id).init(this._filmsListTopRatedContainerElement, dataCard, comments);
        }
        if(this._filmCommentedPresenter.has(dataCard.id)) {
          this._filmCommentedPresenter.get(dataCard.id).init(this._filmsListMostCommentedContainerElement, dataCard, comments);
        }
        break;
      case UpdateType.MAJOR:
        this._clearFilmList({resetRenderedCardCount: true, resetSortType: true});
        this._renderCardsList();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        this._hideNoFilmsMessage();
        this._renderFilmsBoard();
        this._renderFilmsExtra();
        break;
    }
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.resetView());
    this._filmRatedPresenter.forEach((presenter) => presenter.resetView());
    this._filmCommentedPresenter.forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmsComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCard(cardListElement, card) {
    const comments = this._getComments();
    const filmPresenter = new FilmPresenter(this._bodyContainer, comments, this._handleViewAction, this._handleModeChange, this._updateMostCommented, this._updateFilteredCardList);

    filmPresenter.init(cardListElement, card);
    if(cardListElement === this._filmsListContainerComponent) {
      this._filmPresenter.set(card.id, filmPresenter);
    }
    if(this._filmsListTopRatedContainerElement !== null && cardListElement === this._filmsListTopRatedContainerElement) {
      this._filmRatedPresenter.set(card.id, filmPresenter);
    }
    if(this._filmsListMostCommentedContainerElement !== null && cardListElement === this._filmsListMostCommentedContainerElement) {
      this._filmCommentedPresenter.set(card.id, filmPresenter);
    }
  }

  _renderCards(cards) {
    cards.forEach((card) => this._renderCard(this._filmsListContainerComponent, card));
  }

  _renderCardsList() {
    this._renderSort();
    const cardCount = this._getCards().length;

    if (cardCount === 0) {
      this._showNoFilmsMessage(this._filterType);
      return;
    } else {
      this._hideNoFilmsMessage();
    }

    const cards = this._getCards().slice(0, Math.min(cardCount, QUANTITY_CARDS_PER_STEP));
    this._quantityCardsOnPage = Math.min(cardCount, QUANTITY_CARDS_PER_STEP);

    this._renderCards(cards);

    if (cardCount > QUANTITY_CARDS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilteredCardsList() {
    this._renderSort();
    const cardCount = this._getCards().length;

    if (cardCount === 0) {
      this._showNoFilmsMessage(this._filterType);
      return;
    } else {
      this._hideNoFilmsMessage();
    }

    const cards = this._getCards().slice(0, this._quantityCardsOnPage);

    this._renderCards(cards);

    if (cardCount > this._quantityCardsOnPage) {
      this._renderShowMoreButton();
    }
  }

  _clearCardCommentedCards() {
    this._filmCommentedPresenter.forEach((presenter) => presenter.destroy());
    this._filmCommentedPresenter.clear();
  }

  _clearFilmList({resetRenderedCardCount = false, resetSortType = false} = {}) {
    const cardCount = this._getCards().length;

    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();

    remove(this._sortComponent);
    remove(this._showMoreComponent);

    if (resetRenderedCardCount) {
      this._renderedCardCount = QUANTITY_CARDS_PER_STEP;
    } else {
      this._renderedCardCount = Math.min(cardCount, this._renderedCardCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _updateSortedCardsByComments() {
    this._getSortedCardsByComments();
    this._renderMostCommentedCards();
  }

  _getSortedCardsByRating() {
    this._sortedCardsByRating = this._getCardsForExtraComponent().slice().sort((a, b) => b.rating - a.rating);
  }

  _renderTopRatedList() {
    render(this._filmsComponent, new FilmsTopRatedListView(), RenderPosition.BEFOREEND);

    const filmsListTopRatedElement = this._filmsComponent.getElement().querySelector('.films-list--top-rated');

    this._filmsListTopRatedContainerElement = filmsListTopRatedElement.querySelector('.films-list__container');
  }

  _renderTopRatedCards() {
    this._sortedCardsByRating = this._sortedCardsByRating
      .slice(0, Math.min(this._sortedCardsByRating.length, QUANTITY_EXTRA_CARDS));
    this._sortedCardsByRating
      .forEach((card) => {
        this._renderCard(this._filmsListTopRatedContainerElement, card);
      });
  }

  _getSortedCardsByComments() {
    this._sortedCardsByComments = this._getCardsForExtraComponent().slice().sort((a, b) => b.commentsId.length - a.commentsId.length);
  }

  _renderMostCommentedList() {
    this._filmsMostCommentedListComponent = new FilmsMostCommentedListView();
    render(this._filmsComponent, this._filmsMostCommentedListComponent, RenderPosition.BEFOREEND);

    const filmsListMostCommentedElement = this._filmsComponent.getElement().querySelector('.films-list--most-commented');

    this._filmsListMostCommentedContainerElement = filmsListMostCommentedElement.querySelector('.films-list__container');
  }

  _renderMostCommentedCards() {
    this._sortedCardsByComments = this._sortedCardsByComments
      .slice(0, Math.min(this._sortedCardsByComments.length, QUANTITY_EXTRA_CARDS));
    this._sortedCardsByComments
      .forEach((card) => {
        this._renderCard(this._filmsListMostCommentedContainerElement, card);
      });
  }

  _handleShowMoreButtonClick() {
    const cardCount = this._getCards().length;
    const newRenderedCardCount = Math.min(cardCount, this._renderedCardCount + QUANTITY_CARDS_PER_STEP);
    const cards = this._getCards().slice(this._renderedCardCount, newRenderedCardCount);

    this._renderCards(cards);
    this._renderedCardCount = newRenderedCardCount;
    this._quantityCardsOnPage = this._renderedCardCount;

    if (this._renderedCardCount >= cardCount) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreComponent !== null) {
      this._showMoreComponent = null;
    }

    this._showMoreComponent = new ShowMoreView();

    this._showMoreComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsListComponent, this._showMoreComponent, RenderPosition.BEFOREEND);
  }

  _showNoFilmsMessage(filterType = '') {
    const filmsListTitle = this._filmsListComponent.getElement().querySelector('.films-list__title');
    if (this._isLoading) {
      filmsListTitle.textContent = 'Loading...';
    } else {
      filmsListTitle.textContent = getNoFilmsMessage(filterType);
    }
    filmsListTitle.classList.remove('visually-hidden');
  }

  _hideNoFilmsMessage() {
    const filmsListTitle = this._filmsListComponent.getElement().querySelector('.films-list__title');
    filmsListTitle.textContent = 'All movies. Upcoming';
    filmsListTitle.classList.add('visually-hidden');
  }

  _renderFilmsBoard() {
    if (this._isLoading) {
      this._showNoFilmsMessage();
      return;
    }

    const cards = this._getCards();
    const cardCount = cards.length;

    if (cardCount === 0) {
      this._showNoFilmsMessage(this._filterType);
      return;
    }

    this._renderSort();

    this._filmsListContainerComponent = new FilmsListContainer();

    render(this._filmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

    this._renderCards(cards.slice(0, Math.min(cardCount, this._renderedCardCount)));
    this._quantityCardsOnPage = Math.min(cardCount, this._renderedCardCount);

    if (cardCount > this._renderedCardCount) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmsExtra() {
    this._getSortedCardsByRating();

    if(this._sortedCardsByRating.length > 0) {
      this._renderTopRatedList();
      this._renderTopRatedCards();
    }

    this._getSortedCardsByComments();

    if(this._sortedCardsByComments.length > 0) {
      this._renderMostCommentedList();
      this._renderMostCommentedCards();
    }
  }
}

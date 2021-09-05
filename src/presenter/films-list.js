import {QUANTITY_CARDS_PER_STEP, QUANTITY_EXTRA_CARDS, SortType} from '../const.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {sortFilmsDate, sortFilmsRating} from '../utils/film.js';
import {updateItem} from '../utils/common.js';
import SortView from '../view/sort.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import FilmsListContainer from '../view/films-list-container.js';
import FilmsTopRatedListView from '../view/films-top-rated-list.js';
import FilmsMostCommentedListView from '../view/films-most-commented-list.js';
import ShowMoreView from '../view/show-more.js';
import FilmPresenter from './film.js';

export default class FilmsList {
  constructor(bodyContainer) {
    this._bodyContainer = bodyContainer;
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

    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._showMoreComponent = new ShowMoreView();

    this._handleCardChange = this._handleCardChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(filmsCards, filmsComments) {
    this._filmsCards = filmsCards.slice();
    this._sourcedFilmsCards = filmsCards.slice();
    this._filmsComments = filmsComments.slice();

    render(this._mainContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderFilmsBoard();
  }

  _sortFilms(sortType) {
    this._deleteSortActiveClass();
    this._setSortActiveClass(sortType);

    switch (sortType) {
      case SortType.DATE:
        this._filmsCards.sort(sortFilmsDate);
        break;
      case SortType.RATING:
        this._filmsCards.sort(sortFilmsRating);
        break;
      default:
        this._filmsCards = this._sourcedFilmsCards.slice();
    }

    this._currentSortType = sortType;
  }

  _deleteSortActiveClass() {
    this._sortComponent.getElement().querySelectorAll('[data-sort-type]').forEach((a) => {
      a.classList.remove('sort__button--active');
    });
  }

  _setSortActiveClass(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._sortComponent.getElement().querySelector('[data-sort-type="date"]').classList.add('sort__button--active');
        break;
      case SortType.RATING:
        this._sortComponent.getElement().querySelector('[data-sort-type="rating"]').classList.add('sort__button--active');
        break;
      default:
        this._sortComponent.getElement().querySelector('[data-sort-type="default"]').classList.add('sort__button--active');
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearCardList();
    this._renderCardsList();
  }

  _handleCardChange(updatedCard) {
    this._filmsCards = updateItem(this._filmsCards, updatedCard);
    this._sourcedFilmsCards = updateItem(this._sourcedFilmsCards, updatedCard);
    this._sortedCardsByRating = updateItem(this._sortedCardsByRating, updatedCard);
    this._sortedCardsByComments = updateItem(this._sortedCardsByComments, updatedCard);

    if(this._filmPresenter.has(updatedCard.id)) {
      this._filmPresenter.get(updatedCard.id).init(this._filmsListContainerComponent, updatedCard);
    }
    if(this._filmRatedPresenter.has(updatedCard.id)) {
      this._filmRatedPresenter.get(updatedCard.id).init(this._filmsListTopRatedContainerElement, updatedCard);
    }
    if(this._filmCommentedPresenter.has(updatedCard.id)) {
      this._filmCommentedPresenter.get(updatedCard.id).init(this._filmsListMostCommentedContainerElement, updatedCard);
    }
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.resetView());
    this._filmRatedPresenter.forEach((presenter) => presenter.resetView());
    this._filmCommentedPresenter.forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    render(this._filmsComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderCard(cardListElement, card) {
    const filmPresenter = new FilmPresenter(this._bodyContainer, this._filmsComments, this._handleCardChange, this._handleModeChange);
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

  _renderCards(from, to) {
    this._filmsCards
      .slice(from, to)
      .forEach((card) => {
        this._renderCard(this._filmsListContainerComponent, card);
      });
  }

  _renderCardsList() {
    this._renderCards(0, Math.min(this._filmsCards.length, QUANTITY_CARDS_PER_STEP));

    if (this._filmsCards.length > QUANTITY_CARDS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _clearCardList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();
    this._renderedCardCount = QUANTITY_CARDS_PER_STEP;
    remove(this._showMoreComponent);
  }

  _getSortedCardsByRating() {
    this._sortedCardsByRating = this._filmsCards.slice().sort((a, b) => b.rating - a.rating);
  }

  _renderTopRatedList() {
    render(this._filmsComponent, new FilmsTopRatedListView(), RenderPosition.BEFOREEND);

    const filmsListTopRatedElement = this._filmsComponent.getElement().querySelectorAll('.films-list--extra')[0];

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
    this._sortedCardsByComments = this._filmsCards.slice().sort((a, b) => b.commentsId.length - a.commentsId.length);
  }

  _renderMostCommentedList() {
    render(this._filmsComponent, new FilmsMostCommentedListView(), RenderPosition.BEFOREEND);

    const filmsListMostCommentedElement = this._filmsComponent.getElement().querySelectorAll('.films-list--extra')[1];

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
    this._renderCards(this._renderedCardCount, this._renderedCardCount + QUANTITY_CARDS_PER_STEP);
    this._renderedCardCount += QUANTITY_CARDS_PER_STEP;

    if (this._renderedCardCount >= this._filmsCards.length) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreComponent, RenderPosition.BEFOREEND);

    this._showMoreComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _showNoFilmsMessage() {
    const filmsListTitle = this._filmsListComponent.getElement().querySelector('.films-list__title');
    filmsListTitle.textContent = 'There are no movies in our database';
    filmsListTitle.classList.remove('visually-hidden');
  }

  _renderFilmsBoard() {
    if (this._filmsCards.length === 0) {
      this._showNoFilmsMessage();
      return;
    }

    this._renderSort();

    this._filmsListContainerComponent = new FilmsListContainer();

    render(this._filmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

    this._renderCardsList();

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

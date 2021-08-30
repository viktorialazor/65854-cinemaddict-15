import {QUANTITY_CARDS, QUANTITY_CARDS_PER_STEP, QUANTITY_EXTRA_CARDS, QUANTITY_FILM_VARIANT} from './const.js';
import {RenderPosition, render, remove} from './utils/render.js';
import {getRandomNumber} from './utils/common.js';
import {getPopupData} from './utils/film.js';
import ProfileView from './view/profile.js';
import NavigationView from './view/navigation.js';
import SortView from './view/sort.js';
import QuantityMoviesView from './view/quantity-movies.js';
import FilmsView from './view/films.js';
import FilmsListView from './view/films-list.js';
import FilmsListContainer from './view/films-list-container.js';
import FilmsTopRatedListView from './view/films-top-rated-list.js';
import FilmsMostCommentedListView from './view/films-most-commented-list.js';
import FilmCardView from './view/film-card.js';
import ShowMoreView from './view/show-more.js';
import PopupView from './view/popup.js';
import {generateFilmCard} from './mock/film-card.js';
import {generateComments} from './mock/film-comments.js';

const filmsComments = [];

const cards = new Array(QUANTITY_CARDS).fill().map(() => {
  const filmVariant = getRandomNumber(0, QUANTITY_FILM_VARIANT);
  const filmComments = generateComments();

  filmComments.forEach((item) => {
    filmsComments.push(item);
  });

  return generateFilmCard(filmVariant, filmComments);
});

const bodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const renderCard = (cardListElement, card) => {
  const filmCardComponent = new FilmCardView(card);
  const filmPopupData = getPopupData(card, filmsComments);
  const filmPopupComponent = new PopupView(filmPopupData);

  const openPopup = () => {
    bodyElement.appendChild(filmPopupComponent.getElement());
    bodyElement.classList.add('hide-overflow');
  };

  const closePopup = () => {
    bodyElement.removeChild(filmPopupComponent.getElement());
    bodyElement.classList.remove('hide-overflow');
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  filmCardComponent.setOpenPopupHandler(() => {
    openPopup();
    document.addEventListener('keydown', onEscKeyDown);
  });

  filmPopupComponent.setClosePopupHandler(() => {
    closePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(cardListElement, filmCardComponent, RenderPosition.BEFOREEND);
};

const renderFilmsBoard = (filmsContainer, filmsCards) => {
  const filmsComponent = new FilmsView();
  const filmsListComponent = new FilmsListView();

  render(filmsContainer, filmsComponent, RenderPosition.BEFOREEND);
  render(filmsComponent, filmsListComponent, RenderPosition.BEFOREEND);

  if (filmsCards.length === 0) {
    const filmsListTitle = filmsListComponent.getElement().querySelector('.films-list__title');
    filmsListTitle.textContent = 'There are no movies in our database';
    filmsListTitle.classList.remove('visually-hidden');
    return;
  }

  const filmsListContainerComponent = new FilmsListContainer();

  render(filmsListComponent, filmsListContainerComponent, RenderPosition.BEFOREEND);

  filmsCards
    .slice(0, Math.min(filmsCards.length, QUANTITY_CARDS_PER_STEP))
    .forEach((filmCard) => {
      renderCard(filmsListContainerComponent.getElement(), filmCard);
    });

  if (filmsCards.length > QUANTITY_CARDS_PER_STEP) {
    let renderedCardCount = QUANTITY_CARDS_PER_STEP;

    const showMoreComponent = new ShowMoreView();

    render(filmsListComponent, showMoreComponent, RenderPosition.BEFOREEND);

    showMoreComponent.setClickHandler(() => {
      filmsCards
        .slice(renderedCardCount, renderedCardCount + QUANTITY_CARDS_PER_STEP)
        .forEach((card) => renderCard(filmsListContainerComponent.getElement(), card));

      renderedCardCount += QUANTITY_CARDS_PER_STEP;

      if (renderedCardCount >= filmsCards.length) {
        remove(showMoreComponent);
      }
    });
  }

  render(filmsComponent, new FilmsTopRatedListView(), RenderPosition.BEFOREEND);
  render(filmsComponent, new FilmsMostCommentedListView(), RenderPosition.BEFOREEND);

  const filmsListTopRatedElement = filmsComponent.getElement().querySelectorAll('.films-list--extra')[0];
  const filmsListMostCommentedElement = filmsComponent.getElement().querySelectorAll('.films-list--extra')[1];
  const filmsListTopRatedContainerElement = filmsListTopRatedElement.querySelector('.films-list__container');

  const sortedCardsByRating = cards.slice().sort((a, b) => b.rating - a.rating);

  sortedCardsByRating
    .slice(0, Math.min(sortedCardsByRating.length, QUANTITY_EXTRA_CARDS))
    .forEach((card) => {
      renderCard(filmsListTopRatedContainerElement, card);
    });

  const filmsListMostCommentedContainerElement = filmsListMostCommentedElement.querySelector('.films-list__container');

  const sortedCardsByComments = cards.slice().sort((a, b) => b.commentsId.length - a.commentsId.length);

  sortedCardsByComments
    .slice(0, Math.min(sortedCardsByComments.length, QUANTITY_EXTRA_CARDS))
    .forEach((card) => {
      renderCard(filmsListMostCommentedContainerElement, card);
    });
};

render(siteHeaderElement, new ProfileView(cards), RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationView(cards), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView(), RenderPosition.BEFOREEND);
render(siteFooterStatisticsElement, new QuantityMoviesView(cards), RenderPosition.BEFOREEND);

renderFilmsBoard(siteMainElement, cards);

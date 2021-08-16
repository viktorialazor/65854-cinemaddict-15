import {QUANTITY_CARDS, QUANTITY_CARDS_PER_STEP, QUANTITY_EXTRA_CARDS, QUANTITY_FILM_VARIANT} from './const.js';
import {getRandomNumber} from './utils.js';
import {createProfileTemplate} from './view/profile.js';
import {createNavigationTemplate} from './view/navigation.js';
import {createSortTemplate} from './view/sort.js';
import {createQuantityMoviesTemplate} from './view/quantity-movies.js';
import {createFilmsTemplate} from './view/films.js';
import {createFilmsListTemplate} from './view/films-list.js';
import {createFilmsTopRatedListTemplate} from './view/films-top-rated-list.js';
import {createFilmsMostCommentedListTemplate} from './view/films-most-commented-list.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreTemplate} from './view/show-more.js';
import {createPopupTemplate} from './view/popup.js';
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

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const bodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, createProfileTemplate(cards), 'beforeend');
render(siteMainElement, createNavigationTemplate(cards), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createFilmsTemplate(), 'beforeend');

const filmsElement = siteMainElement.querySelector('.films');

render(filmsElement, createFilmsListTemplate(), 'beforeend');

const filmsListElement = filmsElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

for(let i = 0; i < Math.min(cards.length, QUANTITY_CARDS_PER_STEP); i++) {
  render(filmsListContainerElement, createFilmCardTemplate(cards[i]), 'beforeend');
}

if (cards.length > QUANTITY_CARDS_PER_STEP) {
  let renderedCardCount = QUANTITY_CARDS_PER_STEP;

  render(filmsListElement, createShowMoreTemplate(), 'beforeend');

  const showMoreButtonElement = siteMainElement.querySelector('.films-list__show-more');

  showMoreButtonElement.addEventListener('click', (evt) => {
    evt.preventDefault();

    cards
      .slice(renderedCardCount, renderedCardCount + QUANTITY_CARDS_PER_STEP)
      .forEach((card) => render(filmsListContainerElement, createFilmCardTemplate(card), 'beforeend'));

    renderedCardCount += QUANTITY_CARDS_PER_STEP;

    if (renderedCardCount >= cards.length) {
      showMoreButtonElement.remove();
    }
  });
}

render(filmsElement, createFilmsTopRatedListTemplate(), 'beforeend');
render(filmsElement, createFilmsMostCommentedListTemplate(), 'beforeend');

const filmsListTopRatedElement = filmsElement.querySelectorAll('.films-list--extra')[0];
const filmsListMostCommentedElement = filmsElement.querySelectorAll('.films-list--extra')[1];
const filmsListTopRatedContainerElement = filmsListTopRatedElement.querySelector('.films-list__container');

const sortedCardsByRating = cards.slice().sort((a, b) => b.rating - a.rating);

for(let i = 0; i < Math.min(sortedCardsByRating.length, QUANTITY_EXTRA_CARDS); i++) {
  render(filmsListTopRatedContainerElement, createFilmCardTemplate(sortedCardsByRating[i]), 'beforeend');
}

const filmsListMostCommentedContainerElement = filmsListMostCommentedElement.querySelector('.films-list__container');

const sortedCardsByComments = cards.slice().sort((a, b) => b.commentsId.length - a.commentsId.length);

for(let i = 0; i < Math.min(sortedCardsByComments.length, QUANTITY_EXTRA_CARDS); i++) {
  render(filmsListMostCommentedContainerElement, createFilmCardTemplate(sortedCardsByComments[i]), 'beforeend');
}

render(siteFooterStatisticsElement, createQuantityMoviesTemplate(cards), 'beforeend');

const getPopupData = (card, commentsList) => {
  const cardCommentsId = card.commentsId;

  const filmComments = [];

  cardCommentsId.forEach((commentId) => {
    commentsList.forEach((comment) => {
      if (comment.id === commentId) {
        filmComments.push(comment);
      }
    });
  });

  return [card, filmComments];
};

const popupCard = getPopupData(cards[0], filmsComments);

render(bodyElement, createPopupTemplate(popupCard), 'beforeend');

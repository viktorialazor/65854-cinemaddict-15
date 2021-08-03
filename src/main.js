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

const quantityCards = 5;
const quantityExtraCards = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, createProfileTemplate(), 'beforeend');
render(siteMainElement, createNavigationTemplate(), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createFilmsTemplate(), 'beforeend');

const filmsElement = siteMainElement.querySelector('.films');

render(filmsElement, createFilmsListTemplate(), 'beforeend');

const filmsListElement = filmsElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

for(let i = 0; i < quantityCards; i++) {
  render(filmsListContainerElement, createFilmCardTemplate(), 'beforeend');
}

render(filmsListElement, createShowMoreTemplate(), 'beforeend');
render(filmsElement, createFilmsTopRatedListTemplate(), 'beforeend');
render(filmsElement, createFilmsMostCommentedListTemplate(), 'beforeend');

const filmsListTopRatedElement = filmsElement.querySelectorAll('.films-list--extra')[0];
const filmsListMostCommentedElement = filmsElement.querySelectorAll('.films-list--extra')[1];
const filmsListTopRatedContainerElement = filmsListTopRatedElement.querySelector('.films-list__container');

for(let i = 0; i < quantityExtraCards; i++) {
  render(filmsListTopRatedContainerElement, createFilmCardTemplate(), 'beforeend');
}

const filmsListMostCommentedContainerElement = filmsListMostCommentedElement.querySelector('.films-list__container');

for(let i = 0; i < quantityExtraCards; i++) {
  render(filmsListMostCommentedContainerElement, createFilmCardTemplate(), 'beforeend');
}

render(siteFooterStatisticsElement, createQuantityMoviesTemplate(), 'beforeend');

import {QUANTITY_CARDS, QUANTITY_FILM_VARIANT} from './const.js';
import {RenderPosition, render} from './utils/render.js';
import {getRandomNumber} from './utils/common.js';
import ProfileView from './view/profile.js';
import NavigationView from './view/navigation.js';
import QuantityMoviesView from './view/quantity-movies.js';
import {generateFilmCard} from './mock/film-card.js';
import {generateComments} from './mock/film-comments.js';
import FilmsListPresenter from './presenter/films-list.js';

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

render(siteHeaderElement, new ProfileView(cards), RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationView(cards), RenderPosition.BEFOREEND);
render(siteFooterStatisticsElement, new QuantityMoviesView(cards), RenderPosition.BEFOREEND);

const filmsListPresenter = new FilmsListPresenter(bodyElement);
filmsListPresenter.init(cards, filmsComments);

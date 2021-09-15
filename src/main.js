import {QUANTITY_CARDS, QUANTITY_FILM_VARIANT} from './const.js';
import {RenderPosition, render} from './utils/render.js';
import {getRandomNumber} from './utils/common.js';
import ProfileView from './view/profile.js';
// import NavigationView from './view/navigation.js';
import QuantityMoviesView from './view/quantity-movies.js';
import {generateFilmCard} from './mock/film-card.js';
import {generateComments} from './mock/film-comments.js';
import FilmsListPresenter from './presenter/films-list.js';
import FilterPresenter from './presenter/filter.js';
import CardsModel from './model/cards.js';
import FilterModel from './model/filter.js';

const filmsComments = [];

const cards = new Array(QUANTITY_CARDS).fill().map(() => {
  const filmVariant = getRandomNumber(0, QUANTITY_FILM_VARIANT);
  const filmComments = generateComments();

  filmComments.forEach((item) => {
    filmsComments.push(item);
  });

  return generateFilmCard(filmVariant, filmComments);
});

const cardsModel = new CardsModel();
cardsModel.setCards(cards);
cardsModel.setComments(filmsComments);

const filterModel = new FilterModel();

const bodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, new ProfileView(cards), RenderPosition.BEFOREEND);
// render(siteMainElement, new NavigationView(filters, 'all'), RenderPosition.BEFOREEND);
// render(siteMainElement, new NavigationView(cards), RenderPosition.BEFOREEND);
render(siteFooterStatisticsElement, new QuantityMoviesView(cards), RenderPosition.BEFOREEND);

// const filmsListPresenter = new FilmsListPresenter(bodyElement);
// filmsListPresenter.init(cards, filmsComments);
const filmsListPresenter = new FilmsListPresenter(bodyElement, cardsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, cardsModel);

filterPresenter.init();
filmsListPresenter.init();

import {QUANTITY_CARDS, QUANTITY_FILM_VARIANT, UpdateType, FilterType, MenuItem, FilterStatisticRange} from './const.js';
import {RenderPosition, render, remove} from './utils/render.js';
import {getRandomNumber} from './utils/common.js';
import {getWatchedFilms, getWatchedFilmsForRange} from './utils/statistics.js';
import ProfileView from './view/profile.js';
import QuantityMoviesView from './view/quantity-movies.js';
import NavigationWrapperView from './view/navigation-wrapper.js';
import NavigationStatisticsView from './view/navigation-statistics.js';
import StatisticsView from './view/statistics.js';
import {generateFilmCard} from './mock/film-card.js';
import {generateComments} from './mock/film-comments.js';
import FilmsListPresenter from './presenter/films-list.js';
import FilterPresenter from './presenter/filter.js';
import CardsModel from './model/cards.js';
import FilterModel from './model/filter.js';

const bodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const filmsComments = [];
let isShowFilms = true;
let isShowStatistics = false;
let statisticsComponent = null;
let activeStatisticRange = FilterStatisticRange.ALL;

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

let filmsWatched = [];
let cardsStatistic = [];

const navigationWrapperComponent = new NavigationWrapperView();
const navigationStatisticsComponent = new NavigationStatisticsView();
const filmsListPresenter = new FilmsListPresenter(bodyElement, cardsModel, filterModel);
const filterPresenter = new FilterPresenter(navigationWrapperComponent, filterModel, cardsModel);

const renderStatistics = () => {
  if (statisticsComponent !== null) {
    remove(statisticsComponent);
  }

  filmsWatched = getWatchedFilms(cardsModel.getCards());
  cardsStatistic = getWatchedFilmsForRange(filmsWatched, activeStatisticRange);

  statisticsComponent = new StatisticsView(cardsStatistic, activeStatisticRange);

  render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
};

const handleStatisticChange = (statisticRange) => {
  if (activeStatisticRange === statisticRange) {
    return;
  }

  activeStatisticRange = statisticRange;
  filmsWatched = getWatchedFilms(cardsModel.getCards());
  cardsStatistic = getWatchedFilmsForRange(filmsWatched, statisticRange);

  renderStatistics();
  statisticsComponent.setStatisticChangeHandler(handleStatisticChange);
};

const handleMenuClick = (menuItem, isFilms, isStats) => {
  if ((isShowFilms && isFilms) || (isShowStatistics && isStats)) {
    return;
  }
  switch (menuItem) {
    case MenuItem.FILTER:
      if (statisticsComponent !== null) {
        remove(statisticsComponent);
        activeStatisticRange = FilterStatisticRange.ALL;
      }
      filmsListPresenter.init();
      isShowFilms = true;
      isShowStatistics = false;
      navigationStatisticsComponent.getElement().classList.remove('main-navigation__additional--active');
      break;
    case MenuItem.STATISTICS:
      filmsListPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      isShowFilms = false;
      isShowStatistics = true;
      renderStatistics();
      statisticsComponent.setStatisticChangeHandler(handleStatisticChange);
      navigationStatisticsComponent.getElement().classList.add('main-navigation__additional--active');
      navigationWrapperComponent.getElement().querySelector('#all').classList.remove('main-navigation__item--active');
      break;
  }
};

navigationWrapperComponent.setMenuHandler(handleMenuClick);

render(siteHeaderElement, new ProfileView(cards), RenderPosition.BEFOREEND);
render(navigationWrapperComponent, navigationStatisticsComponent, RenderPosition.BEFOREEND);
render(siteMainElement, navigationWrapperComponent, RenderPosition.BEFOREEND);
render(siteFooterStatisticsElement, new QuantityMoviesView(cards), RenderPosition.BEFOREEND);

filterPresenter.init();
filmsListPresenter.init();

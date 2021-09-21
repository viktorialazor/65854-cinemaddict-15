import {UpdateType, FilterType, MenuItem, FilterStatisticRange, AUTHORIZATION, END_POINT} from './const.js';
import {RenderPosition, render, remove} from './utils/render.js';
import {getWatchedFilms, getWatchedFilmsForRange} from './utils/statistics.js';
import ProfileView from './view/profile.js';
import QuantityMoviesView from './view/quantity-movies.js';
import NavigationWrapperView from './view/navigation-wrapper.js';
import NavigationStatisticsView from './view/navigation-statistics.js';
import StatisticsView from './view/statistics.js';
import FilmsListPresenter from './presenter/films-list.js';
import FilterPresenter from './presenter/filter.js';
import CardsModel from './model/cards.js';
import FilterModel from './model/filter.js';
import Api from './api.js';

const bodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

let isShowFilms = true;
let isShowStatistics = false;
let statisticsComponent = null;
let activeStatisticRange = FilterStatisticRange.ALL;

const api = new Api(END_POINT, AUTHORIZATION);
const cardsModel = new CardsModel();
const filterModel = new FilterModel();

let filmsWatched = [];
let cardsStatistic = [];

const navigationWrapperComponent = new NavigationWrapperView();
const navigationStatisticsComponent = new NavigationStatisticsView();
const filmsListPresenter = new FilmsListPresenter(bodyElement, cardsModel, filterModel, api);
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

render(navigationWrapperComponent, navigationStatisticsComponent, RenderPosition.BEFOREEND);
render(siteMainElement, navigationWrapperComponent, RenderPosition.BEFOREEND);

filterPresenter.init();
filmsListPresenter.init();

api.getCards()
  .then((cards) => {
    const commentsFromRequests = [];
    const totalComments = [];

    cards.map((card) => {
      commentsFromRequests.push(api.getCommentsByFilmId(card.id));
    });

    Promise.all(commentsFromRequests)
      .then((allComments) => {
        allComments.forEach((commentItem) => {
          commentItem.forEach((comment) => {
            totalComments.push(comment);
          });
        });
        cardsModel.setCards(UpdateType.INIT, cards, totalComments);
        render(siteHeaderElement, new ProfileView(cards), RenderPosition.BEFOREEND);
        render(siteFooterStatisticsElement, new QuantityMoviesView(cards), RenderPosition.BEFOREEND);
        navigationWrapperComponent.setMenuHandler(handleMenuClick);
      });
  })
  .catch(() => {
    cardsModel.setCards(UpdateType.INIT, [], []);
    render(siteHeaderElement, new ProfileView([]), RenderPosition.BEFOREEND);
    render(siteFooterStatisticsElement, new QuantityMoviesView([]), RenderPosition.BEFOREEND);
    navigationWrapperComponent.setMenuHandler(handleMenuClick);
  });

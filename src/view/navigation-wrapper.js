import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createNavigationWrapperTemplate = () => (
  `<nav class="main-navigation">
  </nav>`
);

export default class NavigationWrapper extends AbstractView {
  constructor() {
    super();

    this._isShowFilms = false;
    this._isShowStatistics = false;
    this._menuHandler = this._menuHandler.bind(this);
  }

  getTemplate() {
    return createNavigationWrapperTemplate();
  }

  _menuHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'A') {
      return;
    }
    let menuItem = '';

    if (evt.target.id === 'navigation-statistics') {
      menuItem = MenuItem.STATISTICS;
      this._isShowFilms = false;
      this._isShowStatistics = true;
    } else {
      menuItem = MenuItem.FILTER;
      this._isShowFilms = true;
      this._isShowStatistics = false;
    }

    this._callback.menuClick(menuItem, this._isShowFilms, this._isShowStatistics);
  }

  setMenuHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuHandler);
  }
}

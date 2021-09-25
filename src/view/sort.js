import AbstractView from './abstract.js';
import {sortTypeList} from '../const.js';

const createSortItemTemplate = (sortItem, currentSortType) => (
  `<li><a href="#" class="sort__button ${currentSortType === sortItem ? 'sort__button--active' : ''}" data-sort-type="${sortItem}">Sort by ${sortItem}</a></li>`
);

const createSortTemplate = (currentSortType) => {
  const sortList = sortTypeList.map((sortItem) => createSortItemTemplate(sortItem, currentSortType)).join('');

  return `<ul class="sort">${sortList}</ul>`;
};

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}

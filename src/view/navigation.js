import AbstractView from './abstract.js';

const createNavigationItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  let itemCount = '';

  if (type !== 'all')  {
    itemCount = `<span class="main-navigation__item-count">${count}</span>`;
  }

  return (
    `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" id="${type}">${name} ${itemCount}</a>`
  );
};

const createNavigationTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createNavigationItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Navigation extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'A') {
      return;
    }

    this._callback.filterTypeChange(evt.target.id);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}

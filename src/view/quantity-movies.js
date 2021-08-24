import {createElement} from '../utils.js';

const createQuantityMoviesTemplate = (cards) => (
  `<p>${cards.length} movies inside
  </p>`
);

export default class QuantityMovies {
  constructor(cards) {
    this._cards = cards;
    this._element = null;
  }

  getTemplate() {
    return createQuantityMoviesTemplate(this._cards);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

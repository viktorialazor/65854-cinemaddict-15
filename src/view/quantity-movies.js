import AbstractView from './abstract.js';

const createQuantityMoviesTemplate = (cards) => (
  `<p>${cards.length} movies inside
  </p>`
);

export default class QuantityMovies extends AbstractView {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createQuantityMoviesTemplate(this._cards);
  }
}

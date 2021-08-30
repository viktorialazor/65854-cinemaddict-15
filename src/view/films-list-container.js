import AbstractView from './abstract.js';

const createFilmsListContainerTemplate = () => (
  `<div class="films-list__container">
  </div>`
);

export default class FilmsListContainer extends AbstractView {
  getTemplate() {
    return createFilmsListContainerTemplate();
  }
}

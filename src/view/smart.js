import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._cardInfo = {};
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._cardInfo = Object.assign(
      {},
      this._cardInfo,
      update,
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}

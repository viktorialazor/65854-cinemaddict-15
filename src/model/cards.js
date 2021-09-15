import AbstractObserver from '../utils/abstract-observer.js';

export default class Cards extends AbstractObserver {
  constructor() {
    super();
    this._cards = [];
    this._comments = [];
  }

  setCards(cards) {
    this._cards = cards.slice();
  }

  getCards() {
    return this._cards;
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  updateCard(updateType, update, filterType) {
    const index = this._cards.findIndex((card) => card.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting card');
    }

    this._cards = [
      ...this._cards.slice(0, index),
      update,
      ...this._cards.slice(index + 1),
    ];

    this._notify(updateType, update, filterType);
  }

  addComment(updateType, updateCard, updateComment) {
    const index = this._cards.findIndex((card) => card.id === updateCard.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting card');
    }

    this._cards = [
      ...this._cards.slice(0, index),
      updateCard,
      ...this._cards.slice(index + 1),
    ];

    this._comments = [
      updateComment,
      ...this._comments,
    ];

    this._notify(updateType, updateCard, updateComment);
  }

  deleteComment(updateType, updateCard, updateCommentId) {
    const indexCard = this._cards.findIndex((card) => card.id === updateCard.id);

    if (indexCard === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._cards = [
      ...this._cards.slice(0, indexCard),
      updateCard,
      ...this._cards.slice(indexCard + 1),
    ];

    const indexComment = this._comments.findIndex((comment) => comment.id === updateCommentId.id);

    this._comments = [
      ...this._comments.slice(0, indexComment),
      ...this._comments.slice(indexComment + 1),
    ];

    this._notify(updateType, updateCard);
  }
}

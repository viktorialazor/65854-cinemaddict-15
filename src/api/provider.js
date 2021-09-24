import CardsModel from '../model/cards.js';
import {isOnline} from '../utils/common.js';

const getSyncedCards = (items) => {
  items
    .filter(({success}) => success)
    .map(({payload}) => payload.card);
};

const createStoreStructure = (items) =>
  items
    .reduce((accumulator, currentValue) => Object.assign({}, accumulator, {
      [currentValue.id]: currentValue,
    }), {});


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getCards() {
    if (isOnline()) {
      return this._api.getCards()
        .then((movies) => {
          const items = createStoreStructure(movies.map(CardsModel.adaptCardToServer));
          this._store.setItems(items);
          return movies;
        });
    }

    const storeCards = Object.values(this._store.getItems());

    return Promise.resolve(storeCards.map(CardsModel.adaptCardToClient));
  }

  getCommentsByFilmId(filmId) {
    if (isOnline()) {
      return this._api.getCommentsByFilmId(filmId)
        .then((comments) => {
          const items = createStoreStructure(comments.map(CardsModel.adaptCommentToServer));
          this._store.setItem(items);

          return comments;
        });
    }

    return Promise.reject(new Error('Get comments failed'));
  }

  updateCard(card) {
    if (isOnline()) {
      return this._api.updateCard(card)
        .then((updateCard) => {
          this._store.setItem(updateCard.id, CardsModel.adaptCardToServer(updateCard));
          return updateCard;
        });
    }

    this._store.setItem(card.id, CardsModel.adaptCardToServer(Object.assign({}, card)));

    return Promise.resolve(card);
  }

  addComment(card, comment) {
    if (isOnline()) {
      return this._api.addComment(card, comment)
        .then((newComment) => {
          this._store.setItem(newComment.id, CardsModel.adaptCommentToServer(newComment));
          return newComment;
        });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(comment) {
    if (isOnline()) {
      return this._api.deleteComment(comment)
        .then(() => this._store.removeItem(comment.id));
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeCards = Object.values(this._store.getItems());

      return this._api.sync(storeCards)
        .then((response) => {
          const updatedFilms = getSyncedCards(response.updated);
          const items = createStoreStructure([...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}

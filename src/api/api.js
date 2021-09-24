import CardsModel from '../model/cards.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getCards() {
    return this._load({url: 'movies'})
      .then(Api.toJSON)
      .then((movies) => movies.map(CardsModel.adaptCardToClient));
  }

  getCommentsByFilmId(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then(Api.toJSON)
      .then((comments) => comments.map(CardsModel.adaptCommentToClient));
  }

  getComments() {
    return this._load({url: 'comments/'})
      .then(Api.toJSON)
      .then((comments) => comments.map(CardsModel.adaptCommentToClient));
  }

  updateCard(card) {
    return this._load({
      url: `movies/${card.id}`,
      method: Method.PUT,
      body: JSON.stringify(CardsModel.adaptCardToServer(card)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(CardsModel.adaptCardToClient);
  }

  addComment(card, comment) {
    return this._load({
      url: `comments/${card.id}`,
      method: Method.POST,
      body: JSON.stringify(CardsModel.adaptCommentToServer(comment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then((response) => response.comments.map(CardsModel.adaptCommentToClient));
  }

  deleteComment(comment) {
    return this._load({
      url: `comments/${comment}`,
      method: Method.DELETE,
    });
  }

  sync(data) {
    return this._load({
      url: '/movies/sync',
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
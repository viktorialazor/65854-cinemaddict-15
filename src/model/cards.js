import AbstractObserver from '../utils/abstract-observer.js';

export default class Cards extends AbstractObserver {
  constructor() {
    super();
    this._cards = [];
    this._comments = [];
  }

  setCards(updateType, cards, comments) {
    this._cards = cards.slice();
    this._comments = comments.slice();

    this._notify(updateType);
  }

  getCards() {
    return this._cards;
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
    const newComment = updateComment[updateComment.length -1];
    updateCard.commentsId.push(newComment.id);
    updateCard.isCommentDisabled = false;

    if (index === -1) {
      throw new Error('Can\'t update unexisting card');
    }

    this._cards = [
      ...this._cards.slice(0, index),
      updateCard,
      ...this._cards.slice(index + 1),
    ];

    this._comments = [
      ...this._comments,
      newComment,
    ];

    this._notify(updateType, updateCard, updateComment);
  }

  deleteComment(updateType, updateCard, updateCommentId) {
    const indexCard = this._cards.findIndex((card) => card.id === updateCard.id);
    let commentIdIndex = null;

    if (indexCard === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    updateCard.commentsId.forEach((commentId, index) => {
      if (commentId === updateCommentId) {
        commentIdIndex = index;
      }
    });

    updateCard.commentsId = [
      ...updateCard.commentsId.slice(0, commentIdIndex),
      ...updateCard.commentsId.slice(commentIdIndex + 1),
    ];

    this._cards = [
      ...this._cards.slice(0, indexCard),
      updateCard,
      ...this._cards.slice(indexCard + 1),
    ];

    const indexComment = this._comments.findIndex((comment) => comment.id === updateCommentId);

    this._comments = [
      ...this._comments.slice(0, indexComment),
      ...this._comments.slice(indexComment + 1),
    ];

    this._notify(updateType, updateCard);
  }

  static adaptCardToClient(card) {
    const adaptedCard = Object.assign(
      {},
      card,
      {
        poster: card['film_info']['poster'],
        title: card['film_info']['title'],
        originalTitle: card['film_info']['alternative_title'],
        rating: card['film_info']['total_rating'],
        director: card['film_info']['director'],
        writers: card['film_info']['writers'],
        actors: card['film_info']['actors'],
        release: card['film_info']['release']['date'] !== null ? new Date(card['film_info']['release']['date']) : null,
        duration: card['film_info']['runtime'],
        country: card['film_info']['release']['release_country'],
        genres: card['film_info']['genre'],
        description: card['film_info']['description'],
        age: card['film_info']['age_rating'],
        isInWatchlist: card['user_details']['watchlist'],
        isWatched: card['user_details']['already_watched'],
        isInFavorites: card['user_details']['favorite'],
        watchingDate: card['user_details']['watching_date'] !== null ? new Date(card['user_details']['watching_date']) : null,
        commentsId: card['comments'],
        isCommentDisabled: false,
      },
    );

    delete adaptedCard['film_info'];
    delete adaptedCard['user_details'];
    delete adaptedCard['comments'];

    return adaptedCard;
  }

  static adaptCardToServer(card) {
    const adaptedCard = Object.assign(
      {},
      card,
      {
        'film_info': {
          'poster': card.poster,
          'title': card.title,
          'alternative_title': card.originalTitle,
          'total_rating': card.rating,
          'director': card.director,
          'writers': card.writers,
          'actors': card.actors,
          'release': {
            'date': card.release instanceof Date ? card.release.toISOString() : null,
            'release_country': card.country,
          },
          'runtime': card.duration,
          'genre': card.genres,
          'description': card.description,
          'age_rating': card.age,
        },
        'user_details': {
          'watchlist': card.isInWatchlist,
          'already_watched': card.isWatched,
          'favorite': card.isInFavorites,
          'watching_date': card.watchingDate instanceof Date ? card.watchingDate.toISOString() : null,
        },
        'comments': card.commentsId,
      },
    );

    delete adaptedCard.poster;
    delete adaptedCard.title;
    delete adaptedCard.originalTitle;
    delete adaptedCard.rating;
    delete adaptedCard.director;
    delete adaptedCard.writers;
    delete adaptedCard.actors;
    delete adaptedCard.release;
    delete adaptedCard.duration;
    delete adaptedCard.country;
    delete adaptedCard.genres;
    delete adaptedCard.age;
    delete adaptedCard.isInWatchlist;
    delete adaptedCard.isWatched;
    delete adaptedCard.isInFavorites;
    delete adaptedCard.watchingDate;
    delete adaptedCard.commentsId;
    delete adaptedCard.isCommentDisabled;

    return adaptedCard;
  }

  static adaptCommentToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        message: comment['comment'],
      },
    );

    delete adaptedComment['comment'];

    return adaptedComment;
  }

  static adaptCommentToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        'comment': comment.message,
      },
    );

    delete adaptedComment.message;

    return adaptedComment;
  }
}

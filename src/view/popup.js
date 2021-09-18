import SmartView from './smart.js';
import {nanoid} from 'nanoid';
import he from 'he';
import {durationFilm, getCurrentDate, generateCommentAuthor} from '../utils/film.js';
import {CommentEmotion, CommentEmojiLabel} from '../const.js';

const createPopupTemplate = (card, comments) => {

  const {
    poster,
    title,
    originalTitle,
    rating,
    director,
    writers,
    actors,
    release,
    duration,
    country,
    genres,
    description,
    age,
    isInWatchlist,
    isWatched,
    isInFavorites,
    commentEmoji,
    commentMessage,
  } = card;

  const filmDuration = durationFilm(duration);
  const emoji = commentEmoji ? `<img src=${commentEmoji} alt=${commentEmoji} width="70" height="70">` : '';
  const text = commentMessage ? commentMessage : '';

  const amountComments = comments.length;
  let commentsList = '';

  comments.forEach((item = {}) => {
    const {
      id,
      emotion,
      date,
      author,
      message,
    } = item;

    commentsList += `<li id=${id} class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src=${emotion} width="55" height="55" alt="emoji-angry">
      </span>
      <div>
        <p class="film-details__comment-text">${message}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
  });

  let genresList = '';
  genres.slice().forEach((item) => {
    genresList += `<span class="film-details__genre">${item}</span>`;
  });
  const genresTitle = genres.length > 1 ? 'Genres' : 'Genre';
  const watchlist = isInWatchlist ? 'film-details__control-button--active ' : '';
  const watched = isWatched ? 'film-details__control-button--active ' : '';
  const favorites = isInFavorites ? 'film-details__control-button--active ' : '';

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src=${poster} alt="">

            <p class="film-details__age">${age}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${originalTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${release}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${filmDuration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genresTitle}</td>
                <td class="film-details__cell">${genresList}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button ${watchlist}film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button ${watched}film-details__control-button--watched" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button ${favorites}film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${amountComments}</span></h3>

          <ul class="film-details__comments-list">${commentsList}</ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${emoji}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(text)}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class Popup extends SmartView {
  constructor(card) {
    super();
    this._card = card;
    this._cardInfo = Popup.parseCardToData(this._card[0]);
    this._cardComments = this._card[1];
    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._clickPopupWatchlistHandler = this._clickPopupWatchlistHandler.bind(this);
    this._clickPopupWatchedHandler = this._clickPopupWatchedHandler.bind(this);
    this._clickPopupFavoritesHandler = this._clickPopupFavoritesHandler.bind(this);
    this._emojiInputHandler = this._emojiInputHandler.bind(this);
    this._messageTextareaHandler = this._messageTextareaHandler.bind(this);
    this._enterCtrlKeyDownHandler = this._enterCtrlKeyDownHandler.bind(this);
    this._clickDeleteCommentHandler = this._clickDeleteCommentHandler.bind(this);
    this._scrollHandler = this._scrollHandler.bind(this);
    this._commentEmoji = this._cardInfo.commentEmoji;
    this._commentMessage = this._cardInfo.commentMessage;
    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._cardInfo, this._cardComments);
  }

  _clickPopupWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.clickPopupWatchlist(this._scrollPosition);
  }

  _clickPopupWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.clickPopupWatched(this._scrollPosition);
  }

  _clickPopupFavoritesHandler(evt) {
    evt.preventDefault();
    this._callback.clickPopupFavorites(this._scrollPosition);
  }

  _closePopupHandler(evt) {
    evt.preventDefault();
    this._callback.closeDetailsPopup();
  }

  _scrollHandler(evt) {
    evt.preventDefault();
    this._scrollPosition = this.getElement().scrollTop;
  }

  setClosePopupHandler(callback) {
    this._callback.closeDetailsPopup = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closePopupHandler);
  }

  setPopupWatchlistClickHandler(callback) {
    this._callback.clickPopupWatchlist = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._clickPopupWatchlistHandler);
  }

  setPopupWatchedHandler(callback) {
    this._callback.clickPopupWatched = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._clickPopupWatchedHandler);
  }

  setPopupFavoritesHandler(callback) {
    this._callback.clickPopupFavorites = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._clickPopupFavoritesHandler);
  }

  setPopupNewCommentHandler(callback) {
    this._callback.addNewPopupComment = callback;
    this.getElement().querySelector('.film-details__new-comment').addEventListener('keydown', this._enterCtrlKeyDownHandler);
  }

  setPopupDeleteCommentHandler(callback) {
    this._callback.deletePopupComment = callback;
    this._comments = this.getElement().querySelectorAll('.film-details__comment');
    this._comments.forEach((comment) => {
      comment.addEventListener('click', this._clickDeleteCommentHandler);
    });
  }

  _clickDeleteCommentHandler(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    evt.preventDefault();
    const comment = evt.target.closest('.film-details__comment');
    const commentId = comment.id;

    comment.remove();
    const index = this._cardInfo.commentsId.findIndex((cardCommentId) => cardCommentId.toString() === commentId.toString());

    if (index === -1) {
      throw new Error('Can\'t delete unexisting commentsId');
    }
    this._cardInfo.commentsId = [
      ...this._cardInfo.commentsId.slice(0, index),
      ...this._cardInfo.commentsId.slice(index + 1),
    ];
    this._callback.deletePopupComment(this._scrollPosition, Popup.parseDataToCard(this._cardInfo), commentId);
  }


  setScrollPosition(position) {
    this.getElement().scroll(0, position);
  }

  getPopupData() {
    return this._cardInfo;
  }

  getDefaultCard() {
    return Popup.parseDataToCard(this._cardInfo);
  }

  _getCommentEmoji(emoji) {
    let emojiPath = '';
    switch(emoji) {
      case CommentEmojiLabel.EMOJI_SMILE:
        emojiPath = CommentEmotion.SMILE;
        break;
      case CommentEmojiLabel.EMOJI_SLEEPING:
        emojiPath = CommentEmotion.SLEEPING;
        break;
      case CommentEmojiLabel.EMOJI_PUKE:
        emojiPath = CommentEmotion.PUKE;
        break;
      case CommentEmojiLabel.EMOJI_ANGRY:
        emojiPath = CommentEmotion.ANGRY;
        break;
    }
    return `./images/emoji/${emojiPath}.png`;
  }

  _emojiInputHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'IMG') {
      return;
    }

    const emoji = evt.target.parentElement.htmlFor;

    this._commentEmoji = this._getCommentEmoji(emoji);

    this.updateData({
      commentEmoji: this._commentEmoji,
    });

    this.setScrollPosition(this._scrollPosition);
  }

  _messageTextareaHandler(evt) {
    evt.preventDefault();
    this._commentMessage = evt.target.value;

    this.updateData({
      commentMessage: this._commentMessage,
    }, true);
  }

  _enterCtrlKeyDownHandler(evt) {
    if (evt.ctrlKey && evt.key === 'Enter') {
      evt.preventDefault();

      if (this._commentMessage !== '' && this._commentEmoji !== '') {
        this._newComment = {
          id: nanoid(),
          emotion: this._commentEmoji,
          date: getCurrentDate(),
          author: generateCommentAuthor(),
          message: this._commentMessage,
        };
        this._cardInfo.commentsId.push(this._newComment.id);
        this._callback.addNewPopupComment(this._scrollPosition, Popup.parseDataToCard(this._cardInfo), this._newComment);
      }
    } else if (evt.key === 'Enter') {
      evt.preventDefault();
      this.getElement()
        .querySelector('.film-details__new-comment')
        .addEventListener('keydown', this._enterCtrlKeyDownHandler);
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  reset(card) {
    this._card = [];
    this._card.push(Popup.parseCardToData(card));
    this._card.push(this._cardComments);
    this.updateData(
      this._cardInfo,
    );
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this._emojiInputHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._messageTextareaHandler);
    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closePopupHandler);
    this.getElement()
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this._clickPopupWatchlistHandler);
    this.getElement()
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this._clickPopupWatchedHandler);
    this.getElement()
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this._clickPopupFavoritesHandler);
    this.getElement().addEventListener('scroll', this._scrollHandler);
    this.getElement()
      .querySelector('.film-details__new-comment')
      .addEventListener('keydown', this._enterCtrlKeyDownHandler);
    this._comments = this.getElement().querySelectorAll('.film-details__comment');
    this._comments.forEach((comment) => {
      comment.addEventListener('click', this._clickDeleteCommentHandler);
    });
  }

  static parseCardToData(card) {
    let cardInfo = card;

    cardInfo = Object.assign(
      {},
      cardInfo,
      {
        commentEmoji: cardInfo.commentEmoji ? cardInfo.commentEmoji : '',
        commentMessage: cardInfo.commentMessage ? cardInfo.commentMessage : '',
      },
    );

    return cardInfo;
  }

  static parseDataToCard(card) {
    const cardInfo = card;

    delete cardInfo.commentEmoji;
    delete cardInfo.commentMessage;

    return cardInfo;
  }
}

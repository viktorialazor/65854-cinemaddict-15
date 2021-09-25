import SmartView from './smart.js';
import he from 'he';
import {humanizeDate, changeFormatDate, durationFilm} from '../utils/film.js';
import {BUTTON_ENTER, emojiTypeList} from '../const.js';

const createCommentItemTemplate = (commentItem = {}) => {
  const {
    id,
    emotion,
    date,
    author,
    message,
  } = commentItem;

  const commentDate = humanizeDate(date);
  const commentEmotion = `./images/emoji/${emotion}.png`;

  return (`<li id=${id} class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src=${commentEmotion} width="55" height="55" alt="emoji-angry">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(message)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`);
};

const createEmojiTemplate = (emoji, isDisabled) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isDisabled ? 'disabled' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emoji}">
  <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`
);

const createCommentEmojiTemplate = (emoji) => (`<img src=./images/emoji/${emoji}.png alt=${emoji} width="70" height="70">`);

const createGenresTemplate = (genre) => (`<span class="film-details__genre">${genre}</span>`);

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
    isCommentDisabled,
  } = card;

  const filmDuration = durationFilm(duration);
  const filmRelease = changeFormatDate(release, 'D MMMM YYYY');
  const emoji = commentEmoji ? createCommentEmojiTemplate(commentEmoji) : '';
  const text = commentMessage ? commentMessage : '';
  const genresList = genres.map((genre) => createGenresTemplate(genre)).join('');
  const genresTitle = genres.length > 1 ? 'Genres' : 'Genre';
  const commentsList = comments.map((comment) => createCommentItemTemplate(comment)).join('');
  const commentsEmojiList = emojiTypeList.map((emojiItem) => createEmojiTemplate(emojiItem, isCommentDisabled)).join('');
  const amountComments = comments.length;
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
                <td class="film-details__cell">${filmRelease}</td>
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
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isCommentDisabled ? 'disabled' : ''}>${he.encode(text)}</textarea>
            </label>

            <div class="film-details__emoji-list">
              ${commentsEmojiList}
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
    this._commentsElements = this.getElement().querySelectorAll('.film-details__comment');
    this._commentsElements.forEach((comment) => {
      comment.addEventListener('click', this._clickDeleteCommentHandler);
    });
  }

  setDetetingCommentHandler() {
    let commentButtonElement = null;

    if (this._comment) {
      commentButtonElement = this._comment.querySelector('.film-details__comment-delete');
      commentButtonElement.textContent = 'Deleting';
      commentButtonElement.disabled = true;
    }
  }

  setSavingCommentHandler() {
    const newCommentElement = this.getElement().querySelector('.film-details__new-comment');
    newCommentElement.classList.add('film-details__new-comment--disabled');
  }

  setAbortingDeleteCommentHandler() {
    const commentButtonElement = this._comment.querySelector('.film-details__comment-delete');

    this._comment.classList.add('shake');
    commentButtonElement.textContent = 'Delete';
    commentButtonElement.disabled = false;
  }

  setAbortingAddCommentHandler() {
    this.updateData({
      commentEmoji: this._commentEmoji,
      commentMessage: this._commentMessage,
      isCommentDisabled: false,
    });
    const newCommentElement = this.getElement().querySelector('.film-details__new-comment');
    const textFieldElement = this.getElement().querySelector('.film-details__comment-input');
    textFieldElement.disabled = false;
    newCommentElement.classList.add('shake');
    newCommentElement.classList.remove('film-details__new-comment--disabled');
  }

  _clickDeleteCommentHandler(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    evt.preventDefault();

    this._comment = evt.target.closest('.film-details__comment');
    this._commentId = this._comment.id;

    const index = this._cardInfo.commentsId.findIndex((cardCommentId) => cardCommentId.toString() === this._commentId.toString());

    if (index === -1) {
      throw new Error('Can\'t delete unexisting commentsId');
    }

    this._callback.deletePopupComment(this._scrollPosition, Popup.parseDataToCard(this._cardInfo), this._commentId);
  }

  setScrollPosition(position) {
    this.getElement().scroll(0, position);
  }

  getFilmPopupData() {
    return this._cardInfo;
  }

  getDefaultCard() {
    return Popup.parseDataToCard(this._cardInfo);
  }

  _emojiInputHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'IMG') {
      return;
    }

    const commentFormElement = this.getElement().querySelector('.film-details__new-comment');

    if(!commentFormElement.classList.contains('film-details__new-comment--disabled')) {
      const emojiLabel = evt.target.parentElement.htmlFor;

      this._commentEmoji = this.getElement().querySelector(`#${emojiLabel}`).value;

      this.updateData({
        commentEmoji: this._commentEmoji,
      });
    }

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
    if (evt.ctrlKey && evt.key === BUTTON_ENTER) {
      evt.preventDefault();

      if (this._commentMessage !== '' && this._commentEmoji !== '') {
        this._newComment = {
          emotion: this._commentEmoji,
          message: this._commentMessage,
        };
        this._callback.addNewPopupComment(this._scrollPosition, Popup.parseDataToCard(this._cardInfo), this._newComment);
      }
    } else if (evt.key === BUTTON_ENTER) {
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

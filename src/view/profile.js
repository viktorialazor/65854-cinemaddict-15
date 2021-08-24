import {createElement} from '../utils.js';

const createProfileTemplate = (cards) => {

  const getProfileRating = () => {
    let profileStatus = '';
    let watchedAmount = 0;

    cards.forEach((card) => {
      if (card.isWatched) {
        watchedAmount += 1;
      }
    });

    if (watchedAmount > 0 && watchedAmount < 11) {
      profileStatus = 'novice';
    } else if (watchedAmount > 10 && watchedAmount < 20) {
      profileStatus = 'fan';
    } else {
      profileStatus = 'movie buff';
    }

    const profile = watchedAmount > 0 ? `<p class="profile__rating">${profileStatus}</p>` : '';

    return profile;
  };

  const profileRating = getProfileRating();

  return `<section class="header__profile profile">
    ${profileRating}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class Profile {
  constructor(cards) {
    this._cards = cards;
    this._element = null;
  }

  getTemplate() {
    return createProfileTemplate(this._cards);
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

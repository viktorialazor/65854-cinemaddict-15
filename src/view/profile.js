import {getProfileRating} from '../utils/film.js';
import AbstractView from './abstract.js';

const createProfileTemplate = (cards) => {
  let watchedAmount = 0;

  cards.forEach((card) => {
    if (card.isWatched) {
      watchedAmount += 1;
    }
  });

  const profileRating = getProfileRating(cards);

  const profile = watchedAmount > 0 ? `<p class="profile__rating">${profileRating}</p>` : '';

  return `<section class="header__profile profile">
    ${profile}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class Profile extends AbstractView {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createProfileTemplate(this._cards);
  }
}

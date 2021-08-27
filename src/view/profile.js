import AbstractView from './abstract.js';

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

export default class Profile extends AbstractView {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createProfileTemplate(this._cards);
  }
}

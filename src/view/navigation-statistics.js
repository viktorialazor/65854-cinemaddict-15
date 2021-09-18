import AbstractView from './abstract.js';

const createNavigationStatisticsTemplate = () => (
  `<a href="#stats" class="main-navigation__additional">Stats
  </a>`
);

export default class NavigationStatistics extends AbstractView {
  getTemplate() {
    return createNavigationStatisticsTemplate();
  }
}

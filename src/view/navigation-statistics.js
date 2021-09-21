import AbstractView from './abstract.js';

const createNavigationStatisticsTemplate = () => (
  `<a href="#stats" id="navigation-statistics" class="main-navigation__additional">Stats
  </a>`
);

export default class NavigationStatistics extends AbstractView {
  getTemplate() {
    return createNavigationStatisticsTemplate();
  }
}

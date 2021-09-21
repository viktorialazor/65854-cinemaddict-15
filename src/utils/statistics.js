import dayjs from 'dayjs';
import {FilterStatisticRange} from '../const.js';

const getWatchedFilms = (cards) => {
  const watchedFilms = cards.slice().filter((card) => card.isWatched);
  return watchedFilms;
};

const getGenresRate = (allGenres) => {
  const resultReduce = allGenres.reduce((acc, cur) => {
    if (!acc.hash[cur]) {
      acc.hash[cur] = {[cur]: 1};
      acc.map.set(acc.hash[cur], 1);
      acc.result.push(acc.hash[cur]);
    } else {
      acc.hash[cur][cur] += 1;
      acc.map.set(acc.hash[cur], acc.hash[cur][cur]);
    }
    return acc;
  }, {
    hash: {},
    map: new Map(),
    result: [],
  });

  const genresRated = resultReduce.result.sort((elemA, elemB) => resultReduce.map.get(elemB) - resultReduce.map.get(elemA));

  return genresRated;
};

const getGenresList = (cards) => {
  let genres = [];
  const genresList = [];
  const quantityList = [];

  cards.forEach((card) => {
    genres = genres.concat(card.genres);
  });

  const genresRated = getGenresRate(genres);
  genresRated.forEach((item) => {
    genresList.push(Object.keys(item).toString());
    quantityList.push(parseInt(Object.values(item), 10));
  });

  return {
    genres: genresList,
    quantity: quantityList,
  };
};

const getTopGenre = (cards) => {
  let genres = [];

  cards.forEach((card) => {
    genres = genres.concat(card.genres);
  });

  let number = 0;
  let genre = '';

  const genresRated = getGenresRate(genres);

  genresRated.forEach((item) => {
    if (Object.values(item) > number) {
      number = Object.values(item);
      genre = Object.keys(item).toString();
    }
  });

  return genre;
};

const getWatchedFilmsForRange = (cards, range) => {
  let cardsWatched = [];
  const nowDate = dayjs().toDate();
  const currentDate = dayjs(nowDate).format('DD MM YYYY');
  const weekAgo = dayjs(nowDate).set('date', dayjs().get('date') -7);
  const monthAgo = dayjs(nowDate).set('month', dayjs().get('month') -1);
  const yearAgo = dayjs(nowDate).set('year', dayjs().get('year') -1);

  switch (range) {
    case FilterStatisticRange.ALL:
      cardsWatched = cards.slice();
      break;
    case FilterStatisticRange.TODAY:
      cardsWatched = cards.slice().filter((card) => dayjs(card.watchingDate).format('DD MM YYYY') === currentDate);
      break;
    case FilterStatisticRange.WEEK:
      cardsWatched = cards.slice().filter((card) => card.watchingDate > weekAgo && card.watchingDate < dayjs().toDate());
      break;
    case FilterStatisticRange.MONTH:
      cardsWatched = cards.slice().filter((card) => card.watchingDate > monthAgo && card.watchingDate < dayjs().toDate());
      break;
    case FilterStatisticRange.YEAR:
      cardsWatched = cards.slice().filter((card) => card.watchingDate > yearAgo && card.watchingDate < dayjs().toDate());
      break;
  }

  return cardsWatched;
};

export {getWatchedFilms, getGenresList, getTopGenre, getWatchedFilmsForRange};

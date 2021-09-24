import dayjs from 'dayjs';
import {FilterStatisticRange} from '../const.js';

const getWatchedFilms = (cards) => (cards.slice().filter((card) => card.isWatched));

const getGenresRate = (allGenres) => {
  const resultReduce = allGenres.reduce((accumulator, currentValue) => {
    if (!accumulator.hash[currentValue]) {
      accumulator.hash[currentValue] = {[currentValue]: 1};
      accumulator.map.set(accumulator.hash[currentValue], 1);
      accumulator.result.push(accumulator.hash[currentValue]);
    } else {
      accumulator.hash[currentValue][currentValue] += 1;
      accumulator.map.set(accumulator.hash[currentValue], accumulator.hash[currentValue][currentValue]);
    }
    return accumulator;
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
  const nowDate = dayjs().toDate();
  const currentDate = dayjs(nowDate).format('DD MM YYYY');
  const weekAgo = dayjs(nowDate).set('date', dayjs().get('date') -7);
  const monthAgo = dayjs(nowDate).set('month', dayjs().get('month') -1);
  const yearAgo = dayjs(nowDate).set('year', dayjs().get('year') -1);

  switch (range) {
    case FilterStatisticRange.ALL:
      return cards.slice();
    case FilterStatisticRange.TODAY:
      return cards.slice().filter((card) => dayjs(card.watchingDate).format('DD MM YYYY') === currentDate);
    case FilterStatisticRange.WEEK:
      return cards.slice().filter((card) => card.watchingDate > weekAgo && card.watchingDate < dayjs().toDate());
    case FilterStatisticRange.MONTH:
      return cards.slice().filter((card) => card.watchingDate > monthAgo && card.watchingDate < dayjs().toDate());
    case FilterStatisticRange.YEAR:
      return cards.slice().filter((card) => card.watchingDate > yearAgo && card.watchingDate < dayjs().toDate());
  }
};

export {getWatchedFilms, getGenresList, getTopGenre, getWatchedFilmsForRange};

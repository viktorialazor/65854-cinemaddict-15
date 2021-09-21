import {nanoid} from 'nanoid';
import {MIN_RATING, MAX_RATING, MIN_DESCRIPTIONS, MAX_DESCRIPTIONS} from '../const.js';
import {getRandomNumber} from '../utils/common.js';
import {generateWatchingDate} from '../utils/film.js';

const generatePoster = (index) => {
  const images = [
    'the-dance-of-life.jpg',
    'sagebrush-trail.jpg',
    'the-man-with-the-golden-arm.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'popeye-meets-sinbad.png',
    'the-great-flamarion.jpg',
    'made-for-each-other.png',
  ];

  return `./images/posters/${images[index]}`;
};

const generateTitle = (index) => {
  const titles = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'The Great Flamarion',
    'Made for Each Other',
  ];

  return titles[index];
};

const generateRating = () => {
  const rating = getRandomNumber(MIN_RATING, MAX_RATING, 'true');

  return rating;
};

const generateDirector = (index) => {
  const directors = [
    'John Cromwell, A. Edward Sutherland',
    'JArmand Schaefer',
    'Otto Preminger',
    'Nicholas Webster',
    'Dave Fleischer',
    'Anthony Mann',
    'John Cromwell',
  ];

  return directors[index];
};

const generateWriters = (index) => {
  const writers = [
    'Benjamin Glazer, Arthur Hopkins, Julian Johnson',
    'Lindsley Parsons',
    'Walter Newman, Lewis Meltzer',
    'Glenville Mareth, Paul L. Jacobson',
    'Max Fleischer, Adolph Zukor',
    'Anne Wigton, Heinz Herald, Richard Weil',
    'Jo Swerling, Rose Franken',
  ];

  return writers[index];
};

const generateActors = (index) => {
  const actors = [
    'Hal Skelly, Nancy Carroll, Dorothy Revier',
    'John Wayne, Nancy Shubert, Lane Chandler',
    'Frank Sinatra, Kim Novak, Eleanor Parker',
    'John Call, Leonard Hicks, Vincent Beck',
    'Jack Mercer, Mae Questel, Gus Wickie, Lou Fleischer',
    'Erich von Stroheim, Mary Beth Hughes, Dan Duryea',
    'Carole Lombard, James Stewart, Charles Coburn',
  ];

  return actors[index];
};

const generateDate = (index) => {
  const dates = [
    '1929-08-28T00:00:00.000Z',
    '1933-12-15T00:00:00.000Z',
    '1955-12-15T00:00:00.000Z',
    '1964-11-14T00:00:00.000Z',
    '1936-11-27T00:00:00.000Z',
    '1945-03-30T00:00:00.000Z',
    '1939-02-10T00:00:00.000Z',
  ];

  return dates[index];
};

const generateDuration = (index) => {
  const duration = [115, 54, 119, 81, 16, 78, 92];

  return duration[index];
};

const generateGenre = (index) => {
  const genres = [
    ['Musical', 'Film-Noir', 'Mystery'],
    ['Western', 'Action', 'Drama', 'Romance'],
    ['Drama', 'Crime', 'Romance'],
    ['Comedy', 'Adventure', 'Family'],
    ['Cartoon', 'Comedy', 'Family'],
    ['Mystery', 'Drama', 'Film-Noir', 'Romance'],
    ['Comedy', 'Drama', 'Romance'],
  ];

  return genres[index];
};

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  const quantityStrings = getRandomNumber(MIN_DESCRIPTIONS, MAX_DESCRIPTIONS);

  let description = '';

  for(let i = 0; i < quantityStrings; i++) {
    const randomIndex = getRandomNumber(0, descriptions.length - 1);
    description += descriptions[randomIndex];
  }

  return description;
};

const generateAge = (index) => {
  const ages = ['18', '16', '16', '8', '8', '18', '16'];

  return ages[index];
};

export const generateFilmCard = (index, comments) => {
  const commentsIdList = [];

  if(comments.length > 0) {
    comments.forEach((item) => {
      commentsIdList.push(item.id);
    });
  }

  const isWatched = Boolean(getRandomNumber(0, 1));
  const watchingDate = isWatched ? generateWatchingDate() : '';

  return {
    id: nanoid(),
    poster: generatePoster(index),
    title: generateTitle(index),
    originalTitle: generateTitle(index),
    rating: generateRating(index),
    director: generateDirector(index),
    writers: generateWriters(index),
    actors: generateActors(index),
    release: generateDate(index),
    duration: generateDuration(index),
    country: 'USA',
    genres: generateGenre(index),
    description: generateDescription(),
    age: generateAge(index),
    isInWatchlist: Boolean(getRandomNumber(0, 1)),
    isWatched: isWatched,
    isInFavorites: Boolean(getRandomNumber(0, 1)),
    watchingDate: watchingDate,
    commentsId: commentsIdList,
  };
};

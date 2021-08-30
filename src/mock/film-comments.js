import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {MAX_COMMENTS} from '../const.js';
import {getRandomNumber} from '../utils/common.js';
import {humanizeDate} from '../utils/film.js';

const generateCommentEmotion = () => {
  const emotions = ['angry.png', 'puke.png', 'sleeping.png', 'smile.png'];

  const randomIndex = getRandomNumber(0, emotions.length - 1);

  return `./images/emoji/${emotions[randomIndex]}`;
};

const generateCommentDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomNumber(-maxDaysGap, 0);
  const date = dayjs().add(daysGap, 'day').toDate();

  return humanizeDate(date);
};

const generateCommentAuthor = () => {
  const authors = ['Tim Macoveev', 'John Doe', 'Mary Beth', 'John Call', 'Eleanor Parker'];

  const randomIndex = getRandomNumber(0, authors.length - 1);

  return authors[randomIndex];
};

const generateCommentMessage = () => {
  const messages = [
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

  const randomIndex = getRandomNumber(0, messages.length - 1);

  return messages[randomIndex];
};

const generateComment = () => ({
  id: nanoid(),
  emotion: generateCommentEmotion(),
  date: generateCommentDate(),
  author: generateCommentAuthor(),
  message: generateCommentMessage(),
});

export const generateComments = () => {
  const quantityComments = getRandomNumber(0, MAX_COMMENTS);
  const comments = [];
  for (let i = 0; i < quantityComments; i++) {
    const comment = generateComment();
    comments.push(comment);
  }
  return comments;
};

import dayjs from 'dayjs';
import {MAX_COMMENTS, MAX_ID_NUMBER} from '../const.js';
import {getRandomNumber, humanizeDate} from '../utils.js';

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

const IdList = new Set();

const generateId = () => {
  const id = getRandomNumber(0, MAX_ID_NUMBER);

  if (!IdList.has(id)) {
    IdList.add(id);

    return id;
  } else {
    generateId();
  }
};

const generateComment = () => ({
  id: generateId(),
  emotion: generateCommentEmotion(),
  date: generateCommentDate(),
  author: generateCommentAuthor(),
  message: generateCommentMessage(),
});

export const generateComments = () => {
  const QuantityComments = getRandomNumber(0, MAX_COMMENTS);
  const comments = [];
  for (let i = 0; i < QuantityComments; i++) {
    const comment = generateComment();
    comments.push(comment);
  }
  return comments;
};

const getRandomNumber = (a = 0, b = 1, floating = false) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  let result = 0;

  floating ? result = Math.round((lower + Math.random() * (upper - lower))*10)/10 : result = Math.floor(lower + Math.random() * (upper - lower + 1));

  return result;
};

const isOnline = () => window.navigator.onLine;

export {getRandomNumber, isOnline};

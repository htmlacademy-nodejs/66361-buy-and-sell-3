"use strict";
const {getRandomInt, shuffle} = require(`../../utils`);
const fs = require(`fs`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const TITLES = [
  `Продам книги Стивена Кинга`,
  `Продам новую приставку Sony Playstation 5`,
  `Продам отличную подборку фильмов на VHS`,
  `Куплю антиквариат`,
  `Куплю породистого кота`,
];

const SENTENCES = [
  `Товар в отличном состоянии.`,
  `Пользовались бережно и только по большим праздникам.`,
  `Продаю с болью в сердце...`,
  `Бонусом отдам все аксессуары.`,
  `Даю недельную гарантию.`,
  `Если товар не понравится — верну всё до последней копейки.`,
  `Это настоящая находка для коллекционера!`,
  `Если найдёте дешевле — сброшу цену.`,
  `Таких предложений больше нет!`,
  `При покупке с меня бесплатная доставка в черте города.`,
];

const CATEGORIES = [
  `Книги`,
  `Разное`,
  `Посуда`,
  `Игры`,
  `Животные`,
  `Журналы`
];

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const getPictureFileName = (num) => {
  const formatNum = String(num).padStart(2, `0`);
  return `item${formatNum}.jpg`;
};

const getRandFromArr = (arr) => arr[getRandomInt(0, arr.length - 1)];
const getDescription = () => shuffle(SENTENCES).slice(1, 5).join(` `);
const getPicture = () => getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX));
const getType = () => OfferType[
  Object.keys(OfferType)[
    Math.floor(Math.random() * Object.keys(OfferType).length)
  ]
];
const getSum = () => getRandomInt(SumRestrict.MIN, SumRestrict.MAX);

const generateOffers = (count) =>
  Array(count)
    .fill({})
    .map(() => ({
      category: [getRandFromArr(CATEGORIES)],
      description: getDescription(),
      picture: getPicture(),
      title: getRandFromArr(TITLES),
      type: getType(),
      sum: getSum(),
    }));

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.info(`Operation success. File created.`);
    });
  },
};

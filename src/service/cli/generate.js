"use strict";
const {getRandomInt, shuffle} = require(`../../utils`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const MOCK_COUNT_RESTRICT = 1000;

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
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > MOCK_COUNT_RESTRICT) {
      console.info(`Не больше 1000 объявлений`);
      return;
    }
    const content = JSON.stringify(generateOffers(countOffer));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }

  },
};

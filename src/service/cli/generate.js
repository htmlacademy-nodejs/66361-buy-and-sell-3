"use strict";
const {getRandomInt, shuffle} = require(`../../utils`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const MOCK_COUNT_RESTRICT = 1000;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

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

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};


const getPictureFileName = (num) => {
  const formatNum = String(num).padStart(2, `0`);
  return `item${formatNum}.jpg`;
};

const getRandFromArr = (arr) => arr[getRandomInt(0, arr.length - 1)];
const getDescription = (sentences) => shuffle(sentences).slice(1, 5).join(` `);
const getPicture = () => getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX));
const getType = () => OfferType[
  Object.keys(OfferType)[
    Math.floor(Math.random() * Object.keys(OfferType).length)
  ]
];
const getSum = () => getRandomInt(SumRestrict.MIN, SumRestrict.MAX);

const generateOffers = (count, titles, categories, sentences) =>
  Array(count)
    .fill({})
    .map(() => ({
      category: [getRandFromArr(categories)],
      description: getDescription(sentences),
      picture: getPicture(),
      title: getRandFromArr(titles),
      type: getType(),
      sum: getSum(),
    }));

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > MOCK_COUNT_RESTRICT) {
      console.info(`Не больше 1000 объявлений`);
      return;
    }
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }

  },
};

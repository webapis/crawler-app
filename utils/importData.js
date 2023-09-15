require("dotenv").config();
const algoliasearch = require("algoliasearch");

const client = algoliasearch("7JF244QSZZ", process.env.ALGOLIAKEY);

function setSettings(index) {
  return new Promise((resolve, reject) => {
    try {
      index
        .setSettings({
          attributeForDistinct: "brand",
          distinct: true,
        })
        .then(() => {
          return resolve(true);
        });
    } catch (error) {
      return reject(error);
    }
  });
}

async function importLinkData({ data }) {
  const linkIndex = client.initIndex("link");
//  await setSettings(linkIndex);
  return new Promise((resolve, reject) => {
    try {
      linkIndex
        .saveObjects(data, { autoGenerateObjectIDIfNotExist: true })
        .then((d) => {
          return resolve(d);
        });
    } catch (error) {
      return reject(error);
    }
  });
}

module.exports = { importLinkData };

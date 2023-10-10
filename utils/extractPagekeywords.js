const { extractUniqueWords } = require("./extractUniqueWords");
function extractPagekeywords({ products, page }) {
  const uniqueWords = new Set();

  const pageKeywords = extractUniqueWords(page);
debugger
  let productKeywords = [];
  products.forEach((obj) => {
    const extractedData = extractUniqueWords(obj);

    productKeywords.push(...extractedData);
  });

  productKeywords.forEach((word) => {
    uniqueWords.add(word);
  });
  pageKeywords.forEach((word) => {
    uniqueWords.add(word);
  });
  const wordCounts = {};

  uniqueWords.forEach((word) => {
    wordCounts[word] = 0;
  });

  pageKeywords.forEach((word) => {

    wordCounts[word]++;
  });
  debugger
  productKeywords.forEach((word) => {

    wordCounts[word]++;
  });
  debugger
  const removeLess = Object.entries(wordCounts)
  //  .filter((f) => f[1] > 1 || (f[0].length === 2 && [f[1] >= 3]))
    .map((m) => m[0])
    .filter((f) => isNaN(f))
    .sort()
   // .sort((a, b) => a.length - b.length)
  //  .filter((f) => f.length <= 10 && f.length >= 2)
  
   .join(" ");
  debugger;
  return removeLess;
}
module.exports = { extractPagekeywords };

# crawler-app
 
//how to extract unique words using javascript:
const strings = ["koton kadife mini elbise drapeli omzu açık uzun kollu _kadin",
  "koton v yaka kadife mini elbise _kadin",
  "koton kadife mini parti elbisesi drapeli volanlı uzun kollu _kadin"
];

const uniqueWords = new Set();

strings.forEach(string => {
  string.split(" ").forEach(word => {
    uniqueWords.add(word);
  });
});

console.log(uniqueWords);

//i also want to count each unique word
const uniqueWords = new Set();

strings.forEach(string => {
  string.split(" ").forEach(word => {
    uniqueWords.add(word);
  });
});

const wordCounts = {};

uniqueWords.forEach(word => {
  wordCounts[word] = 0;
});

strings.forEach(string => {
  string.split(" ").forEach(word => {
    wordCounts[word]++;
  });
});

console.log(wordCounts);
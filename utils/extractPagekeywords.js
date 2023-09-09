function extractPagekeywords({products}){
    const uniqueWords = new Set();

    products.forEach(obj => {
  obj.title.replace('-',' ').split(" ").forEach(word => {
    uniqueWords.add(word);
  });
});

const wordCounts = {};

uniqueWords.forEach(word => {
  wordCounts[word] = 0;
});


products.forEach(obj => {
    obj.title.replace('-',' ').split(" ").forEach(word => {
        wordCounts[word]++;
    });
  });

const removeLess =Object.entries( wordCounts).filter(f=>f[1]> 1 || (f[0].length===2 && [f[1]>=3] )).map(m=>m[0]).filter(f=> isNaN(f)).sort((a, b) => a.length - b.length).filter(f=>f.length<=10  && f.length>=2).join(" ")
debugger
return removeLess
}
module.exports={extractPagekeywords}
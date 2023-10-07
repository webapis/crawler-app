// const penti = require('./penti.json')

// const fs =require('fs')


// const uniqueWords = new Set();

// penti.forEach(obj => {
//   obj.title.replace('-',' ').split(" ").forEach(word => {
//     uniqueWords.add(word);
//   });
// });

// const wordCounts = {};

// uniqueWords.forEach(word => {
//   wordCounts[word] = 0;
// });


// penti.forEach(obj => {
//     obj.title.replace('-',' ').split(" ").forEach(word => {
//         wordCounts[word]++;
//     });
//   });

// const removeLess =Object.entries( wordCounts).filter(f=>f[1]> 1 || (f[0].length===2 && [f[1]>=3] )).map(m=>m[0]).filter(f=> isNaN(f)).sort((a, b) => a.length - b.length).filter(f=>f.length<=10  && f.length>=2).join(" ")
// debugger
// console.log(wordCounts);
// fs.writeFileSync('./pentiunique.json',JSON.stringify({keywords:removeLess}))



const response = await fetch(`https://s2.googleusercontent.com/s2/favicons?domain=${'https://www.defacto.com.tr'}`);
const faviconUrl = response.headers.get('Content-Location');
"data:" + blob.type + ';base64,' + buffer.toString('base64');
debugger
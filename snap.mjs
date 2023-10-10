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

import { createRequire } from 'module';
const require = createRequire(import.meta.url);


// import fetchFavicon from "./utils/fetchFavicon.mjs";
// const sharp = require('sharp');
// const path =require('path')
// const im =require('imagemagick')
// const response = await fetch(`https://s2.googleusercontent.com/s2/favicons?domain=${'https://www.addax.com.tr'}`);

// const faviconUrl = response.headers.get('Content-Location');
// debugger
// const fpath = await fetchFavicon({url:faviconUrl,filename:'addax'})
// debugger
// sharp(fpath).jpeg().toFile(`addax.jpeg`)
// // const faviconUrl = response.headers.get('Content-Location');
// // const blob = await response.blob()
// // let buffer = Buffer.from(response);
// // const dataURL ="data:" + blob.type + ';base64,' + buffer.toString('base64');
// // debugger
debugger
const  {extractUniqueWords} =require('./utils/extractUniqueWords');
debugger
const words = extractUniqueWords(
    {
      "hrefText": "",
      "docTitle": "Abiyefon | Lider Abiye Giyim Sitesi",
      "link": "https://www.abiyefon.com/beyaz-uzun/kadın",
      "objectID": "7228c3d184cdbb5a1049a1da6a40e6f86529273c",
      "brand": "abiyefon",
      "domainName": "www.abiyefon.com"})

      debugger
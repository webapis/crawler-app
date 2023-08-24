
async function handler(page, context) {

  const url = await page.url();

console.log('url--start--',url)
  await page.waitForSelector(".result.-only-desktop");
  //   const productCount = await page.$eval('.result.-only-desktop', element => parseInt(element.textContent.replace(/[^\d]/g, "")))
  debugger;

  await autoScroll(page);
debugger

  const data = await page.$$eval('.list__products .product-item', (productCards) => {

    
// function extractColorWordFromString(inputString) {
//   // List of color words in Turkish
//   const colorWords = [
//     'siyah', 'beyaz', 'kırmızı', 'mavi', 'yeşil', 'sarı', 'turuncu', 'mor',
//     'pembe', 'bordo', 'kahverengi', 'beyaz', 'lacivert', 'gri', 'krem', 'bej',
//     'buz mavisi', 'açık mavi', 'koyu mavi', 'fuşya', 'antrasit', 'kumral',
//     'altın rengi', 'gümüş rengi', 'bronz', 'gül rengi', 'haki', 'açık yeşil',
//     'koyu yeşil', 'açık pembe', 'koyu pembe', 'turkuaz', 'lavanta', 'eflatun',
//     'nane yeşili', 'somon', 'mercan', 'misket limonu', 'zümrüt yeşili',
//     'safir mavisi', 'çikolata kahvesi', 'teknede mavi', 'tüy rengi', 'zeytin yeşili',
//     'gök mavisi', 'menekşe rengi', 'soluk mavi', 'briket kırmızısı', 'peach',
//     'açık gri', 'koyu gri', 'lila', 'çam rengi', 'mürdüm', 'parlament mavisi',
//     'zambak rengi', 'buz mavisi', 'hardal', 'hardal sarısı', 'fuşya', 'antik beyaz',
//     'antik pembe', 'pastel yeşil', 'pastel mavi', 'pastel mor', 'pastel sarı',
//     'pastel turuncu', 'pastel pembe', 'pastel kırmızı', 'pastel gri', 'pastel kahverengi'
//     // Add even more color words as needed
//   ];

//   const lowerCaseInput = inputString.toLowerCase();

//   const matchedColorWord = colorWords.find(color => lowerCaseInput.includes(color));

//   return matchedColorWord || null;
// }

    return productCards.map(document => {
try {
    const imageUrl = document.querySelector('img').src
    const title = document.querySelector('.product-item__info-name a').innerHTML.trim()
    const priceNew = document.querySelector('.product-item__info-price pz-price').innerText.replace('TL','').trim()
    const longlink = document.querySelector('.product-item__info-name a').href
  //  const color = extractColorWordFromString(decodeURI(longlink))
    const link = longlink.substring(longlink.indexOf("koton.com/") + 10)
//    const longImgUrl = imageUrl && 'https:' + imageUrl.substring(imageUrl.lastIndexOf('//'), imageUrl.lastIndexOf('.jpg') + 4)
 //   const imageUrlshort = imageUrl && longImgUrl.substring(longImgUrl.indexOf("https://dfcdn.defacto.com.tr/") + 29)

    return {
        title: 'koton ' + title.replace(/İ/g,'i').toLowerCase()  ,
        priceNew,
        imageUrl,
        link,
        timestamp: Date.now(),
        marka: 'koton',
    } 
} catch (error) {
    return {error:error.toString(),content:document.innerHTML}
}

    }).filter(f => f.imageUrl.length>0 && f.title.length > 5)
})
debugger
console.log('data length_____', data.length, 'url:', url,process.env.GENDER)


console.log("process.env.GENDER ")
const formatprice = data.map((m) => {
    return { ...m, title: m.title + " _" + process.env.GENDER }
})


return formatprice
}



async function autoScroll(page) {
    debugger
    page.on("console", (message) => {
        console.log("Message from Puppeteer page:", message.text());
      });
  await page.evaluate(async () => {
    const totalItems = parseInt( document.querySelector(".result.-only-desktop").textContent.replace(/[^\d]/g, ""))
    function percentageDifference(a, b) {
      // Calculate the absolute difference between the two numbers.
      let difference = a - b;
    
      // Calculate the average of the two numbers.
      let average = (a + b) / 2;
    
      // Calculate the percentage difference.
      let percentage = difference / average * 100;
    
      return Math.round(percentage);
    }
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      let inc = 0;
      var timer = setInterval(() => {
        
       // const loading = document.querySelector('.js-loader-area.list__products-loadmore-container.passive')
    
          const collectedItems = document.querySelectorAll(".list__products .product-item").length;
  
          const percentage =percentageDifference(totalItems,collectedItems)
        
          if(collectedItems>=200){
            clearInterval(timer);
            resolve();
          }

          if(percentage ===NaN || percentage>=1){

            window.scrollBy(0, distance);
            totalHeight += distance;
            inc = inc + 1;
            console.log("inc", inc,totalItems,collectedItems);

          }else{
            clearInterval(timer);
            resolve();
          }
   
      }, 300);
    });
  });
}
async function getUrls(page) {
  const url = await page.url();
  // await page.waitForSelector('.result.-only-desktop')
  // const productCount = await page.$eval('.result.-only-desktop', element => parseInt(element.textContent.replace(/[^\d]/g, "")))
  // const totalPages = Math.ceil(productCount / 59)
  const pageUrls = [];

  // let pagesLeft = totalPages
  // for (let i = 1; i <= totalPages; i++) {

  //     if (pagesLeft > 0) {

  //         pageUrls.push(`${url}?page=` + i)
  //         --pagesLeft
  //     }

  // }

  return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 };
}
module.exports = { handler, getUrls };


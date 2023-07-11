const fetch =require('node-fetch')

async function handler(page, context) {
const url =await page.url()
    debugger;
    const response =await fetch(url)
debugger
const jsonData =await response.json()
debugger
//https://st.mngbcn.com/
const data = Object.values( jsonData.groups[0].garments).map(m=>m.colors).flat().map(m=>{
    
    const imageUrl=m.images[0].img1Src
    return {
    imageUrl:imageUrl.substring(imageUrl.indexOf('https://st.mngbcn.com/')+22),
    title:'mango '+m.images[0].
    altText,
    priceNew:m.price. salePriceNoCurrency,
    link:m.linkAnchor.substring(1),

    timestamp: Date.now(),
    marka: 'mango',
}})
debugger


    debugger;

   // await page.waitForSelector('.catalog')

    debugger
  //  await autoScroll(page);

/*     const data = await page.$$eval('.catalog .page li[data-testid]', (productCards) => {
        return productCards.map(productCard => {

            // const imageUrl = productCard.querySelector('.catalog-products .product-card .product-card__image .image-box .product-card__image--item.swiper-slide img').getAttribute('data-srcset')
            // const title = productCard.querySelector('.product-card__title a').getAttribute('title').trim()
            // const priceNew = productCard.querySelector('.product-card__price--new') && productCard.querySelector('.product-card__price--new').textContent.trim().replace('₺', '').replace('TL', '')
            // const longlink = productCard.querySelector('.catalog-products .product-card .product-card__image .image-box a').href
            // const link = longlink.substring(longlink.indexOf("defacto.com.tr/") + 15)
            // const longImgUrl = imageUrl && 'https:' + imageUrl.substring(imageUrl.lastIndexOf('//'), imageUrl.lastIndexOf('.jpg') + 4)
            // const imageUrlshort = imageUrl && longImgUrl.substring(longImgUrl.indexOf("https://dfcdn.defacto.com.tr/") + 29)

            return {
                title: 'mango ' + title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'mango',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    }) */
debugger
    console.log('data length_____', data.length, 'url:', url,process.env.GENDER)


    console.log("process.env.GENDER ")
    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return formatprice
}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}
const uniqify = (array, key) => array.reduce((prev, curr) => prev.find(a => a[key] === curr[key]) ? prev : prev.push(curr) && prev, []);


async function autoScroll(page) {
    page.on("console", (message) => {
      console.log("Message from Puppeteer page:", message.text());
    });
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 100;
        let inc = 0;
  
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
  
          window.scrollBy(0, distance);
          totalHeight += distance;
          inc = inc + 1;
          console.log("inc", inc);
          if (totalHeight >= scrollHeight - window.innerHeight) {
            if (inc === 50) {
              clearInterval(timer);
              resolve();
            }
          } else {
            inc = 0;
          }
        }, 500);
      });
    });
  }
module.exports = { handler, getUrls }


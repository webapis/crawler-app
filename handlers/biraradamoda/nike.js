

async function handler(page, context) {


    const url = await page.url()
debugger
    await page.waitForSelector('.product-card')
 await autoScroll(page)
debugger
    const data = await page.$$eval('.product-card', (productCards) => {
        return productCards.map(document => {

            const imageUrl = document.querySelector('.product-card__hero-image').src
            const title = document.querySelector('.product-card__hero-image').alt
            const priceNew = document.querySelector('[data-testid="product-price-reduced"]') ?document.querySelector('[data-testid="product-price-reduced"]').innerText.replace('₺',''):document.querySelector('[data-testid="product-price"]').innerText.replace('₺','')
            const longlink = document.querySelector('.product-card__link-overlay').href
            const link = longlink.substring(longlink.indexOf("https://www.nike.com/") + 21)

            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://static.nike.com/") + 24)

            return {
                title: 'nike ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'nike',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    console.log('data length_____', data.length, 'url:', url, process.env.GENDER)

debugger
    console.log("process.env.GENDER ")
    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return formatprice
}
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
        }, 200);
      });
    });
  }
async function getUrls(page) {
    const url = await page.url()
    const pageUrls = []
    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
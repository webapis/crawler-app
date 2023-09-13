


async function extractor(page,marka) {
    await autoScroll(page);
    const data = await page.$$eval('.Prd', (productCards,marka) => {
        return productCards.map(document => {
            try {
                const priceNew = Array.from(document.querySelector('.SalesAmount').querySelectorAll('.PPrice')).reverse()[0].innerHTML.replace('TL', '').trim()
                const longlink = document.querySelector('a[data-product').href
                const link = longlink.substring(longlink.indexOf("https://www.addax.com.tr/") + 25)
                const longImgUrl = document.querySelector("img[data-src]").getAttribute('data-src')
                const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf("https://cdn3.sorsware.com/") + 26)//https://cdn3.sorsware.com/
                const title = document.querySelector("img[data-src]").alt
                return {
                    title: marka+' ' + title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka,
                }
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
  
        })
    },marka)

return data

}


const productPageSelector='.PrdContainer'
//const linkSelector='a:not(.Prd a)'
const linkSelector='#MainMenu a'
const linksToRemove=['https://www.addax.com.tr/alt-giyim/','https://www.addax.com.tr/ust-giyim/','https://www.addax.com.tr/dis-giyim/']
const hostname='https://www.addax.com.tr/'
const productItemsSelector='.Prd'
const exclude=[".pdf"]
const postFix =''

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
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
        }, 250);
      });
    });
  }
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname,productItemsSelector,exclude,postFix }


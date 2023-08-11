

const { RequestQueue  } =require ('crawlee');

async function handler(page, context) {
    const { request: { userData: { start } } } = context
    const requestQueue = await RequestQueue.open();
    let data = []
    const url = await page.url()

    let productItems =[]
   
    debugger
    if (start) {
        await page.waitForSelector('#Katalog')
     console.log('start page')
        const productExist = await page.$('.productItem')
        if(productExist){
         productItems = await page.evaluate(() => document.querySelectorAll('.productItem').length)
        }
    if(productItems>20){
        console.log('add next page')
        await requestQueue.addRequest({ url: `${url}?page=2`, userData: { start: false } })
    }
   

    } else if (!start) {
        console.log('next page')
        const productExist = await page.$('.productItem')
        if(productExist){
            productItems = await page.evaluate(() => document.querySelectorAll('.productItem').length)
            const currentPage = url.substring(url.indexOf('='))
            const nextPage = parseInt(url.substring(url.indexOf('=') + 1)) + 1
            const nextUrl = url.replace(currentPage, `=${nextPage}`)
            debugger
            await requestQueue.addRequest({ url: nextUrl, userData: { start: false } })
        }
        debugger
      
    }

    if (productItems > 0) {
        console.log('collecting product items length',productItems)
        data = await page.$$eval('.productItem', (productCards) => {
            return productCards.map(document => {
                    try {
                        const priceNew = document.querySelector('.currentPrice') ? document.querySelector('.currentPrice').textContent.replace(/\n/g, '').replace('₺', '').trim() : document.querySelector('.addPriceDiscount span').textContent.replace('₺', '').trim()
                        const longlink = document.querySelector('a.fl').href
                        const link = longlink.substring(longlink.indexOf("https://www.patirti.com/") + 24)
                        const longImgUrl = document.querySelector('img').src ? document.querySelector('img').src : document.querySelector('img[data-bind]').src
                       // const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf("https://images.patirti.com/") + 27)
                        const title = document.querySelector('m[data-bind]').innerHTML
                        return {
                            title: 'patirti ' + title.replace(/İ/g, 'i').toLowerCase(),
                            priceNew,
                            imageUrl: longImgUrl,// imageUrlshort, // imageUrlshort,
                            link,
        
                            timestamp: Date.now(),
        
                            marka: 'patirti',
        
        
        
                        }
                    } catch (error) {
                        return {error:error.toString(),content:document.innerHTML}
                    }
          
            })//.filter(f=>f.priceNew)
        })


    }


    debugger

    console.log('data length_____', data.length, 'url:', url)

    const formatprice = data.map((m) => {
        return { ...m }
    })

    debugger
    return formatprice.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })






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
        }, 500);
      });
    });
  }




async function getUrls(page) {


    const pageUrls = []

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }


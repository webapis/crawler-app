
async function handler(page, context) {


    const url = await page.url()

    await page.waitForSelector('#ProductPageProductList')
    // onetrust-accept-btn-handler

    const acceptcookies = await page.$('.seg-popup-close')
    if (acceptcookies) {
        await page.click('.seg-popup-close')
    }

    return new Promise((resolve, reject) => {
        try {
            let totalProducts = 0
            let collected = 0
            let inv = setInterval(async () => {

                console.log('collected', collected)

                if (totalProducts>0 && totalProducts === collected) {
                    clearInterval(inv)
                    const data = await page.$$eval('.productItem', (productCards) => {
                        return productCards.map(productCard => {
                            const priceNew = productCard.querySelector('.discountPrice span').textContent.replace(/\n/g, '').trim().replace('₺', '').replace('TL', '').trim()
                            const longlink = productCard.querySelector('.productName a').href
                            const link = longlink.substring(longlink.indexOf("https://www.quzu.com.tr/") + 24)
                            const longImgUrl = productCard.querySelector('img[data-original]') &&  productCard.querySelector('img[data-original]').getAttribute('data-original')
                            //const imageUrlshort = longImgUrl&& longImgUrl.substring(longImgUrl.indexOf('https://www.quzu.com.tr/') + 24)
                            const title = productCard.querySelector('.productName a').innerHTML

                            return {
                                title: 'quzu ' + title.replace(/İ/g,'i').toLowerCase(),
                                priceNew,//:priceNew.replace('.','').replace(',','.').trim(),
                                imageUrl: longImgUrl,
                                link,
                                timestamp: Date.now(),
                                marka: 'quzu',
                  
                            }
                        }).filter(f => f.imageUrl !== null)
                    })

          
                    console.log('data length_____', data.length, 'url:', url)
                    debugger

                    
                    return resolve(data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }}))
             

                } else {
                 
                    await manualScroll(page)

                     totalProducts = await page.evaluate(() => parseInt(document.querySelector('.appliedFilter.FiltrelemeUrunAdet span').innerHTML.replace(/[^\d]/g, '')))
                     collected = await page.evaluate(() => document.querySelectorAll('#ProductPageProductList .productItem').length)
    
                }

            }, 50)
        
        } catch (error) {
            debugger
            return reject(error)
        }
    })
}





async function manualScroll(page) {
    await page.evaluate(async () => {
        var totalHeight = 0;
        var distance = 100;
        let inc = 0
        window.scrollBy(0, distance);
        totalHeight += distance;
        inc = inc + 1
    });
}

async function getUrls(page) {

    const pageUrls = []



    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
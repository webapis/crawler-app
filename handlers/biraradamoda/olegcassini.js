async function handler(page, context) {


    const url = await page.url()


    // // onetrust-accept-btn-handler
    // const productExist = await page.$('.appliedFilter.FiltrelemeUrunAdet span')
    // debugger
    // const acceptcookies = await page.$('.seg-popup-close')
    // if (acceptcookies) {
    //     await page.click('.seg-popup-close')
    // }
        return new Promise((resolve, reject) => {
            try {
                let totalProducts = 0
                let collected = 0
                let inv = setInterval(async () => {



                    console.log('collected', collected,totalProducts)

                    if (totalProducts>0 && totalProducts === collected) {
                              clearInterval(inv)

                              const data = await page.$$eval('.productItem', (productCards) => {
                                return productCards.map(productCard => {
                                    const priceNew = productCard.querySelector('.currentPrice').innerHTML.replace('TL', '').replace(/\n/g,'')
                                    const longlink = productCard.querySelector('.proRowName a[title]').href
                                    const link = longlink.substring(longlink.indexOf("https://www.olegcassini.com.tr/") + 31)
                                     const longImgUrl = productCard.querySelector(".imgInner img").src
                                     const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf("https://www.olegcassini.com.tr/") + 31)
                                    const title = productCard.querySelector('.proRowName a[title]').getAttribute('title')
                                    return {
                                        title: 'olegcassini ' + title.replace(/İ/g,'i').toLowerCase(),
                        
                                        priceNew,
                        
                                       imageUrl: imageUrlshort,
                                      link,
                        
                                        timestamp: Date.now(),
                        
                                        marka: 'olegcassini',
                        
                        
                        
                                    }
                                })
                            })

                            debugger
                            console.log('data length_____', data.length, 'url:', url)
                            debugger

                            const remap =data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
                            return resolve(remap)
                        //  await page.click('.button.js-load-more')


                    } else {

                        await manualScroll(page)
                        totalProducts = await page.evaluate(() =>parseInt(document.querySelector('#katalog > div:nth-child(5) > div:nth-child(2) > div > div').innerHTML.replace(/[^\d]/g,'')))
                        collected = await page.evaluate(() => document.querySelectorAll('.productItem').length)

                    }

                }, 150)
                // clearInterval(inv)
            } catch (error) {
                console.log('error------',error)
                debugger
                return reject(error)
            }
        })
  



}





async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}



async function manualScroll(page) {
    await page.evaluate(async () => {
        var totalHeight = 0;
        var distance = 200;
        let inc = 0
        window.scrollBy(0, distance);
        totalHeight += distance;
        inc = inc + 1
    });
}
module.exports = { handler, getUrls }


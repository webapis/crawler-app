
const { RequestQueue  } =require ('crawlee');
async function handler(page, context) {
    const { request: { userData: { start } } } = context
    const requestQueue = await RequestQueue.open();
    const url = await page.url()
    if (start) {
        const total = await page.evaluate(() => parseInt(document.querySelector('.filter-pagination').innerHTML.replace(/[^\d]/g, '')))
        debugger
        const updatedUrl = url + `?sort=stock&image-size=small&image=model&offset=0&page-size=${total}`
    
        debugger;
        requestQueue.addRequest({ url: updatedUrl, userData: { start: false } })
        return []
    } else {
        debugger
        // await page.waitForSelector(() => {
        //     const productCounter = document.querySelectorAll('.product-item').length
        //     const total = parseInt(document.querySelector('.filter-pagination').innerHTML.replace(/[^\d]/g, ''))

        //     return total === productCounter
        // })

        // onetrust-accept-btn-handler

        const acceptcookies = await page.$('#onetrust-accept-btn-handler')
        if (acceptcookies) {
            await page.click('#onetrust-accept-btn-handler')
        }
        await autoScroll(page)

        const data = await page.$$eval('.product-item', (productCards) => {
            return productCards.map(productCard => {
                try {
                    const priceNew = productCard.querySelector('.price.regular') ? productCard.querySelector('.price.regular').innerHTML.replace('TL', '').trim() : ''
                    const longlink = productCard.querySelector('.item-heading a') ? productCard.querySelector('.item-heading a').href : ''
                    const link = longlink.substring(longlink.indexOf("https://www2.hm.com/tr_tr/") + 26)
                    const longImgUrl = productCard.querySelector('[data-src]').getAttribute('data-src')
                    const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf("//lp2.hm.com/hmgoepprod?set=source[") + 35)
                    const title = productCard.querySelector('.item-heading a') ? productCard.querySelector('.item-heading a').textContent.replace(/[\n]/g, '').trim() : ''
    
                    return {
                        title: 'hm ' + title.replace(/İ/g, 'i').toLowerCase(),
                        priceNew: priceNew.replace('&nbsp;', '.'),//:priceNew.replace('.','').replace(',','.').trim(),
                        imageUrl: imageUrlshort,
                        link,
                        timestamp: Date.now(),
                        marka: 'hm',
                    }
                } catch (error) {
                    return {
                        error:error.toString(),content:document.innerHTML
                    }
                }
            
            })
        })
        console.log('data length_____', data.length, 'url:', url)



        return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })




    }

}




async function autoScroll(page) {
    await page.evaluate(async () => {


        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                var toth = 7775
                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}

async function getUrls(page) {

    const pageUrls = []



    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
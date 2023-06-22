
async function handler(page, context) {
    const { request: { userData: {  } } } = context
    debugger;


    const url = await page.url()

    debugger;

    await page.waitForSelector('.ProductList', { timeout: 120000 })
    await autoScroll(page);

    debugger
    const data = await page.$$eval('.Prd', (productCards) => {
        return productCards.map(productCard => {

            const longImgUrl = productCard.querySelector('a[data-product] img').getAttribute('data-src') ? productCard.querySelector('a[data-product] img').getAttribute('data-src') : productCard.querySelector('a[data-product] img').src
            const title = productCard.querySelector('a[data-product] img').alt
            const priceNew = productCard.querySelector('.PriceArea').querySelectorAll('span').length === 1 ? productCard.querySelector('.PriceArea').querySelectorAll('span')[0].innerHTML.trim().replace('₺', '').trim() : productCard.querySelector('.PriceArea').querySelectorAll('span')[1].innerHTML.trim().replace('TL', '').trim()
            const longlink = productCard.querySelector('a[data-product]').href
            const link = longlink.substring(longlink.indexOf("https://www.oxxo.com.tr/") + 24)

            const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf("https://cdn.sorsware.com/") + 25)
            return {
                title: 'oxxo ' + title.replace(/İ/g,'i').toLowerCase(),

                priceNew,

                imageUrl: imageUrlshort,
                link,

                timestamp: Date.now(),

                marka: 'oxxo',



            }
        })//.filter(f => f.imageUrl !== null)
    })



    //----------

    console.log('data length_____', data.length, 'url:', url)




    return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}

async function autoScroll(page) {

    await page.evaluate(async () => {


        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(async () => {

                var scrollHeight = document.body.scrollHeight;

                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve(true);
                }
            }, 150);
        });
    });
}
module.exports = { handler, getUrls }










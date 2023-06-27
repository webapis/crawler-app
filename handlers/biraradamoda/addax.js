

const { Dataset  } =require ('crawlee');
async function handler(page, context) {

    const url = await page.url()

    debugger;

    await page.waitForSelector('.PrdContainer')
    await autoScroll(page);

    debugger
    const data = await page.$$eval('.Prd', (productCards) => {
        return productCards.map(productCard => {
            const priceNew = productCard.querySelector('.PPrice').innerHTML.replace('TL', '').trim()//.replace(',','.')
            const longlink = productCard.querySelector('a[data-product').href
            const link = longlink.substring(longlink.indexOf("https://www.addax.com.tr/") + 25)
            const longImgUrl = productCard.querySelector("img[data-src]").getAttribute('data-src')
            const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf("https://cdn3.sorsware.com/") + 26)//https://cdn3.sorsware.com/
            const title = productCard.querySelector("img[data-src]").alt
            return {
                title: 'addax ' + title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'addax',
            }
        })
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
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;

                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 150);
        });
    });
}
module.exports = { handler, getUrls }


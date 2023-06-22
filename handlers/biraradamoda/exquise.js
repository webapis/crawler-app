
async function handler(page, context) {
    const { request: { userData: { } } } = context
    debugger;
    const url = await page.url()

    await page.waitForSelector('.infinite-scroll-component__outerdiv')

    await autoScroll(page)
    debugger;


    const data = await page.$$eval('[data-id]', (productCards) => {
        return productCards.map(document => {
            const title = document.querySelector('h3[class^="style_nameContainer"]').innerText.trim()
            const img = document.querySelector('div[class^="style_imageContainer"] img').src
           // const img = document.querySelector('[srcset]') && document.querySelector('[srcset]').getAttribute('srcset').split(',').reverse()[0].trim()
            const link = document.querySelector('div[class^="style_imageContainer"] a').href
            const priceNew = Array.from(document.querySelector('div[class^="style_detailContainer"]').querySelectorAll('div')).map(m => m.innerText).reverse()[0]
            return {
                title: 'exquise ' + title.replace(/İ/g, 'i').toLowerCase().replaceAll('-', ' '),
                priceNew: priceNew.replace('₺', ''),//.replace(',','.'),
                imageUrl: img && img.substring(img.indexOf('https://cdn.myikas.com/') + 23),
                link: link.substring(link.indexOf('https://exquise.com/') + 20),
                timestamp: Date.now(),
                marka: 'exquise',

            }
        })
    })
    console.log('data length_____', data.length, 'url:', url)
    debugger

    return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })
}





async function autoScroll(page) {
    await page.evaluate(async () => {


        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                const items = document.querySelectorAll('[data-id]').length
                const total = parseInt(document.querySelector('div[class^="style_productCount"]').innerText.replace(/[^\d]/g, ''))

                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (items >= total) {
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

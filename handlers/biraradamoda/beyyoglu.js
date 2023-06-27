
async function handler(page, context) {


    const url = await page.url()

        await page.waitForSelector('.js-product-wrapper.product-item')
        //  await autoScroll(page)
        debugger;
        const data = await page.$$eval('.js-product-wrapper.product-item', (productCards) => {
            return productCards.map(productCard => {

                const img = productCard.querySelector('.product-item__image.js-product-item-image a img').src
                const title = productCard.querySelector('.product-item__image.js-product-item-image a img').alt
                const priceNew = productCard.querySelector('pz-price').innerHTML.replace('TL', '').trim()//.replace(',','.')
                const link = productCard.querySelector('.product-item__image.js-product-item-image a').href

                return {
                    title: 'beyyoglu ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl: img.substring(img.indexOf('https://179a38.cdn.akinoncloud.com/products/') + 44),
                    link: link.substring(link.indexOf('https://www.beyyoglu.com/') + 25),
                    timestamp: Date.now(),
                    marka: 'beyyoglu',

                }
            }).filter(f => f.priceNew !== null)
        })


        debugger;
        console.log('data length_____', data.length, 'url:', url)

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
    const url = await page.url()
    const modURL = url.substring(0, url.lastIndexOf('/'))
    debugger;
    await page.waitForSelector('pz-pagination')
    const productCount = await page.evaluate(() => parseInt(document.querySelector('pz-pagination').getAttribute('total')))
    debugger;
    const totalPages = Math.ceil(productCount / 24)
    const pageUrls = []
    pageUrls.push(`${modURL}?page=` + totalPages)
    let pagesLeft = totalPages
    //  for (let i = 2; i <= totalPages; i++) {

    //      pageUrls.push(`${modURL}?page=` + i)
    //     --pagesLeft

    //  }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
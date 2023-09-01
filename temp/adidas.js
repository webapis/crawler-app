
async function handler(page) {


    const url = await page.url()

    await page.waitForSelector('.plp-grid___hCUwO')
    await autoScroll(page)
    debugger;
    const data = await page.$$eval('.grid-item', (productCards) => {
        return productCards.map(productCard => {

            const longImage = productCard.querySelector('.glass-product-card__assets-link img') && productCard.querySelector('.glass-product-card__assets-link img').srcset.split('w,')[5].replace('\n', '').replace('766w', '').trim()
            const title = productCard.querySelector('.glass-product-card__assets-link img') && productCard.querySelector('.glass-product-card__assets-link img').alt
            const priceNew = productCard.querySelector('[ data-auto-id="gl-price-item"] div') && productCard.querySelector('[ data-auto-id="gl-price-item"] div').innerHTML.replace('TL', '').trim()
            const link = productCard.querySelector('[data-auto-id="glass-hockeycard-link"]').href

            return {
                title: 'adidas '+ title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl: longImage.substring(longImage.indexOf('https://assets.adidas.com/images/') + 33),
                link: link.substring(link.indexOf('https://www.adidas.com.tr/tr/') + 29),
                timestamp: Date.now(),
                marka: 'adidas'
            }
        }).filter(f => f.priceNew !== null)
    })

    console.log('data length_____', data.length, 'url:', url)


    return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
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
            }, 100);
        });
    });
}
async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('[data-auto-id="pagination-pages-container"]')
    const totalPages = await page.$eval('[data-auto-id="pagination-pages-container"]', element => parseInt(element.innerHTML.replace(/[^\d]/i, '').trim()))

    const pageUrls = []

    let pagesLeft = totalPages
    let countProds = 0
    for (let i = 2; i <= totalPages; i++) {

        countProds = countProds + 48

        pageUrls.push(`${url}?start=` + countProds)
        --pagesLeft


    }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
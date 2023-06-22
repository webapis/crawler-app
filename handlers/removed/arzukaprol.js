const Apify = require('apify');

async function handler(page, context) {
    const { request: { userData: { subcategory, category, start } } } = context
    debugger;
    const url = await page.url()
    await page.waitForSelector('#gf-products')
    debugger;
    const data = await page.$$eval('#gf-products .grid__item', (productCards, _subcategory, _category) => {
        return productCards.map(productCard => {


            const title = productCard.querySelector('.grid-view-item__link.grid-view-item__image-container.full-width-link span').textContent.trim()
            const priceNew = productCard.querySelector('.price-item.price-item--regular').textContent.replace('₺\n', '').trim()
            const longlink = productCard.querySelector('.grid-view-item__link.grid-view-item__image-container.full-width-link').href
            const link = longlink.substring(longlink.indexOf('https://arzukaprol.com/') + 23)
            const longImgUrl = productCard.querySelector('.product-card img').currentSrc//.split(',')[2]
            const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf('https://cdn.shopify.com/s/files/1/0342/2348/9163/products/') + 58)

            return {
                title,
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'arzukaprol',
                subcategory: _subcategory,
                category: _category
            }
        })//.filter(f => f.imageUrl !== null)
    }, subcategory, category)

    console.log('data length_____', data.length, 'url:', url)


    const nextPageExists = await page.$('.btn.btn--tertiary.btn--narrow')

    if (nextPageExists) {
        debugger;

        const isNotDisabled = await page.evaluate(() => document.querySelectorAll('.btn.btn--tertiary.btn--narrow')[1].disabled)
        debugger;
        if (isNotDisabled === undefined) {
            debugger;
            if (start) {

                const nextPage = `${url}?page=2`
                const requestQueue = await Apify.openRequestQueue();

                requestQueue.addRequest({ url: nextPage, userData: { start: false, subcategory, category } })
                debugger;
            } else {
                debugger;
                const pageUrl = url.slice(0, url.lastIndexOf("=") + 1)
                const pageNumber = parseInt(url.substr(url.indexOf("=") + 1)) + 1
                const nextPage = pageUrl + pageNumber
                const requestQueue = await Apify.openRequestQueue();
                debugger;
                requestQueue.addRequest({ url: nextPage, userData: { start: false, subcategory, category } })
                debugger;
            }


        } else {
            debugger;
        }





    } else {
        debugger;
    }

    return data
}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}
module.exports = { handler, getUrls }
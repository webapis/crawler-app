
async function handler(page, context) {
    const { request: { userData: { subcategory, category } } } = context
    debugger;
    const url = await page.url()

    await page.waitForSelector('.products.list.items.product-items')

    await autoScroll(page)
    debugger;


    const data = await page.$$eval('.item.product.product-item', (productCards, _subcategory, _category, _opts) => {
        return productCards.map(productCard => {
            const title = productCard.querySelector('.product-item-link').innerHTML
            const img = productCard.querySelector('.product-image-photo').src
            const priceNew = productCard.querySelector('.special-price span') ? productCard.querySelector('.special-price span').innerHTML.replace('₺', '') : productCard.querySelector('.price.parent').innerHTML.replace('₺', '')
            const link = productCard.querySelector('.product-item-info a') && productCard.querySelector('.product-item-info a').href

            return {
                title,

                priceNew,
                imageUrl: img && img.substring(img.indexOf('https://img-dagi.mncdn.com/mnpadding/') + 37),
                link: link && link.substring(link.indexOf('https://www.dagi.com.tr/') + 24),
                timestamp: Date.now(),
                marka: 'dagi',
                subcategory: _subcategory,
                category: _category
            }
        })
    }, subcategory, category)
    console.log('data length_____', data.length, 'url:', url)
    return data

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


/*

async function handler(page, context) {
    const { request: { userData: { subcategory, category } } } = context
    debugger;
    const url = await page.url()

    await page.waitForSelector('.toolbar-amount')
    const totalItems = await page.$eval('.toolbar-amount', element => parseInt(element.textContent.replaceAll('\n', '').trim().replace(/[^\d]/g, '')))
    debugger;
    return new Promise((resolve, reject) => {
        try {
            let inv = setInterval(async () => {
                const totalLoaded = await page.$$eval('.item.product.product-item', elements => elements.length)
                debugger;
                if (totalLoaded < totalItems) {
                    debugger;
                  
                    await autoScroll(page)
                    debugger;
                } else {
                    debugger;
                    clearInterval(inv)
                    const data = await page.$$eval('.product-item', (productCards, _subcategory, _category, _opts) => {
                        return productCards.map(productCard => {
                            const title = productCard.querySelector('.product-image-photo').alt
                            const img= productCard.querySelector('.product-image-photo').src
                            const priceNew =productCard.querySelector('.special-price span')?productCard.querySelector('.special-price span').innerHTML.replace('₺',''): productCard.querySelector('.price.parent').innerHTML.replace('₺','')
                            const link = productCard.querySelector('.product.photo.product-item-photo').href

                            return {
                                title,
                                priceNew,
                                imageUrl: img,
                                link,
                                timestamp: Date.now(),
                                marka: 'dagi',
                                subcategory: _subcategory,
                                category: _category
                            }
                        })
                    }, subcategory, category)
                    console.log('data length_____', data.length, 'url:', url)
                    return resolve(data)

                }

            }, 3000)
        } catch (error) {
            return reject(error)
        }
    })
}
*/
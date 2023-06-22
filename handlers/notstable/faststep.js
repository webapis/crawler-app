
async function handler(page, context) {
    const { request: { userData: { subcategory, category } } } = context

    const url = await page.url()

    await page.waitForSelector('.main-products.product-grid')


    return new Promise((resolve, reject) => {
        try {
            let inv = setInterval(async () => {

                const nonelesft = await page.$('.ias-noneleft')

                if (nonelesft) {
                    debugger;
                    clearInterval(inv)
                    const data = await page.$$eval('.product-layout', (productCards, _subcategory, _category, _opts) => {
                        return productCards.map(element => {
                            const title = element.querySelector('.image a.product-img img').alt.trim()
                            const img = element.querySelectorAll('.image a.product-img img')[0].getAttribute('data-srcset').split('x,')[1].replace('2x', '').trim()
                            const priceNew = element.querySelector('.price-tax') ? element.querySelector('.price-tax').textContent.replace('TL', '').replace('SEPETTE', '').trim() : element.querySelector('.price-normal').innerHTML.replace('TL', '')
                            const link = element.querySelector('.image a.product-img').href

                            return {
                                title,
                                priceNew,
                                imageUrl: img.substring(img.indexOf('https://cdn.faststep.com.tr?img=catalog/urunresim/')+50),
                                link:link.substring(link.indexOf('https://www.faststep.com.tr/')+28),
                                timestamp: Date.now(),
                                marka: 'faststep',
                                subcategory: _subcategory,
                                category: _category
                            }
                        })
                    }, subcategory, category)
                    debugger;
                    console.log('data length_____', data.length, 'url:', url)
                    return resolve(data)

                } else {

              
              
                    await manualScroll(page)
                  
                }

            }, 100)
        } catch (error) {
            debugger;
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
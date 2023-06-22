
async function handler(page, context) {
    const { request: { userData: { } } } = context
    
    await page.waitForSelector('#products')
    
    const url = await page.url()

    const data = await page.$$eval('.products__item', (productCards) => {
        return productCards.map(document => {
            const imageUrl = document.querySelector('[data-original]').getAttribute('data-original')
            const title = document.querySelector('a[title]').getAttribute('title')
            const priceNew = document.querySelector(".product__price.-actual").textContent.replace('TL', '').replace(/\n/g, '').trim()
            const longlink = document.querySelector('a[title]').href
            const link = longlink.substring(longlink.indexOf("https://www.network.com.tr/") + 27)
            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://img-network.mncdn.com/mnresize/") + 39)
            return {
                title: 'network ' + title.replace(/İ/g, 'i').toLowerCase().replaceAll('-',' '),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'network',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })
    
    console.log('data length_____', data.length, 'url:', url)



    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return formatprice

}

async function getUrls(page) {
    
    const url = await page.url()
    await page.waitForSelector('.js-total-products-count')
    await page.waitForSelector('.js-per-page-products-count')
    const productCount = await page.evaluate(() => {
        return parseInt(document.querySelector('.js-total-products-count').innerText)
    })
    const productPerPage = await page.evaluate(() => {
        return parseInt(document.querySelector('.js-per-page-products-count').innerText)
    })
    
    const totalPages = Math.ceil(productCount / productPerPage)
    const pageUrls = []
    
    if (totalPages > 1) {
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?page=` + i)
            --pagesLeft
        }
    }


    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
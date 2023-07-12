
async function handler(page, context) {


    const url = await page.url()

    await page.waitForSelector('.product__listing')


    const data = await page.$$eval('.js-product-list-item', (productCards) => {
        return productCards.map(document => {
                try {
                    const imageUrl = document.querySelectorAll('a img[data-src]').length >0? document.querySelectorAll('a img[data-src]')[0].getAttribute('data-src'):null
                    const title = document.querySelector('.product__listing--content a').text.trim()
                    const priceNew = document.querySelector('.product__listing--basket-price span')? document.querySelector('.product__listing--basket-price span').innerText.replace('TL','').trim():(document.querySelector('.product__listing--price ins')?document.querySelector('.product__listing--price ins').innerText.replace('TL','').trim() :document.querySelector('.lone-price').innerText.replace('TL','').trim() )
                    const longlink = document.querySelector('.product__listing--content a').href
                    const link = longlink.substring(longlink.indexOf("https://www.pierrecardin.com.tr") + 32)
                    const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://aydinli-pc.b-cdn.net/") + 29)
                    return {
                        title: 'pierrecardin ' + title.replace(/İ/g, 'i').toLowerCase(),
                        priceNew,
                        imageUrl: imageUrlshort,
                        link,
                        timestamp: Date.now(),
                        marka: 'pierrecardin',
                    }   
                } catch (error) {
                    return {error:error.toString(),content:document.innerHTML}
                }
      
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    console.log('data length_____', data.length, 'url:', url, process.env.GENDER)

    debugger
    console.log("process.env.GENDER ")
    const mapgender = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })

    return mapgender
}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.entity__count span')
    const productCount = await page.evaluate(() => parseInt(document.querySelector('.entity__count span').innerText.replace(/[^\d]/g, '')))
    const totalPages = Math.ceil(productCount / 24)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
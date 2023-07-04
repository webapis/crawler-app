
async function handler(page, context) {

    debugger
    const url = await page.url()

    await page.waitForSelector('.item-grid')
    debugger

    const data = await page.$$eval('.product', (productCards) => {
        return productCards.map(document => {
            const obj = document.querySelector('.product__inside__name')
            // const imageUrl = productCard.querySelector('.catalog-products .product-card .product-card__image .image-box .product-card__image--item.swiper-slide img').getAttribute('data-srcset')
            const title = obj
            // const priceNew = productCard.querySelector('.product-card__price--new') && productCard.querySelector('.product-card__price--new').textContent.trim().replace('₺', '').replace('TL', '')
            // const longlink = productCard.querySelector('.catalog-products .product-card .product-card__image .image-box a').href
            // const link = longlink.substring(longlink.indexOf("defacto.com.tr/") + 15)
            // const longImgUrl = imageUrl && 'https:' + imageUrl.substring(imageUrl.lastIndexOf('//'), imageUrl.lastIndexOf('.jpg') + 4)
            // const imageUrlshort = imageUrl && longImgUrl.substring(longImgUrl.indexOf("https://dfcdn.defacto.com.tr/") + 29)

            return {
                title, //'hotiç ' + title.replace(/İ/g, 'i').toLowerCase(),
                // priceNew,
                // imageUrl: imageUrlshort,
                //  link,
             //   timestamp: Date.now(),
              //  marka: 'hotiç',
            }
        })//.filter(f => f.imageUrl !== null && f.title.length > 5)
    })
    debugger
    console.log('data length_____', data.length, 'url:', url, process.env.GENDER)


    console.log("process.env.GENDER ")
    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return formatprice
}

async function getUrls(page) {
    const url = await page.url()
    const pageUrls = []
    const nextPageExists = await page.$('.pagination')
    if (nextPageExists) {
        const totalPages = await page.evaluate(() => Math.max(Array.from(document.querySelectorAll('.pagination a')).map(m => m.innerHTML).filter(Number)))


        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {



            pageUrls.push(`${url}?pagenumber=` + i)
            --pagesLeft


        }
    }



    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
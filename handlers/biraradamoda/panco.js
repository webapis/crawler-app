

async function handler(page, context) {
    const { request: { userData: { } } } = context

    const url = await page.url()

    await page.waitForSelector('.js-list-products')


    const data = await page.$$eval('.product-item-box', (productCards) => {
        return productCards.map(productCard => {

            const imageUrl = productCard.querySelector('.product-item-image').src
             const title = productCard.querySelector('.product-name').innerHTML.replace(/\n/g, '').trim()
             const priceNew = productCard.querySelector('.product-sale-price').innerHTML.replace(/\n/g, '').replace("TL",'').trim()
            const longlink = productCard.querySelector('.product-item-info a').href
            const link = longlink.substring(longlink.indexOf("https://www.panco.com.tr/") + 25)
            // const longImgUrl = imageUrl && 'https:' + imageUrl.substring(imageUrl.lastIndexOf('//'), imageUrl.lastIndexOf('.jpg') + 4)
            const imageUrlshort = imageUrl.substring(imageUrl.indexOf("https://cdn-panco.akinon.net/products/") + 38)

            return {
                title: 'panco ' + title.replace(/İ/g,'i').toLowerCase(),
                 priceNew,
                 imageUrl: imageUrlshort,
                 link,
                timestamp: Date.now(),
                marka: 'panco',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 10)
    })
debugger
    console.log('data length_____', data.length, 'url:', url,process.env.GENDER)


    console.log("process.env.GENDER ")
    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return formatprice
}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.js-pagination')
    const totalPages = await page.evaluate(()=>document.querySelectorAll(".js-pagination")[document.querySelectorAll(".js-pagination").length-1])
    
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?page=` + i)
        --pagesLeft

    }

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
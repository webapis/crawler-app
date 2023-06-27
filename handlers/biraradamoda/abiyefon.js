
async function handler(page, context) {


    const url = await page.url()

    await page.waitForSelector('.products')


    const data = await page.$$eval('.products li', (productCards) => {
        return productCards.map(productCard => {
            const priceNew = productCard.querySelector("span[data-price]") ? productCard.querySelector("span[data-price]").getAttribute('data-price').replace(/\n/g, '').trim().replace('₺', '').replace('TL', '').trim() : productCard.outerHTML
            const longlink = productCard.querySelector('.product-link') ? productCard.querySelector('.product-link').getAttribute('data-purehref') : null
            const link = longlink.substring(longlink.indexOf("/") + 1)
            const longImgUrl = productCard.querySelector('.product-list-image') ? productCard.querySelector('.product-list-image').src : productCard.outerHTML
            const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf('https://www.abiyefon.com/') + 25)
            const title = productCard.querySelector(".img-options img") ? productCard.querySelector(".img-options img").alt : productCard.outerHTML
            return {
                title: 'abiyefon ' + title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'abiyefon'
            }
        }).filter(f => f.imageUrl !== null  && f.link !==null)
    })

    console.log('data length_____', data.length, 'url:', url)

    const formatprice = data.map((m) => {
        return { ...m,title:m.title+" _"+process.env.GENDER }
    })



    return formatprice

}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.count-info-text strong')
    const productCount = await page.$eval('.count-info-text strong', element => parseInt(element.textContent))
    const totalPages = Math.ceil(productCount / 100)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
























// const data = await page.$$eval('.products li', (productCards, _subcategory, _category, _opts) => {
//     return productCards.map(productCard => {
//         const priceNew = productCard.querySelector("span[data-price]") ? productCard.querySelector("span[data-price]").getAttribute('data-price').replace(/\n/g, '').trim().replace('₺', '').replace('TL', '').trim() : productCard.outerHTML
//         const longlink = productCard.querySelector('.product-link') ? productCard.querySelector('.product-link').getAttribute('data-purehref') : productCard.outerHTML
//         const link = longlink.substring(longlink.indexOf("/") + 1)
//         const longImgUrl = productCard.querySelector('.product-list-image') ? productCard.querySelector('.product-list-image').src : productCard.outerHTML
//         const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf('https://www.abiyefon.com/') + 25)
//         const title = productCard.querySelector(".img-options img") ? productCard.querySelector(".img-options img").alt : productCard.outerHTML
//         return {
//             title: 'abiyefon ' + title + (_opts.keyword ? (title.toLowerCase().includes(_opts.keyword) ? '' : ' ' + _opts.keyword) : ''),
//             priceNew,
//             imageUrl: imageUrlshort,
//             link,
//             timestamp: Date.now(),
//             marka: 'abiyefon',
//             subcategory: _subcategory,
//             category: _category
//         }
//     }).filter(f => f.imageUrl !== null)
// }, subcategory, category, opts)
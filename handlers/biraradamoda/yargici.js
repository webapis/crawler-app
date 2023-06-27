


async function handler(page, context) {

    debugger;
//close-button-1545222288830

    const url = await page.url()

    debugger;

    await page.waitForSelector('.product-list-container')
   // await autoScroll(page);

    debugger
    const data = await page.$$eval('.product-box-container', (productCards) => {
        return productCards.map(productCard => {
            const priceNew = productCard.querySelector('.d-block.product-box-prices.product-box-price.pl-1.pr-2.text-black').textContent.replace(/\n/g, '').replace('TL', '').trim()
            const longlink = productCard.querySelector('.product-box-image-container').href
            const link = longlink.substring(longlink.indexOf("https://www.yargici.com/") + 24)
            const longImgUrl = productCard.querySelector('[data-original]').getAttribute('data-original')
            const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf("https://img-incommerce-yargici.mncdn.com/") + 41)
            const title = productCard.querySelector('.product-box-zoom-image').alt
            return {
                title: 'yargici ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,//:priceNew.replace('.','').replace(',','.').trim(),
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'yargici',

            }
        })
    })



    //----------

    console.log('data length_____', data.length, 'url:', url)


    return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })
}

async function getUrls(page) {

    const url = await page.url()

    const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.pager-container .individual-page a')).map(m=> m.innerHTML).filter(Number).map(m=>parseInt(m))))

    const pageUrls = []
debugger
    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?pagenumber=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}


module.exports = { handler, getUrls }


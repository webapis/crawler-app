const Apify = require('apify');

async function handler(page, context) {
    const { request: { userData: {  } } } = context
    debugger;
    const url = await page.url()
    await page.waitForSelector('.product-list-cards')

    await page.waitForSelector('.product-item')

    debugger;
    const data = await page.$$eval('.product-item', (items) => {

        return items.map(document => {
            let productTitle = document.querySelector('.product-title').textContent
            let productDesc = document.querySelector('.product-desc').textContent
            const priceNew = document.querySelector('.price')? document.querySelector('.price').innerText.replace('TL', '').trim():document.querySelector('.ins-product-price').innerText.replace('TL', '')
            const longlink = document.querySelector('.product-card-info').href
            const link = longlink.substring(longlink.indexOf('https://www.mavi.com/') + 21)
            const longImgUrl = document.querySelector('.swiper-slide').querySelector('a img').getAttribute('data-main-src')
            const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf('//sky-static.mavi.com/') + 22)

            return {
                title: 'mavijeans ' + productTitle.replace(/\n/g, '').trim() + ' ' + productDesc.replace(/\n/g, '').trim(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'mavijeans',

            }
        })
    });

    debugger

    console.log('data length_____', data.length, 'url:', url)

    return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })


}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.right-menu-item.product-number')
    const productCount = await page.$eval('.right-menu-item.product-number', element => parseInt(element.innerText.replace(/[^\d]/g, '')))
    const totalPages = Math.ceil(productCount / 24)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}


module.exports = { handler, getUrls }
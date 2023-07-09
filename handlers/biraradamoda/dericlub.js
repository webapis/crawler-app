

const { RequestQueue } = require('crawlee');
async function handler(page, context) {
    const { request: { userData: { start, detailPage } } } = context
    const requestQueue = await RequestQueue.open();
    const url = await page.url()
    debugger
    if (start) {
        debugger
        await page.waitForSelector('#ProductPageProductList')
        await page.waitForSelector('.ItemOrj')
        const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.pageBorder a')).map(m => m.innerHTML.replace(/[^\d]/g, '')).filter(Number)))
        // const totalPages = Math.ceil(productCount / 60)
        const pageUrls = []

        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {

            //pageUrls.push(`${url}?sayfa=` + i)
            //--pagesLeft
            debugger
            await requestQueue.addRequest({ url: `${url}?sayfa=` + i, userData: { start: false } })
        }


        const data = await page.$$eval('.productItem', (productCards) => {
            return productCards.map(productCard => {
                const longlink = productCard.querySelector('.detailLink.detailUrl').href
                return {
                    link: longlink,
                }
            }).filter(f => f.link !== null)
        })
        for (let url of data) {

            await requestQueue.addRequest({ url: url.link, userData: { start: false, detailPage: true } })
        }
        return []
    }
    if (detailPage) {

        debugger
        await page.waitForSelector('#ProductDetailMain')
        debugger
        const data = await page.evaluate(() => {
            try {
                const renk = document.querySelector('.size_box.selected').innerHTML.replace('/', '-')
                return [{
                    title: 'dericlub ' + document.querySelector('.ProductName span').textContent.replaceAll('\n', '').toLowerCase() + ' ' + renk,
                    priceNew: document.querySelector('.spanFiyat').textContent.replace('₺', ''),
                    imageUrl: document.querySelector('#imgUrunResim').src,
                    link: location.href,
                    timestamp: Date.now(),
                    marka: 'dericlub',
                }]
            } catch (error) {
                return [{ error: error.toString(), content: document.innerHTML }]
            }

        })
        debugger
        console.log('data length_____', data.length, 'url:', url, process.env.GENDER)
        return data.map((m) => { return { ...m, title: m.title + " _" + process.env.GENDER } })
    } else {

        await page.waitForSelector('#ProductPageProductList')
        await page.waitForSelector('.ItemOrj')

        const data = await page.$$eval('.productItem', (productCards) => {
            return productCards.map(productCard => {
                const longlink = productCard.querySelector('.detailLink.detailUrl').href
                return {
                    link: longlink,
                }
            }).filter(f => f.link !== null)
        })

        for (let url of data) {
            debugger
            await requestQueue.addRequest({ url: url.link, userData: { start: false, detailPage: true } })
        }
        return []
    }

}

async function getUrls(page) {

    // const url = await page.url()
    //  await page.waitForSelector('.appliedFilter.FiltrelemeUrunAdet span')
    //  const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.appliedFilter.FiltrelemeUrunAdet span')).map(m => m.innerHTML.replace(/[^\d]/g, '')).filter(Number)))
    // const totalPages = Math.ceil(productCount / 60)
    const pageUrls = []

    // let pagesLeft = totalPages
    // for (let i = 2; i <= totalPages; i++) {

    //     pageUrls.push(`${url}?sayfa=` + i)
    //     --pagesLeft


    // }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
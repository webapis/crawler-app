


async function handler(page) {



    await page.waitForSelector('.list-content')

    await autoScroll(page)
    debugger
    const data = await page.$$eval('.product-item-box', (productCards) => {
        return productCards.map(document => {

            const title = document.querySelector('.product-name a').innerText
            const img= document.querySelector('.product-item-image').getAttribute('data-src')
            const priceNew =document.querySelector('.product-sale-price').innerText.replace('TL','').trim()
            const link = document.querySelector('.product-name a').href

            return {
                title: 'desa '+title.replace(/İ/g,'i').replaceAll('-',' ').toLowerCase(),
                priceNew,//:priceNew.replace(',','.'),
                imageUrl: img.substring(img.indexOf('https://14231c.cdn.akinoncloud.com/')+35),
                link:link.substring(link.indexOf('https://www.desa.com.tr/')+24),
                timestamp: Date.now(),
                marka: 'desa',

            }
        })
    })



    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })

debugger
    return formatprice




}





async function autoScroll(page) {
    await page.evaluate(async () => {


        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                const range = Array.from(document.querySelector('.js-pagination-count.pagination-info div').innerText.split(' ')).filter(Number)
                const total = range[0]
                const collected = range[1]
                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (total === collected) {
                    clearInterval(timer);
                    resolve();
                } else {
                    document.querySelector('.js-show-more.list-show-more').click()
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

async function handler(page, context) {


    const url = await page.url()

    await page.waitForSelector('.js-product-list-container')
debugger
    await autoScroll(page)
    debugger
    const data = await page.$$eval('.js-product-list-item', (productCards) => {
        return productCards.map(document => {
            const imageUrl =document.querySelector('.js-product-list-item img[data-src]') && document.querySelector('.js-product-list-item img[data-src]').getAttribute('data-src')
            const title = document.querySelector('.product__name a').innerText
            const priceNew = document.querySelector('.product__listing--basket-price span').innerText.replace('TL','').trim()
            const longlink = document.querySelector('.product__name a').href
            const link = longlink.substring(longlink.indexOf('https://tr.uspoloassn.com/') + 26)
            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://aydinli-polo.b-cdn.net/") +31)

            return {
                title: 'uspoloassn ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'uspoloassn',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    console.log('data length_____', data.length, 'url:', url, process.env.GENDER)


    console.log("process.env.GENDER ")
    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


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

                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.page-list-more')
    const productCount= await page.evaluate(()=>Array.from(document.querySelectorAll('.page-list-more p span')).map(m=>m.innerText.replace(/[^\d]/g,'')).reverse()[0]) 
    const totalPages = Math.ceil(productCount / 24)
    const pageUrls = []
    if (totalPages > 1) {
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {

            pageUrls.push(`${url}?page=` + i)
            --pagesLeft


        }
    }


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
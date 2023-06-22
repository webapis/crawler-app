
async function handler(page, context) {
    const { request: { userData: { } } } = context

    const url = await page.url()

    await page.waitForSelector('.product-list')
    await autoScroll(page)
    const data = await page.$$eval('.product-item', (productCards) => {
        return productCards.map(document => {
            const imageUrl = document.querySelector('.image-link img').src
            const title = document.querySelector('.image-link img').alt
            const priceNew = document.querySelector('.last-price').innerText
            const longlink = document.querySelector('.image-link').href
            const link = longlink.substring(longlink.indexOf("https://www.centone.com.tr/") + 27)
            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://www.centone.com.tr/") + 27)
            return {
                title: 'centone ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'centone',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    console.log('data length_____', data.length, 'url:', url, process.env.GENDER)
    console.log("process.env.GENDER ")
    debugger
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
    const hasMorePges = await page.$('.pagination a')
    const pageUrls = []
    if (hasMorePges) {
        const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.pagination a')).map(m => m.innerText).filter(Number)))

        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {

            pageUrls.push(`${url}?sayfa=` + i)
            --pagesLeft


        }
    }


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
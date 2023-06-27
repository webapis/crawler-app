

async function handler(page, context) {


    const url = await page.url()

    await page.waitForSelector('.pattern-group-body')

    await autoScroll(page)
    const data = await page.$$eval('.card-product', (productCards) => {
        return productCards.map(document => {

            const imageUrl = document.querySelector('.image img').src
            const title = document.querySelector('.card-product-inner .title').innerText.trim()
            const priceNew = document.querySelector('.sale-price').innerText.replace('TL', '').trim()
            const longlink = document.querySelector('a.c-p-i-link').href
            const link = longlink.substring(longlink.indexOf("https://www.lacht.com.tr") + 24)

            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://cdn.qukasoft.com") + 24)

            return {
                title: 'lacht ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'lacht',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    console.log('data length_____', data.length, 'url:', url, process.env.GENDER)


    console.log("process.env.GENDER ")
    const mapgender = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return mapgender
}
async function autoScroll(page) {
    await page.evaluate(async () => {


        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                var toth = 7775
                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}
async function getUrls(page) {
    const url = await page.url()
    const nextPageExist = await page.$('.pagination .page-link')
    const pageUrls = []
    if (nextPageExist) {

        const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.pagination .page-link')).map(m => m.innerText).filter(Number)))



        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {



            pageUrls.push(`${url}?sayfa=` + i)
            --pagesLeft


        }

    }


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
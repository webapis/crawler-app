

async function handler(page, context) {


    const url = await page.url()

    await page.waitForSelector('#ProductPageProductList')

    await autoScroll(page)
    const data = await page.$$eval('.productItem', (productCards) => {
        return productCards.map(document => {

            const imageUrl = document.querySelector('a.detailLink img').src
            const title = document.querySelector('a.detailLink img').alt
            const priceNew = document.querySelector('.discountPrice span').innerText.replace('₺', '')
            const longlink = document.querySelector('a.detailLink').href
            const link = longlink.substring(longlink.indexOf('https://www.avva.com.tr/') + 24)
            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://static.ticimax.cloud/") +29)

            return {
                title: 'avva ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'avva',
                gender:'erkek'
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    console.log('data length_____', data.length, 'url:', url, process.env.GENDER)

debugger
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
    await page.waitForSelector('.pageBorder')

    const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.pageBorder a')).map(m => m.innerText).filter(Number)))
    const pageUrls = []
    if (totalPages > 1) {
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {

            pageUrls.push(`${url}?sayfa=` + i)
            --pagesLeft


        }
    }


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
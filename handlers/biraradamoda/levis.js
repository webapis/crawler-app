
async function handler(page, context) {


    const url = await page.url()

    await page.waitForSelector('.product-listing')
    await autoScroll(page)

    const data = await page.$$eval('[data-js="p-item"]', (productCards) => {
        return productCards.map(document => {

            const imageUrl = document.querySelector('.image img') ? document.querySelector('.image img').src : null
            const title = document.querySelector('.image a').getAttribute('title')
            const priceNew = document.querySelector('.one-price') ? document.querySelector('.one-price').innerText.replace('TL', '').trim() : document.querySelector('.new-price').innerText.replace('TL', '').trim()
            const longlink = document.querySelector('.image a').href
            const link = longlink.substring(longlink.indexOf("https://www.levis.com.tr/") + 25)

            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://st-levis.mncdn.com/") + 27)

            return {
                title: 'levis ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'levis',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })

    console.log('data length_____', data.length, 'url:', url, process.env.GENDER)

    debugger
    console.log("process.env.GENDER ")
    const formatprice = data.map((m) => {
        return { ...m,title: m.title + " _" + process.env.GENDER }
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
    const hasNextPage = await page.$('.page-pagination a')
    const pageUrls = []
    if (hasNextPage) {

        const totalPages = await page.evaluate(() => parseInt(Math.max(...Array.from(document.querySelectorAll('.page-pagination a')).map(m => m.innerText).filter(Number))))



        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {



            pageUrls.push(`${url}?p=` + i)
            --pagesLeft


        }
    }


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
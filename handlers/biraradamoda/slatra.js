
async function handler(page, context) {
    const { request: { userData: { } } } = context
    debugger;
    const url = await page.url()
    // const acceptcookies = await page.$('.insider-opt-in-notification-button.insider-opt-in-disallow-button')
    // if (acceptcookies) {
    //     await page.click('.insider-opt-in-notification-button.insider-opt-in-disallow-button')
    // }
    await page.waitForSelector('#ProductListMainContainer')

     await autoScroll(page)
    debugger;


    const data = await page.$$eval('.ItemOrj', (productCards) => {
        return productCards.map(document => {
            const title = document.querySelector(".productName.detailUrl a").innerHTML
            const img =document.querySelector("a .productSliderImage")&& document.querySelector("a .productSliderImage").src
            const priceNew = document.querySelector(".discountPrice span").innerText.replace('₺', '')
            const link = document.querySelector(".productName.detailUrl a").href

            return {
                title: 'slatra ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew: priceNew,//.replace(',','.'),
                imageUrl: img && img.substring(img.indexOf('https://static.ticimax.cloud/') + 29),
                link: link.substring(link.indexOf('https://www.slatra.com.tr/') + 26),
                timestamp: Date.now(),
                marka: 'slatra',

            }
        })
    })
    console.log('data length_____', data.length, 'url:', url)
    debugger

    return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } }).filter(f => f.imageUrl !== null && f.title.length > 5)
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

    const hasPanination = await page.$('.totalItems')
    const pageUrls = []

    if (hasPanination) {
        const productCount = await page.evaluate(() => parseInt(document.querySelector('.totalItems').innerText))
        const totalPages = Math.ceil(productCount / 50)


        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {



            pageUrls.push(`${url}?sayfa=` + i)
            --pagesLeft


        }
    }


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }

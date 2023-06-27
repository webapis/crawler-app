
async function handler(page, context) {

    debugger;
    const url = await page.url()

    await page.waitForSelector('#katalog')
    debugger
    await page.waitForSelector('#header-wrap > div > div.row > div > div > div.pos-r.fr.d-flex.forDesktop > div:nth-child(3) > span')
    debugger
    await page.hover("#header-wrap > div > div.row > div > div > div.pos-r.fr.d-flex.forDesktop > div:nth-child(3) > span")
    debugger
   const exits= await page.$("[data-value='TL']")
    debugger
if(exits){
    await page.click("[data-value='TL']")
    await page.reload()
}

    debugger
    await autoScroll(page)

    const data = await page.$$eval('.productItem', (productCards) => {
        return productCards.map(productCard => {
            const title = productCard.querySelector(".vitrinUrunAdi.detailLink").getAttribute('title')
            const img = productCard.querySelector(".imgInner img").src
            const priceNew = productCard.querySelector(".currentPrice").innerHTML.replace('TL', '').replace(/\n/g, '').trim()
            const link = productCard.querySelector(".vitrinUrunAdi.detailLink").href

            return {
                title: 'sementa ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew: priceNew,//.replace(',','.'),
                imageUrl: img.substring(img.indexOf('https://cdn.sementa.com/') + 24),
                link: link.substring(link.indexOf('https://www.sementa.com/') + 24),
                timestamp: Date.now(),
                marka: 'sementa',

            }
        })
    })
    console.log('data length_____', data.length, 'url:', url)
    debugger

    return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })


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

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    if (inc === 200) {
                        clearInterval(timer);
                        resolve();
                    } else {
                        inc = inc + 1
                    }

                } else {
                    inc = 0
                }
            }, 100);
        });
    });
}
async function getUrls(page) {

    const pageUrls = []


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }

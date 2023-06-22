

async function handler(page, context) {
    const { request: { userData: { } } } = context

    const url = await page.url()
    debugger
    await page.waitForSelector('.catalogWrapper')
    debugger

    await autoScroll(page)
    const data = await page.$$eval('.productItem', (productCards) => {
        return productCards.map(document => {

            const imageUrl = document.querySelector('a img').src
            const title = document.querySelector('.productDetails a').innerText
            const priceNew = document.querySelector('.currentPrice').innerText.replace('TL', '').trim()
            const longlink = document.querySelector('.productDetails a').href
            const link = longlink.substring(longlink.indexOf("https://www.markapia.com/") + 25)

            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://www.markapia.com/") + 25)

            return {
                title: 'markapia ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'markapia',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 3 && f.priceNew != null)
    })

    console.log('data length_____', data.length, 'url:', url, process.env.GENDER)

    debugger
    console.log("process.env.GENDER ")

    const formatedData =data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})


    debugger
    return formatedData
}




async function autoScroll(page) {
    await page.evaluate(async () => {


        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                const totalCollected = document.querySelectorAll('.productItem').length
                const totalItems = parseInt(document.querySelector('.totalPr').innerText.replace(/[^\d]/g, '').trim())

                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalCollected === totalItems) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
async function getUrls(page) {
    //  const url = await page.url()
    //  await page.waitForSelector('.page_numbers span')
    // const productCount = await page.$eval('.catalog__meta--product-count span', element => parseInt(element.innerHTML))
    //const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.page_numbers span')).map(m => m.innerHTML).filter(Number)))
    const pageUrls = []

    // let pagesLeft = totalPages
    // for (let i = 2; i <= totalPages; i++) {



    //     pageUrls.push(`${url}?page=` + i)
    //     --pagesLeft


    // }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
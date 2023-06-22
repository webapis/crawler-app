
async function handler(page, context) {
    const { request: { userData: { subcategory, category } } } = context

    const url = await page.url()

    await page.waitForSelector('.ProductList')

    await autoScroll(page)
    const data = await page.$$eval('.productItemLayout', (productCards, _subcategory, _category) => {
        return productCards.map(element => {

            const title = element.querySelector('img[title]').getAttribute('title')
            const img = element.querySelector('img[title]').src
            const priceNew = element.querySelector('.discountFlashPrice').textContent.replace('TL', '').trim()
            const link = element.querySelector('img[title]').parentElement.href
            return {
                title,

                priceNew: priceNew ? priceNew.replace(',', '.').trim() : 0,

                imageUrl: img.substring(img.indexOf('https://images.farktorcdn.com/img/')+34),
                link:link.substring(link.indexOf('https://www.fullamoda.com/')+26),

                timestamp: Date.now(),

                marka: 'fullamoda',
                subcategory: _subcategory,
                category: _category


            }
        })//.filter(f => f.imageUrl !== null)
    }, subcategory, category)

    console.log('data length_____', data.length, 'url:', url)



    return data
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
            }, 120);
        });
    });
}
async function getUrls(page) {
    const url = await page.url()
    // await page.waitForSelector('.total-count spann')
    // const productCount = await page.$eval('.total-count spann', element => parseInt(element.innerHTML))
    // const totalPages = Math.ceil(productCount / 60)
     const pageUrls = []

    // let pagesLeft = totalPages
    // for (let i = 2; i <= totalPages; i++) {



    //     pageUrls.push(`${url}?page=` + i)
    //     --pagesLeft


    // }

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
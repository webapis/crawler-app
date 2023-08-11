

async function handler(page, context) {

    debugger;
    const url = await page.url()
    await page.waitForSelector('.product-grid')


    await autoScroll(page)
    debugger;
    const data = await page.$$eval('.product-item', (items) => {

        return items.map(document => {
            try {
                let productTitle = document.querySelector('.product-item img').alt

                const priceNew = document.querySelector('.price').innerText.replace('TL', '').trim()
                const longlink = document.querySelector('.name a').href
                const link = longlink.substring(longlink.indexOf('https://miostil.com/') + 20)
                const longImgUrl = document.querySelector('.product-item img').src
              //  const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf('https://miostil.com/') + 20)
    
                return {
                    title: 'miostil ' + productTitle.replace(/\n/g, '').trim(),
                    priceNew,
                    imageUrl: longImgUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'miostil',
    
                } 
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
    
        })
    });

    debugger

    console.log('data length_____', data.length, 'url:', url)

    return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })


}

async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.pager a')
    const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.pager a')).map(m => m.innerHTML).filter(Number)))

    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?pagenumber=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
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
            }, 200);
        });
    });
}
module.exports = { handler, getUrls }
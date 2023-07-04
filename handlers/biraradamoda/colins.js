

async function handler(page) {


    const url = await page.url()

    return new Promise((resolve, reject) => {
        try {
            let totalProducts = 0
            let collected = 0
            let inv = setInterval(async () => {


                if (totalProducts > 0 && collected >= (totalProducts-1)) {
                    clearInterval(inv)

                    const data = await page.$$eval('.productbox.clearfix.list-item', (productCards) => {
                        return productCards.map(productCard => {
                            const title = productCard.querySelector('.lazy-image.product-name.track-link').getAttribute('title')
                            const img =productCard.querySelector('.lazy-image.product-name.track-link img')&& productCard.querySelector('.lazy-image.product-name.track-link img').src
                            const priceNew = productCard.querySelector('.product-price') ? productCard.querySelector('.product-price').innerHTML.replace('TL', '').trim() : productCard.querySelector('.product-new-price').innerHTML.replace('TL', '').trim()
                            const link = productCard.querySelector('.lazy-image.product-name.track-link').href

                            return {
                                title: 'colins ' + title.replace(/İ/g, 'i').toLowerCase(),
                                priceNew: priceNew,//.replace(',','.'),
                                imageUrl:img&& img.substring(img.indexOf('https://img-colinstr.mncdn.com/mnresize/') + 40),
                                link:link&& link.substring(link.indexOf('https://www.colins.com.tr/') + 26),
                                timestamp: Date.now(),
                                marka: 'colins',

                            }
                        })
                    })
                    debugger
                    console.log('data length_____', data.length, 'url:', url)
                    debugger

                    const remap = data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } }).filter(f => f.imageUrl !== null && f.title.length > 5)
                    return resolve(remap)
                    //  await page.click('.button.js-load-more')


                } else {
                    const hiddenLoading = await page.evaluate(()=>document.querySelector('.loading') && document.querySelector('.loading').style.visibility==='hidden')
                    if(hiddenLoading){
                        await manualScroll(page)
                        totalProducts = await page.evaluate(() => parseInt(document.querySelector('#product-count').innerHTML.replace(/[^\d]/g, '')))
                        collected = await page.evaluate(() => document.querySelectorAll('.productbox.clearfix.list-item').length)
                        console.log('collected', collected, totalProducts)
                    }
                   

                }

            }, 50)
            // clearInterval(inv)
        } catch (error) {
            console.log('error------', error)
            debugger
            return reject(error)
        }
    })




}

async function manualScroll(page) {
    await page.evaluate(async () => {
        var totalHeight = 0;
        var distance = 50;
        let inc = 0
        window.scrollBy(0, distance);
        totalHeight += distance;
        inc = inc + 1
    });
}
// async function handlerdd(page, context) {
//     const { request: { userData: { } } } = context
//     debugger;
//     const url = await page.url()

//     await page.waitForSelector('.module-content.product-list.clearfix')

//     await autoScroll(page)
//     debugger;


//     const data = await page.$$eval('.productbox.clearfix.list-item', (productCards) => {
//         return productCards.map(productCard => {
//             const title = productCard.querySelector('.lazy-image.product-name.track-link').getAttribute('title')
//             const img = productCard.querySelector('.lazy-image.product-name.track-link img').src
//             const priceNew = productCard.querySelector('.product-price') ? productCard.querySelector('.product-price').innerHTML.replace('TL', '').trim() : productCard.querySelector('.product-new-price').innerHTML.replace('TL', '').trim()
//             const link = productCard.querySelector('.lazy-image.product-name.track-link').href

//             return {
//                 title: 'colins ' + title.replace(/İ/g, 'i').toLowerCase(),
//                 priceNew: priceNew,//.replace(',','.'),
//                 imageUrl: img.substring(img.indexOf('https://img-colinstr.mncdn.com/mnresize/') + 40),
//                 link: link.substring(link.indexOf('https://www.colins.com.tr/') + 26),
//                 timestamp: Date.now(),
//                 marka: 'colins',

//             }
//         })
//     })
//     console.log('data length_____', data.length, 'url:', url)


//     return data.map(m => { return { ...m, title: m.title + " _" + process.env.GENDER } })
// }





// async function autoScroll(page) {
//     await page.evaluate(async () => {


//         await new Promise((resolve, reject) => {
//             var totalHeight = 0;
//             var distance = 100;
//             let inc = 0
//             var timer = setInterval(() => {
//                 var scrollHeight = document.body.scrollHeight;
//                 var toth = 7775
//                 window.scrollBy(0, distance);
//                 totalHeight += distance;
//                 inc = inc + 1
//                 if (totalHeight >= scrollHeight - window.innerHeight) {
//                     clearInterval(timer);
//                     resolve();
//                 }
//             }, 200);
//         });
//     });
// }
async function getUrls(page) {

    const pageUrls = []


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }


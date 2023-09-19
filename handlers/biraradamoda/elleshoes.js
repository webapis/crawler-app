
const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page) {



    await autoScroll(page)
    const data = await page.$$eval('.productItem', (productCards) => {
        return productCards.map(document => {
try {
    const imageUrl = document.querySelector('.productImage a img').getAttribute('data-original')
    const title = document.querySelector('.productImage a').getAttribute('title')
    const priceNew = document.querySelector('.discountPrice').innerText.replace('TL','').trim()
    const link = document.querySelector('.productImage a').href

  
    return {
        title: 'elleshoes ' + title.replace(/İ/g,'i').toLowerCase(),
        priceNew,
        imageUrl,
        link,
        timestamp: Date.now(),
        marka: 'elleshoes',
    }
} catch (error) {
    return {error,content:document.innerHTML}
}
           
        })
    })

return data
}
// async function autoScroll(page) {
//     await page.evaluate(async () => {

// const totalItems =parseInt(document.querySelector(".FiltrelemeUrunAdet").innerText.replace(/[^\d]/gi,''))
//         await new Promise((resolve, reject) => {
//             var totalHeight = 0;
//             var distance = 100;
//             let inc = 0
//             var timer = setInterval(() => {
//                 var scrollHeight = document.body.scrollHeight;
//                 const collectedItems =document.querySelectorAll(".productItem").length
//                 window.scrollBy(0, distance);
//                 totalHeight += distance;
//                 inc = inc + 1
//                 if (collectedItems>=totalItems) {
//                     clearInterval(timer);
//                     resolve();
//                 }
//             }, 100);
//         });
//     });
// }
async function getUrls(page) {
    // const url = await page.url()
    // await page.waitForSelector('.pageBorder')

    // const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.pageBorder a')).map(m => m.innerText).filter(Number)))
    const pageUrls = []
    // if (totalPages > 1) {
    //     let pagesLeft = totalPages
    //     for (let i = 2; i <= totalPages; i++) {

    //         pageUrls.push(`${url}?sayfa=` + i)
    //         --pagesLeft


    //     }
    // }


    return { pageUrls, productCount: 0, pageLength:0 }
}
const productPageSelector='.FiltrelemeUrunAdet'
const linkSelector='.mobilMenu a'
const linksToRemove=[]
const hostname='https://www.elleshoes.com/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }



const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page) {




 
    await autoScroll(page)
    debugger;
    const data = await page.$$eval('.ItemOrj.col-3', (productCards, _subcategory, _category, _node) => {
        return productCards.map(productCard => {
            const longimg = productCard.querySelector('[data-original]').getAttribute('data-original')
            const title = productCard.querySelector('.productName.detailUrl a').innerHTML
            const priceNew = productCard.querySelector('.discountPrice span').innerHTML.replace('₺', '').replaceAll('\n','')//.replace('.','').replace(',','.')
            const link = productCard.querySelector('.detailLink.detailUrl').href

            return {
                title: 'baqa ' + title.replace(/İ/g,'i').toLowerCase(),
                priceNew,
                imageUrl: longimg,
                link: link.substring(link.indexOf('https://www.baqa.com.tr/') + 24),
                timestamp: Date.now(),
                marka: 'baqa',

            }
        })//.filter(f => f.priceNew !== null)
    })


    return data
}
// async function autoScroll(page) {
//     await page.evaluate(async () => {


//         await new Promise((resolve, reject) => {
//             var totalHeight = 0;
//             var distance = 100;
//             let inc = 0
//             var timer = setInterval(() => {
//                 var scrollHeight = document.body.scrollHeight;

//                 window.scrollBy(0, distance);
//                 totalHeight += distance;
//                 inc = inc + 1
//                 if (totalHeight >= scrollHeight - window.innerHeight) {
//                     clearInterval(timer);
//                     resolve();
//                 }
//             }, 100);
//         });
//     });
// }

const productPageSelector='#ProductPageProductList'
const linkSelector='.headerContent a'
const linksToRemove=[]
const hostname='https://www.baqa.com.tr/'
const exclude=['?currency=eur','?currency=gbp','?currency=sar','?currency=usd','?currency=kwd','?currency=aed','?currency=qar','/ar/','/en/']
const postFix ='?currency=try'
async function getUrls(page) {

    const pageUrls = []



    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

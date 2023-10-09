
const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page) {



  await autoScroll(page);


  const data = await page.$$eval('.list__products .product-item', (productCards) => {
    return productCards.map(document => {
try {
    const imageUrl = document.querySelector('.pz-image-placeholder source').srcset
    const title = document.querySelector('.product-item__info-name a').innerHTML.trim()
    const priceNew = document.querySelector('.product-item__info-price pz-price').innerText.replace('TL','').trim()
    const link = document.querySelector('.product-item__info-name a').href


    return {
        title: 'koton ' + title.replace(/İ/g,'i').toLowerCase(),
        priceNew,
        imageUrl,
        link,
        timestamp: Date.now(),
        marka: 'koton',
    } 
} catch (error) {
    return {error:error.toString(),content:document.innerHTML}
}

    })
})
return  data
}




async function getUrls(page) {
  const url = await page.url();
  // await page.waitForSelector('.result.-only-desktop')
  // const productCount = await page.$eval('.result.-only-desktop', element => parseInt(element.textContent.replace(/[^\d]/g, "")))
  // const totalPages = Math.ceil(productCount / 59)
  const pageUrls = [];

  // let pagesLeft = totalPages
  // for (let i = 1; i <= totalPages; i++) {

  //     if (pagesLeft > 0) {

  //         pageUrls.push(`${url}?page=` + i)
  //         --pagesLeft
  //     }

  // }

  return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 };
}
const productPageSelector='.list__products'
const linkSelector='.site-map__list a'
const linksToRemove=[]
const hostname='https://www.koton.com/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

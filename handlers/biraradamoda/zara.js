
const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
    productPageSelector:'.product-grid__product-list',
    linkSelector:'.layout-menu-std__menu a',
    linksToRemove:[],
    hostname:'https://www.zara.com/tr/',
    exclude:[],
    postFix:''
  }




async function extractor(page) {

    debugger

debugger

await autoScroll(page)

    const url = await page.url()
    debugger
      await page.evaluate(()=>document.querySelectorAll('.view-option-selector button')[1].click())
      debugger
      await page.waitForTimeout(2000)
      debugger
    const data = await page.$$eval('li[data-productid]', (productCards) => {
        return productCards.map(document => {
            const priceNew = document.querySelector('.money-amount__main').innerText.replace('TL','').trim()
            const link = document.querySelector('.product-grid-product__figure a').href
            const imageUrl = document.querySelector('.product-grid-product__figure a img').src
            const title = document.querySelector('.product-grid-product-info__main-info h3').innerText
            return {
                title: 'zara ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'zara',

            }
        })
    })


debugger
  
    return data

}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}


module.exports = { extractor, getUrls,...initValues }

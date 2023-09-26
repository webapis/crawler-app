

const {autoScroll}=require('../../utils/autoscroll')

const initValues ={
    productPageSelector:'.ProductList',
    linkSelector:'#MainMenu a',
    linksToRemove:[],
    hostname:'https://www.oxxo.com.tr/',
    exclude:[],
    postFix:''
  }

async function extractor(page) {

    const url = await page.url()

    await autoScroll(page);

    const data = await page.$$eval('.Prd', (productCards,url) => {
        return productCards.map(productCard => {
            try {
                const imageUrl = productCard.querySelector('a[data-product] img').getAttribute('data-src') ? productCard.querySelector('a[data-product] img').getAttribute('data-src') : productCard.querySelector('a[data-product] img').src
                const title = productCard.querySelector('a[data-product] img').alt
                const priceNew = productCard.querySelector('.PriceArea').querySelectorAll('span').length === 1 ? productCard.querySelector('.PriceArea').querySelectorAll('span')[0].innerHTML.trim().replace('₺', '').trim() : productCard.querySelector('.PriceArea').querySelectorAll('span')[1].innerHTML.trim().replace('TL', '').trim()
                const link = productCard.querySelector('a[data-product]').href
                return {
                    title: 'oxxo ' + title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'oxxo'
                }
            } catch (error) {
                return {error:error.toString(),url,content:document.innerHTML}
            }
        })
    },url)

    return data
}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}


module.exports = { extractor, getUrls,...initValues }







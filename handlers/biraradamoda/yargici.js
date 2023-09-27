const initValues ={
    productPageSelector:'.product-list-container',
    linkSelector:'.main-menu a',
    linksToRemove:[],
    hostname:'https://www.yargici.com/',
    exclude:[],
    postFix:''
  }


async function extractor(page) {


    const url = await page.url()

    const data = await page.$$eval('.product-box-container', (productCards) => {
        return productCards.map(productCard => {
            const priceNew = productCard.querySelector('.d-block.product-box-prices.product-box-price.pl-1.pr-2.text-black').textContent.replace(/\n/g, '').replace('TL', '').trim()
            const link = productCard.querySelector('.product-box-image-container').href
            const imageUrl = productCard.querySelector('[data-original]').getAttribute('data-original')
            const title = productCard.querySelector('.product-box-zoom-image').alt
            return {
                title: 'yargici ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'yargici',

            }
        })
    })



  
    return data
}

async function getUrls(page) {

    const url = await page.url()
const nextPage =await page.$('.pager-container .individual-page a')

    const pageUrls = []
if(nextPage){
    const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.pager-container .individual-page a')).map(m=> m.innerHTML).filter(Number).map(m=>parseInt(m))))

    for (let i = 2; i <= totalPages; i++) {
        pageUrls.push(`${url}?pagenumber=` + i)
    }
}
 

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}


module.exports = { extractor, getUrls,...initValues }

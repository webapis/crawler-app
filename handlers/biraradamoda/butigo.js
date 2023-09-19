
async function extractor(page) {

    const data = await page.$$eval('[data-gtm-product]', (productCards) => {
        return productCards.map(document => {
            try {
                const img = document.querySelector('[data-src]').getAttribute('data-src')
                const title =  document.querySelector('.product__image a img').alt
                const priceNew =document.querySelector('.product__prices-sale').innerText.replace('TL','').trim()
                const link = document.querySelector('.product__image a').href
                return {
                    title: 'butigo '+title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl: img.substring(img.indexOf('https://floimages.mncdn.com/mnpadding/')+38),
                    link,
                    timestamp: Date.now(),
                    marka: 'butigo',
                }
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
        
        })//.filter(f => f.imageUrl !== null)
    })


    return data
}

const productPageSelector='.row.product-lists'
const linkSelector='.navigation a'
const linksToRemove=[]
const hostname='https://www.butigo.com.tr/'
const exclude=[]
const postFix =''

async function getUrls(page) {
    const url = await page.url()
 const nextPage =   await page.$('.pagination .page-item a')
    const productCount = 0
    const pageUrls = []
    if(nextPage){
        const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.pagination .page-item a')).map(m=> m.innerHTML).filter(Number)))
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
    
            pageUrls.push(`${url}?page=` + i)
            --pagesLeft
        
        }
    
    }
  
    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }


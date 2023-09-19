

const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page, ) {

    await autoScroll(page)

            const data = await page.$$eval('.product', (productCards) => {
                return productCards.map(document => {
                        try {
                            const title = document.querySelector('.dl-event')? document.querySelector('.dl-event').getAttribute('title'): document.querySelector('.image-hover.hover-nav a').getAttribute('title')
                            const imageUrl= document.querySelector('.dl-event img')? document.querySelector('.dl-event img').getAttribute('data-src'):document.querySelector('.image-hover.hover-nav a img').src
                            const priceNew =document.querySelector('.price-sales') ?document.querySelector('.price-sales').innerHTML.replace('TL','').trim():(document.querySelector('.camp-price') ? document.querySelector('.camp-price').innerHTML.replace('TL','').trim():null)
                            const link = document.querySelector('.dl-event')? document.querySelector('.dl-event').href:document.querySelector('.image-hover.hover-nav a').href
                
                            return {
                                title: 'dilvin '+title.replace(/İ/g,'i').replaceAll('-',' ').toLowerCase(),
                                priceNew,
                                imageUrl,
                                link,
                                timestamp: Date.now(),
                                marka: 'dilvin',
                
                            }    
                        } catch (error) {
                            return {error:error.toString(),content:document.innerHTML}
                        }
            
                }).filter(f => f.priceNew !== null)
            })
        
  return data
    
        

}

async function getUrls(page) {
    //const url = await page.url()
    // const nextPageExists = await page.$('.pagination .last')
     const pageUrls = []
    // if(nextPageExists){
   
    //     const totalPages = await page.$eval('.pagination .last', element => parseInt(element.href.substring( element.href.lastIndexOf('=')+1)))
    //     debugger;
    //     for (let i = 2; i <= totalPages; i++) {
    //         pageUrls.push(`${url}?rpg=` + i)
    
    //     }
    // }


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.category-product'
const linkSelector='.nav.navbar-nav a'
const linksToRemove=[]
const hostname='https://www.dilvin.com.tr/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }


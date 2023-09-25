const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
    productPageSelector:'.product-grid',
    linkSelector:'.ddd',
    linksToRemove:[],
    hostname:'https://miostil.com/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {

    debugger;
    const url = await page.url()


    await autoScroll(page)
    debugger;
    const data = await page.$$eval('.product-item', (items,url) => {

        return items.map(document => {
            try {
                let productTitle = document.querySelector('.product-item img').alt

                const priceNew = document.querySelector('.price').innerText.replace('TL', '').trim()
                const link = document.querySelector('.name a').href
                const imageUrl = document.querySelector('.product-item img').src
        
                return {
                    title: 'miostil ' + productTitle.replace(/\n/g, '').trim(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'miostil',
    
                } 
            } catch (error) {
                return {error:error.toString(),url,content:document.innerHTML}
            }
    
        })
    },url);

  return data

}

async function getUrls(page) {
    const url = await page.url()
  const nextPage =  await page.$('.pager a')
  
    const pageUrls = []
if(nextPage){
    const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.pager a')).map(m => m.innerHTML).filter(Number)))

    for (let i = 2; i <= totalPages; i++) {
        pageUrls.push(`${url}?pagenumber=` + i)
    }
}



    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}


module.exports = { extractor, getUrls,...initValues }
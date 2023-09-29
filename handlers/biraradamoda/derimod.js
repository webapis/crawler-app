

const initValues ={
     productPageSelector:'.ProductCard',
     linkSelector:'.site-header a',
     linksToRemove:[],
     hostname:'https://derimod.com.tr/',
     exclude:[],
     postFix:''
    
}


async function extractor(page) {
    const url = await page.url()
debugger
   const data = await page.$$eval('.ProductCard', (productCards,url) => {
        return productCards.map(document => {
                try {
                    const imageUrl ='https:'+ document.querySelector('.ProductCard [data-bgset]').getAttribute('data-bgset').replaceAll('\n','').trim().split(',')[2].trim().split(' ')[0]
                    const title = document.querySelector('.ProductCard a [aria-label]').getAttribute('aria-label')
                    const priceNew = document.querySelector('.product-grid-item__price__new')?document.querySelector('.product-grid-item__price__new').innerText.replace('TL',''):document.querySelector('.product-grid-item__price').innerText.replace('TL','')
                    const link = document.querySelector('.ProductCard a').href
     
                    return {
                        title: 'derimod ' + title.replace(/İ/g,'i').toLowerCase(),
                        priceNew,
                        imageUrl,
                        link,
                        timestamp: Date.now(),
                        marka: 'derimod',
                    } 
                } catch (error) {
                    return{
                        error:error.toString(),url,content:document.innerHTML
                    }
                }
       
        })
    },url)


debugger

    return data
}

async function getUrls(page) {
    const url = await page.url()

    const pageUrls = []
 const nextPage =   await page.$('.search-total-count')
    if(nextPage){
        const totalPages = await page.evaluate(()=> Math.max(...Array.from(document.querySelectorAll('.pagination-item')).map(m=>m.innerHTML.replace(/[^\d]/g, '')).filter(Number))) 
      
    
     
        for (let i = 2; i <= totalPages; i++) {
    
            pageUrls.push(`${url}?page=` + i)
    
    
        }
    }
   

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}

module.exports = { extractor, getUrls,...initValues }

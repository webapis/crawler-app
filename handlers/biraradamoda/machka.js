
const {linkExtractor}=require('../../utils/linkExtractor')
//const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
     productPageSelector:'.ems-prd-list',
     linkSelector:'.btn-full',
     linksToRemove:[],
     hostname:'https://www.machka.com.tr/',
     exclude:[],
     postFix:''
}


async function extractor(page, context) {


    debugger
    await linkExtractor({...initValues,linkSelector:'.selected a',candidateSelector:'.modal-body [href="javascript:void(0);"]',page,context,action:'click'})

    debugger

    await page.waitForSelector('.ems-prd')
   
      let   data = await page.$$eval('.ems-prd', (items) => {

            return items.map(document => {

                try {
                    const priceNew = document.querySelector('.ems-prd-price-last') && document.querySelector('.ems-prd-price-last').innerText.replace('₺', '').trim()
                    const link = document.querySelector('.ems-prd-link.btn-full').href
                    const imageUrl = document.querySelector('[data-image-src]').getAttribute('data-image-src')

                    return {
                        title: 'machka ' + document.querySelector('[data-image-src]').alt,
                        priceNew,
                        imageUrl,
                        link,
                        timestamp: Date.now(),
                        marka: 'machka',
        
                    }
                } catch (error) {
                    return {error:error.toString(),url:document.baseUrl,content:document.innerHTML}
                }
           
            })
        });
    
return data


}



async function getUrls(page) {

    const url = await page.url()
 const nextPage =   await page.$('.prd-qty')
    let productCount = 0
   const pageUrls = []
    if(nextPage){
         productCount = await page.evaluate(()=>parseInt(document.querySelector('.prd-qty').innerHTML.replace(/[^\d]/g, '')))
        const totalPages = Math.ceil(productCount / 15)
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?page=` + i)
        }
    }
 

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }

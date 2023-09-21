
const {linkExtractor}=require('../../utils/linkExtractor')
const initValues ={
     productPageSelector:'.list-content',
     linkSelector:'.navigation a',
     linksToRemove:[],
     hostname:'https://www.lovemybody.com.tr/',
     exclude:[],
     postFix:''
}



async function extractor(page,context) {

    
    await linkExtractor({...initValues,candidateSelector:'.navigation__item',page,context,action:'hover'})
    debugger
    await page.waitForTimeout(5000);
   
      let   data = await page.$$eval('.product-item-box', (items) => {

            return items.map(document => {
                try {
                 
                    const priceNew =document.querySelector('.product-item__campaign span')?  document.querySelector('.product-item__campaign span').nextSibling.textContent.replaceAll('\n','').trim().replace('TL','').trim(): document.querySelector('.product-item-box a[data-price]').getAttribute('data-price')
                    const link = document.querySelector('.info a').href
               
                    const imageUrl = document.querySelector('.product-item-box a[data-image]').getAttribute('data-image')
                    
                    return {
                        title: 'lovemybody ' +document.querySelector('.product-name').innerText,
                        priceNew,
                        imageUrl,
                        link,
                        timestamp: Date.now(),
                        marka: 'lovemybody',
        
                    }
                } catch (error) {
                    return {error:error.toString(),content:document.innerHTML}
                }
            
            })
        });
    

return data






}



async function getUrls(page) {

    const url = await page.url()
  const nextPage =  await page.$('.search-total-count span')
  let productCount = 0
    const pageUrls = []

if(nextPage){
     productCount = await page.evaluate(()=>parseInt(document.querySelector('.search-total-count span').innerText.replace(/[^\d]/g, '')))
    const totalPages = Math.ceil(productCount / 24)
    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?page=` + i)
 
    }
}


    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}


module.exports = { extractor, getUrls,...initValues }

const initValues ={
    productPageSelector:'.productItem',
    linkSelector:'.navigation a',
    linksToRemove:[],
    hostname:'https://www.tonnyblack.com.tr',
    exclude:[],
    postFix:'?currency=try'
  }
async function extractor(page) {

    debugger
        const url = await page.url()
    
      
        const data = await page.$$eval('.productItem', (productCards,url) => {
            return productCards.map(document => {
                try {
                 const imageUrl =document.querySelector('.detailLink.detailUrl img').src
                const title = document.querySelector('.detailLink.detailUrl').getAttribute('title')
                 const priceNew = document.querySelector('.discountPrice').innerText.replace('₺',' ').trim()
                     const link = document.querySelector('.detailLink.detailUrl').href
               
                
                   return {
                         title: 'tonnyblack ' + title.toLowerCase(),
                         priceNew,
                         imageUrl,
                        link,
                        timestamp: Date.now(),
                        marka: 'tonnyblack',
                   } 
                } catch (error) {
                    return {error:error.toString(),url,content:document.innerHTML}
                }
              
            })
        },url)
return data
    }
    
    async function getUrls(page) {
        const url = await page.url()
      const nextPageExist = await page.$('.pageBorder a')
      const pageUrls = []
      if(nextPageExist){
        const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll(".pageBorder a")).map(a=>a.innerText).filter(Number)))

        for (let i = 2; i <= totalPages; i++) {
    

            pageUrls.push(`${url}&sayfa=` + i)
         
    
        }
      }

        return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
    }
    module.exports = { extractor, getUrls,...initValues }

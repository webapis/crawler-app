


async function extractor(page) {

    const data = await page.$$eval('.ItemOrj', (productCards) => {
        return productCards.map(document => {

            try {
                const title = document.querySelector('.imageItem a').getAttribute('title')
                const imageUrl =document.querySelector('.imageItem a img').getAttribute('data-src')
                const priceNew = document.querySelector('.discountPrice').innerText.replace('₺','')
                const link = document.querySelector('.imageItem a').href
    
                return {
                    title: 'dericlub ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'dericlub',
    
                }
            } catch (error) {

                return {error:error.toString(),content:document.innerHTML}
            
            }
        
        })
    })
  
    return data 

}

async function getUrls(page) {
    const url = await page.url()
   const nextPage =   await page.$('.pageBorder a')
    const pageUrls = []
if(nextPage){

    const totalPages= await page.evaluate(()=> Math.max(...Array.from(document.querySelectorAll('.pageBorder a')).map(m => m.innerHTML.replace(/[^\d]/g, '')).filter(Number))) 
    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?sayfa=` + i)
        --pagesLeft

    }
}

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}




const productPageSelector='#ProductPageProductList'
const linkSelector='.navigation a'
const linksToRemove=[]
const hostname='https://www.dericlub.com.tr/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }


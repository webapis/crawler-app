


async function extractor(page) {


        const data = await page.$$eval('.showcase-container .showcase', (productCards) => {
            return productCards.map(document => {
                const brand =document.querySelector('.showcase-brand a').innerText
                const imageUrl = document.querySelector('.showcase-image img').getAttribute('data-src')
                const title = brand +' '+ document.querySelector('.showcase-title').innerText
                const priceNew = document.querySelector('.showcase-price-new').innerText.replace('TL','').trim()
                const link = document.querySelector('.showcase-image a').href
             
                return {
                    hrefText:title ,
                    title: 'alpinist ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'alpinist',
                }
            }).filter(f => f.imageUrl !== null && f.title.length > 5)
        })
    
 return data
    

   
}
const productPageSelector='.showcase-container'
const linkSelector='#navigation a'
const linksToRemove=[]
const hostname='https://www.alpinist.com.tr/'
const exclude=[]
const postFix =''

async function getUrls(page) {
    
    const firstUrl = await page.url()
    const nextPageExists = await page.$('.paginate a')
    const pageUrls = []
    if(nextPageExists){
        const totalPages = await page.evaluate(() => {
            return Math.max(...Array.from(document.querySelectorAll('.paginate a')).map(m=>m.innerHTML.trim()).filter(Number))
        })
    
      
        let pagesLeft = totalPages
    
        for (let i = 2; i <= totalPages; i++) {
            const url = `${firstUrl}?tp=${i}`
    
            if (pagesLeft >= 1) {
                pageUrls.push(url)
                --pagesLeft
            }
        }

        console.log('pageUrls!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',pageUrls)
    }else{
        console.log('not next page>>>>>>>>>>>>>>')
    }
  


    return { pageUrls:[], productCount: 0, pageLength:pageUrls.length }

}
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }
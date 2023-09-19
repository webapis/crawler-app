
const {autoScroll}=require('../../utils/autoscroll')

async function extractor(page) {


    await autoScroll(page)

    const data = await page.$$eval('#ProductPageProductList .ItemOrj', (productCards) => {
        return productCards.map(document => {
            try {

                const imageUrl = document.querySelector('.productSliderImage')? document.querySelector('.productSliderImage').src: document.querySelector('[data-original]').getAttribute('data-original')
                const title = document.querySelector('.productName.detailUrl a').innerHTML.trim()
                const priceNew = document.querySelector('.discountPrice span').innerHTML.replace('₺', '').replace(/\n/g, '').trim()
                const link = document.querySelector('.productName.detailUrl a').href
          
                return {
                    title: 'armine ' + title,
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'armine',
                }
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
         
        })
    })
    debugger
  
    
        return data
    }
    


const productPageSelector='#ProductPageProductList'
const linkSelector='.navigation a'
const linksToRemove=[]
const hostname='https://www.armine.com/'
const exclude=[]
const postFix =''

    async function getUrls(page) {
        const url = await page.url()
       const nextPageExits = await page.$('.totalItems')
       const pageUrls = []
       let productCount =0
       if(nextPageExits){
         productCount = await page.$eval('.totalItems', element => parseInt(element.innerHTML))
        const totalPages = Math.ceil(productCount / 70)

    
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
    
            pageUrls.push(`${url}?sayfa=` + i)
            --pagesLeft
    
        }
       }
     
        return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
    }
    module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }
const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page) {

   await autoScroll(page)


debugger
    const data = await page.$$eval('.product-list article', (productCards) => {
    
            return productCards.map(document => {
                try {
                    const color= document.querySelector('a h3 ~ span')? document.querySelector('a h3 ~ span').innerText:'' 
                    const title =document.querySelector('a h3')?document.querySelector('a h3').innerText :document.innerHTML 
                    const imageUrl = document.querySelector('a picture source')? document.querySelector('a picture source').getAttribute('srcset'):''
                   // const img = document.querySelector('[srcset]') && document.querySelector('[srcset]').getAttribute('srcset').split(',').reverse()[0].trim()
                    const link =document.querySelector('a')? document.querySelector('a').href :''
                    const priceNew = document.querySelector('a h3')? Array.from(document.querySelector('a h3').previousSibling.childNodes).reverse()[0].innerHTML.replace('₺','').trim():''
                    return {
                        title: 'exquise ' + title.replace(/İ/g, 'i').toLowerCase().replaceAll('-', ' ') + color,
                        priceNew: priceNew,//.replace('₺', ''),//.replace(',','.'),
                        imageUrl,
                        link,
                        timestamp: Date.now(),
                        marka: 'exquise',
        
                    } 
                } catch (error) {
                    debugger
                    return {error:error.toString(),content:document.innerHTML}
                }
             
            })
       
    
    })


    return data
}





async function getUrls(page) {

    const pageUrls = []


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
const productPageSelector='.infinite-scroll-component__outerdiv'
const linkSelector='sss'
const linksToRemove=[]
const hostname='https://exquise.com/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }



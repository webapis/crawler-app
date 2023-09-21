const {autoScroll}=require('../../utils/autoscroll')

const {linkExtractor}=require('../../utils/linkExtractor')
const initValues ={
     productPageSelector:'.infinite-scroll-component__outerdiv',
     linkSelector:'footer nav a',
     linksToRemove:[],
     hostname:'https://exquise.com/',
     exclude:[],
     postFix :''
    
    
}
async function extractor(page,context) {

    const toggleBtn = await page.$('[aria-label="Toggle main menu"]')
    if(toggleBtn){
        await page.click('[aria-label="Toggle main menu"]')
        await page.waitForSelector('.MuiDrawer-root')
        await linkExtractor({...initValues,linkSelector:'.MuiAccordion-region a',candidateSelector:'.MuiAccordionSummary-expandIconWrapper',page,context,action:'click'})
    }

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


module.exports = { extractor, getUrls,...initValues }


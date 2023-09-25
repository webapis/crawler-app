
const initValues ={
    productPageSelector:'.product_box',
    linkSelector:'.open-sub a',
    linksToRemove:[],
    hostname:'https://www.matras.com/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {
    const url = await page.url()
    const data = await page.$$eval('.product_box', (productCards,url) => {
        return productCards.map(document => {
            try {
            const imageUrl = document.querySelector('.product_image img').src
            const title = document.querySelector('.product_name').innerText
            const priceNew = document.querySelector('.turkcell-price span').innerHTML.replaceAll('\n', '').replace('TL', '')
            const link = document.querySelector('.product_image a').href
         
            return {
                title: 'matras ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'matras',
            }   
            } catch (error) {
                return {
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
  const nextPage =  await page.$('.filtreurun')
  let productCount =0
    const pageUrls = []
if(nextPage){

     productCount = await page.evaluate(()=>parseInt(document.querySelector('.filtreurun').innerText.replace(/[^\d]/g,'')))
    const totalPages = Math.ceil(productCount / 32)
    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?page=` + i)


    }  
}
  

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }
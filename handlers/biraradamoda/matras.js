
const initValues ={
    productPageSelector:'.product_box',
    linkSelector:'',
    linksToRemove:[],
    hostname:'https://www.matras.com/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {

    const data = await page.$$eval('.product_box', (productCards) => {
        return productCards.map(productCard => {
            try {
            const imageUrl = productCard.querySelector('.product_image img').src
            const title = productCard.querySelector('.product_name').textContent.replaceAll('\n','') 
            const priceNew = productCard.querySelector('.turkcell-price span').innerHTML.replaceAll('\n', '').replace('TL', '')
            const link = productCard.querySelector('.product_image a').href
         
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
                    error:error.toString(),content:document.innerHTML
                }
            }
         
        })
    })

return data
}

async function getUrls(page) {
    const url = await page.url()
  const nextPage =  await page.$('.filtreurun')
     const productCount = await page.evaluate(()=>parseInt(document.querySelector('.filtreurun').innerText.replace(/[^\d]/g,'')))
     const totalPages = Math.ceil(productCount / 32)
    const pageUrls = []
if(nextPage){
    
}
    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?page=` + i)


    }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }
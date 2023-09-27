

const initValues ={
    productPageSelector:'.product-list-grid',
    linkSelector:'.menu a',
    linksToRemove:[],
    hostname:'https://www.twist.com.tr/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {

    debugger;
    const url = await page.url()


    const data = await page.$$eval('[data-category-name]', (productCards,url) => {


        return productCards.map(productCard => {

            try {
                const priceNew = productCard.querySelector('.urunListe_satisFiyat').innerHTML.replace('₺', '').trim()
                const link = productCard.querySelector('.prd-lnk').href
                const imageUrl = productCard.querySelector('[data-background]') ? productCard.querySelector('[data-background]').getAttribute('data-background') : productCard.querySelector('[data-image-src]').getAttribute('data-image-src')
                const title = productCard.querySelector('.prd-name').textContent.replace(/\n/g, '').trim()
    
                return {
                    title: 'twist ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'twist',
    
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
    const nextPage =   await page.$('.prd-qty')
    let productCount=0
    const pageUrls = []

if(nextPage){
    const totalPages = Math.ceil(productCount / 15)
    for (let i = 2; i <= totalPages; i++) {
         productCount = await page.evaluate(() => parseInt(document.querySelector('.prd-qty').innerHTML.replace(/[^\d]/g, '')))
       
        pageUrls.push(`${url}?page=` + i)

    }
}


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }


const initValues ={
    productPageSelector:'.js-product-list-cards',
    linkSelector:'.newStaticPages a',
    linksToRemove:[],
    hostname:'https://www.mavi.com/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {
    const url = await page.url()
//await autoScroll(page)
  
    const data = await page.$$eval('.product-list-cards-inner .product-item', (items,url) => {
try {
    return items.map(document => {
        let productTitle = document.querySelector('.product-title').textContent
        let productDesc = document.querySelector('.product-desc').textContent
        const priceNew = document.querySelector('.price')? document.querySelector('.price').innerText.replace('TL', '').trim():document.querySelector('.ins-product-price').innerText.replace('TL', '')
        const link = document.querySelector('.product-card-info').href
        const imageUrl = document.querySelector('[data-cfsrc]')
        return {
           
            title: 'mavijeans ' + productTitle.replace(/\n/g, '').trim() + ' ' + productDesc.replace(/\n/g, '').trim(),
            priceNew,
            imageUrl,
            link,
            timestamp: Date.now(),
            marka: 'mavijeans',

        }
    })
} catch (error) {
    return {error:error.toString(),content:document.innerHTML}
}
    
    },url);

return data

}

async function getUrls(page) {
    const url = await page.url()
  const nextPage =  await page.$('.right-menu-item.product-number')
  let productCount =0
    const pageUrls = []

    if(nextPage){
         productCount = await page.$eval('.right-menu-item.product-number', element => parseInt(element.innerText.replace(/[^\d]/g, '')))
        const totalPages = Math.ceil(productCount / 24)
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?page=` + i)
        }
    }


    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}


module.exports = { extractor, getUrls,...initValues }
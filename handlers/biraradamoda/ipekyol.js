
async function extractor(page, context) {

    const url = await page.url()
debugger
    await page.waitForSelector('[data-product-id]')
    debugger;

    //await autoScroll(page)

    
    const data = await page.evaluate(() => {

        const items = Array.from(document.querySelectorAll('[data-product-id]'))
        return items.map(document => {
                try {
                    const priceNew =  document.querySelector('.urunListe_satisFiyat').innerText.replace('₺', '').trim()
                    const link = document.querySelector('.prd-lnk').href
                    const imageUrl = document.querySelector('[data-image-src]').getAttribute('data-image-src')
           
                    return {
                        title: 'ipekyol ' + document.querySelector('.prd-name span').innerHTML.replace(/İ/g, 'i').toLowerCase(),
                        priceNew,
                        imageUrl,
                        link,
                        timestamp: Date.now(),
                        marka: 'ipekyol',
                    }   
                } catch (error) {
                    return {error:error.toString(),content:document.innerHTML
                    }
                }
   
         })
    })


    return data
}


async function getUrls(page, param) {

    const url = await page.url()
    let productCount =0
    const nextPage = await page.$('.categories-title span')

    const pageUrls = []
if(nextPage){
     productCount = await page.evaluate(()=>parseInt(document.querySelector('.categories-title span').innerText.replace(/[^\d]/g,''))) 

    const totalPages = Math.ceil(productCount / 15)

    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`${url}?page=` + i)
   
    }
}

 

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
const productPageSelector='[data-product-id]'
const linkSelector='.menu.main-menu a'
const linksToRemove=[]
const hostname='https://www.ipekyol.com.tr/'
const exclude=[]
const postFix =''

module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }


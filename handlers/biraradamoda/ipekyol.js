
async function extractor(page, context) {

    const url = await page.url()
debugger
    await page.waitForSelector('[data-product-id]')
    debugger;

    //await autoScroll(page)

    
    const data = await page.evaluate(() => {

        const items = Array.from(document.querySelectorAll('[data-product-id]'))
        return items.map(item => {
                try {
                    const priceNew = item.querySelector('.prd-price .urunListe_satisFiyat') && item.querySelector('.prd-list .prd-price .urunListe_satisFiyat').textContent.replace('\n', '').replace('₺', '').trim()
                    const link = item.querySelector('a.prd-lnk.clicked-item') && item.querySelector('a.prd-lnk.clicked-item').href
                    const imageUrl = item.querySelector('[data-image-src]') && item.querySelector('[data-image-src]').getAttribute('data-image-src')
           
                    return {
                        title: item.querySelector('.prd-name span') && 'ipekyol ' + item.querySelector('.prd-name span').innerHTML.replace(/İ/g, 'i').toLowerCase(),
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


//main-links
const {linkExtractor}=require('../../utils/linkExtractor')
const initValues ={
     productPageSelector:'.product-listing',
     linkSelector:'.main-links a',
     linksToRemove:[],
     hostname:'https://www.levis.com.tr/',
     exclude:[],
     postFix :'',
}
async function extractor(page,context) {
        const alisverisBtn =await page.$('[data-js="menu-main-link"]')
        if(alisverisBtn){
            await page.click('[data-js="menu-main-link"]')
            debugger
            await page.waitForSelector('[data-js="mp-links"]');
            debugger
            await linkExtractor({...initValues, linkSelector:'[data-js="mp-tab-sub-link"]',candidateSelector:'.menu-panel .mp-links .js-active a[data-js="mp-tab-link"]',page,context,action:'click'})
        }
        // const closeBtn = await page.$('[data-js="btn-close-menu]')
        // if(closeBtn){
        //     await page.click('[data-js="btn-close-menu]')
        // }

    const data = await page.$$eval('[data-js="p-item"]', (productCards) => {
        return productCards.map(document => {
            try {
                const imageUrl = document.querySelector('.image img').src
                const title = document.querySelector('.image a').getAttribute('title')
                const priceNew = document.querySelector('.one-price') ? document.querySelector('.one-price').innerText.replace('TL', '').trim() : document.querySelector('.new-price').innerText.replace('TL', '').trim()
                const link = document.querySelector('.image a').href
       
                return {
                    title: 'levis ' + title.replace(/İ/g, 'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'levis',
                }
            } catch (error) {
                return {error:error.toString(),content:document.innerHTML}
            }
       
        })
    })

  return data
}

async function getUrls(page) {
    const url = await page.url()
    const hasNextPage = await page.$('.page-pagination a')
    const pageUrls = []
    if (hasNextPage) {

        const totalPages = await page.evaluate(() => parseInt(Math.max(...Array.from(document.querySelectorAll('.page-pagination a')).map(m => m.innerText).filter(Number))))

        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?p=` + i)
          
        }
    }


    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}


module.exports = { extractor, getUrls,...initValues }
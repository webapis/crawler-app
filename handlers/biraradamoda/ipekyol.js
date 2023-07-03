
async function handler(page, context) {

    const {  addUrl,start } = context
    const url = await page.url()

    debugger;//
    await page.waitForSelector('.prd-list')
    debugger;
    const data = await page.evaluate(() => {
  
        const items = Array.from(document.querySelectorAll('.prd-list'))
        return items.map(item => {

            const priceNew = item.querySelector('.prd-list .prd-price .urunListe_satisFiyat') && item.querySelector('.prd-list .prd-price .urunListe_satisFiyat').textContent.replace('\n', '').replace('₺', '').trim()

            debugger;
       
            const longlink =item.querySelector('a.prd-lnk.clicked-item')&& item.querySelector('a.prd-lnk.clicked-item').href
            const link =longlink&& longlink.substring(longlink.indexOf('https://www.ipekyol.com.tr/')+27)
            const longImgUrl =  item.querySelector('[data-image-src]') && item.querySelector('[data-image-src]').getAttribute('data-image-src')
            const imageUrlshort = longImgUrl&& longImgUrl.substring(longImgUrl.indexOf('https://img2-ipekyol.mncdn.com/mnresize/')+40)
            return {
                title: item.querySelector('.prd-name span') && 'ipekyol '+ item.querySelector('.prd-name span').innerHTML.replace(/İ/g,'i').toLowerCase(),
        
                priceNew,//:priceNew.replace('.','').replace(',00','').trim(),
  
                imageUrl:imageUrlshort,
                link,
     
                timestamp: Date.now(),
      
                marka: 'ipekyol',



            }
        }).filter(f => f.imageUrl !== null)
    } )

    console.log('data length_____', data.length)
    const nextPageExists = await page.$('.btnDefault.load-next')
    debugger;
    if (nextPageExists && start) {

debugger
        const nextPage = `${url}?page=2`
  
        debugger;
     addUrl({ url: nextPage,  start: false  })
    } else if (nextPageExists && !start) {
        debugger;
        const pageUrl = url.slice(0, url.lastIndexOf("=") + 1)
        const pageNumber = parseInt(url.substr(url.indexOf("=") + 1)) + 1
        const nextPage = pageUrl + pageNumber
   
        debugger;
        addUrl({ url: nextPage, start: false})

    }

    console.log('data length_____', data.length, 'url:', url)

    return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
}

async function getUrls(page, param) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}
module.exports = { handler, getUrls }
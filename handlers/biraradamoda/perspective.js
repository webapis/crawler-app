
async function handler(page, context) {


    const url = await page.url()
    debugger
    await page.waitForSelector('.ProductList')
    
    const acceptcookies = await page.$('#personaPersonaclickExitClose')
    if (acceptcookies) {
        await page.click('#personaPersonaclickExitClose')
    }
//document.querySelector('.DottetArea .Pages')
//document.querySelector('#personaPersonaclickExitClose')
//Array.from(document.querySelectorAll('.DottetArea .Pages [data-pgno]')).map(m=>m.innerHTML)
    const data = await page.$$eval('.Prd', (productCards) => {
        return productCards.map(productCard => {

            const longImgUrl = productCard.querySelector('[data-src]') ? productCard.querySelector('[data-src]').getAttribute('data-src') : productCard.querySelector('.PImage').src
            const title = productCard.querySelector('.PImage') ? productCard.querySelector('.PImage').alt : productCard.innerHTML
            const priceNew = productCard.querySelector('.PriceArea').querySelectorAll('span').length === 1 ? productCard.querySelector('.PriceArea').querySelectorAll('span')[0].innerHTML.trim().replace('₺', '').trim() : productCard.querySelector('.PriceArea').querySelectorAll('span')[1].innerHTML.trim().replace('₺', '').trim()
            const longlink = productCard.querySelector('.carousel-item a').href
            const link = longlink.substring(longlink.indexOf("https://www.perspective.com.tr/") + 31)

           // const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf("https://cdn.sorsware.com/") + 25)
            return {
                title: 'perspective ' + title.replace(/İ/g,'i').toLowerCase(),

                priceNew,//: priceNew.replace('.', '').replace(',', '.').trim(),

                imageUrl: longImgUrl,
                link,

                timestamp: Date.now(),

                marka: 'perspective',



            }
        })//.filter(f => f.imageUrl !== null)
    })

    console.log('data length_____', data.length, 'url:', url)


    return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
}

async function getUrls(page) {
    const url = await page.url()

    const pageUrls = []
  
    
        const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.DottetArea .Pages [data-pgno]')).map(m=>m.innerHTML).filter(Number).map(m => parseInt(m))))
  
debugger
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
    
    
    
            pageUrls.push(`${url}?p=` + i)
            --pagesLeft
    
    
        }

    
  

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }
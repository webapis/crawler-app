

async function handler(page) {

    const url = await page.url()
    await page.waitForSelector('.list-content')

   
      let   data = await page.$$eval('.product-item-box', (items) => {

            return items.map(document => {
                const priceNew = document.querySelector('.product-item-box a[data-price]').getAttribute('data-price')
                const longlink = document.querySelector('.info a').href
                const link = longlink.substring(longlink.indexOf('https://www.lovemybody.com.tr/') + 30)
                const longImgUrl = document.querySelector('.product-item-box a[data-image]').getAttribute('data-image')
                const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf('https://akn-lmb.b-cdn.net/') + 26)
                return {
                    title: 'lovemybody ' + document.querySelector('.product-item-box a[data-name]').getAttribute('data-name'),
                    priceNew,//: priceNew.replace('.', '').replace(',00', '').trim(),
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka: 'lovemybody',
    
                }
            })
        });
    


    debugger

    console.log('data length_____', data.length, 'url:', url)
    const formatedData =data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }}).filter(f=>f.title.toLowerCase().includes('çanta'))


    debugger
    return formatedData






}



async function getUrls(page) {

    const url = await page.url()
    await page.waitForSelector('.search-total-count span')
    const productCount = await page.evaluate(()=>parseInt(document.querySelector('.search-total-count span').innerText.replace(/[^\d]/g, '')))
    const totalPages = Math.ceil(productCount / 24)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }

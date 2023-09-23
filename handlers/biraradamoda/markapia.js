const {autoScroll}=require('../../utils/autoscroll')
const initValues ={
    productPageSelector:'.infinite-scroll-component__outerdiv',
    linkSelector:'.ddd',
    linksToRemove:[],
    hostname:'https://www.markapia.com/',
    exclude:[],
    postFix:''
  }
async function extractor(page) {


    await autoScroll(page)


    debugger

    const data = await page.$$eval('[data-id]', (productCards) => {
        return productCards.map(document => {
try {
    const imageUrl =Array.from(document.querySelector('[srcset]').getAttribute('srcset').split(',') ).find((f,i)=>i===10).trim().split(' ')[0]
    const title = document.querySelector('.product-name').innerText
    const priceNew = Array.from(document.querySelectorAll('.discount-price span')).reverse()[0].innerText.replace('₺','').trim()
    const link = document.querySelector('a').href

    return {
        title: 'markapia ' + title.replace(/İ/g, 'i').toLowerCase(),
        priceNew,
        imageUrl,
        link,
        timestamp: Date.now(),
        marka: 'markapia',
    }
} catch (error) {
    return { error: error.toString(), content: document.innerHTML };
}
        
        })
    })
debugger
 return data
}





async function getUrls(page) {
    //  const url = await page.url()
    //  await page.waitForSelector('.page_numbers span')
    // const productCount = await page.$eval('.catalog__meta--product-count span', element => parseInt(element.innerHTML))
    //const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.page_numbers span')).map(m => m.innerHTML).filter(Number)))
    const pageUrls = []

    // let pagesLeft = totalPages
    // for (let i = 2; i <= totalPages; i++) {



    //     pageUrls.push(`${url}?page=` + i)
    //     --pagesLeft


    // }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,...initValues }
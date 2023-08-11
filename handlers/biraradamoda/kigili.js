
async function handler(page, context) {

debugger
    await page.waitForSelector('.list-content')

   await autoScroll(page)
    debugger
    const data = await page.$$eval('.product-item-wrapper', (productCards) => {
        return productCards.map(document => {
                try {
                    const title = document.querySelector('.product-name a').innerText
                    const img= document.querySelector(".product-item-image-link [data-default-img]")?document.querySelector(".product-item-image-link [data-default-img]").getAttribute('data-default-img'):(document.querySelector(".product-item-image-link .product-item-image")?document.querySelector(".product-item-image-link .product-item-image").src: null)
                    const priceNew =document.querySelector('.product-sale-price').innerText.replace('TL','').trim()
                    const link = document.querySelector('.product-name a').href
        
                    return {
                        title: 'kigili '+title.replace(/İ/g,'i').replaceAll('-',' ').toLowerCase(),
                        priceNew,//:priceNew.replace(',','.'),
                        imageUrl:img,//&& img.substring(img.indexOf('https://kigili.akinoncdn.com/')+29),
                        link:link.substring(link.indexOf('https://www.kigili.com/')+23),
                        timestamp: Date.now(),
                        marka: 'kigili',
        
                    } 
                } catch (error) {
                    return {error:error.toString(),content:document.innerHTML}
                }
     
        })
    })
debugger

console.log('data length_____', data.length, 'url:', url)
    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })

debugger
    return formatprice//.filter(f => f.imageUrl !== null  && f.imageUrl.length>0 )




}




async function autoScroll(page) {
    await page.evaluate(async () => {


        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;

                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function getUrls(page) {

    const url = await page.url()
    await page.waitForSelector('.pagination .pagination-item')
    const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll(".pagination .pagination-item")).map(m=>m.innerText.trim()).filter(Number)))

    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }



async function handler(page) {

    const url = await page.url()

    debugger;

    await page.waitForSelector('.ProductList',{timeout:180000})
  // const totalProducts= await page.evaluate(()=>parseInt(document.querySelector("[for^=sidebar-filter-p-product_type]").innerText.replace(/[^\d]/g,"")))
    await autoScroll(page);

    debugger
    const data = await page.$$eval('.ProductItem', (productCards) => {
        return productCards.map(document => {
            try {
                const priceNew = document.querySelector('.ProductItem__Price').innerText.replace('TL','')
                const longlink = document.querySelector(".ProductItem__Title.Heading a").href
                 const link = longlink.substring(longlink.indexOf("https://www.bagmori.com/") + 24)
                const longImgUrl =document.querySelector('.ProductItem__Image').srcset.split(' ').filter(f=>f.includes('www.'))[3]
                 const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf("//www.bagmori.com/") + 18)//https://cdn3.sorsware.com/
                const title = document.querySelector(".ProductItem__Title.Heading a").innerText
                return {
                    title: 'bagmori ' + title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl: imageUrlshort,
                    link,
                    timestamp: Date.now(),
                    marka: 'bagmori',
                }
            } catch (error) {
                return {error,content:document.innerHTML}
            }
        
        })
    })

debugger

    //----------

    console.log('data length_____', data.length, 'url:', url)



    return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }}).filter(f=>f.priceNew !=="")
}


async function getUrls(page) {
    const url = await page.url()
    await page.waitForSelector('.Pagination__Nav a')

    const totalPages = await page.evaluate(()=>Math.max(...Array.from(document.querySelectorAll('.Pagination__Nav a')).map(m=>m.innerText).filter(Number)))
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {

        pageUrls.push(`https://www.bagmori.com/search?options%5Bprefix%5D=last&page=${i}&q=Canta&type=product`)
        --pagesLeft

    }

    return { pageUrls, productCount:0, pageLength: pageUrls.length + 1 }
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
            }, 150);
        });
    });
}
module.exports = { handler, getUrls }


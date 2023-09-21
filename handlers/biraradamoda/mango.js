const fetch =require('node-fetch')

async function handler(page, context) {
const url =await page.url()
    debugger;
    const response =await fetch(url)
debugger
const jsonData =await response.json()
debugger

const data = Object.values( jsonData.groups[0].garments).map(m=>m.colors).flat().map(m=>{
    
    const imageUrl=m.images[0].img1Src
    return {
    imageUrl,
    title:'mango '+m.images[0].
    altText,
    priceNew:m.price. salePriceNoCurrency,
    link:m.linkAnchor.substring(1),

    timestamp: Date.now(),
    marka: 'mango',
}})


    return data
}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}


module.exports = { handler, getUrls }


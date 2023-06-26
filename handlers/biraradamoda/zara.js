const { Dataset  } =require ('crawlee');
async function handler(page, context) {
    const { request: { userData: { } } } = context
    const productsDataset = await Dataset.open(`products`);
    const url = await page.url()
    await page.waitForSelector('.product-grid-block-dynamic.product-grid-block-dynamic__container')

    await page.evaluate(async () => {
        var totalHeight = 0;
        var distance = 100;
        let inc = 0
        window.scrollBy(0, distance);
        totalHeight += distance;
        inc = inc + 1
    });

    await page.waitFor(5000)
    const { items } = await productsDataset.getData()
    const data = items.filter(f => f.productGroups).map(m => [...m.productGroups]).flat().map(m => {

        return [...m.elements]
    }).flat().filter(f => f.commercialComponents).map(m => [...m.commercialComponents]).flat().filter(f=> f.price).map(c => {
        try {
            return {
                ...c, detail: {
                    ...c.detail, colors: c.detail.colors.map(m => {
                        const imageUrl = m.xmedia[0].path + '/w/315/' + m.xmedia[0].name + '.jpg?ts=' + m.xmedia[0].timestamp
                        const link = c.seo.keyword + '-p' + c.seo.seoProductId + '.html'
                        const price = m.price.toString().length === 5 ? m.price.toString().substring(0, 3) + ',' + m.price.toString().substring(3) : (m.price.toString().length === 6 ? m.price.toString().charAt(0) + '.' + m.price.toString().substring(1, 4) + ',00' : null)

                        return {
                            ...m, title: "zara " + c.name + ' ' + m.name, priceNew: price, imageUrl, link

                        }
                    })
                }
            }
        } catch (error) {
            debugger
        }

    }).map(m => {
        return [...m.detail.colors]

    }).flat().map(m => {
        return {
            title: m.title, priceNew: m.priceNew, imageUrl: m.imageUrl, link: m.link, timestamp: Date.now(),
            marka: "zara"
        }
    })
    // debugger;

    console.log('data length_____', data.length, 'url:', url)



    debugger
    return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}


module.exports = { handler, getUrls }


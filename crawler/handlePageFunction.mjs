export default   (context)=>  {


    const { page, request: { userData: { start, opts } } } = context


    const { handler, getUrls } = require(`./handlers/biraradamoda/${process.env.marka}`);
    const { pageUrls, productCount } = await getUrls(page)
    process.env.productCount = productCount

    if (start) {
        let order = 1
        for (let url of pageUrls) {
            if (pageUrls.length === order) {
                await requestQueue.addRequest({ url, userData: { start: false, opts, } })
            } else {
                await requestQueue.addRequest({ url, userData: { start: false, opts, } })
            }
            ++order;
        }
    }

    const dataCollected = await handler(page, context)
    if (dataCollected.length > 0) {
        await productsDataset.pushData(dataCollected)

        process.env.dataLength = parseInt(process.env.dataLength) + dataCollected.length


    } else {
        console.log('unsuccessfull page data collection')

        // throw 'unsuccessfull data collection'
    }



};


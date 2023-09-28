const initValues ={
  productPageSelector:'.fl.col-12.catalogWrapper',
  linkSelector:'#mainMenu a',
  linksToRemove:[],
  hostname:'https://www.vitrin.com.tr/',
  exclude:[],
  postFix:''
}
async function extractor(page) {

  const url = await page.url();
  debugger;

  const products = await page.evaluate(() => window.PRODUCT_DATA);


  debugger;

  const data = products.map((document) => {
    try {
      const longImage = document.image;
      const title = document.name;
      const priceNew = document.total_sale_price.toString().replace(".", ",");
      const link = "https://www.vitrin.com.tr/"+ document.url;

      return {
        title: "vitrin " + title.replace(/İ/g, "i").toLowerCase(),
        priceNew, 
        imageUrl: longImage, 
        link,
        timestamp: Date.now(),
        marka: "vitrin",
      };
    } catch (error) {
      return { error: error.toString(),url, content: document.innerHTML };
    }
  });


  return data
}

async function getUrls(page) {
    debugger;
    const url = await page.url();
    const hasNextPage = await page.$(".productPager");
    const pageUrls = [];
    if (hasNextPage) {
      const totalPages = await page.evaluate(() =>
        Math.max(
          ...Array.from(document.querySelectorAll(".productPager a[title]"))
            .map((m) => m.getAttribute("title").replace(/[^\d]/g, ""))
            .filter(Number)
            .map((m) => parseInt(m))
        )
      );
   
  
 
      for (let i = 2; i <= totalPages; i++) {
        pageUrls.push(`${url}?pg=` + i);
    
      }
    }
  
    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 };
  }
  module.exports = { extractor, getUrls,...initValues }

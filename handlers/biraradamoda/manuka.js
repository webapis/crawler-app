
<<<<<<< HEAD
const {autoScroll}=require('../../utils/autoscroll')
=======
>>>>>>> 2c545d90b157b730858dbcd3a328da59704c38d4
const initValues ={
  productPageSelector:'.catalogWrapper',
  linkSelector:'#mainMenu a',
  linksToRemove:[],
  hostname:'https://www.manuka.com.tr/',
  exclude:[],
  postFix:''
}
<<<<<<< HEAD

async function extractor(page) {
    debugger;

=======
async function extractor(page) {



>>>>>>> 2c545d90b157b730858dbcd3a328da59704c38d4
  await page.click('.dropdown a')
  debugger
  await page.click('span[value="tr"]')
  debugger
  await page.waitForNavigation()
  debugger
    await autoScroll(page);
    debugger;
  
    const data = await page.$$eval(".catalogWrapper .productItem", (productCards) => {
      return productCards.map((document) => {
        try {
            const title = document.querySelector('.detailLink img').alt
            const imageUrl=document.querySelector('.detailLink picture source[media="(max-width:1000px)"]').getAttribute('data-srcset')
            const link=document.querySelector('.detailLink').href
            const priceNew=document.querySelector('.currentPrice').innerText.replace("TL",'').trim()
          return {
                      title: 'manuka ' + title.replace(/İ/g,'i').toLowerCase(),
                      priceNew,
                      imageUrl,
                      link,
                      timestamp: Date.now(),
                      marka: 'manuka',
          };
        } catch (error) {
          return { error: error.toString(), content: document.innerHTML };
        }
      });
    })
  return data
  }
  

  async function getUrls(page) {
    const pageUrls = [];
  
    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 };
  }
  module.exports = { extractor, getUrls,...initValues }
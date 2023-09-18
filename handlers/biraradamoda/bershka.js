async function extractor(page) {
  debugger;
  const url = await page.url();


  await autoScroll(page);
  debugger;

  const data = await page.$$eval(".category-product-card", (productCards) => {
    return productCards.map((document) => {
      try {
        const imageUrl = document
          .querySelector(".category-product-card a img")
          .getAttribute("data-original");
        const title = document.querySelector(".product-image img").alt;
        const priceNew = document
          .querySelector(".current-price-elem")
          .innerText.replace("TL", "")
          .trim();
        const longlink = document.querySelector(
          ".category-product-card a"
        ).href;
        const link = longlink.substring(
          longlink.indexOf("https://www.bershka.com/") + 24
        );
        const imageUrlshort = imageUrl.substring(
          imageUrl.indexOf("https://static.bershka.net/") + 27
        );

        return {
          title: "bershka " + title,
          priceNew,
          imageUrl: imageUrlshort,
          link,
          timestamp: Date.now(),
          marka: "bershka",
        };
      } catch (error) {
        return { error: error.toString(), content: document.innerHTML };
      }
    });
  })
return data
}

async function autoScroll(page) {
  page.on("console", (message) => {
    console.log("Message from Puppeteer page:", message.text());
  });
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      let inc = 0;

      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;

        window.scrollBy(0, distance);
        totalHeight += distance;
        inc = inc + 1;
        console.log("inc", inc);
        if (totalHeight >= scrollHeight - window.innerHeight) {
          if (inc === 50) {
            clearInterval(timer);
            resolve();
          }
        } else {
          inc = 0;
        }
      }, 500);
    });
  });
}

const productPageSelector='span.bskico-filter'
const linkSelector='[class^="menu"] a'
const linksToRemove=[]
const hostname='https://www.bershka.com/tr/'
const exclude=[]
const postFix =''
async function getUrls(page) {
  const pageUrls = [];

  return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 };
}
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname ,exclude,postFix }

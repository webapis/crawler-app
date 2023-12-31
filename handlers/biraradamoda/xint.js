async function handler(page, context) {
  const url = await page.url();
  debugger;
  await page.waitForSelector(".fl.col-12.catalogWrapper");
  const products = await page.evaluate(() => window.PRODUCT_DATA);

  debugger;

  const data = products.map((document) => {
    try {
      const longImage = document.image;
      const title = document.name;
      const priceNew = document.total_sale_price; //.toString().replace('.',',')
      const link = document.url;

      return {
        title: "xint " + title.replace(/İ/g, "i").toLowerCase(),
        priceNew,
        imageUrl: longImage, //.substring(longImage.indexOf('https://www.xint.com.tr/') + 24),
        link,
        timestamp: Date.now(),
        marka: "xint",
      };
    } catch (error) {
      return { error: error.toString(), content: document.innerHTML };
    }
  });

  console.log("data length_____", data.length, "url:", url);

  return data.map((m) => {
    return { ...m, title: m.title + " _" + process.env.GENDER };
  });
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
    debugger;

    let pagesLeft = totalPages;
    for (let i = 2; i <= totalPages; i++) {
      pageUrls.push(`${url}?pg=` + i);
      --pagesLeft;
    }
  }

  return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 };
}
module.exports = { handler, getUrls };

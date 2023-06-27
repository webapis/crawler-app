import puppeteer from'puppeteer';

async function scrapeWebsite(url) {
  const maxRetries = 3;
  let retryCount = 0;
  let success = false;

  while (retryCount < maxRetries && !success) {
    const browser = await puppeteer.launch({headless:false,executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\chrome.exe'});
    const page = await browser.newPage();

    try {
      await page.goto(url);
      const pageTitle = await page.title();
      console.log(`Page title (${url}):`, pageTitle);

      // Take a screenshot of the page
      await page.screenshot({ path: `screenshot_${url.replace(/[^a-zA-Z0-9]/g, '')}.png` });

      success = true;
    } catch (error) {
      console.error(`An error occurred (${url}):`, error);
      retryCount++;
      console.log(`Retrying (${url}) - attempt ${retryCount} of ${maxRetries}...`);
    } finally {
      await page.close();
      await browser.close();
    }
  }

  if (!success) {
    console.error(`The operation failed for (${url}) after maximum retries.`);
  } else {
    // Add additional URLs to scrape if success
    const additionalUrls = [
      'https://www.example.com/page1',
      'https://www.example.com/page2',
      'https://www.example.com/page3',
    ];
    for (const additionalUrl of additionalUrls) {
      await scrapeWebsite(additionalUrl);
    }
  }
}

async function runDemo() {
  const urls = [
    'https://www.example.com',
    'https://www.google.com',
    'https://www.openai.com',
  ];

  const promises = urls.map(url => scrapeWebsite(url));
  await Promise.all(promises);
}

export default runDemo
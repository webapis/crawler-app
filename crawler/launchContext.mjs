export default {
    // Chrome with stealth should work for most websites.
    // If it doesn't, feel free to remove this.
    // useChrome: true,
    launchOptions: {
    
      //  headless: process.env.HEADLESS === 'true' ? true : false,
         args: ['--no-sandbox', '--disable-setuid-sandbox', "--disable-web-security",
            `--window-size=1200,1250`,
            // "--allow-insecure-localhost",
            // //  "--user-data-dir=/tmp/foo",
            // "--ignore-certificate-errors",
            // '--disable-gpu-rasterization',
            // '--disable-low-res-tiling',
            // '--disable-skia-runtime-opts',
            // '--disable-yuv420-biplanar',
            // '--disable-site-isolation-trials',
            // '--disable-dev-shm-usage',
            //'--lang=en-US,en'
            // '--shm-size=3gb'

        ],
        env: { LANGUAGE: "en_US" }
    }}
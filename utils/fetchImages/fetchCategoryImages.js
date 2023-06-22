const { fetchImages } = require('./fetchImages')
const makeDir = require('make-dir')
const fetch = require('node-fetch')
const plimit = require('p-limit')
const limit = plimit(5);
const categoryNavigation = require('../../src/category-nav-counter.json')
const imagePrefixCloudinary = 'https://res.cloudinary.com/codergihub/image/fetch/h_200/'
const fs = require('fs')
const placeholders = require('../../src/drawer/imageComponent/placeholders.json')
const path = require('path')
var promiseRetry = require('promise-retry');
debugger

async function fetchPromise({ imageUrls, groupName, title }) {

    return new Promise(async (resolve, reject) => {
        try {
            const urls = []
            if (imageUrls ) {
                for (let u of imageUrls) {

                    const { marka, src, title } = u
                 
                    const imageSource = placeholders[marka].imageHost.trim() + src
                    const filename = path.basename(src).toLocaleLowerCase()
                    const cleanFileName = ('_' + filename.slice(0, filename.indexOf('.jpg'))).replace(/\./g, "") + '.jpg'
                    const dirname = path.join(process.cwd(), `sprites`, groupName, `${cleanFileName}`)
                    const dirpath = path.dirname(dirname)
                    await makeDir(dirpath)
                    urls.push({ url: imageSource, filepath: path.join(process.cwd(), 'sprites', groupName, `${cleanFileName}`),imgTitle:title })
                }
                const {filepath,title:imgTitle} = await fetchImages(urls)
                const unchangedGropData = categoryNavigation[groupName]
                const changedData = { ...unchangedGropData.find(f => f.title === title), imageUrls: { filename: path.basename(filepath.toLocaleLowerCase(), '.jpg'), title:imgTitle } }
                categoryNavigation[groupName] = [...unchangedGropData.filter(f => f.title !== title), changedData]


                resolve(true)
            }
            resolve(true)

        } catch (error) {
            debugger
            reject(error)
        }



    })
}

async function fetchCategoryImages() {


    const promises = []

    await Object.entries(categoryNavigation).map(async (m) => {
        const groupName = m[0]
        const categories = m[1]
        categories.forEach(cat => {
            const { imageUrls, title } = cat
            
debugger
            promises.push(limit(async () => await fetchPromise({ imageUrls, groupName, title })))

        })




    })
    try {
        const response = await Promise.all(promises)
        if (fs.existsSync(path.join(process.cwd(), 'src/category-nav-counter-image.json'))) {
            fs.unlinkSync(path.join(process.cwd(), 'src/category-nav-counter-image.json'))
        }
        debugger
        fs.writeFileSync(path.join(process.cwd(), 'src/category-nav-counter-image.json'), JSON.stringify(categoryNavigation))
        process.exit(0)

    } catch (error) {
        console.log('error__', error)
        debugger
    }


}

(async () => {

    await fetchCategoryImages()
    console.log('fetch images complete')
})()


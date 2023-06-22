



const { getGoogleToken } = require('../google/google.oauth')
const fs = require('fs')
const { getSheetValues, appendSheetValues } = require('../google.sheet.js')
const makeDir = require('make-dir');
const path =require('path')
var through = require("through2");
var jsonArrayStreams = require("json-array-streams");


async function categorizeData() {
    const google_access_token = await getGoogleToken()
    const sheetData = await getSheetValues({ access_token: google_access_token, spreadsheetId: '1TVFTCbMIlLXFxeXICx2VuK0XtlNLpmiJxn6fJfRclRw', range: 'categoriestest!A:C' })
    let categoryItems = []
    for (let value of sheetData.values.filter((c, i) => i > 0)) {
        const subcategory = value[0]
        const category = value[1]
        const regex = value[2]

        categoryItems.push({ subcategory, category, regex })
    }


    return new Promise(async (resolve, reject) => {
        if (fs.existsSync(`${process.cwd()}/api/_files/kadin/data.json`)) {
            fs.unlinkSync(`${process.cwd()}/api/_files/kadin/data.json`)
        }
        const dirname = path.dirname(`${process.cwd()}/api/_files/kadin/data.json`)
    
        await makeDir(dirname)
        fs.appendFileSync(`${process.cwd()}/api/_files/kadin/data.json`, '')
        let counter = 0
        const writeStream = fs.createWriteStream(`${process.cwd()}/api/_files/kadin/data.json`)
        writeStream.write('[')
        const readstream = fs.createReadStream(`${process.cwd()}/data-unique/data.json`)
        const data = fs.readFileSync(`${process.cwd()}/data-unique/data.json`)
        const totalObjects = JSON.parse(data).length
        let objCounter = 0
        let countCategories ={}
        readstream.pipe(jsonArrayStreams.parse())
            .pipe(through.obj(async function (object, enc, cb) {
                const { title
                } = object
                const subcategorymatch = categoryItems.find(c => {
                    const regex = new RegExp(c.regex, 'i')
                    const result = regex.test(title.toLowerCase())

                    return result === true
                })
                if(subcategorymatch !==undefined){
                    let categoryExistsintitle =  new RegExp(subcategorymatch.category, 'i').test(title)
                   // let category = categoryExistsintitle ? '' : "_" + subcategorymatch.category + "_" 
                    const categorizedObject = { ...object, title }
                    writeStream.write(JSON.stringify(categorizedObject))
                } else
                {
                    const categorizedObject = { ...object, title: title + "_belirsiz" }
                    writeStream.write(JSON.stringify(categorizedObject))
    
                }
                ++ objCounter

                if (objCounter === totalObjects) {

                    writeStream.write(']')
                } else {
                    writeStream.write(',')
                }
                cb();
             
            }))

        readstream.on('data', (data) => {

          
        })
        readstream.on('close', (data) => {
            console.log('closed')

            return resolve(true)

        })

        readstream.on('error', (error) => {

            return reject(error)
        })
    })
}


(async () => {

    console.log('------------------------DATA CATEGORIZATION STARTED----------------------------------')
    await categorizeData()
    console.log('------------------------DATA CATEGORIZATION ENDED----------------------------------')
    process.exit(0)
})()
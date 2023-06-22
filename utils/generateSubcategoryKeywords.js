require('dotenv').config()


async function generateSubcategoryKeywords() {
    const fs = require('fs')
    const makeDir = require('make-dir');
    const { getSheetValues } = require('../google.sheet.js')
    const { getGoogleToken } = require('../google/google.oauth')
    const keywords = require('../api/_files/nav/keywords.json')
    const keywordsObj = {}
    for (let k of keywords) {

        keywordsObj[k.title] = k


    }
    debugger

    const spreadsheetId = '1A4FWttdgPq2kaT2fr_Z0ke3ETfK8ndjiyEc7nvJ4xHk'
    const website = process.env.WEBSITE
    const google_access_token = await getGoogleToken()

    let categoryItems = []
    const sheetData = await getSheetValues({ access_token: google_access_token, spreadsheetId, range: `${website}!A:G` })
    debugger
    for (let value of sheetData.values.filter((c, i) => i > 0)) {
        const keywords = value[0]
        const subcategory =value[1]
        const exact = value[2]
        const exclude = value[3]
        const functionName = value[4]
        const groupDescription = value[5]
        const sort = value[6]
        const group = value[7]
    
        categoryItems.push({keywords, subcategory, exact, exclude, functionName, groupDescription, sort, group })

    }


    await makeDir(`subcategory-keywords/${website}`)

    if (fs.existsSync(`subcategory-keywords/${website}/keywords.json`)) {
        fs.unlinkSync(`subcategory-keywords/${website}/keywords.json`)
    }
    fs.appendFileSync(`subcategory-keywords/${website}/keywords.json`, JSON.stringify(categoryItems))

    if (fs.existsSync(`src/category-nav.json`)) {
        fs.unlinkSync(`src/category-nav.json`)
    }
    const mappedCatItems = categoryItems.map(m => {
        let index=''
        if(keywordsObj[m.subcategory] ===undefined || keywordsObj[m.subcategory].index===undefined){
            debugger
            index=undefined
        }
        else{
            index = keywordsObj[m.subcategory].index
        
        }

        


        return { ...m, index: index + '-' }
    })
    debugger
    const grouped = groupBy([...mappedCatItems, { subcategory: 'diger', exact: '', exclude: '', functionName: 'diger', groupDescrption: 'diger', sort: 100, group: 'diger', index: '0-' }], 'groupDescription')
    fs.appendFileSync(`src/category-nav.json`, JSON.stringify(grouped))

}

(async () => {

    await generateSubcategoryKeywords()

})()



var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};
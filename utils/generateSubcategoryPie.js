const fs = require('fs')
const path = require('path')
const dirs = fs.readdirSync('./urls')
const { walkSync } = require('./walkSync')

function generateSubcategoryPie() {


    const date = new Date().toISOString()
    const brandNames = dirs.map(m => m.replace('.js', ''))

    debugger
    let subcategories = {}
    const reportPath = path.join(process.cwd(), `projects/trends/src/total-subcategory-pie.json`)
    const reportexists = fs.existsSync(reportPath)
    if (reportexists) {
        const previousreport = JSON.parse(fs.readFileSync(reportPath, { encoding: 'utf-8' }))
        subcategories = previousreport

        for (let m of brandNames){
            const current = require(`${process.cwd()}/urls/${m}`)
            const mappedurls = current.urls.map(m => m.subcategory).flat()
            const uniquedata = [...new Set(mappedurls)];
            subcategories  = Object.assign({}, {...subcategories,...uniquedata.reduce((a, v) => ({ ...a, [v]: { data: { [date]: 0 } } }), {})})

         }

    } else {
         for (let m of brandNames){
            const current = require(`${process.cwd()}/urls/${m}`)
            const mappedurls = current.urls.map(m => m.subcategory).flat()
            const uniquedata = [...new Set(mappedurls)];
            subcategories  = Object.assign({}, {...subcategories,...uniquedata.reduce((a, v) => ({ ...a, [v]: { data: { [date]: 0 } } }), {})})

         }
      
      

        
    }


    walkSync(path.join(process.cwd(), `projects/dream/data`), (filepath) => {

        const fileName = filepath.replace(/[\\]/g, "-").replace(/[/]/g, "-").split('-')

        const subcategory = fileName[10]
        if (subcategories[subcategory] === undefined) {
            subcategories[subcategory] = { data: { [date]: 0 } }
        }
        if (subcategories[subcategory].data === undefined) {
            subcategories[subcategory].data = { [date]: 0 }
        }
        if (subcategories[subcategory].data[date] === undefined) {
            subcategories[subcategory].data[date] = 0
        }
        subcategories[subcategory].data[date] = subcategories[subcategory].data[date] + 1


    })

    debugger
    fs.writeFileSync(reportPath, JSON.stringify(subcategories))
    debugger

}

module.exports = { generateSubcategoryPie }
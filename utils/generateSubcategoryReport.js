const fs = require('fs')
const path = require('path')
const dirs = fs.readdirSync('./urls')
const { walkSync } = require('./walkSync')

function generateSubcategoryReport() {


    const date = new Date().toISOString()
    const brandNames = dirs.map(m => m.replace('.js', ''))

    debugger
    let markas = {}
    const reportPath = path.join(process.cwd(), `projects/trends/src/total-subcategory.json`)
    const reportexists = fs.existsSync(reportPath)
    if (reportexists) {
        const previousreport = JSON.parse(fs.readFileSync(reportPath, { encoding: 'utf-8' }))
        markas = previousreport
        for (let m of brandNames) {
            const current = require(`../urls/${m}`)
            const mappedurls = current.urls.map(m => m.subcategory).flat()
            const uniquedata = [...new Set(mappedurls)];
            const props = Object.assign({}, uniquedata.reduce((a, v) => ({ ...a, [v]: { data: { [date]: 0 } } }), {}))
            if (markas[m] === undefined) {
                markas[m] = {
                    ...props
                }
            }

        }
    } else {
        for (let m of brandNames) {
            const current = require(`../urls/${m}`)
            const mappedurls = current.urls.map(m => m.subcategory).flat()
            const uniquedata = [...new Set(mappedurls)];
            const props = Object.assign({}, uniquedata.reduce((a, v) => ({ ...a, [v]: { data: { [date]: 0 } } }), {}))
            if (markas[m] === undefined) {
                markas[m] = {
                    ...props
                }
            }

        }
    }
    debugger

    walkSync(path.join(process.cwd(), `projects/dream/data`), (filepath) => {

        const fileName = filepath.replace(/[\\]/g, "-").replace(/[/]/g, "-").split('-')
        const marka = fileName[9]
        const subcategory = fileName[10]
        if (markas[marka][subcategory] === undefined) {
            markas[marka][subcategory] = { data: { [date]: 0 } }
        }
        if (markas[marka][subcategory].data === undefined) {
            markas[marka][subcategory].data = { [date]: 0 }
        }
        if (markas[marka][subcategory].data[date] === undefined) {
            markas[marka][subcategory].data[date] = 0
        }
        markas[marka][subcategory].data[date] = markas[marka][subcategory].data[date] + 1


    })

    debugger
    fs.writeFileSync(reportPath, JSON.stringify(markas))
    debugger

}

module.exports = { generateSubcategoryReport }
const fs = require('fs')
const path = require('path')
const dirs = fs.readdirSync('./urls')
const { walkSync } = require('./walkSync')

function generateBrendReport() {



    let markas = {}
    const date = new Date().toISOString()
    dirs.map(m => m.replace('.js', '')).map(m => {
        if (markas[m] === undefined) {

            markas[m] = { data: { [date]: 0 } }
        }

        return null
    })

    const reportPath = path.join(process.cwd(), `projects/trends/src/total-markas.json`)
    const reportexists = fs.existsSync(reportPath)
    if (reportexists) {
        const previousreport = JSON.parse(fs.readFileSync(reportPath, { encoding: 'utf-8' }))
        markas = previousreport
        dirs.map(m => m.replace('.js', '')).map(m => {
            if (markas[m] === undefined) {

                markas[m] = { data: { [date]: 0 } }
            }
            if (markas[m].data[date] === undefined) {
                markas[m] = { data: { ...markas[m].data, [date]: 0 } }
            }

            return null
        })
    } else {

        dirs.map(m => m.replace('.js', '')).map(m => {
            if (markas[m] === undefined) {

                markas[m] = { data: { [date]: 0 } }
            }
            if (markas[m].data[date] === undefined) {
                markas[m] = { data: { ...markas[m].data, [date]: 0 } }
            }
            return null
        })
    }
    debugger

    walkSync(path.join(process.cwd(), `projects/dream/data`), (filepath) => {

        const fileName = filepath.replace(/[\\]/g, "-").replace(/[/]/g, "-").split('-')
        const marka = fileName[9]
    
        debugger
        if(    markas[marka] ===undefined){

            markas[marka] = { data: { [date]: 0 } } 
        }
        markas[marka].data[date] = markas[marka].data[date] + 1


    })

    debugger
    fs.writeFileSync(reportPath, JSON.stringify(markas))
    debugger

}

module.exports = { generateBrendReport }
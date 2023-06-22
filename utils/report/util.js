require('dotenv').config()
const { walkSync } = require('../walkSync')
const path = require('path')
const fs = require('fs')
const makeDir = require('make-dir')
function countTotal(dirpath, reportFilePath) {
    const folderPath = path.join(process.cwd(), `${dirpath}`)

    if (fs.existsSync(folderPath)) {


        let total = 0
        const date = new Date().toISOString()
        walkSync(folderPath, async (file) => {

            try {

                const data = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }))
                total = total + data.length

            } catch (error) {
                console.log('file deletion error', error)

                throw error
            }
        })
        const savePath = path.join(process.cwd(), `${reportFilePath}`)
        if (fs.existsSync(savePath)) {

            let data = JSON.parse(fs.readFileSync(savePath, { encoding: 'utf-8' }))

            fs.writeFileSync(savePath, JSON.stringify([...data, { date, total }]))


        } else {

            fs.writeFileSync(savePath, JSON.stringify([{ date, total }]))

        }
    }
}

function countTotalCollected(dirpath, reportFilePath) {
    const folderPath = path.join(process.cwd(), `${dirpath}`)
    if (fs.existsSync(folderPath)) {

        let total = 0
        const date = new Date().toISOString()
        walkSync(folderPath, async () => {

            try {
                total = total + 1


            } catch (error) {
                console.log('file deletion error', error)

                throw error
            }
        })
        const savePatha = path.join(process.cwd(), `${reportFilePath}`)
        if (fs.existsSync(savePatha)) {

            let data = JSON.parse(fs.readFileSync(savePatha, { encoding: 'utf-8' }))
            fs.unlinkSync(savePatha)
            if (data.length === 0) {
      
                fs.writeFileSync(savePatha, JSON.stringify([{ data: [{ date, total }] }]))
            } else {
           
                fs.writeFileSync(savePatha, JSON.stringify([{ data: [...data[0].data, { date, total }] }]))
            }
  



        } else {
            fs.writeFileSync(savePatha, JSON.stringify([{ data: [{ date, total }] }]))

        }
    }
}


function countTotalCollectedByBrand() {

    const dirpath = `data/${process.env.WEBSITE}`
    const reportPath = path.join(`${process.cwd()}`, `projects/trends/public/reports/total-collected-by-brand-bar.json`)
    const previousreport = JSON.parse(fs.readFileSync(path.join(`${process.cwd()}`, `projects/trends/public/reports/total-collected-by-brand-bar.json`), { encoding: 'utf-8' }))
    debugger
    const dirs = fs.readdirSync(`${process.cwd()}/urls/${process.env.WEBSITE}/${process.env.GENDER}`)
    debugger
    const folderPath = path.join(process.cwd(), `${dirpath}`)
    const date = new Date().toISOString()
    debugger
    if (fs.existsSync(folderPath)) {
        let markas = {}
    
        walkSync(folderPath, (filepath) => {
    
            const fileName = filepath.replace(/[\\]/g, "-").replace(/[/]/g, "-").split('-')
            const marka = fileName[8]
    
            if (markas[marka] === undefined) {
    
                markas[marka] = { data: { count: 0 } }
            }
            markas[marka].data.count = markas[marka].data.count + 1
    
        })
        for (let m of dirs) {
            const current = m.replace('.js', '')
            debugger
    
    
    
            const obj = markas[current]
     
            if (obj) {
                const exists = previousreport.length > 0 && previousreport.find(f => f.title === current)
                if (exists) {
                    exists.data = [...exists.data, { date, total: obj.data.count }]
    
                } else {
                    previousreport.push({ title: current, data: [{ date, total: obj.data.count }] })
                    debugger
                }
    
            }else{
                const exists = previousreport.length > 0 && previousreport.find(f => f.title === current)
                if (exists) {
                    exists.data = [...exists.data, { date, total: 0 }]
    
                } else {
                    previousreport.push({ title: current, data: [{ date, total: 0 }] })
                    debugger
                } 
            }
    
    
    
            debugger
    
        }
    
        fs.writeFileSync(reportPath, JSON.stringify(previousreport))
    
    
    }
    
}

function countTotalCollectedBySubcategory() {
    const keywords = require(`${process.cwd()}/api/_files/nav/keywords.json`)

    const categories = keywords.filter(f => f.keywordType === 'category')
    const categoriesCallected = Object.values(require(`${process.cwd()}/src/category-nav-counter.json`)).flat()
    const previousreport = require(`${process.cwd()}/projects/trends/public/reports/total-collected-by-subcategory-bar.json`)
    const date = new Date().toISOString()

    for (let cat of categories) {

        let count = categoriesCallected.find(f => f.title === cat.title).count
        let precountExist = previousreport.find(f => f.title === cat.title)
        //previously counted and last time also counted
        if (precountExist && count) {

            precountExist.data = [...precountExist.data, { date, total: count }]
        }
        //first time count counted
        else if (!precountExist && count) {

            previousreport.push({ data: [{ date, total: count }], title: cat.title })
        }
        //counting missed
        else if (precountExist && !count) {

            precountExist.data = [...precountExist.data, { date, total: 0 }]
        }
        if (!precountExist && !count) {
            previousreport.push({ data: [{ date, total: 0 }], title: cat.title })
        }


    }



    const updatedReport = previousreport

    fs.unlinkSync('./projects/trends/public/reports/total-collected-by-subcategory-bar.json')
    fs.writeFileSync('./projects/trends/public/reports/total-collected-by-subcategory-bar.json', JSON.stringify(updatedReport))


}

function countTotalCollectedBySubcategoryPie() {
    const keywords = require(`${process.cwd()}/api/_files/nav/keywords.json`)
    const fs = require('fs')

    const categoriesCallected = Object.values(require(`${process.cwd()}/src/category-nav-counter.json`)).flat()
    const previousreport = require(`${process.cwd()}/projects/trends/public/reports/collected-subcategory-pie.json`)
    const date = new Date().toISOString()





    const updatedReport = [...previousreport, { data: categoriesCallected, date }]

    fs.unlinkSync('./projects/trends/public/reports/collected-subcategory-pie.json')
    fs.writeFileSync('./projects/trends/public/reports/collected-subcategory-pie.json', JSON.stringify(updatedReport))



}
function countByBrand(dirpath, reportFilePath) {
    const dirs = fs.readdirSync('./urls')

    const folderPath = path.join(process.cwd(), `${dirpath}`)
    if (fs.existsSync(folderPath)) {
        let markas = {}
        const date = new Date().toISOString()
        dirs.map(m => m.replace('.js', '')).map(m => {
            if (markas[m] === undefined) {

                markas[m] = { data: { [date]: 0 } }
            }

            return null
        })

        const reportPath = path.join(process.cwd(), `${reportFilePath}`)
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


        walkSync(folderPath, (filepath) => {


            const data = JSON.parse(fs.readFileSync(filepath, { encoding: 'utf-8' }))

            data.forEach(d => {
                const { marka } = d

                if (markas[marka] === undefined) {

                    markas[marka] = { data: { [date]: 0 } }
                }
                markas[marka].data[date] = markas[marka].data[date] + 1
            })




        })
        const savePath = path.join(process.cwd(), `${reportFilePath}`)

        fs.writeFileSync(savePath, JSON.stringify(markas))


    }
}




function countByBrandDeleted(dirpath, reportFilePath) {
    const dirs = fs.readdirSync('./urls')
    const folderPath = path.join(process.cwd(), `${dirpath}`)

    if (fs.existsSync(folderPath)) {
        let markas = {}
        const date = new Date().toISOString()
        dirs.map(m => m.replace('.js', '')).map(m => {
            if (markas[m] === undefined) {

                markas[m] = { data: { [date]: 0 } }
            }

            return null
        })

        const reportPath = path.join(process.cwd(), `${reportFilePath}`)
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


        walkSync(folderPath, (filepath) => {

            const fileName = filepath.replace(/[\\]/g, "-").replace(/[/]/g, "-").split('-')
            const marka = fileName[8]

            const data = JSON.parse(fs.readFileSync(filepath, { encoding: 'utf-8' }))




            if (markas[marka] === undefined) {

                markas[marka] = { data: { [date]: data.length } }
            }
            markas[marka].data[date] = markas[marka].data[date] + data.length





        })
        const savePath = path.join(process.cwd(), `${reportFilePath}`)

        fs.writeFileSync(savePath, JSON.stringify(markas))

    }
}


function countBySubcategory(dirpath, reportFilePath) {
    const dirs = fs.readdirSync(`${process.cwd()}/urls`)


    const folderPath = path.join(process.cwd(), `${dirpath}`)

    if (fs.existsSync(folderPath)) {
        const date = new Date().toISOString()
        const brandNames = dirs.map(m => m.replace('.js', ''))


        let markas = {}
        const reportPath = path.join(process.cwd(), `${reportFilePath}`)
        const reportexists = fs.existsSync(reportPath)
        if (reportexists) {
            const previousreport = JSON.parse(fs.readFileSync(reportPath, { encoding: 'utf-8' }))
            markas = previousreport
            for (let m of brandNames) {
                const current = require(`${process.cwd()}/urls/${process.env.GENDER}/${m}`)
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
                const current = require(`${process.cwd()}/urls/${process.env.GENDER}/${m}`)
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


        walkSync(folderPath, (filepath) => {

            const data = JSON.parse(fs.readFileSync(filepath))


            data.forEach(d => {

                const { marka, subcategory } = d

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


        })


        fs.writeFileSync(reportPath, JSON.stringify(markas))

    }
}


function countBySubcategoryDeleted(dirpath, reportFilePath) {
    const dirs = fs.readdirSync(`${process.cwd()}/urls/${process.env.GENDER}`)
    const date = new Date().toISOString()
    const brandNames = dirs.map(m => m.replace('.js', ''))
    const folderPath = path.join(process.cwd(), `${dirpath}`)
    if (fs.existsSync(folderPath)) {

        let markas = {}
        const reportPath = path.join(process.cwd(), `${reportFilePath}`)
        const reportexists = fs.existsSync(reportPath)
        if (reportexists) {
            const previousreport = JSON.parse(fs.readFileSync(reportPath, { encoding: 'utf-8' }))
            markas = previousreport
            for (let m of brandNames) {
                const current = require(`${process.cwd()}/urls/${process.env.GENDER}/${m}`)
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
                const current = require(`${process.cwd()}/urls/${process.env.GENDER}/${m}`)
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


        walkSync(folderPath, (filepath) => {

            const fileName = filepath.replace(/[\\]/g, "-").replace(/[/]/g, "-").split('-')

            const marka = fileName[8]

            const data = JSON.parse(fs.readFileSync(filepath, { encoding: 'utf-8' }))

            data.forEach(d => {
                const fileName = d.replace(/[\\]/g, "-").replace(/[/]/g, "-").split('-')
                const subcategory = fileName[4]

                if (markas[marka] === undefined) {
                    markas[marka] = {}
                }
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



        })


        fs.writeFileSync(reportPath, JSON.stringify(markas))


    }
}



module.exports = { countTotal, countTotalCollectedBySubcategoryPie, countByBrand, countByBrandDeleted, countBySubcategory, countBySubcategoryDeleted, countTotalCollected, countTotalCollectedByBrand, countTotalCollectedBySubcategory }

(async () => {


    require('dotenv').config()
    console.log('--------------------------------------------------------------')
    const plimit = require('p-limit')

    const path = require('path')
    const makeDir = require('make-dir');
    const { walkSync } = require('./walkSync')
    const { productTitleMatch } = require('../netlify/functions/productTitleMatch')
    const fs = require('graceful-fs')
    const limit = plimit(5);

    console.log('--------------------------------------------------------------')


    // const website = process.env.WEBSITE

    const keywords = require(path.join(process.cwd(), `api/_files/nav/keywords.json`))
    fs.rmSync(path.join(process.cwd(), `api/_files/data`), { recursive: true, force: true });
    // const getDirectories = source =>
    //     fs.readdirSync(source, { withFileTypes: true })
    //         .filter(dirent => dirent.isDirectory())
    //         .map(dirent => dirent.name)

    //const dirnames = getDirectories(path.join(process.cwd(), `unzipped-data`))
    debugger

    const functionObj = { diger: {} }

    //  makeDir.sync(path.dirname(`data/${website}/${process.env.GENDER}/${dirName}`))

    let markaProducts = []
    walkSync(path.join(process.cwd(), `unzipped-data`), async (filepath) => {
        const data = JSON.parse(fs.readFileSync(filepath))

        markaProducts.push(...data)
    })
    debugger
    console.log('PRODUCTS TO MERGE', markaProducts.length)
    console.log('process.env.GENDER', process.env.GENDER)
    const gender = process.env.GENDER
    if ((gender === 'kadin' && markaProducts.length < 31000) ||
        (gender === 'erkek' && markaProducts.length < 23000) ||
        (gender === 'ecocuk' && markaProducts.length < 5000) ||
        (gender === 'kcocuk' && markaProducts.length < 5000)) {
        throw 'Error Not enoght product data'

    }

    let i = 0
    for (let mp of markaProducts) {
        i++
        const { title, marka } = mp
        const categoryKeywords = keywords.filter(f => f.keywordType === 'category')
        var machfound = false
        for (let k of categoryKeywords) {


            const nws = k.exclude !== '' ? k.exclude.split(',') : []

            const match = productTitleMatch({ kw: k.keywords, nws, title })
            if (match) {

                if (functionObj[k.functionName] === undefined) {
                    functionObj[k.functionName] = {}
                }

                if (functionObj[k.functionName][marka] === undefined) {
                    functionObj[k.functionName][marka] = []
                }

                const previouslyAdded = functionObj[k.functionName][marka].find(f => f.imageUrl === mp.imageUrl)
                if (!previouslyAdded) {
                    functionObj[k.functionName][marka] = [...functionObj[k.functionName][marka], mp]
                }
                machfound = true
                //  break;



            }


        }


        if (machfound === false) {
            if (functionObj['diger'][marka] === undefined) {
                functionObj['diger'][marka] = []
            }
            functionObj['diger'][marka] = [...functionObj['diger'][marka], { ...mp, title: mp.title + ' diger' }]

        }

        if (i === markaProducts.length) {

            for (let fnName in functionObj) {

                const fnc = functionObj[fnName]

                for (let m in fnc) {


                    const current = functionObj[fnName][m]
                    const savePath = path.join(process.cwd(), `api/_files/data/${fnName}/${m}.json`)
                    makeDir.sync(path.dirname(savePath))

                    if (current && current.length > 0) {
                        fs.writeFileSync(savePath, JSON.stringify(current))
                    }
                    else {

                    }

                }






            }

        }
    }



    // for (let marka in functionObj['diger']) {
    //     const current = functionObj['diger'][marka]
    //     const savePath = path.join(process.cwd(), `api/_files/data/diger/${marka}.json`)
    //     const exists = fs.existsSync(savePath)
    //     if (exists) {
    //         const data = fs.readFileSync(savePath, { encoding: 'utf8' })
    //         const dataObj = JSON.parse(data)

    //         fs.writeFileSync(savePath, JSON.stringify([...dataObj, ...current]))
    //     } else {
    //         makeDir.sync(path.dirname(savePath))
    //         fs.writeFileSync(savePath, JSON.stringify([...current]))
    //     }
    //     debugger
    // }


    // function saveToOther({ marka, d }) {
    //     const savePath = path.join(process.cwd(), `api/_files/data/diger/${marka}.json`)
    //     const exists = fs.existsSync(savePath)
    //     if (exists) {
    //         const data = fs.readFileSync(savePath, { encoding: 'utf8' })
    //         const dataObj = JSON.parse(data)

    //         fs.writeFileSync(savePath, JSON.stringify([...dataObj, d]))
    //     } else {
    //         makeDir.sync(path.dirname(savePath))
    //         fs.writeFileSync(savePath, JSON.stringify([d]))
    //     }
    // }



    // function saveToFunctionName({ k, marka, d }) {


    //     const savePath = path.join(process.cwd(), `api/_files/data/${k.functionName}/${marka}.json`)


    //     const exists = fs.existsSync(savePath)


    //     if (exists) {
    //         const data = fs.readFileSync(savePath, { encoding: 'utf8' })
    //         const dataObj = JSON.parse(data)

    //         fs.writeFileSync(savePath, JSON.stringify([...dataObj, d]))
    //     } else {
    //         makeDir.sync(path.dirname(savePath))
    //         fs.writeFileSync(savePath, JSON.stringify([d]))
    //     }


    // }





})()
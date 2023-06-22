require('dotenv').config()
console.log('--------------------------------------------------------------')
const fs = require('fs')
const path = require('path')
const makeDir = require('make-dir');
const { walkSync } = require('./walkSync')



console.log('--------------------------------------------------------------')

const website =process.env.WEBSITE
console.log('website...',website)
let obj = {}

// delete old data

if (fs.existsSync(path.join(process.cwd(), `old-data`))) {
    walkSync(path.join(process.cwd(), 'old-data'), async (filepath) => {
        
   
            const data = JSON.parse(fs.readFileSync(filepath))

            for (let d of data) {
                
                if (fs.existsSync(d)) {
                    
                    fs.unlinkSync(d)
                   
                } else {
                 
                }
            }

    
    })
}

// add newdata
if (fs.existsSync(path.join(process.cwd(), `collected-data`))) {


    walkSync(path.join(process.cwd(), `collected-data`), async (filepath) => {

     
            const collectedData = JSON.parse(fs.readFileSync(filepath, { encoding: 'utf-8' }))


            
            for (let d of collectedData) {
                const { imageUrl, marka } = d
                makeDir.sync(`data/${website}/${process.env.GENDER}/${marka}`)
                const fileName = imageUrl.replace(/[/]/g, '-').replace(/[.jpg]/g, '').replace(/[?]/, '').replace(/\[|\]|\,|&|=|:/g, '')
                const savePath = path.join(process.cwd(), `data/${website}/${process.env.GENDER}/${marka}/${fileName}.json`)
              
                fs.writeFileSync(savePath, JSON.stringify(d))
            }

   


    })
}
// add updateddata
if (fs.existsSync(path.join(process.cwd(), `updated-data`))) {

    if (fs.existsSync(path.join(process.cwd(), `updated-data`))) {
        walkSync(path.join(process.cwd(), `updated-data`), async (filepath) => {
      
                const collectedData = JSON.parse(fs.readFileSync(filepath, { encoding: 'utf-8' }))
                for (let d of collectedData) {
                    const { imageUrl, marka } = d
                    makeDir.sync(`data/${website}/${process.env.GENDER}/${marka}`)
                    const fileName = imageUrl.replace(/[/]/g, '-').replace(/[.jpg]/g, '').replace(/[?]/, '').replace(/\[|\]|\,|&|=|:/g, '')
                    const savePath = path.join(process.cwd(), `data/${website}/${process.env.GENDER}/${marka}/${fileName}.json`)
                 
                    fs.writeFileSync(savePath, JSON.stringify(d))
                }
        })
    }

}



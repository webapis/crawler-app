
    

    // (async () => {
    //     const im = require('imagemagick');
    //     const { walkSync } = require('../walkSync')
    //     const path = require('path')
    //     const plimit = require('p-limit')
    //     const makeDir =require('make-dir')
    //     const limit = plimit(5);
    //     const files = []
    //     const promises = []
    //     walkSync('sprites', (src) => {
    //         const fileName = path.basename(src)
    //         const groupName =src.split('\\')[1]
    //         const srcPath= path.join(process.cwd(),src)
      
    //         const dstPath = path.join(process.cwd(), 'sprites-cropped',groupName, fileName)
    //         console.log('dstPath',dstPath)
    //         debugger
    //         promises.push(limit(async () => await cropImage({ srcPath, dstPath })))
    //     })
    //     async function cropImage({ srcPath, dstPath }) {
    //         try {
                
           
    //         await makeDir(path.dirname(dstPath))
    //         return new Promise((resolve, reject) => {
    //             im.crop({
    //                 srcPath,
    //                 dstPath,
    //                 height: 200,
                 
    //             }, function (err, stdout, stderr) {
                  
    //                 if (err){
    //                     debugger
    //                     reject(err)
    //                 }
              
    //                 console.log('resized kittens.jpg to fit within 200');
    //                 resolve(true)
        
    //             });
    //         })

    //     } catch (error) {
    //             debugger
    //     }
    //     }
    //     try {
    //         await Promise.all(promises)
    //     } catch (error) {
    //         debugger
    //     }
    

    // })()


    



    (async () => {
        const sharp = require('sharp');
        const im = require('imagemagick');
        const { walkSync } = require('../walkSync')
        const makeDir =require('make-dir')
        const path = require('path')
        const plimit = require('p-limit')
        const limit = plimit(5);
        const promises = []
        walkSync('sprites', async(src) => {
            const fileName = path.basename(src)
            const groupName =src.split('\\')[1]
            debugger
            const srcPath= path.join(process.cwd(),src)
            debugger
            const dstPath = path.join(process.cwd(), 'sprites-cropped',groupName, fileName)
            debugger
            await makeDir(path.dirname(dstPath))
     debugger
            promises.push(limit(async () => await cropImage({ srcPath, dstPath })))
        })
        async function cropImage({ srcPath, dstPath }) {
        
         
                const fs =require('fs')
                const buffer =fs.readFileSync(srcPath)
                await sharp(buffer)
                .resize(null,200)
                .jpeg()
                .toFile(dstPath);
          
        }
        await Promise.all(promises)


    })()

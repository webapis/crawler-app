const { countTotal, countTotalCollectedBySubcategoryPie,countByBrand, countByBrandDeleted, countBySubcategory,countBySubcategoryDeleted,countTotalCollected,countTotalCollectedByBrand,countTotalCollectedBySubcategory } = require('./util')

require('dotenv').config()
function countTotalUpdated() {

 // countTotal('updated-data', `projects/trends/public/reports/total-updated.json`)
 // countTotal('old-data', `projects/trends/public/reports/total-deleted.json`)
  countTotal('collected-data', `projects/trends/public/reports/total-newdata.json`)
  countTotalCollected(`data/${process.env.WEBSITE}/${process.env.GENDER}`,`projects/trends/public/reports/total-collected-bar.json`)
}

function countByBrandUpdated() {
 // countByBrand('updated-data', `projects/trends/src/reports/updated/by-brand-updated.json`)
 // countByBrand('collected-data', `projects/trends/src/reports/updated/by-brand-newdata.json`)
 // countByBrandDeleted('old-data', `projects/trends/src/reports/updated/by-brand-deleted.json`)
  countTotalCollectedByBrand()
}

function countBySubcategoryUpdated() {
  debugger
  //countBySubcategory('updated-data', `projects/trends/src/reports/updated/by-subcategory-updated.json`)
  //countBySubcategory('collected-data', `projects/trends/src/reports/updated/by-subcategory-newdata.json`)
  //countBySubcategoryDeleted('old-data',`projects/trends/src/reports/updated/by-subcategory-deleted.json`)
  countTotalCollectedBySubcategory(`data/${process.env.WEBSITE}/${process.env.GENDER}`,`projects/trends/public/reports/total-collected-by-subcategory.json`)
  countTotalCollectedBySubcategoryPie()
}


    countTotalUpdated()
    countByBrandUpdated()
    countBySubcategoryUpdated()





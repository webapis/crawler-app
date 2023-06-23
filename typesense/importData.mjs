import { genegateNavigation } from "./genegateNavigation.mjs";
import mapPrice from "./mapPrice.mjs";
import fs from "fs";
import path from "path";
import walkSync from "./walkSync.mjs";
import orderData from "./orderData.mjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Typesense = require("typesense");

let client = new Typesense.Client({
  nodes: [
    {
      host: "cainkfusel2d9vzjp.a1.typesense.net", // For Typesense Cloud use cainkfusel2d9vzjp.a1.typesense.net
      port: "443", // For Typesense Cloud use 443
      protocol: "https", // For Typesense Cloud use https
    },
  ],
  apiKey: "V4FN9a4QTCYkq8zWjjgs1YVonWDyrpSD",
  connectionTimeoutSeconds: 2,
});
debugger
let schema = {
  name: "products",
  fields: [
    {
      name: "title",
      type: "string",
      facet: false,
      optional:false
      
    },
    {
      name: "marka",
      type: "string",
      facet: true,
      optional:false
    },
    {
      name: "gender",
      type: "string",
      facet: true,
      optional:false
    },
    {
      name: "renk",
      type: "string",
      facet: true,
      optional:false
    },
    {
      name: "price",
      type: "float",
      facet: true,
      optional:false
    },
    {
      name: "link",
      type: "string",
      facet: false,
      optional:false
    },
    {
      name: "id",
      type: "string",
      facet: false,
      optional:false
    },
    {
      name: "index",
      type: "int32",
      facet: false,
      sortable:true
    },
    {
      name: "kategori",
      type: "string",
      facet: true,
      sortable:true
    },
    {
      name: "altKategori",
      type: "string",
      facet: true,
      sortable:true
    },
  ],
  // default_sorting_field: "index",
};

//const rest =await client.collections().create(schema);

//await client.collections('products').delete()
debugger;
console.log("process.env.marka------", process.env.marka === true);





debugger
if (process.env.marka) {
  //const deleteResult = await prisma.products.deleteMany({ where: { marka: { contains: process.env.marka } } })

}

let filePaths = [];
debugger;

walkSync(path.join(process.cwd(), `erkek/unzipped-data`), async (filepath) => {
  filePaths.push(filepath);
});
walkSync(path.join(process.cwd(), `kadin/unzipped-data`), async (filepath) => {
  filePaths.push(filepath);
});
walkSync(
  path.join(process.cwd(), `kiz-cocuk/unzipped-data`),
  async (filepath) => {
    filePaths.push(filepath);
  }
);

walkSync(
  path.join(process.cwd(), `erkek-cocuk/unzipped-data`),
  async (filepath) => {
    filePaths.push(filepath);
  }
);

let list = [];
let sliceCounter = 0;
let isComplete = false;
let indexCounter = 0;

while (!isComplete) {
  for (let filepath of filePaths) {
    const raw = fs.readFileSync(filepath, { encoding: "utf-8" });
    
    const data = JSON.parse(raw)
      .map((m) => {
        return {
          marka: m.marka,
          gender: m.gender
            ? m.gender
                .replace("kcocuk", "kız çocuk")
                .replace("ecocuk", "erkek çocuk")
                .replace("kadin", "kadın")
            : "unknown",
          title: m.title
            .substr(m.title.indexOf(" "))
            .replace("_kcocuk", "")
            .replace("_ecocuk", "")
            .replace("_erkek", "")
            .replace("_kadin", "")
            .toLowerCase(),
          link: m.link,
          id: m.imageUrl,
          price: m.priceNew ? mapPrice(m.priceNew.toString()) : 0,
        };
      })
      .slice(sliceCounter, sliceCounter + 20);

   
    const removeImgNull = data.filter((m) => m.imageUrl !== null);
    const imageUrlWithNull = data.filter((m) => m.imageUrl === null);
    if (imageUrlWithNull.length > 0) {
      console.log("imageUrlWithNull", imageUrlWithNull.length);
    }

    list.push(...removeImgNull);
  }
  if (list.length > 0) {
    console.log("list.length", list.length);
    //add kategori field
    let listwithNav = [];
    for (let l of list) {
      const navs = genegateNavigation({ title: l.title });

      listwithNav.push({ ...l, ...navs });
    }

    debugger;
    const orderedList = orderData(listwithNav);
    const indexedList = orderedList.map((m) => {
      indexCounter = indexCounter + 1;
      return { ...m, index: indexCounter };
    });
    const chunk = (arr, size) =>
      arr.reduce(
        (carry, _, index, orig) =>
          !(index % size)
            ? carry.concat([orig.slice(index, index + size)])
            : carry,
        []
      );
    const chunkedArray = chunk(indexedList, 300);
    for (let arr of chunkedArray) {
      await main({ data: arr });
      debugger;
    }
    list = [];
    sliceCounter = sliceCounter + 20;
  } else {
    debugger;
    isComplete = true;
    // const deleteResult = await prisma.products.deleteMany({ where: { modified: { lt: new Date(new Date().setHours(0, 0, 0, 0)) } } })
  }
}

async function main({ data }) {
  try {
    debugger;
    const result = await client
      .collections("products")
      .documents()
      .import(data, { action: "create" });
    debugger;
    console.log(`result`,result)
    for (let d of data) {
      debugger;

      if (d.delete) {
        try {
          delete d.delete;
          delete d.update;
          delete d.deletedDate;
          // const user = await prisma.products.delete({
          //   where: {
          //     imageUrl: d.imageUrl
          //   }
          // })
          console.log("deleted", d.marka, d.link);
        } catch (error) {
          console.log("no raw existed in db");
        }
      } else if (d.update) {
        delete d.delete;
        delete d.update;
        delete d.deletedDate;
        // const user = await prisma.products.upsert({
        //   where: {
        //     imageUrl: d.imageUrl
        //   },
        //   update: d,
        //   create: d,
        // })

        console.log("updated");
      } else {
        delete d.delete;
        delete d.update;
        delete d.deletedDate;
        debugger;
        // const user = await prisma.products.update({
        //   where: {
        //     imageUrl: d.imageUrl
        //   },
        //   data: { modified: new Date() },
        // })
      }

      debugger;
    }
  } catch (error) {
    console.error(error);
  }
}

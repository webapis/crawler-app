import { genegateNavigation } from "./genegateNavigation.mjs";
import mapPrice from "./mapPrice.mjs";

import { createRequire } from "module";
import { Dataset  } from 'crawlee';
const productsDataset = await Dataset.open(`products`);
const require = createRequire(import.meta.url);
require('dotenv').config()
const {client} =require('./client.js')
console.log("process.env.marka------", process.env.marka === true);


await client.collections('products').documents().delete({'filter_by': `marka:${process.env.marka}`});
await client.collections('products').documents().delete({'filter_by': `marka:${process.env.marka},gender:unknown`});
await client.collections('products').delete()
const { items: data } = await productsDataset.getData();
debugger
   const mappedData=   data.filter(f=>f.includes('çanta')).map((m => { return { ...m, gender: m.title.substring(m.title.lastIndexOf('_')) } })).map((m) => {
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
          imageUrl: m.imageUrl,
          price: m.priceNew ? mapPrice(m.priceNew.toString()) : 0,

          kategori: ['çapraz,bel,sırt,omuz,spor,outdoor'].find(m.includes(f))?['çapraz,bel,sırt,omuz,spor,outdoor'].find(m.includes(f)):'diger'
        };
      })

      // await client
      // .collections("products")
      // .documents()
      // .import(mappedData, { action: "create" });
   

 





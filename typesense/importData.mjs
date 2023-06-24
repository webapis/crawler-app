import { genegateNavigation } from "./genegateNavigation.mjs";
import mapPrice from "./mapPrice.mjs";

import { createRequire } from "module";
import { Dataset  } from 'crawlee';
const productsDataset = await Dataset.open(`products`);
const require = createRequire(import.meta.url);
const {client} =require('./client.js')
console.log("process.env.marka------", process.env.marka === true);


await client.collections('products').documents().delete({'filter_by': `marka:${process.env.marka}`});

const { items: data } = await productsDataset.getData();

   const mappedData=   data.map((m) => {
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

          ...genegateNavigation({ title: m.title })
        };
      })

      await client
      .collections("products")
      .documents()
      .import(mappedData, { action: "create" });
   

 





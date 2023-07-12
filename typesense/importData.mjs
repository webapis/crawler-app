import { genegateNavigation } from "./genegateNavigation.mjs";
//import {schema} from './createSchema.mjs'
import mapPrice from "./mapPrice.mjs";

import { createRequire } from "module";
import { Dataset  } from 'crawlee';
const productsDataset = await Dataset.open(`products`);
const require = createRequire(import.meta.url);
require('dotenv').config()
const {client} =require('./client.js')
console.log("process.env.marka------", process.env.marka === true);
const uniqify = (array, key) => array.reduce((prev, curr) => prev.find(a => a[key] === curr[key]) ? prev : prev.push(curr) && prev, []);


 await client.collections('products').documents().delete({'filter_by': `marka:${process.env.marka}`});
 await client.collections('products').documents().delete({'filter_by': `marka:gon`});
// await client.collections('products').delete()
//const rest =await client.collections().create(schema);
const { items: data } = await productsDataset.getData();
debugger
const anaKategoriler =['çanta',"çüzdan","valiz","kartlık"]
const kategoriler =['göğüs','laptop','okul','bebek','clutch','kova','Postacı','baskılı','el','plaj','tote','gece','baget','alışveriş','bez','kot','abiye','portföy','gece','kol','telefon','çapraz','bel','sırt','omuz','spor','outdoor']
const renkler =  ['rose','vişne','mor','platin','altın','gümüş','gold','indigo','haki','gri','lacivert','bej','pembe','sarı','beyaz','kırmızı','siyah','fuşya','turuncu','yeşil','mavi','kahve']

const uniqueProductCollection = uniqify(data, 'imageUrl')
console.log('uniqueProductCollection',uniqueProductCollection.length)
const regex = /^(çorap|blink optic shine|sungerı)$/i; 
const mappedData=   uniqueProductCollection.filter(item=> !regex.test(item.title)).map((m => { return { ...m, gender: m.title.substring(m.title.lastIndexOf('_')) } })).map((m) => {
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
          anaKategori: anaKategoriler.find((f)=>m.title.split(' ').includes(f))?anaKategoriler.find((f)=>m.title.split(' ').includes(f)):'diger',
          kategori: kategoriler.find((f)=>m.title.split(' ').includes(f))?kategoriler.find((f)=>m.title.split(' ').includes(f)):'diger',
          renk:renkler.find((f)=>m.title.split(' ').includes(f))?renkler.find((f)=>m.title.split(' ').includes(f)):'diger',
          altKategori:'depicated'
        };
      })

      await client
      .collections("products")
      .documents()
      .import(mappedData, { action: "create" });
   

 





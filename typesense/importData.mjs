import { genegateNavigation } from "./genegateNavigation.mjs";
import mapPrice from "./mapPrice.mjs";
import fs from "fs";
import path from "path";
import walkSync from "./walkSync.mjs";
import orderData from "./orderData.mjs";
import { createRequire } from "module";
import { PuppeteerCrawler, Dataset,RequestQueue  } from 'crawlee';
const productsDataset = await Dataset.open(`products`);
const require = createRequire(import.meta.url);
const {client} =require('./client.js')
console.log("process.env.marka------", process.env.marka === true);

let filePaths = [];
debugger;
let list = [];
let sliceCounter = 0;
let isComplete = false;
let indexCounter = 0;
const prevData =[]
const mergedData =[]

const { items: data } = await productsDataset.getData();
while (!isComplete) {
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
          id: m.imageUrl,
          price: m.priceNew ? mapPrice(m.priceNew.toString()) : 0,
        };
      })
      .slice(sliceCounter, sliceCounter + 20);

   
    const removeImgNull = mappedData.filter((m) => m.imageUrl !== null);
    debugger
    const imageUrlWithNull = mappedData.filter((m) => m.imageUrl === null);
    if (imageUrlWithNull.length > 0) {
      console.log("imageUrlWithNull", imageUrlWithNull.length);
    }

    list.push(...removeImgNull);
  
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
      debugger
      await main({ data: arr });
      debugger;
    }
    list = [];
    sliceCounter = sliceCounter + 20;
  } else {
    debugger;
    isComplete = true;
  }
}


async function main({ data }) {
  try {
    debugger;
    const result = await client
      .collections("products")
      .documents()
      .import(data, { action: "create" });

  } catch (error) {
    console.error(error);
  }
}

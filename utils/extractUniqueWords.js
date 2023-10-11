function extractUniqueWords(obj) {
  try {

    const objClone ={...obj}
    delete objClone.objectID;
    delete objClone.keywords
    delete objClone.id
    delete objClone.pid
    delete objClone.timestamp
    delete objClone.priceNew
    delete objClone.imageUrl
    const wordSplitRegex = /\s|[-]|\/|[?]/;
    // Split all property values into words.
    const words = Object.values(objClone).flatMap((value) => value.toLowerCase().split(wordSplitRegex));
  
    // Create a set to store the unique words.
    const uniqueWords = new Set();
  
    // Iterate over the words and add them to the set if they are not already there.
    for (const word of words) {
      uniqueWords.add(word);
    }
  
    // Convert the set to an array and return it.
    return [...uniqueWords].filter((f,i)=>f.length>2);
  } catch (error) {

    debugger

  }

}


  module.exports={ extractUniqueWords}
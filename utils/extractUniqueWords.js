function extractUniqueWords(obj) {
  try {
    delete obj.objectID;
    delete obj.keywords
    delete obj.id
    delete obj.pid
    delete obj.timestamp
    delete obj.priceNew
    delete obj.imageUrl
    const wordSplitRegex = /\s|[-]|\/|[?]/;
    // Split all property values into words.
    const words = Object.values(obj).flatMap((value) => value.toLowerCase().split(wordSplitRegex));
  
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
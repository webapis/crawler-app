function extractUniqueWords(obj) {
    // Split all property values into words.
    const words = Object.values(obj).flatMap((value) => value.split(' '));
  
    // Create a set to store the unique words.
    const uniqueWords = new Set();
  
    // Iterate over the words and add them to the set if they are not already there.
    for (const word of words) {
      uniqueWords.add(word);
    }
  
    // Convert the set to an array and return it.
    return [...uniqueWords];
  }

  module.exports={ extractUniqueWords}
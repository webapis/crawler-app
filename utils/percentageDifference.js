export function percentageDifference(a, b) {
    // Calculate the absolute difference between the two numbers.
    let difference = a - b;
  
    // Calculate the average of the two numbers.
    let average = (a + b) / 2;
  
    // Calculate the percentage difference.
    let percentage = difference / average * 100;
  
    return percentage;
  }
  
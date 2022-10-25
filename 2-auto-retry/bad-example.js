const sum = (a, b) => {
  if (typeof a !== 'number') {
    throw new Error('Please provide a number for parameter "a"');
  }
  if (typeof b !== 'number') {
    throw new Error('Please provide a number for parameter "a"');
  }

  return a + b;
};

let result;
let iteration = 0;

do {
  try {
    console.debug('Iteration', ++iteration);
    result = sum('Test', 3);
  } catch (e) {
    console.error(e);
  }
} while (typeof result === 'undefined');

console.log('Result is', result);
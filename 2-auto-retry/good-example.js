const randomBetween = (a, b) => {
  if (typeof a !== 'number') {
    throw new Error('Please provide a number for parameter "a"');
  }
  if (typeof b !== 'number') {
    throw new Error('Please provide a number for parameter "a"');
  }

  return Math.min(a, b) + Math.abs(a - b) * Math.random();
};

let result;
let iteration = 0;

do {
  try {
    console.debug('Iteration', ++iteration);
    result = randomBetween(1, 3);
  } catch (e) {
    console.error(e);
  }
} while (typeof result === 'undefined' || result < 2);

console.log('Result is', result);
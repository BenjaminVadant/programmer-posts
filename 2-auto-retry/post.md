# Auto retry
[Source](https://github.com/BenjaminVadant/programmer-posts/tree/main/2-auto-retry)

## Issue statement

When your code depends on a lot of moving parts, some internal and some external, it can be useful to retry multiple times before accepting failure.

This is not a case of 

> Insanity is doing the same thing over and over and expecting different results.

_Albert Einstein_

You should only use automatic retry in cases where you do not control everything.

## A bad example

In the code below, we control everything. The code is simple, there is no hidden dependencies and the `sum` function parameters do not depend on some user input that might change.
In this case, execution will never leave the `do...while` loop and expecting otherwise is _insanity_.

```js
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
```

## A good example

In the code below, we do not control the return of `Math.random` except that the value is between 0 and 1.
So each time we call `randomBetween(1, 3)`, we can expect (and will get) a different value between 1 and 3.
Thus, execution will leave the `do...while` loop eventually. It can take time though.

```js
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
```

## A better example - retry limit


## A better example - timeout limit
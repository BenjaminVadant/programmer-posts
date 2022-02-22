# Promise timeout
[Source](https://github.com/BenjaminVadant/programmer-posts/tree/main/1-promise-timeout)

## Issue statement

When waiting for a `Promise` to resolve, it can be interesting to be able to set a timeout.

## Library solution

To implement such behavior, we can use [bluebird](http://bluebirdjs.com/) and, in particular, this helper : [`.timeout`](http://bluebirdjs.com/docs/api/timeout.html).

```js
const Promise = require('bluebird');

/**
 * Generate an asynchronous task.
 * 
 * @param  {Number} max=10 The amount of iteration
 * @param  {Number} now=0 The initial timestamp (useful for debugging)
 * 
 * @returns {Promise<String>} 'a long awaited success'
 */
const longPromiseFactory = async (max = 10, now = 0) => {
  for (let index = 0; index < max; index += 1) {
    console.debug({
      time: Math.round((Date.now() - now) / 100) * 100,
      index
    });

    // We wait for 1000 ms to emulate a long task
    await (new Promise((resolve) => setTimeout(resolve, 1000)));
  }

  return 'a long awaited success';
};

(async () => {
  const now = Date.now();
  try {
    {
      // 1 - The timeout is higher than task duration
      console.log('Timeout higher than 10s');

      const result = await Promise.resolve(longPromiseFactory(10, now)).timeout(11 * 1000, 'Timeout error');

      console.log('Task completed with result =', result);
    }

    {
      // 2 - The timeout is lower than task duration
      console.log('Timeout lower than 10s');

      const result = await Promise.resolve(longPromiseFactory(10, now)).timeout(9 * 1000, 'Timeout error');

      // We will not reach this
      console.log('Task completed with result =', result);
    }

  } catch (error) {
    console.debug({
      time: Math.round((Date.now() - now) / 100) * 100,
      error: error.message
    });
  }
  process.exit();
})();

/**
 * Output should be:
 * 
 * Timeout higher than 10s
 * { time: 0, index: 0 }
 * { time: 1000, index: 1 }
 * { time: 2000, index: 2 }
 * { time: 3000, index: 3 }
 * { time: 4000, index: 4 }
 * { time: 5000, index: 5 }
 * { time: 6000, index: 6 }
 * { time: 7000, index: 7 }
 * { time: 8000, index: 8 }
 * { time: 9000, index: 9 }
 * Task completed with result = a long awaited success
 * Timeout lower than 10s
 * { time: 10000, index: 0 }
 * { time: 11000, index: 1 }
 * { time: 12000, index: 2 }
 * { time: 13000, index: 3 }
 * { time: 14000, index: 4 }
 * { time: 15000, index: 5 }
 * { time: 16000, index: 6 }
 * { time: 17000, index: 7 }
 * { time: 18000, index: 8 }
 * { time: 19000, error: 'Timeout error' }
 */
```

## Vanilla solution

If we do not want to add to our technical debt, using [`Promise.race`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) we can easily implement the same feature.
The idea is to race the long task against a promise that rejects after a set timeout.

```js
/**
 * Generate a promise that rejects after a provided timeout with a provided error message
 * 
 * @param  {Number} timeout=1000
 * @param  {String} message='Timeout error'
 */
const timeoutPromiseFactory = async (timeout = 1000, message = 'Timeout error') => {
  if (typeof timeout !== 'number' || !(timeout > 0)) {
    throw new Error('Please provide a positive number for timeout parameter');
  }
  if (typeof message !== 'string' || message.length < 1) {
    throw new Error('Please provide a useful message');
  }

  // We wait for timeout ms
  await (new Promise((resolve) => setTimeout(resolve, timeout)));

  throw new Error(message);
};

/**
 * Generate an asynchronous task.
 * 
 * @param  {Number} max=10 The amount of iteration
 * @param  {Number} now=0 The initial timestamp (useful for debugging)
 * 
 * @returns {Promise<String>} 'a long awaited success'
 */
const longPromiseFactory = async (max = 10, now = 0) => {
  for (let index = 0; index < max; index += 1) {
    console.debug({
      time: Math.round((Date.now() - now) / 100) * 100,
      index
    });

    // We wait for 1000 ms to emulate a long task
    await (new Promise((resolve) => setTimeout(resolve, 1000)));
  }

  return 'a long awaited success';
};

(async () => {
  const now = Date.now();
  try {
    {
      // 1 - The timeout is higher than task duration
      console.log('Timeout higher than 10s');

      const result = await Promise.race([longPromiseFactory(10, now), timeoutPromiseFactory(11 * 1000)]);

      console.log('Task completed with result =', result);
    }

    {
      // 2 - The timeout is lower than task duration
      console.log('Timeout lower than 10s');

      const result = await Promise.race([longPromiseFactory(10, now), timeoutPromiseFactory(9 * 1000)]);

      // We will not reach this
      console.log('Task completed with result =', result);
    }

  } catch (error) {
    console.debug({
      time: Math.round((Date.now() - now) / 100) * 100,
      error: error.message
    });
  }
  process.exit();
})();

/**
 * Output should be:
 * 
 * Timeout higher than 10s
 * { time: 0, index: 0 }
 * { time: 1000, index: 1 }
 * { time: 2000, index: 2 }
 * { time: 3000, index: 3 }
 * { time: 4000, index: 4 }
 * { time: 5000, index: 5 }
 * { time: 6000, index: 6 }
 * { time: 7000, index: 7 }
 * { time: 8000, index: 8 }
 * { time: 9000, index: 9 }
 * Task completed with result = a long awaited success
 * Timeout lower than 10s
 * { time: 10000, index: 0 }
 * { time: 11000, index: 1 }
 * { time: 12000, index: 2 }
 * { time: 13000, index: 3 }
 * { time: 14000, index: 4 }
 * { time: 15000, index: 5 }
 * { time: 16000, index: 6 }
 * { time: 17000, index: 7 }
 * { time: 18000, index: 8 }
 * { time: 19000, error: 'Timeout error' }
 */
```
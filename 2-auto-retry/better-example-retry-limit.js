const retryTask = ({task = () => {}, nRetries = 5, successFn = () => (true)} = {}) => {
  return async (...arguments) => {
    let result;
    const errors = [];
    let iteration = 0;
    
    do {
      try {
        console.debug('Iteration', iteration);

        result = await task(...arguments);

        if (!(await successFn(result))) {
          throw new Error('Result does not match successFn')
        }
      } catch (e) {
        errors.push(e);
      } finally {
        iteration += 1;
      }
    } while (errors.length === iteration && iteration < nRetries);

    if (errors.length === iteration) {
      const error = new Error(`Failure after ${nRetries} retries`);

      error.errors = errors;

      throw error;
    }

    return result;
  };
};

const randomBetween = (a, b) => {
  if (typeof a !== 'number') {
    throw new Error('Please provide a number for parameter "a"');
  }
  if (typeof b !== 'number') {
    throw new Error('Please provide a number for parameter "a"');
  }

  return Math.min(a, b) + Math.abs(a - b) * Math.random();
};

(async () => {
  try {

    const randomBetweenLessThan2With5Retries = retryTask({
      task: randomBetween,
      nRetries: 5,
      successFn: (result) => (result < 2)
    });

    const result = await randomBetweenLessThan2With5Retries(1, 3);

    console.log('Result is', result);
  } catch (error) {
    console.error(error);
  }
  process.exit();
})();
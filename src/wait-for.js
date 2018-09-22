const DEFAULT_TIMEOUT = 4500; // milliseconds
const POLL_INTERVAL = 10; // milliseconds

async function delay(delayMs) {
  await new Promise(resolve => setTimeout(resolve, delayMs));
}

/**
 * creates polling function
 * @example waitFor(getByTestId)('my-id')
 * @example waitFor(getByTestId, 'my-id')
 * @param {function} callback - function or async function
 * @param {*} args - if more than 1 argument is passed,
 *                   result function is invoked immediately
 *                   with remaining arguments
 * @returns {function} polling function
 */
function waitFor(callback, ...callbackArgs) {
  /**
   * retries callback until it returns a non-null value or timeout is exceeded
   * @param {any} args - argument list for query
   * @returns {Promise<HTMLElement, Error>} HTMLElement or Error
   */
  async function pollingFunction(...args) {
    // get timeout setting from last argument (should be an "options" object):
    const options = args[args.length - 1];
    const timeout = options.timeout || DEFAULT_TIMEOUT;

    const startedAt = Date.now();
    let lastErr = new Error("Query timed out");
    let hasTimedOut = false;

    while (!hasTimedOut) {
      try {
        const result = await callback(...args);
        if (result !== null) return result;
      } catch (err) {
        lastErr = err;
      }
      hasTimedOut = Date.now() - startedAt > timeout;
      await delay(POLL_INTERVAL);
    }
    throw lastErr;
  }

  if (callbackArgs.length > 0) {
    return pollingFunction(...callbackArgs);
  } else {
    return pollingFunction;
  }
}

export { waitFor };

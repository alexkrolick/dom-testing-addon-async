# dom-testing-addon-async

[![Build Status](https://travis-ci.org/alexkrolick/dom-testing-addon-async.svg?branch=master)](https://travis-ci.org/alexkrolick/dom-testing-addon-async)

Async query addon for dom-testing-library

## Usage

### `find*`

Fach of the `get` and `getAll` queries from `dom-testing-library` are wrapped in an async `find` API.

The find APIs return a Promise and retry automatically until they time out. The timeout can be specified as an option in the last argument.

```js
import { findByLabelText, findByText } from 'dom-testing-addon-async'

const container = document;

fireEvent.click(getByRole('log-in'))
// This element doesn't appear immediately:
const usernameElement = await findByLabelText(container, 'username', {timeout: 200})
usernameElement.value = 'chucknorris'
// wait for error state
expect(await findByText(container, 'Error: Name must be capitalized')).not.toBeNull()
// expect NOT to see success state
await expect(findByText(container, 'Everything OK!')).rejects.toMatchInlineSnapshot()
```

### `waitFor`

`waitFor` is a utility function that lets you retry queries until they succeed or time out. Unlike `dom-testing-library#wait`, `waitFor` returns the result of the function. It is used internally to create the find APIs.

The first argument is the query. A new async function is returned if this is the only argument. If there are more arguments, it returns a Promise which resolves with the result of calling the async function with the arguments. If the last argument is an object with a "timeout" key, it will be used as the timeout for the retries. The Promise is rejected with the last error thrown by the callback.

```js
const usernameElement = await waitFor(getByLabelText, container, 'username')
usernameElement.value = 'chucknorris'
```

You can create your own async queries by passing only the first argument:

```js
const waitForText = waitFor(getByText)

const headline = await waitForText('news flash')

expect(headline).toBeDefined() // do something
```

### with react-testing-library

You can add the queries to react-testing-libary's render method as described [here](https://github.com/kentcdodds/react-testing-library#custom-render)

```diff
// my-component.test.js
- import { render, fireEvent } from 'react-testing-library';
+ import { render, fireEvent } from '../test-utils';
```

```js
// test-utils.js
import {render} from 'react-testing-library'
import * as syncQueries from 'dom-testing-library/dist/queries'
import * as asyncQueries from 'dom-testing-addon-async/dist/queries'

const allQueries = {
   ...syncQueries,
   ...asyncQueries,
}

function customRender(ui, {queries = allQueries, ...rest} = {}) {
  return render(ui, {queries, ...rest})
}

// re-export everything
export * from 'react-testing-library'

// override render method
export {customRender as render}
```

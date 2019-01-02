# dom-testing-addon-async

[![Build Status](https://travis-ci.org/alexkrolick/dom-testing-addon-async.svg?branch=master)](https://travis-ci.org/alexkrolick/dom-testing-addon-async)

Async query addon for dom-testing-library

## Why?

`dom-testing-library` handles asynchronocity by providing [`waitForElement`](https://testing-library.com/docs/api-async) to wrap and retry function calls that may error. But in some cases it may be helpful to invert the default expectation and treat sync queries like `getByText` as special cases rather than the other way around. For example:
- In test environments with lots of async behavior it can be cumbersome to always use `wait` or `waitForElement`.
 - Asynchronicity may be sometimes be considered an implementation detail - for example, async form validation states, or a React Suspense or Hook that may sometimes resolve after a timeout. 
 
 ### Before
 
```jsx
const usernameElement = await waitForElement(() =>
  getByLabelText(container, 'username'))
```

### After

```jsx
const usernameElement = await findByLabelText(container, 'username'))
```

## API

### `find*`

Each of the `get` and `getAll` queries from `dom-testing-library` are wrapped in an async `find` API.

The find APIs return a Promise and retry automatically until they time out. The timeout can be specified as an option in the last argument.

```jsx
import { findByLabelText, findByText } from 'dom-testing-addon-async'
import { getByRole} from 'dom-testing-library'

const container = document;

// trigger an action
fireEvent.click(getByRole('log-in'))

// This element doesn't appear immediately:
const usernameElement = await findByLabelText(container, 'username')

usernameElement.value = 'chucknorris'

// wait for error state
expect(await findByText(container, 'Error: Name must be capitalized')).not.toBeNull()

// expect NOT to see success state
await expect(findByText(container, 'Everything OK!')).rejects.toMatchInlineSnapshot()
```

### `waitFor`

> Note 
>
> You probably won't need `waitFor` unless you are building your own queries. Otherwise, use `dom-testing-library`'s [`wait` or `waitForElement`](https://testing-library.com/docs/api-async).

`waitFor` is a utility function that lets you retry queries until they succeed or time out. It is used internally to create the find APIs.

The first argument is the query. A new async function is returned if this is the only argument. You can create your own async queries this way:

```js
const waitForText = waitFor(getByText)

const headline = await waitForText('news flash')

expect(headline).toBeDefined() // do something
```

If there are two or more arguments, `waitFor` returns a Promise which resolves with the result of calling the async function with the arguments. If the last argument is an object with a "timeout" key, it will be used as the timeout for the retries. The Promise is rejected with the last error thrown by the callback.

```js
const usernameElement = await waitFor(getByLabelText, container, 'username')
usernameElement.value = 'chucknorris'
```

## with react-testing-library

You can add the queries to react-testing-libary's render method as described [here](https://testing-library.com/docs/react-testing-library/setup#custom-render)

```diff
- import { render, fireEvent } from 'react-testing-library';
+ import { render, fireEvent } from '../test-utils';
```

```jsx
test('shows errors when form is invalid', async () => {
  const { findByLabelText, findByText, getByRole } = render(<MyForm />)
  
  // trigger an action
  fireEvent.click(getByRole('log-in')) // can still use sync queries

  // This element doesn't appear immediately:
  const usernameElement = await findByLabelText(container, 'username')
  
  // type in the box
  fireEvent('change', userNameElement, {value: 'chucknorris'})

  // wait for error state
  expect(await findByText(container, 'Error: Name must be capitalized')).not.toBeNull()

  // expect NOT to see success state
  await expect(findByText(container, 'Everything OK!')).rejects.toMatchInlineSnapshot()
})
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
  // Note: you may also need to wrap the result's `rerender` method
  return render(ui, {queries, ...rest})
}

// re-export everything
export * from 'react-testing-library'

// override render method
export {customRender as render}
```

 
 > **Note**
 >
 > In the future, React may provide more APIs for controlling whether a component tree is synchronous or concurrent/suspendable.

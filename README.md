# redux-seamless-immutable

Helpers for using [`seamless-immutable`](https://github.com/rtfeldman/seamless-immutable) in [Redux](http://redux.js.org). Provides a compatible `combineReducers` and `routerReducer` (for use with `react-router-redux`).

## Installation

	$ npm install redux-seamless-immutable

## Usage

```javascript
import { combineReducers, routerReducer } from 'redux-seamless-immutable'
import { createStore } from 'redux'

import reducer from './reducers'

const rootReducer = combineReducers({
  reducer,
  routing: routerReducer
})

const store = createStore(
  rootReducer
)
```

## API

#### `combineReducers()`

A `seamless-immutable` compatible [`combineReducers`](http://redux.js.org/docs/api/combineReducers.html).

#### `routerReducer()`

A `seamless-immutable` compatible replacement for the [`routerReducer`](https://github.com/reactjs/react-router-redux#routerreducer) from [react-router-redux](https://github.com/reactjs/react-router-redux).



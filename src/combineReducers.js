import Immutable from 'seamless-immutable';

export default function combineReducers(reducers) {
  let reducerKeys = Object.keys(reducers);
  return (inputState, action) => {
    return Immutable(reducerKeys.reduce((reducersObject, reducerName) => {
      let reducer = reducers[reducerName];
      let reducerState = inputState[reducerName];
      reducersObject[reducerName] = reducer(reducerState, action);
      return reducersObject;
    }, {}));
  }
}
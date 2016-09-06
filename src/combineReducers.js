import Immutable from 'seamless-immutable';

export default function combineReducers(reducers) {
  let reducerKeys = Object.keys(reducers);
  return (inputState=Immutable({}), action) => {
    let newState = Immutable(inputState);

    reducerKeys.forEach(reducerName => {
      let reducer = reducers[reducerName];
      let reducerState = inputState[reducerName];
      newState = newState.set(reducerName, reducer(reducerState, action));
    });

    return newState;
  }
}
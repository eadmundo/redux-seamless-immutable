import Immutable from 'seamless-immutable';

export default function combineReducers(reducers) {
  return (state=Immutable({}), action) => Object.keys(reducers)
    .reduce(
      (iState, key) => iState.set(key, reducers[key](state[key], action)),
      Immutable(state)
    )
}

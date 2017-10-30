import { expect } from 'chai';
import Immutable from 'seamless-immutable';
import combineReducers from '../src/combineReducers';

describe('combineReducers', () => {
  it('returns a composite reducer that maps the state keys to given reducers', () => {
    const reducer = combineReducers({
      counter: (state = 0, action) =>
      action.type === 'increment' ? state + 1 : state,
      stack: (state = [], action) =>
      action.type === 'push' ? [ ...state, action.value ] : state
    })

    const s1 = reducer(Immutable({}), { type: 'increment' })
    expect(s1).to.eql({ counter: 1, stack: [] })
    const s2 = reducer(s1, { type: 'push', value: 'a' })
    expect(s2).to.eql({ counter: 1, stack: [ 'a' ] })
  })

  it('returns the same object instance if no state has changed', () => {
    const reducer = combineReducers({
      doNothing1: state => state || Immutable({ hello: "world" }),
      doNothing2: state => state || Immutable({ one: 2 })
    })

    const s1 = reducer(Immutable({}), { type: "test1" });
    const s2 = reducer(s1, { type: "test2" });

    expect(s1).to.equal(s2);
  })

  it('maintains referential equality if the reducers it is combining do', () => {
    const reducer = combineReducers({
      child1 (state = {}) {
        return state
      },
      child2 (state = {}) {
        return state
      },
      child3 (state = {}) {
        return state
      }
    })

    const initialState = reducer(Immutable({}), '@@INIT')
    expect(reducer(initialState, { type: 'FOO' })).to.equal(initialState)
  })

  it('does not have referential equality if one of the reducers changes something', () => {
    const reducer = combineReducers({
      child1 (state = {}) {
        return state
      },
      child2 (state = { count: 0 }, action) {
        switch (action.type) {
          case 'increment':
            return { count: state.count + 1 }
          default:
            return state
        }
      },
      child3 (state = {}) {
        return state
      }
    })

    const initialState = reducer(undefined, '@@INIT')
    expect(reducer(initialState, { type: 'increment' })).to.not.equal(initialState)
  })

  it('catches error thrown in reducer when initializing and re-throw', () => {
    const reducer = combineReducers({
      throwingReducer () {
        throw new Error('Error thrown in reducer')
      }
    })
    expect(
      () => reducer({})
    ).to.throw(
      /Error thrown in reducer/
    )
  })

  it('ignores all props which are not a function (in production)', () => {
    global.process.env.NODE_ENV = 'production';

    const reducer = combineReducers({
      fake: true,
      broken: 'string',
      another: { nested: 'object' },
      stack: (state = []) => state
    });

    const validReducerKeys = Object.keys(reducer(Immutable({}), { type: 'push' }))

    expect(validReducerKeys).to.deep.equal(['stack'])

    global.process.env.NODE_ENV = undefined
  })

  it('throws an error if a reducer returns undefined handling an action', () => {
    const reducer = combineReducers({
      counter (state = 0, action) {
        switch (action && action.type) {
          case 'increment':
            return state + 1
          case 'decrement':
            return state - 1
          case 'whatever':
          case null:
          case undefined:
            return undefined
          default:
            return state
        }
      }
    })

    const state = Immutable({ counter: 0 })

    expect(
      () => reducer(state, { type: 'whatever' })
    ).to.throw(
      /"counter".*"whatever"/
    )
    expect(
      () => reducer(state, null)
    ).to.throw(
      /"counter".*an action/
    )
    expect(
      () => reducer(state, {})
    ).to.throw(
      /"counter".*an action/
    )
  })

  it('throws an error on first call if a reducer returns undefined initializing', () => {
    const reducer = combineReducers({
      counter (state, action) {
        switch (action && action.type) {
          case 'increment':
            return state + 1
          case 'decrement':
            return state - 1
          default:
            return state
        }
      }
    })

    expect(
      () => reducer(Immutable({}), 'asdf')
    ).to.throw(
      /"counter".*initialization/
    )
  })

  it('allows a symbol to be used as an action type', () => {
    const increment = Symbol('INCREMENT')

    const reducer = combineReducers({
      counter (state = 0, action) {
        switch (action.type) {
          case increment:
            return state + 1
          default:
            return state
        }
      }
    })

    expect(
      reducer(Immutable({ counter: 0 }), { type: increment }).counter
    ).to.equal(1)
  })

  it('throws an error on first call if a reducer attempts to handle a private action', () => {
    const reducer = combineReducers({
      counter (state, action) {
        switch (action.type) {
          case 'increment':
            return state + 1
          case 'decrement':
            return state - 1
          // Never do this in your code:
          case '@@redux/INIT':
            return 0
          default:
            return undefined
        }
      }
    })

    expect(() => reducer()).to.throw(
      /"counter".*private/
    )
  })
})

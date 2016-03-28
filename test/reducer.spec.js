import { expect } from 'chai';
import Immutable from 'seamless-immutable';
import routerReducer from '../src/routerReducer';
import { LOCATION_CHANGE } from 'react-router-redux';

describe('routerReducer', () => {
  const state = Immutable({
    locationBeforeTransitions: {
      pathname: '/foo',
      action: 'POP'
    }
  })

  it('updates the path', () => {
    expect(routerReducer(state, {
      type: LOCATION_CHANGE,
      payload: {
        path: '/bar',
        action: 'PUSH'
      }
    })).to.eql({
      locationBeforeTransitions: {
        path: '/bar',
        action: 'PUSH'
      }
    })
  })

  it('works with initialState', () => {
    expect(routerReducer(undefined, {
      type: LOCATION_CHANGE,
      payload: {
        path: '/bar',
        action: 'PUSH'
      }
    })).to.eql({
      locationBeforeTransitions: {
        path: '/bar',
        action: 'PUSH'
      }
    })
  })


  it('respects replace', () => {
    expect(routerReducer(state, {
      type: LOCATION_CHANGE,
      payload: {
        path: '/bar',
        action: 'REPLACE'
      }
    })).to.eql({
      locationBeforeTransitions: {
        path: '/bar',
        action: 'REPLACE'
      }
    })
  })
})

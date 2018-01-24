import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe('auth reducer', () => {
  it('should return the intial state', () => {
    expect(reducer(undefined, {})).toEqual({
      token: null,
      userId: null,
      error: null,
      loading: false,
      authRedirectPath: '/'
    });
  });

  it('should store the token upon login', () => {
    const state = {
      token: null,
      userId: null,
      error: null,
      loading: false,
      authRedirectPath: '/'
    }
    expect(reducer(state, {
      type: actionTypes.AUTH_SUCCESS,
      idToken: "some-token",
      userId: "some-userId"
    })).toEqual({
      token: "some-token",
      userId: "some-userId",
      error: null,
      loading: false,
      authRedirectPath: '/'
    })
  });
});

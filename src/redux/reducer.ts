import {SET_USERS, SET_SEARCHED_USER} from './actions';
import {fromJS} from 'immutable';

const initialState = fromJS({
  users: [],
  searchedUser: '',
});

export const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_USERS:
      return state.set('users', fromJS(action.payload));
    case SET_SEARCHED_USER:
      return state.set('searchedUser', action.payload);
    default:
      return state;
  }
};

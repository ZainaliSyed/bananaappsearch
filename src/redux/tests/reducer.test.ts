import {reducer} from '../reducer';
import {setUsers, setSearchedUser} from '../actions';
import {fromJS} from 'immutable';

describe('reducer', () => {
  it('should handle SET_USERS', () => {
    const initialState = fromJS({users: [], searchedUser: ''});
    const users = [{name: 'John', bananas: 5}];
    const newState = reducer(initialState, setUsers(users));
    expect(newState.get('users').toJS()).toEqual(users);
  });

  it('should handle SET_SEARCHED_USER', () => {
    const initialState = fromJS({users: [], searchedUser: ''});
    const newState = reducer(initialState, setSearchedUser('John'));
    expect(newState.get('searchedUser')).toEqual('John');
  });
});

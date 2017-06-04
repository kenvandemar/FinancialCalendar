import {
    GET_ALL_STATE
} from '../actions/constants';

import store from '../configureStore';
const initialState = {
 allState: {}
}

export default function getAllStateReducer (state = initialState, action) {
    switch(action.type) {
        case GET_ALL_STATE: 
            return {
                ...state,
                allState: action.stateData
            }
        default:
            return state
    }
}
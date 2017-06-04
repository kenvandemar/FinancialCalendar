import { FETCHING_TYPE, 
        FETCHING_TYPE_SUCCESS, 
        FETCHING_TYPE_FAILURE,

        FETCH_TYPE_BY_NAME_LOCAL,
        FETCH_TYPE_BY_NAME_LOCAL_SUCCESS
    } 
from '../actions/constants';

const initialState = {
    typeData: [],
    isFetching: false,
    error: false
}

export default function typeReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_TYPE_BY_NAME_LOCAL:
        case FETCHING_TYPE:
            return {
                ...state,
                isFetching: true,
                typeData: []
            }
        case FETCH_TYPE_BY_NAME_LOCAL_SUCCESS:
            return {
                ...state,
                isFetching: false,
                typeData: action.typeLocalData
            }
        case FETCHING_TYPE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                typeData: action.typeData
            }
        case FETCHING_TYPE_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true
            }
        default: 
            return state;
    }
}
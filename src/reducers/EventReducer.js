import {FETCHING_EVENT,
        FETCHING_EVENT_SUCCESS,
        FETCHING_EVENT_FAILURE,

        FETCHING_MORE_EVENT,
        FETCHING_MORE_EVENT_SUCCESS,
        FETCHING_MORE_EVENT_FAILURE,

        FETCH_EVENT_LOCAL,
        FETCH_EVENT_LOCAL_SUCCESS,

        FETCH_MORE_EVENT_LOCAL,
        FETCH_MORE_EVENT_LOCAL_SUCCESS
} from '../actions/constants';

const initialState = {
    eventData: [],
    isFetching: false,
    error: false,

    moreEventData: [],
    isFetchings: false,
    errors: false
}

export default function eventReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_EVENT_LOCAL:
        case FETCHING_EVENT:
            return {
                ...state,
                isFetching: true,
                eventData: []
            }
        case FETCH_EVENT_LOCAL_SUCCESS:
            return {
                ...state,
                isFetching: false,
                eventData: action.eventLocalData.concat(initialState.moreEventData)
            }
        case FETCHING_EVENT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                eventData: action.eventData.concat(initialState.moreEventData)
            }
        case FETCHING_EVENT_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case FETCH_MORE_EVENT_LOCAL:
        case FETCHING_MORE_EVENT:
            return {
                ...state,
                isFetchings: true,
                moreEventData: []
            }
        case FETCH_MORE_EVENT_LOCAL_SUCCESS:
            return {
                ...state,
                isFetching: false,
                moreEventData: action.mEventLocal
            }
        case FETCHING_MORE_EVENT_SUCCESS:
            return {
                ...state,
                isFetchings: false,
                moreEventData: action.moreEventData
            }
        case FETCHING_MORE_EVENT_FAILURE:
            return {
                ...state,
                isFetchings: false,
                errors: true
            }
        default:
            return state
    }
}
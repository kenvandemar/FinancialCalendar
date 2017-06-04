import {
    GET_TYPE_ID,
    GET_TYPE_ID_SUCCESS,
    GET_TYPE_ID_FAILURE,

    GET_TYPE_NAME,
    GET_TYPE_NAME_SUCCESS,

    FETCH_TYPE_BY_NAME,
    FETCH_TYPE_BY_NAME_SUCCESS,
    FETCH_TYPE_BY_NAME_FAILURE,

    FETCH_TYPE_LOAD_MORE,
    FETCH_TYPE_LOAD_MORE_SUCCESS,
    FETCH_TYPE_LOAD_MORE_FAILURE,

    FETCH_EVENT_BY_TYPE_LOCAL,
    FETCH_EVENT_BY_TYPE_LOCAL_SUCCESS,

    FETCH_MORE_TYPE_BY_NAME_LOCAL,
    FETCH_MORE_TYPE_BY_NAME_LOCAL_SUCCESS,

    GET_DATA_FILTER

} from '../actions/constants.js';

const initialState = { 
                typeEventData: [],
                isFetch: false,
                errorrs: false,
                typeIdList: '',
                typeNameList: '',
                moreEventData: [],
                isFetchs: false,
                errorr: null,
                dataFilter: []

    };

export default function getTypeReducer(state = initialState, action) {
    switch(action.type) {
        case GET_DATA_FILTER:
        return {
            ...state,
            dataFilter: action.dataFilter
        }
        case GET_TYPE_ID_SUCCESS:
            return {
                ...state,
                typeIdList: action.item
            }
        case GET_TYPE_NAME_SUCCESS:
            return {
                ...state,
                typeNameList: action.itemName
            }
        case FETCH_EVENT_BY_TYPE_LOCAL:
        case FETCH_TYPE_BY_NAME:
            return {
                ...state,
                isFetch: true,
                typeEventData: []
            }
        case FETCH_EVENT_BY_TYPE_LOCAL_SUCCESS:
            return {
                ...state,
                isFetch: false,
                typeEventData: action.eventTypeLocal
            }
        case FETCH_TYPE_BY_NAME_SUCCESS:
            return {
                ...state,
                isFetch: false,
                typeEventData: action.typeEventData,
            }
        case FETCH_TYPE_BY_NAME_FAILURE:
            return {
                ...state,
                isFetch: false,
                errorrs: true
            }
        case FETCH_MORE_TYPE_BY_NAME_LOCAL:
        case FETCH_TYPE_LOAD_MORE:
            return {
                ...state,
                isFetchs: true,
                moreEventData: []
            }

        case FETCH_MORE_TYPE_BY_NAME_LOCAL_SUCCESS:
            return {
                ...state,
                isFetchs: false,
                moreEventData: action.mEventByTypeLocal
            }
        case FETCH_TYPE_LOAD_MORE_SUCCESS:
            return {
                ...state,
                isFetchs: false,
                moreEventData: action.moreEventData
            }
        case FETCH_TYPE_LOAD_MORE_FAILURE:
            return {
                ...state,
                isFetchs: false,
                errorr: true
            }
            default:
                return state
    }

    
}

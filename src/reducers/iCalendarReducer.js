import {
    FETCHING_CALENDAR,
    FETCHING_CALENDAR_SUCCESS,
    FETCHING_CALENDAR_FAILURE
} from '../actions/constants';

const initialState = {
    iCalData: [],
    isLoadings: false,
    errored: false
}
export default function iCalendarReducer(state = initialState, action) {
    switch(action.type) {
        case FETCHING_CALENDAR:
            return {
                ...state,
                isLoadings: true,
                typeData: []
            }
        case FETCHING_CALENDAR_SUCCESS: 
            return {
                ...state,
                isLoadings: false,
                iCalData: action.iCalData
            }
        case FETCHING_CALENDAR_FAILURE:
            return {
                ...state,
                isLoadings: false,
                errored: true
            }
        default:
            return state;
    }
}
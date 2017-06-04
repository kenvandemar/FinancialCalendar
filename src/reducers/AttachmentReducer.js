import {
    FETCH_ATTACHMENT,
    FETCH_ATTACHMENT_SUCCESS,
    FETCH_ATTACHMENT_FAILURE
} from '../actions/constants';

const initialState = {
    attachmentData: [],
    isFetching: false,
    error: false
}

export default function attachmentReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_ATTACHMENT:
            return {
                ...state,
                isFetching: true,
                attachmentData: []
            }
        case FETCH_ATTACHMENT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                attachmentData: action.attData
            }
        case FETCH_ATTACHMENT_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true
            }
        default:
            return state
    }
}
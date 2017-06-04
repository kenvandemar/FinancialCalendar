import {
 GET_EVENT_LIST_SUCCESS,
} from './constants.js';

function getEventSuccess(item) {
    return {
        type: GET_EVENT_LIST_SUCCESS,
        item
    };
}
export function getEventDataNow(eventd) {
    return (dispatch) => {
        dispatch(
            getEventSuccess(eventd)
        );
    };
}


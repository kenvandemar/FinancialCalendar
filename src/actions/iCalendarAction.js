import {
    FETCHING_CALENDAR,
    FETCHING_CALENDAR_SUCCESS,
    FETCHING_CALENDAR_FAILURE
} from './constants';


export function fetchICalendarFromAPI() {
    return (dispatch) => {
        dispatch(getCalendar())
        fetch('http://113.190.248.146/myirappapi2/api/v1/fincalendar/ae-nbad/en-gb/')
            .then(res => res.json())
            .then(json => dispatch(getCalendarSuccess(json)))
            .catch(err => dispatch(getCalendarFailure(err)))
    }
}


function getCalendar() {
    return {
        type: FETCHING_CALENDAR
    }
}

function getCalendarSuccess(iCalData) {
    return {
        type: FETCHING_CALENDAR_SUCCESS,
        iCalData
    }
}

function getCalendarFailure(err) {
    return {
        type: FETCHING_CALENDAR_FAILURE,
        err
    }
}
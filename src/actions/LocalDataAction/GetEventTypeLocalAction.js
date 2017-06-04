import {
    FETCH_EVENT_BY_TYPE_LOCAL,
    FETCH_EVENT_BY_TYPE_LOCAL_SUCCESS,

    FETCH_MORE_TYPE_BY_NAME_LOCAL,
    FETCH_MORE_TYPE_BY_NAME_LOCAL_SUCCESS,

    GET_DATA_FILTER
} from '../constants';


let lastDatess = '';
let removeIdss = '';
let typeNames = '';

export function getMoreEventyByTypeLocal(mEventByTypeLocal, lstDate = '', rmvId = '') {
    return (dispatch) => {
        dispatch(fetchMoreEventByTypeLocal());
            if (mEventByTypeLocal !== null && mEventByTypeLocal.length > 0) {
                dispatch(fetchMoreEvenByTypeLocalSuccess(mEventByTypeLocal));
            }  
        }
    }

export function getMoreEventyByTypeLocalOffline(mEventByTypeLocal, lstDate = '', rmvId = '', typeName = '') {
    lastDatess = lstDate;
    removeIdss = rmvId;
    typeNames = typeName;

    return (dispatch) => {
        let dataFilter = null;
        let arrIds = removeIdss.split(',');

        dispatch(fetchMoreEventByTypeLocal());
        if (mEventByTypeLocal.length > 0 && mEventByTypeLocal.length !== null) {

            dataFilter = mEventByTypeLocal.filter(obj => new Date(obj.EventDate) <= new Date(lastDatess) && arrIds.indexOf(obj.Id.toString()) < 0);
        
        let theDataFilter = dataFilter.filter(data => data.EventType.toString() === typeNames.toString());
            
            if (theDataFilter !== null && theDataFilter.length > 0) {
                if (theDataFilter.length >= 10) {
                    theDataFilter = theDataFilter.slice(0, 10);
                } else {
                    theDataFilter.slice(0, -theDataFilter.length);
                }
            }
            dispatch(fetchMoreEvenByTypeLocalSuccess(theDataFilter));
        }
    }

}
export function getDataFilter(dataFilter) {
    return {
        type: GET_DATA_FILTER,
        dataFilter
    }
}
export function fetchMoreEventByTypeLocal() {
    return {
        type: FETCH_MORE_TYPE_BY_NAME_LOCAL
    }
}

function fetchMoreEvenByTypeLocalSuccess(mEventByTypeLocal) {
    return {
        type: FETCH_MORE_TYPE_BY_NAME_LOCAL_SUCCESS,
        mEventByTypeLocal
    }
}


export function getEventByTypeLocal(eventTypeLocal) {
    return (dispatch) => {
        dispatch(fetchEventByTypeLocal());
        if (eventTypeLocal.length > 0) {
            dispatch(fetchEventByTypeLocalSuccess(eventTypeLocal));
        }
    }
}

function fetchEventByTypeLocal() {
    return {
        type:  FETCH_EVENT_BY_TYPE_LOCAL
    }
}

function fetchEventByTypeLocalSuccess(eventTypeLocal) {
    return {
        type: FETCH_EVENT_BY_TYPE_LOCAL_SUCCESS,
        eventTypeLocal
    }
}
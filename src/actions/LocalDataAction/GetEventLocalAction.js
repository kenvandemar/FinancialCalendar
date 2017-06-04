import _ from 'lodash';

import {
    FETCH_EVENT_LOCAL,
    FETCH_EVENT_LOCAL_SUCCESS,

    FETCH_MORE_EVENT_LOCAL,
    FETCH_MORE_EVENT_LOCAL_SUCCESS
} from '../constants';

let lastDates = '';
let removeIds = '';

export function getMoreEventLocal(mEventLocal, lstDate = '', rmvId = '') {
    return (dispatch) => {
        dispatch(fetchMoreEventLocal());

  console.log('CHECK STORAGEEEE', mEventLocal);
  if (mEventLocal.length > 0 && mEventLocal !== null) {
            dispatch(fetchMoreEventLocalSuccess(mEventLocal));
        }    
    }
}


export function getMoreEventLocalOffline(mEventLocal, lstDate = '', rmvId = '') {
    lastDates = lstDate;
    removeIds = rmvId;

    return (dispatch) => {
        let dataFilter = null;
        let arrIds = removeIds.split(',');

        dispatch(fetchMoreEventLocal());

  if (mEventLocal.length > 0 && mEventLocal !== null) {
    dataFilter = mEventLocal.filter(obj => new Date(obj.EventDate) <= new Date(lastDates) && arrIds.indexOf(obj.Id.toString()) < 0);  
            let uniqueData = _.uniqBy(dataFilter, (x) => {
                return x.Id;
            });
          
            
          if (uniqueData !== null && uniqueData.length > 0) {
              if (uniqueData.length >= 10) {
                  uniqueData = uniqueData.slice(0, 10);
              } else {
                  uniqueData.slice(0, -uniqueData.length);
              }
          }

  console.log('CHECK STORAGE UNIQUE', uniqueData);
            dispatch(fetchMoreEventLocalSuccess(uniqueData));
  }
        
    }
}

function fetchMoreEventLocal() {
    return {
        type: FETCH_MORE_EVENT_LOCAL
    }
}

function fetchMoreEventLocalSuccess(mEventLocal){
    return {
        type: FETCH_MORE_EVENT_LOCAL_SUCCESS,
        mEventLocal
    }
}

export function getEventLocal(eventLocalData) {
    return (dispatch) => {
        dispatch(fetchEventLocal());
        if (eventLocalData.length > 0) {
            dispatch(fetchEventLocalSuccess(eventLocalData));
        }
    }
}

function fetchEventLocal() {
    return {
        type: FETCH_EVENT_LOCAL
    }
}

function fetchEventLocalSuccess(eventLocalData) {
    return {
        type: FETCH_EVENT_LOCAL_SUCCESS,
        eventLocalData
    }
}
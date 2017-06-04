import _ from 'lodash';
import React from 'react';
import { AsyncStorage } from 'react-native';

import { FETCHING_EVENT,
         FETCHING_EVENT_SUCCESS,
         FETCHING_EVENT_FAILURE,

         FETCHING_MORE_EVENT,
         FETCHING_MORE_EVENT_SUCCESS,
         FETCHING_MORE_EVENT_FAILURE
} from './constants';
import { getMoreEventLocal} from './LocalDataAction/GetEventLocalAction';

const serviceBaseUrl = 'http://113.190.248.146/myirappapi2/';
const apiPath = 'api';
const apiVersion = 'v1';
const apiName = 'fincalendar';
const companyCode = 'ae-nbad';
const lang = 'en-gb';

let eventStorageKey = React.PropTypes.string;
let eventStorageKeyMore = React.PropTypes.string;


let url = 'http://113.190.248.146/myirappapi2/api/v1/fincalendar/ae-nbad/en-gb/10';
let lastDates = '';
let removeIds = '';
let originLastDates = '';

eventStorageKey = `${apiName}_${lang}`;
eventStorageKeyMore = `${lang}_${apiName}`;


export function fetchEventFromAPI() {
    return (dispatch) => {
        dispatch(getEvent())
        fetch(url)
            .then(res => res.json())
            .then(json => {

                let sData = { cacheTime: new Date().getTime(), data: json };

                dispatch(getEventSuccess(json));
                AsyncStorage.setItem(eventStorageKey, JSON.stringify(sData));
            })
            .catch(err => dispatch(getEventFailure(err)))
    }
}

function getEvent() {
    return {
        type: FETCHING_EVENT
    }
}


function getEventSuccess(eventData) {
    return {
        type: FETCHING_EVENT_SUCCESS,
        eventData
    }
}

function getEventFailure(err) {
    return {
        type: FETCHING_EVENT_FAILURE,
        err
    }
}


export function fetchMoreEventFromAPI( lstDate = '', rmvId = '', orgLastDate = '') {
    lastDates = lstDate;
    removeIds = rmvId;
    originLastDates = orgLastDate;
  
    if (lastDates !== '') {
        url += '/' + lastDates;
    }
    if (removeIds !== '') {
        url += '/' + removeIds;
    }

console.log('CHECK URL NOW', url);
    return(dispatch) => {
        let dataFilter = null;
        let arrIds = removeIds.split(',');
    
        dispatch(getMoreEvent())
        fetch(url)
            .then(res => res.json())
            .then(json => {
                if (json !== undefined && json !== null) {
                let data = json;
                    
                AsyncStorage.getItem(eventStorageKeyMore).then((mEventData) => {
                 
                    if(mEventData === null){
                        AsyncStorage.setItem(eventStorageKeyMore, JSON.stringify(data));
                    }
                    else {
                        let moreEventLocal = JSON.parse(mEventData);
                        AsyncStorage.setItem(eventStorageKeyMore, JSON.stringify(moreEventLocal.concat(data)));

                      
                        dataFilter = moreEventLocal.filter(obj => new Date(obj.EventDate) <= new Date(originLastDates) && arrIds.indexOf(obj.Id.toString()) < 0);

                       
                    
                     let dataFilterUnique = _.uniqBy(dataFilter, (x) => {
                         return x.Id;
                     })
                console.log('CHEK DATA', dataFilterUnique);

                        if (dataFilterUnique !== null && dataFilterUnique.length > 0) {
                            if (dataFilterUnique.length >= 10) {
                                dataFilterUnique = dataFilterUnique.slice(0, 10);
                            } else {
                                dataFilterUnique.slice(0, -dataFilterUnique.length);
                            }
                             dispatch(getMoreEventLocal(dataFilterUnique, originLastDates, removeIds)); 
                        } else {
                            dispatch(getMoreEventSuccess(json));
                        }
                            
                    }
                })   
             }      
            })
            .catch(err => dispatch(getEventFailure(err)))
             url = url.slice(0, url.lastIndexOf('/'));
                url = url.slice(0, url.lastIndexOf('/'));

    }
}

function getMoreEvent() {
    return {
        type: FETCHING_MORE_EVENT
    }
}

function getMoreEventSuccess(moreEventData) {
    return {
        type: FETCHING_MORE_EVENT_SUCCESS,
        moreEventData
    }
}

function getMoreEventFailure(err) {
    return {
        type: FETCHING_MORE_EVENT_FAILURE,
        err
    }
}
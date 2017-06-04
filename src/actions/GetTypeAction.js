import _ from 'lodash';
import React from 'react';
import { AsyncStorage } from 'react-native';
import dateFormat from 'dateformat';
import {
    GET_TYPE_ID,
    GET_TYPE_ID_SUCCESS,
    GET_TYPE_ID_FAILURE,

    FETCH_TYPE_BY_NAME,
    FETCH_TYPE_BY_NAME_SUCCESS,
    FETCH_TYPE_BY_NAME_FAILURE,

    FETCH_TYPE_LOAD_MORE,
    FETCH_TYPE_LOAD_MORE_SUCCESS,
    FETCH_TYPE_LOAD_MORE_FAILURE,

    GET_TYPE_NAME,
    GET_TYPE_NAME_SUCCESS

} from './constants';
import { getMoreEventyByTypeLocal, fetchMoreEventByTypeLocal } from './LocalDataAction/GetEventTypeLocalAction';

const serviceBaseUrl = 'http://113.190.248.146/myirappapi2';
const apiPath = 'api';
const apiVersion = 'v1';
const apiName = 'fincalendar';
const companyCode = 'ae-nbad';
const lang = 'en-gb';

let typeIds = '';
let pageSizes = '';
let lastDates = '';
let removeIds = '';
let originLastDates = '';
let typeNames = '';
let typeNamess = '';
const hyphen = '-';
const colon = ':';

let eventTypeStorageKey = React.PropTypes.string;
let moreEventTypeStorageKey = React.PropTypes.string;



eventTypeStorageKey = `${apiName}_${lang}_${lang}`;
moreEventTypeStorageKey = `${lang}_${apiName}_${apiName}`;

let url = `${serviceBaseUrl}/${apiPath}/${apiVersion}/${apiName}/${companyCode}/${lang}`;


//FETCH MORE

export function fetchMoreTypeByNameFromAPI(typeId = '', pageSize = React.PropTypes.number, lstDate = '', rmvId = '', typeName='') {
    typeIds = typeId;
    pageSizes = pageSize;
    lastDates = lstDate;
    removeIds = rmvId;
    typeNames = typeName
    console.log('CHECK THE FUKCING TYPE NAME', typeNames);

    let convertDate1 = lastDates.substr(0, 4) + hyphen + lastDates.substr(4);
    let convertDate2 = convertDate1.substr(0, 7) + hyphen + convertDate1.substr(7);
    let convertDate3 = convertDate2.substr(0, 13) + colon + convertDate2.substr(13);
    let lastConvertDates = convertDate3.substr(0, 16) + colon + convertDate3.substr(16);
    console.log('CHECK LAST ONE', lastConvertDates);  

    if (typeIds !== '') {
       url += '/' + typeIds;
   }
   
    if (pageSizes !== '') {
       url += '/' + pageSizes;
   }

   if (lastDates !== '') {
        url += '/' + lastDates;
   }
   if (removeIds !== '') {
       url += '/' + removeIds;
   } 
   console.log('CHECK URL', url);
   
    return (dispatch) => {
        let dataFilter = null;
        let arrIds = removeIds.split(',');
        dispatch(getMoreTypeByName())
        fetch(url)
            .then(res => res.json())
            .then(json => {
                console.log('CHECK JSON', json);
                if (json !== undefined && json !== null) {
                    AsyncStorage.getItem(moreEventTypeStorageKey).then((mEventTypeData) => {
                   
                if (mEventTypeData === null) {
                            AsyncStorage.setItem(moreEventTypeStorageKey, JSON.stringify(json));
                } 
                else {
                 let moreEventTypeLocal = JSON.parse(mEventTypeData);

                // let eventTypeFilter = moreEventTypeLocal.filter(data => data.EventType.toString() === typeNames.toString());

               
                let uniqueEventType = _.uniqBy(moreEventTypeLocal, (x) => {
                    return x.Id;
                });
                 console.log('CHECK REPEAT EVENT', uniqueEventType);
             AsyncStorage.setItem(moreEventTypeStorageKey, JSON.stringify(uniqueEventType.concat(json)));

          dataFilter = moreEventTypeLocal.filter(obj => new Date(obj.EventDate) <= new Date(lastConvertDates) && arrIds.indexOf(obj.Id.toString()) < 0);

        let theDataFilter = dataFilter.filter(data => data.EventType.toString() === typeNames.toString());
                console.log('CHECK MY DATA FILTERS', dataFilter);

                    if (theDataFilter !== null && theDataFilter.length > 0) {
                            if (theDataFilter.length >= 10) {
                                theDataFilter = theDataFilter.slice(0, 10);
                            } else {
                                theDataFilter.slice(0, -theDataFilter.length);
                            }
                             dispatch(getMoreEventyByTypeLocal(theDataFilter, lastConvertDates, removeIds));
                        }  else {
                             dispatch(getMoreTypeByNameSuccess(json))
                        }
                            //dispatch(fetchMoreEventByTypeLocal());
                        }
                    })
                }
                
            })
            .catch(err => dispatch(getMoreTypeByNameFailure(err)))
               url = url.slice(0, url.lastIndexOf('/'));
                 url = url.slice(0, url.lastIndexOf('/'));
                 url = url.slice(0, url.lastIndexOf('/'));
                 url = url.slice(0, url.lastIndexOf('/'));
               
    }
}

function getMoreTypeByName() {
    return {
        type: FETCH_TYPE_LOAD_MORE
    }
}
function getMoreTypeByNameSuccess(moreEventData) {
    return {
        type: FETCH_TYPE_LOAD_MORE_SUCCESS,
        moreEventData
    }
}
function getMoreTypeByNameFailure(err) {
    return {
        type: FETCH_TYPE_LOAD_MORE_FAILURE,
        err
    }
}
//Fetch TYPE BY NAME
export function fetchTypeByNameFromAPI(typeId, typeName='') {

typeNamess = typeName;

    return (dispatch) => {
        dispatch(getTypeByName())
        fetch(`http://113.190.248.146/myirappapi2/api/v1/fincalendar/ae-nbad/en-gb/${typeId}/10`)
            .then(res => res.json())
            .then(json => {
                let sData = { cacheTime: new Date().getTime(), data: json }
                dispatch(getTypeByNameSuccess(json));
             
                AsyncStorage.getItem(eventTypeStorageKey).then((eventTypeData) => {
                    if (eventTypeData === null) {
                         AsyncStorage.setItem(eventTypeStorageKey, JSON.stringify(json));
                    } else {
                        let eventTypeLocal = JSON.parse(eventTypeData);
                       let eventList = _.uniqBy(eventTypeLocal, (x) => {
                            return x.Id
                        });
                        AsyncStorage.setItem(eventTypeStorageKey, JSON.stringify(eventList.concat(json)));
                    }
                });
        
            })
            .catch(err => dispatch(getTypeByNameFailure(err)))
    }
}

function getTypeByName() {
    return {
        type: FETCH_TYPE_BY_NAME
    }
}

function getTypeByNameSuccess(typeEventData) {
    return {
        type: FETCH_TYPE_BY_NAME_SUCCESS,
        typeEventData
    }
}

function getTypeByNameFailure(err) {
    return {
        type: FETCH_TYPE_BY_NAME_FAILURE,
        err
    }
}


// GET TYPE ID
function getTypeIdSuccess(item) {
    return {
        type: GET_TYPE_ID_SUCCESS,
        item
    }
} 

export function getTypeId(idItem) {
    return (dispatch) => {
        dispatch(
            getTypeIdSuccess(idItem)
        );
    }
}


// GET TYPE NAME
function getTypeNameSuccess(itemName) {
    return {
        type: GET_TYPE_NAME_SUCCESS,
        itemName
    }
}

export function getTypeName(nameItem) {
    return (dispatch) => {
        dispatch (getTypeNameSuccess(nameItem))
    }
}


import React from 'react';
import { AsyncStorage } from 'react-native';
import { FETCHING_TYPE,
         FETCHING_TYPE_SUCCESS, 
         FETCHING_TYPE_FAILURE    
} 
from './constants';

const apiName = 'fincalendar';
const eventTypeApiName = 'eventtype';
const lang = 'en-gb';

let typeStorageKey = React.PropTypes.string;
typeStorageKey = `${apiName}_${eventTypeApiName}_${lang}`;

export function fetchTypeFromAPI() {
    return (dispatch) => {
        dispatch(getType())
        fetch('http://113.190.248.146/myirappapi2/api/v1/fincalendar/eventtype/ae-nbad/en-gb')
            .then(res => res.json())
            .then(json => {
                dispatch(getTypeSuccess(json));
                AsyncStorage.setItem(typeStorageKey, JSON.stringify(json));
                 
        })
            .catch(err => dispatch(getTypeFailure(err)))
    }
}

function getType() {
    return {
        type: FETCHING_TYPE
    }
}

function getTypeSuccess(typeData) {
    return {
        type: FETCHING_TYPE_SUCCESS,
        typeData
    }
}

function getTypeFailure(err) {
    return {
        type: FETCHING_TYPE_FAILURE,
        err
    }
}

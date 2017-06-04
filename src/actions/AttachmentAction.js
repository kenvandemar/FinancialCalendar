import {
    FETCH_ATTACHMENT,
    FETCH_ATTACHMENT_SUCCESS, FETCH_ATTACHMENT_FAILURE
} from './constants';


const serviceBaseUrl = 'http://113.190.248.146/myirappapi2/';
const apiPath = 'api';
const apiVersion = 'v1';
const apiName = 'fincalendar';
const eventTypeApiName = 'eventtype';
const lang = 'en-gb';

const url = `${serviceBaseUrl}/${apiPath}/${apiVersion}/${apiName}/attachments`;

export function fetchAttachmentFromAPI(id) {
    const attachmentUrl = `${url}/${id}`
    return (dispatch) => {
        dispatch(getAttachment())
        fetch(attachmentUrl)
            .then(res => res.json())
            .then(json => dispatch(getAttachmentSuccess(json)))
            .catch(err => dispatch(getAttachmentFailure(err)))
    }   
}

function getAttachment() {
    return {
        type: FETCH_ATTACHMENT
    }
}

function getAttachmentSuccess(attData) {
    return {
        type: FETCH_ATTACHMENT_SUCCESS,
        attData
    }
}

function getAttachmentFailure(err) {
    return {
        type: FETCH_ATTACHMENT_FAILURE,
        err
    }
}
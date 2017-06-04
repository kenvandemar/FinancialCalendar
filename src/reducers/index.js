import { combineReducers } from 'redux';
import { FETCH_TYPE_BY_NAME_SUCCESS } from '../actions/constants';
import routes from './routes';
import TypeReducer from './TypeReducer';
import EventReducer from './EventReducer';
import AttachmentReducer from './AttachmentReducer';
import GetTypeReducer from './GetTypeReducer';
import iCalendarReducer from './iCalendarReducer';
import recycleState from 'redux-recycle';
import GetEventReducer from './GetEventReducer';
import CheckNetWorkReducer from './CheckNetWorkReducer';

const appReducer = combineReducers({
    routes,
    typeData: TypeReducer,
    eventData: EventReducer,
    attachmentData: AttachmentReducer,
    typeEventData:  GetTypeReducer,
    iCalendarData: iCalendarReducer,
    getEvent: GetEventReducer,
    checkNetWork: CheckNetWorkReducer
})

export default appReducer;
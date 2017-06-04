import { 
   GET_EVENT_LIST_SUCCESS
} from '../actions/constants';

const INITIAL_STATE = { 
    eventList: []
 };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_EVENT_LIST_SUCCESS:
            return {
                ...state,
             eventList: action.item
            };
        default:
            return state;
    }
};


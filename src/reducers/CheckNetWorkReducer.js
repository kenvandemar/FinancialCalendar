import { 
    CHECK_NETWORK_INFO
} from '../actions/constants';

const initialState = {
    isConnected: false
}
export default (state = initialState, action) => {
    switch(action.type) {
        case CHECK_NETWORK_INFO:
            return {
                ...state,
                isConnected: action.isConnected
            }
        default:
            return state;
    }
}
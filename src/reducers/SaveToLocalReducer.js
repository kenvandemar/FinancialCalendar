import { SAVE_TO_LOCAL_SUCESS } from '../actions/constants';

const initialState = {
    localDatas: {}
}

export default function saveToLocalReducer(state = initialState, action) {
    switch(action.type) {
        case SAVE_TO_LOCAL_SUCESS:
            return {
                ...state,
                localDatas: action.localDatas
            }
        default:
            return state;
    }
}

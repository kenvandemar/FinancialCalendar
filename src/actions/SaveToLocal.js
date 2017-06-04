import {
    SAVE_TO_LOCAL,
    SAVE_TO_LOCAL_SUCESS,
    SAVE_TO_LOCAL_FAILURE
} from './constants';


export function saveDataToLocal(localData) {
    return (dispatch) => {
        dispatch(saveToLocalSuccess(localData))
    }
}

function saveToLocalSuccess(localDatas) {
    return dispatch(data) ({
        type: saveToLocalSuccess,
        localDatas
    });
}

function saveToLocalFailure() {
    return dispatch() ({
        type: SAVE_TO_LOCAL_FAILURE,
    });
}
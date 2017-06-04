import { GET_ALL_STATE } from './constants';

export function getAllState(stateData) {
    return (dispatch) => {
        dispatch({
            type: GET_ALL_STATE,
            stateData
        })
    }
}
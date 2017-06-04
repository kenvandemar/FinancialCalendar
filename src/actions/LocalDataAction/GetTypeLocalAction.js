import { 
    FETCH_TYPE_BY_NAME_LOCAL,
    FETCH_TYPE_BY_NAME_LOCAL_SUCCESS
} from '../constants';


export function getTypeByNameLocal(typeLocalData) {
    return (dispatch) => {
        dispatch(fetchTypeByNameLocal());
        if (typeLocalData.length > 0 && typeLocalData.length !== null) {
             dispatch(getTypeByNameLocalSuccess(typeLocalData));
        }  
    }
}
function fetchTypeByNameLocal() {
    return {
        type: FETCH_TYPE_BY_NAME_LOCAL
    }
}
function getTypeByNameLocalSuccess(typeLocalData) {
    return {
        type: FETCH_TYPE_BY_NAME_LOCAL_SUCCESS,
        typeLocalData
    }
}

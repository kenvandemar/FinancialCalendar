import { createStore, applyMiddleware, compose} from 'redux';
import appReducer from './reducers/index';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

export default function configureStore() {
     const store = compose(applyMiddleware(thunk, createLogger()))(createStore)(appReducer);
    return store;
}
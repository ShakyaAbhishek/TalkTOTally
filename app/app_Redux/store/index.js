import {combineReducers,createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import saveUserDataReducer from '../reducers/saveUserDataReducer';
import saveCompanyDataReducer from '../reducers/saveCompanyDataReducer';
const rootReducer = combineReducers({
    saveUserDataReducer,
    saveCompanyDataReducer
});

let store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

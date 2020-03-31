import {createStore, combineReducers, applyMiddleware} from 'redux'
import SystemStore from './System'
import SiteInfoStore from './SiteInfo'
import thunkMiddleware from 'redux-thunk'
const rootReducer = combineReducers({
  siteInfo: SiteInfoStore,
  system: SystemStore
})

export default createStore(rootReducer, applyMiddleware(thunkMiddleware))

import { createStore, combineReducers, applyMiddleware  } from 'redux'
import { reviewReducer } from './review/review.reducers'
import { userReducer } from './user/user.reducers'
import thunk from 'redux-thunk'
import { RootState } from './root-state'
import { appReducer } from './app/app.reducers'
import { accountReducer } from './account/account.reducers'
import { nestedAccountsReducer } from './nested-accounts/nested-accounts.reducers'

 const rootReducer = combineReducers<RootState>({ app: appReducer, 
    users: userReducer, review: reviewReducer, 
    account: accountReducer, nestedAccounts: nestedAccountsReducer })
    
 const store = createStore(rootReducer, {}, applyMiddleware(thunk));


export default store
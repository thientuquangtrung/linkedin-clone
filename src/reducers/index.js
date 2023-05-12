import { combineReducers } from "redux";

import userReducer from '../features/user/userSlice';
import articleReducer from '../features/article/articleSlice'

const rootReducer = combineReducers({
    user: userReducer,
    article: articleReducer
})

export default rootReducer;
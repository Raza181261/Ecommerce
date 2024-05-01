import {createStore, combineReducers, applyMiddleware, compose} from "redux";
import {thunk} from "redux-thunk";
import { productDetailsReducer, productReducer } from "./reducers/productReducers";

const reducer = combineReducers({
    products: productReducer,
    productDetails : productDetailsReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        )   
);

export default store    


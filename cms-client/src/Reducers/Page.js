import Cookie from 'universal-cookie';
import {
    LOAD_PAGE,
    LOAD_PAGE_FAIL,
    LOAD_PAGE_SUCCESS
} from '../Actions/types';
const initialState = {
    pageContent: [],
    pageTitle: 'Loading...',
    isLoading: false,
    pageLoadErr: false,
    pageLoadErrMsg: ''
}
export default (state = initialState, action)=>{
    switch(action.type){
        case LOAD_PAGE:
            return{
                isLoading: action.payload
            }
        case LOAD_PAGE_FAIL:
            return{
                
            }
    }
}
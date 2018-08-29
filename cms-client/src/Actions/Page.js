import axios from 'axios';
import {HOST} from '../constants';
import {
    LOAD_PAGE,
    LOAD_PAGE_FAIL,
    LOAD_PAGE_SUCCESS
} from './types';
export const loadPageAttempt = (data)=>{
    return (dispatch)=>{
        dispatch({
            action: LOAD_PAGE,
            payload: true
        });
        let pageName = '';
        if(data.pageName === undefined || data.pageName === '' || data.pageName === null){
            pageName = 'home';
        }else{
            pageName = data.pageName;
        }
        axios.get(`${HOST}/api/public/${pageName}`)
        .then(res => {
            dispatch({
                action: LOAD_PAGE_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                action: LOAD_PAGE_FAIL,
                payload: err.message
            });
        });
    }
}
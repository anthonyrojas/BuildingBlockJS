import React,{Component} from 'react';
import { connect } from 'react-redux';
import AuxHOC from '../../HOC/AuxHOC';
import {
    loadPageAttempt
} from '../../Actions/Page';
class Page extends Component{
    render(){
        return(
            <AuxHOC>
                <div dangerouslySetInnerHTML={}></div>
            </AuxHOC>
        );
    }
}

export default Page;
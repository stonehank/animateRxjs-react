import React from 'react';
import {Consumer} from '../index'
import createSectionLazy from './create-section-lazy'



export default class LazyOperatorsCoreContainer extends React.Component{

	shouldComponentUpdate(nextProps){
		const curOperatorName=this.props.match.params.section
		const nextOperatorName=nextProps.match.params.section
		return curOperatorName!==nextOperatorName;
	}
    render(){
        const operatorName=this.props.match.params.section
        const lazyPath=()=>import('../Components/operator-core-container-compatible')
        return(
            <Consumer>
                {({smallScreen})=>createSectionLazy(lazyPath, operatorName, {operatorName,smallScreen})}
            </Consumer>
        )
    }
}

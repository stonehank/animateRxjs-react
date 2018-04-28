import React from 'react';
import { DragSource } from 'react-dnd';
//import {fromJS,is} from 'immutable';


class MarbleBallComponent extends React.PureComponent{

    //shouldComponentUpdate(prevProps){
    //    return !is(fromJS(this.props._curStyle),fromJS(prevProps._curStyle))
    //        || this.props.isDragging !==prevProps.isDragging
    //}
    render(){
        //console.log('marbleBallComponent')
        const {left,text,top,background,color,connectDragSource,closePop,showPop,cancelBubble,isDragging}=this.props
        const curStyle=isDragging ? {left,top,background,color,opacity:0.7} :{left,top,background,color}
        return connectDragSource(
            <div className="colorBall"
                 onMouseOut={closePop}
                 onMouseOver={showPop}
                 onMouseDown={closePop}
                 onClick={cancelBubble}
                 style={curStyle}>{text}</div>
        )
    }
}

const type='marbleBall'
const spec={
    beginDrag:()=>{
        return {}
    },
    endDrag:(props,monitor)=>{
        const result=monitor.getDropResult()
        const movedX=result?result.x:0;
        props.setDropLeft(movedX)
        props.setIsDragged(true)
    }
}

const collect=(connect,monitor)=>{
    return{
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}
export default DragSource(type, spec, collect)(MarbleBallComponent);
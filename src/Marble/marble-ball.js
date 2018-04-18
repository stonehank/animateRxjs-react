import React from 'react';
import ReactDOM from 'react-dom';
import PopText from './../Widget/poptext'
export default class MarbleBall extends React.Component{
    constructor(){
        super()
        this.showPop=this.showPop.bind(this)
        this.closePop=this.closePop.bind(this)
        this.dragStart=this.dragStart.bind(this)
        this.dragging=this.dragging.bind(this)
        this.dragOver=this.dragOver.bind(this)
        this.state={
            curStyle:{},
            curContent:{},
            left:0,
            showPopText:false
        }
    }
    closePop(){
        this.setState({
            showPopText:false
        })
    }
    showPop(e){

        const {offsetY,offsetX}=e.nativeEvent
        const {top}=this.state.curStyle
        const left=this.state.left;
        this.setState({
            position:{top:offsetY+top,left:offsetX+left},
            showPopText:true
        })
    }

    cancelBubble(e){
        e.nativeEvent.stopImmediatePropagation()
    }

    dragStart(e){
        e.nativeEvent.stopImmediatePropagation()
        this.initX=e.clientX
        document.getElementById('root').style.cursor='-webkit-grabbing';
        document.addEventListener('mousemove',this.dragging)
        document.addEventListener('mouseup',this.dragOver)
    }
    dragOver(e){
        e.stopPropagation()
        e.stopImmediatePropagation()
        document.removeEventListener('mousemove',this.dragging)
        document.removeEventListener('mouseup',this.dragOver)
        document.getElementById('root').style.cursor='inherit';
        this.draggingBall=null;
        ReactDOM.render(this.draggingBall,document.getElementById('dragMarble'))

        if(isNaN(this.finalX)){return}
        this.setState(prevState=>({
            left:prevState.left+this.finalX
        }))
        this.finalX=0;
    }
    dragging(e){
        e.preventDefault()
        //console.time(1)
        const {marbleBallObj,dragMaxLeft}=this.props
        const {text,...style}=marbleBallObj
        const {left}=this.state;
        this.finalX=e.clientX-this.initX;
        if(this.finalX<-left){this.finalX=-left}
        if(this.finalX>dragMaxLeft-left){this.finalX=dragMaxLeft-left}


        this.draggingBall=React.createElement('div',{className:'colorBall',style:Object.assign({},style,{left:left+this.finalX})},text)

        ReactDOM.render(this.draggingBall,document.getElementById('dragMarble'))
        //console.timeEnd(1)
    }


    componentWillUnmount(){
        clearTimeout(this.timer)
    }

    componentDidMount(){
        const {marbleBallObj}=this.props
        const {data,text,left,...style}=marbleBallObj
        this.timer=setTimeout(()=>{
            this.setState({
                curStyle:style,
                left:left,
                curContent:{text,data}
            })
        },20)
    }
    render(){
        //console.log('MarbleBall')
        const {left,curStyle,curContent}=this.state;
        const {text,data}=curContent
        const _curStyle=Object.assign({},curStyle,{left})
        return(
            <React.Fragment>
                <div className="colorBall"
                     onClick={this.cancelBubble}
                     onMouseDown={this.dragStart}
                     onMouseOut={this.closePop}
                     onMouseOver={this.showPop}
                     style={_curStyle}>{text}</div>
                {this.state.showPopText?
                <PopText data={data} position={this.state.position}/>:
                    null
                }
            </React.Fragment>
        )
    }
}
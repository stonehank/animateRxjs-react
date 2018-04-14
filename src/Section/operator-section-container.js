import React from 'react';
import {clearFunc,calcColorBallNewPosition,calcCodeStrArrPlusMinus,checkDidAllunSub,_fetchData,alladdNECStatus} from '../tools'
import SectionWrap from './section-wrap'
import {Marble,Result} from '../Widget'
//import PropTypes from 'prop-types';
import Rx from 'rxjs/Rx'
import * as Immutable from 'immutable';

const {fromJS,is} =Immutable


export default class OperatorSectionContainer extends React.Component{
    constructor(){
        super()
        this.fetchDataSetState=this.fetchDataSetState.bind(this)
        this.testStart=this.testStart.bind(this)
        this.clearStart=this.clearStart.bind(this)
        this.testStop=this.testStop.bind(this)
        this.marbleCheckChange=this.marbleCheckChange.bind(this)
        this.resultCheckChange=this.resultCheckChange.bind(this)
        this.showRxjsInResult=this.showRxjsInResult.bind(this)
        this.showRxjsInMarble=this.showRxjsInMarble.bind(this)
        this.refreshResultMarble=this.refreshResultMarble.bind(this)
        this.refreshStartStopButton=this.refreshStartStopButton.bind(this)
        this.prevCodeArr=[]
        this.unSubMarble={}
        this.unSubResult={}
        this.newMarbleArr=[]
        this.state={
            showMarble:true,
            showResult:true,
            marbleText:'', func:null, line:0,
            isFetching:true,
            resultValue:'',
            marbleArr:false,
            showStartButton:true
        }
    }

    fetchDataSetState(operatorName){
        this.fetch$=Rx.Observable.fromPromise(_fetchData(operatorName))
            .subscribe(data=>{

        //fetchData.promise(operatorName).then(data=>{
                const {title,name,caption,code,line,marbleText,func}=data;
                const codeObj=calcCodeStrArrPlusMinus(code,this.prevCodeArr),
                    codeStr=codeObj.str,
                    minus=codeObj.minus,
                    plus=codeObj.plus;
                this.prevCodeArr=codeObj.arr;

                /*用clearStart会多render1次*/
                //this.clearStart()

                /*全部unsubscribe 并且清空状态，此处不会触发更新*/
                clearFunc(this.unSubMarble);
                clearFunc(this.unSubResult);
                this.unSubMarble={}
                this.unSubResult={}

                /*清空数据界面(非状态界面) 获取新值*/
                this.newMarbleArr=[];
                this.setState({
                    marbleArr:this.newMarbleArr,
                    resultValue:'',
                    isFetching:false,
                    basicData:{ title, name, caption, minus, plus,code:codeStr},
                    line, marbleText, func
                })

            })
            //.catch(err=>console.warn('fetchData '+err))
    }
    componentWillUnmount(){
        //const {isFetching}=this.state;
        //if(isFetching){
        //fetchData.cancel()
        //}
        this.fetch$.unsubscribe()
    }
    shouldComponentUpdate(nextProps,nextState){
            //console.log(this.props,nextProps)
        //console.log(this.state,nextState)
        return !is(fromJS(this.props),fromJS(nextProps))
             || !is(fromJS(this.state),fromJS(nextState))
    }
    componentDidMount(){
        const operatorName=this.props.match.params.section;
        this.fetchDataSetState(operatorName)
    }
    componentWillReceiveProps(nextProps){
        const curOperatorName=this.props.match.params.section,
            nextOperatorName=nextProps.match.params.section;
        if(curOperatorName!==nextOperatorName){
            this.setState({isFetching:true})
            this.fetchDataSetState(nextOperatorName)
        }
    }
    /**
     * 清空result界面 &  清空marble界面
     */
    refreshResultMarble(){
        this.newMarbleArr=[];
        this.setState({
            marbleArr:false,
            resultValue:''
        })
        //TODO:需要修正 强制刷新result
        this.resultRefreshTimeStamp=new Date().getTime()
    }

    /**
     * result checkbox事件
     */
    resultCheckChange(){
        this.setState(prevState=>({
            showResult:!prevState.showResult
        }))
    }
    /**
     * marble checkbox事件
     */
    marbleCheckChange(){
        this.setState(prevState=>({
            showMarble:!prevState.showMarble
        }))
    }
    /**
     * 开始按钮方法
     * 清楚unsubscribe-》执行函数-》清空页面（放在最后可以刷新状态）
     * @param e
     */
    testStart(e){
        if(e)e.stopPropagation();
        clearFunc(this.unSubMarble);
        clearFunc(this.unSubResult);
        this.timeStamp=new Date().getTime()
        this.newMarbleArr=[];
        if(!this.state.func){alert('数据获取失败！刷新重试');return;}
        this.state.func.call(this,this.showRxjsInResult,this.showRxjsInMarble)
        alladdNECStatus(this.unSubMarble)
        alladdNECStatus(this.unSubResult)
        this.setState({
            showStartButton:checkDidAllunSub(this.unSubMarble,this.unSubResult),
            marbleArr:this.newMarbleArr,
            resultValue:''
        })
        //TODO:需要修正 强制刷新result
        this.resultRefreshTimeStamp=new Date().getTime()
        //this.refreshResultMarble()
    }

    refreshStartStopButton(){
        this.setState({
            showStartButton:checkDidAllunSub(this.unSubMarble,this.unSubResult)
        })
    }

    testStop(e){
        if(e)e.stopPropagation();
        clearFunc(this.unSubMarble);
        clearFunc(this.unSubResult);
        this.refreshStartStopButton()
        //TODO:需要修正 强制刷新marble,result
        this.marbleRefreshTimeStamp=new Date().getTime()
        this.resultRefreshTimeStamp=new Date().getTime()
    }

    /**
     * 清楚按钮
     * unsubscribe-》清空界面
     * @param e
     */
    clearStart(e){
        if(e)e.stopPropagation();
        clearFunc(this.unSubMarble,true);
        clearFunc(this.unSubResult,true);
        this.refreshResultMarble()

    }
    /**
     * subscribe in marble方法
     * @param v
     * @param whichLine
     */
    showRxjsInMarble(v,whichLine){
        const {line}=this.state;
        let curTimeStamp=new Date().getTime();
        let timeGap=curTimeStamp-this.timeStamp
        let marbleBallObj=calcColorBallNewPosition(line,whichLine,v,timeGap);
        this.newMarbleArr=this.newMarbleArr.concat(marbleBallObj);
        this.setState({marbleArr:this.newMarbleArr})
    }
    /**
     * subscribe in result方法
     * @param v
     */
    showRxjsInResult(v){
        this.setState(prevState=>({
            resultValue:prevState.resultValue+v+"<br>"
        }))
    }
    render(){
        //console.log('OperatorSectionContainer')
        const {isFetching,basicData,line,
            resultValue,showMarble,showResult,marbleArr,marbleText,showStartButton}=this.state
        return(
            <React.Fragment>
                <SectionWrap
                    isFetching={isFetching}
                    basicData={basicData}
                    resultCheckChange={this.resultCheckChange}
                    marbleCheckChange={this.marbleCheckChange}
                    showMarble={showMarble}
                    showResult={showResult}
                    showStartButton={showStartButton}
                    testStop={this.testStop}
                    clearStart={this.clearStart}
                    testStart={this.testStart} />
                <div>
                    {this.state.showMarble?
                        <Marble
                            timeStamp={this.marbleRefreshTimeStamp}
                            refreshStartStopButton={this.refreshStartStopButton}
                            unSubMarble={this.unSubMarble}
                            marbleArr={marbleArr}
                            line={line}
                            marbleText={marbleText} />
                        :null}
                    {this.state.showResult?
                        <Result
                            resultRefreshTimeStamp={this.resultRefreshTimeStamp}
                            refreshStartStopButton={this.refreshStartStopButton}
                            unSubResult={this.unSubResult}
                            value={resultValue}/>:null}
                </div>
            </React.Fragment>
        )
    }
}


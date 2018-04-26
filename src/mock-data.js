import Rx from 'rxjs/Rx';
import {changeStatus} from './tools'
let count = 0
let _deepList = [];

window.Rx=Rx;
/**
 * 此处为 Rx.Subscriber 底下的三个命令进行添加，为了能精确显示当前状态
 * @param addFunc
 * @param status
 * @returns {Function}
 */

Function.prototype.addBefore=function(addFunc,status){
    let _thisFunc=this;
    return function(force){
        addFunc.call(this,status,force)
        _thisFunc.call(this,status)
    }
}

function addCEUStatus(){
    Rx.Subscriber.prototype.complete=Rx.Subscriber.prototype.complete.addBefore(changeStatus,'complete')
    Rx.Subscriber.prototype.error=Rx.Subscriber.prototype.error.addBefore(changeStatus,'error')
    Rx.Subscriber.prototype.unsubscribe=Rx.Subscriber.prototype.unsubscribe.addBefore(changeStatus,'unsubscribe')
}
addCEUStatus()

export const shallowList = [
    {shallowTitle: '全部(按字母顺序)', sort: 'name', pathname: 'operators', notShowChild: true},
    {shallowTitle: '按点击量排序', sort: 'hits', pathname: 'hits'},
    {shallowTitle: '按常用程度排序', sort: 'useful', pathname: 'useful'}
];

export const EDITRULES=`
/*1、所有需要显示的发射源命名必须以'Rx'开头，例如：let RxInterval，如果写成let interval，则不会在选择面板中显示*/
/*2、建议第一行为命名所有变量，例如：let RxOf,RxTimer,RxFrom...*/
/*3、每一行语句结束处必须添加分号";"*/
/*4、代码修改尽量在'//editArea'内部，再去选择面板上操作是否订阅和显示位置*/
`
/*
 * subscriber编写规则：
 * 一、Subscription命名：
 * 选择发射源要显示的对应位置，例如：
 * let RxClick;
 * 显示在Marble中：marSub.RxClick=...
 * 显示在Result中：resSub.RxClick=...
 *
 *
 * 二、subscriber()回调：
 * 使用NEC方法创建回调：
 * NEC方法包含了3种状态的回调(next,error,complete)
 * 参数1 表示要显示位置的方法
 * 参数2 表示要显示的行数
 * 例如：
 * RxClick 需要订阅并且在Marble中第1行订阅：...RxClick.subscriber(NEC(showInMar,1));
 * RxClick 需要订阅并且在Marble中最后1行订阅：...RxClick.subscriber(NEC(showInMar,'last'));
 * RxClick 需要订阅并且在Result中订阅：...RxClick.subscriber(NEC(showInRes));
 *
 * 三、代码结尾以分号(;)结尾
 */


/*


 * */


export const Data = [
    {
        name: 'takeUntil',
        title: 'takeUntil:参数为另一个发射源，当发射值时，发出complete',
        caption: '说明：' + '参数隔3秒发出1，当1发出，立刻complete',
        hits: 715,
        useful: 412,
        //line: 3,
        marbleText: 'takeUntil',
        code: `

            //editArea

             let RxIntervalTake5,RxOfDelay, RxTakeUntil;
            RxIntervalTake5 = Rx.Observable.interval(1000).take(5);
            RxOfDelay = Rx.Observable.of(1).delay(3000);
            RxTakeUntil = RxIntervalTake5.takeUntil(RxOfDelay);

            //editArea


            marSub.RxIntervalTake5 = RxIntervalTake5.subscribe(NEC(showInMar, 1));
            marSub.RxOfDelay = RxOfDelay.subscribe(NEC(showInMar, 2));
            marSub.RxTakeUntil = RxTakeUntil.subscribe(NEC(showInMar, 'last'));
            resSub.RxTakeUntil = RxTakeUntil.subscribe(NEC(showInRes));
         `},
    {
        name: 'takeWhile',
        title: 'takeWhile:参数返回false时，发出complete',
        caption: '说明：' + '参数的条件是n<4，因此n为4时，发出complete',
        hits: 715,
        useful: 412,
        //line: 2,
        marbleText: 'takeWhile(n=>n<4)',
        code: `

            //editArea

            let RxIntervalTake7, RxTakeWhile;
            RxIntervalTake7 = Rx.Observable.interval(1000).take(7);
            RxTakeWhile = RxIntervalTake7.takeWhile(n=>n<4);

            //editArea

            marSub.RxIntervalTake7 = RxIntervalTake7.subscribe(NEC(showInMar, 1));
            marSub.RxTakeWhile = RxTakeWhile.subscribe(NEC(showInMar, 'last'));
            resSub.RxTakeWhile = RxTakeWhile.subscribe(NEC(showInRes));

         `,},
    {
        name: 'retryWhen',
        title: 'retryWhen:重复发射源，直到内部源(条件源)发出complete或者error',
        caption: '说明：' + '在重复条件下，retryWhen总是能重复发射源的镜像，但不包括error；此处条件为interval值<3，此处第一行为发射源' +
        '虽然很快error，但是error并不影响retryWhen，第二行为重复的条件，即条件发射源一旦触发并且符合重复的条件（未complete，未error），' +
        '立刻开始重复一次发射源的镜像  ',
        hits: 715,
        useful: 412,
        //line: 3,
        marbleText: 'retryWhen',
        code: `

            //editArea

            let RxInterval, RxTimer_Throw, RxRetryWhen;
            RxTimer_Throw=Rx.Observable.timer(0,200).map(n=>{if(n===3){throw 'err'};return n});
            RxInterval = Rx.Observable.interval(1000).takeWhile(x=>x<3);
            RxRetryWhen =RxTimer_Throw.retryWhen(()=>RxInterval);

            //editArea


            marSub.RxTimer_Throw = RxTimer_Throw.subscribe(NEC(showInMar, 1));
            marSub.RxInterval = RxInterval.subscribe(NEC(showInMar, 2));
            marSub.RxRetryWhen = RxRetryWhen.subscribe(NEC(showInMar, 'last'));
            resSub.RxRetryWhen = RxRetryWhen.subscribe(NEC(showInRes));

         `},
    {
        name: 'repeatWhen',
        title: 'repeatWhen:重复发射源，直到内部源(条件源)发出complete或者error',
        caption: '说明：' + '在重复条件下，repeatWhen总是能重复发射源的镜像，但不包括complete；此处条件为interval值<3，此处第一行为发射源' +
        '虽然很快complete，但是complete并不影响repeatWhen，第二行为重复的条件，即条件发射源一旦触发并且符合重复的条件（未complete，未error），' +
        '立刻开始重复一次发射源的镜像 ',
        hits: 915,
        useful: 612,
        //line: 3,
        marbleText: 'repeatWhen',
        code: `

            //editArea

            let RxInterval, RxTimer0_100, RxRepeatWhen;
            RxTimer0_100=Rx.Observable.timer(0,100).take(3);
            RxInterval = Rx.Observable.interval(1000).takeWhile(x=>x<5);
            RxRepeatWhen =RxTimer0_100.repeatWhen(()=>RxInterval);

            //editArea


            marSub.RxTimer0_100 = RxTimer0_100.subscribe(NEC(showInMar, 1));
            marSub.RxInterval_takeWhile = RxInterval_takeWhile.subscribe(NEC(showInMar, 2));
            marSub.RxRepeatWhen = RxRepeatWhen.subscribe(NEC(showInMar, 'last'));
             resSub.RxRepeatWhen = RxRepeatWhen.subscribe(NEC(showInRes));
         `,},
    {
        name: 'merge',
        title: 'merge:将发射源合并，同时执行',
        caption: '说明：' + ' merge合并不管发射源顺序，直接合并',
        hits: 985,
        useful: 612,
        //line: 3,
        marbleText: 'merge',
        code: `

            //editArea

            let RxClick, RxTimer0_1000, RxMerge;
            RxClick = Rx.Observable.fromEvent(document, 'click');
            RxTimer0_1000 = Rx.Observable.timer(0, 1000).take(3);
            RxMerge = Rx.Observable.merge(RxClick, RxTimer0_1000);

            //editArea


            marSub.RxClick = RxClick.subscribe(NEC(showInMar, 1));
            marSub.RxTimer0_1000 = RxTimer0_1000.subscribe(NEC(showInMar, 2));
            marSub.RxMerge = RxMerge.subscribe(NEC(showInMar, 'last'));
             resSub.RxMerge = RxMerge.subscribe(NEC(showInRes));
         `,},
    {
        name: 'forkJoin',
        title: 'forkJoin:将最终结果合并成1个数组',
        caption: '说明：' + ' 第一个发射源执行显示1到6(几乎同时),第二个发射源每隔1s显示增加1,' +
        'forkJoin会等全部发射源完成结束后，才将各自的最终结果合并成1个数组',
        hits: 1524,
        useful: 912,
        //line: 3,
        marbleText: 'forkJoin',
        code: `

            //editArea

            let RxRange, RxTimer0_1000, RxForkJoin;
            RxRange = Rx.Observable.range(1, 6);
            RxTimer0_1000 = Rx.Observable.timer(0, 1000).take(3);
            RxForkJoin = Rx.Observable.forkJoin(RxRange, RxTimer0_1000);

            //editArea


            marSub.RxRange = RxRange.subscribe(NEC(showInMar, 1));
            marSub.RxTimer0_1000 = RxTimer0_1000.subscribe(NEC(showInMar, 2));
            marSub.RxForkJoin = RxForkJoin.subscribe(NEC(showInMar, 'last'));
              resSub.RxForkJoin = RxForkJoin.subscribe(NEC(showInRes));
         `,},
    {
        name: 'distinctUntilKeyChange',
        title: 'distinctUntilKeyChange 只对比前一项，通过参数中的key值去比较value',
        caption: '说明：' + ' 参数可以设定根据那一项进行去重，此处根据 x 值去重，可以在Result看到原来4组obj，' +
        '对比前一项去重后剩下第1,3,4组',
        hits: 25,
        useful: 89,
        //line: 2,
        marbleText: 'distinctUntilKeyChange',
        code: `

            //editArea

            let RxFrom,RxDistinctUntilKeyChanged;
            RxFrom = Rx.Observable.from([{x:1,y:2},{x:1,y:3},{x:2,y:4},{x:1,y:6}]);
            RxDistinctUntilKeyChanged = RxFrom.distinctUntilKeyChanged('x',(prevV,nextV)=>prevV===nextV);

            //editArea


            marSub.RxFrom = RxFrom.subscribe(NEC(showInMar, 1));
            marSub.RxDistinctUntilKeyChanged = RxDistinctUntilKeyChanged.subscribe(NEC(showInMar, 'last'));
               resSub.RxDistinctUntilKeyChanged = RxDistinctUntilKeyChanged.subscribe(NEC(showInRes));
         `,},
    {
        name: 'distinctUntilChange',
        title: 'distinctUntilChange 只对比前一项',
        caption: '说明：' + ' 参数可以设定根据那一项进行去重，此处根据当前项 x 和上一项 y 对比去重，可以在Result看到原来4组obj，' +
        '对比前一项去重后剩下第1,2,4组',
        hits: 273,
        useful: 425,
        //line: 2,
        marbleText: 'distinctUntilChange',
        code: `

            //editArea

            let RxFrom,RxDistinctUntilChange;
            RxFrom = Rx.Observable.from([{x:1,y:2},{x:1,y:2},{x:2,y:4},{x:1,y:6}]);
            RxDistinctUntilChange = RxFrom.distinctUntilChanged((prevObj,nextObj)=>prevObj.y===nextObj.x);

            //editArea


            marSub.RxFrom = RxFrom.subscribe(NEC(showInMar, 1));
            marSub.RxDistinctUntilChange = RxDistinctUntilChange.subscribe(NEC(showInMar, 'last'));
             resSub.RxDistinctUntilChange = RxDistinctUntilChange.subscribe(NEC(showInRes));
         `,},
    {
        name: 'distinct',
        title: 'distinct 全部对比并且去重复',
        caption: '说明：' + ' 参数可以设定根据那一项进行去重，此处根据x值去重，可以在Result看到原来4组obj，去重后剩下2组',
        hits: 213,
        useful: 745,
        //line: 2,
        marbleText: 'distinct',
        code: `

            //editArea

            let RxFrom,RxDistinct;
            RxFrom = Rx.Observable.from([{x:1,y:2},{x:1,y:3},{x:2,y:4},{x:1,y:6}]);
            RxDistinct = RxFrom.distinct(obj=>obj.x);

            //editArea


            marSub.RxFrom = RxFrom.subscribe(NEC(showInMar, 1));
            marSub.RxDistinct = RxDistinct.subscribe(NEC(showInMar, 'last'));
              resSub.RxDistinct = RxDistinct.subscribe(NEC(showInRes));
         `,},
    {
        name: 'delayWhen',
        title: 'delayWhen：根据另一个源来执行延迟',
        caption: '说明：' + ' 源RxOf根据RxClick触发后才触发，此处点击屏幕后才会显示start',
        hits: 78,
        useful: 527,
        //line: 2,
        marbleText: 'delayWhen',
        code: `

            //editArea

               let RxOf,RxClick,RxDelayWhen;
            RxOf = Rx.Observable.of('start');
            RxClick = Rx.Observable.fromEvent(document,'click');
            RxDelayWhen = RxOf.delayWhen(e=>RxClick);

            //editArea


            marSub.RxClick = RxClick.subscribe(NEC(showInMar, 1));
            marSub.RxDelayWhen = RxDelayWhen.subscribe(NEC(showInMar, 'last'));
              resSub.RxDelayWhen = RxDelayWhen.subscribe(NEC(showInRes));
         `,},
    {
        name: 'delay',
        title: 'delay：参数为延迟的时间（毫秒）',
        caption: '说明：' + '点击后第一行为当前点击，最后一行为实际输出（此处延迟1秒），点击5次后complete',
        hits: 42,
        useful: 128,
        //line: 2,
        marbleText: 'delay',
        code: `

            //editArea

            let RxClick,RxDelay;
            RxClick = Rx.Observable.fromEvent(document,'click');
            RxDelay = RxClick.delay(1000);

            //editArea


            marSub.RxClick = RxClick.subscribe(NEC(showInMar, 1));
            marSub.RxDelay = RxDelay.subscribe(NEC(showInMar, 'last'));
             resSub.RxDelay = RxDelay.subscribe(NEC(showInRes));
         `,},
    {
        name: 'audit',
        title: 'audit:等待时间由另一个observable决定，不会立刻发送第一个源',
        caption: '说明：' + '点击后会立刻输出最新值，此处是1秒内任意多次点击也只发出1次值，<font color="#8d8d8d">跟debounce很像，暂时未弄清楚区别?</font>' +
        '第二行为timer的行动（可以忽略），第三行为结果数据输出行，结合第二行可以更清楚的看出结果数据来源',
        hits: 762,
        useful: 875,
        //line: 3,
        marbleText: 'audit',
        code: `

        //editArea

   let RxTimer0_1000, RxClick, RxAudit;
            RxTimer0_1000 = Rx.Observable.timer(0, 1000).take(10);
            RxClick = Rx.Observable.fromEvent(document, 'click');
            RxAudit = RxTimer0_1000.audit(()=>RxClick);

        //editArea


            marSub.RxClick = RxClick.subscribe(NEC(showInMar, 1));
            marSub.RxTimer0_1000 = RxTimer0_1000.subscribe(NEC(showInMar, 2));
            marSub.RxAudit = RxAudit.subscribe(NEC(showInMar, 'last'));
                    resSub.RxAudit = RxAudit.subscribe(NEC(showInRes));
         `,},
    {
        name: 'debounce',
        title: 'debounce:等待时间由另一个observable决定，不会立刻发送第一个源',
        caption: '说明：' + '点击后会立刻输出最新值，而不像throttle等待下一次的最新值，此处是1秒内任意多次点击也只发出1次值，' +
        '第二行为timer的行动（可以忽略），第三行为结果数据输出行，结合第二行可以更清楚的看出结果数据来源',
        hits: 762,
        useful: 875,
        //line: 3,
        marbleText: 'debounce',
        code: `

        //editArea

        let RxTimer0_1000, RxClick, RxDebounce;
            RxTimer0_1000 = Rx.Observable.timer(0, 1000).take(10);
            RxClick = Rx.Observable.fromEvent(document, 'click');
            RxDebounce = RxTimer0_1000.debounce(()=>RxClick);

        //editArea


            marSub.RxClick = RxClick.subscribe(NEC(showInMar, 1));
            marSub.RxTimer0_1000 = RxTimer0_1000.subscribe(NEC(showInMar, 2));
            marSub.RxDebounce = RxDebounce.subscribe(NEC(showInMar, 'last'));
         resSub.RxDebounce = RxDebounce.subscribe(NEC(showInRes));
         `,},
    {
        name: 'throttle',
        title: 'throttle:等待时间由另一个observable决定，立刻发送第一个源',
        caption: '说明：' + '点击后不立刻发出，而是会等下一个发射源，再发射出去，此处是1秒内任意多次点击也只发出1次值，' +
        '第二行为timer的行动（可以忽略），第三行为结果数据输出行，结合第二行可以更清楚的看出结果数据来源',
        hits: 762,
        useful: 875,
        //line: 3,
        marbleText: 'throttle',
        code: `

        //editArea

        let RxTimer0_1000,RxClick,RxThrottle;
        RxTimer0_1000 =  Rx.Observable.timer(0,1000);
        RxClick =Rx.Observable.fromEvent(document,'click');
        RxThrottle = RxTimer0_1000.throttle(()=>RxClick);

        //editArea


            marSub.RxClick = RxClick.subscribe(NEC(showInMar, 1));
            marSub.RxTimer0_1000 = RxTimer0_1000.subscribe(NEC(showInMar, 2));
            marSub.RxThrottle = RxThrottle.subscribe(NEC(showInMar, 'last'));
         resSub.RxThrottle = RxThrottle.subscribe(NEC(showInRes));
         `,},
    {
        name: 'auditTime',
        title: 'auditTime:类似throttleTime，收到第一个源不会立刻发送最新值，而是等待间隔时间后发送最新值',
        caption: '说明：' + '此处最后一行不论点击多少次会等1秒才会发送最新值',
        hits: 762,
        useful: 875,
        //line: 2,
        marbleText: 'auditTime',
        code: `

        //editArea

            let RxClick, RxAuditTime;
            RxClick = Rx.Observable.fromEvent(document, 'click');
            RxAuditTime = RxClick.auditTime(1000)

        //editArea


            marSub.RxClick = RxClick.subscribe(NEC(showInMar, 1));
            marSub.RxAuditTime = RxAuditTime.subscribe(NEC(showInMar, 'last'));
         resSub.RxAuditTime = RxAuditTime.subscribe(NEC(showInRes));
         `,},
    {
        name: 'throttleTime',
        title: 'throttleTime:有click就取消上一次的，这里间隔时间最多1秒，收到第一个源立刻发送',
        caption: '说明：' + '此处最后一行一旦有点击立刻会发出一个事件',
        hits: 762,
        useful: 875,
        //line: 2,
        marbleText: 'throttleTime',
        code: `

        //editArea

   let RxClick, RxThrottleTime;
            RxClick = Rx.Observable.fromEvent(document, 'click');
            RxThrottleTime = RxClick.throttleTime(1000)

        //editArea


            marSub.RxClick = RxClick.subscribe(NEC(showInMar, 1));
            marSub.RxThrottleTime = RxThrottleTime.subscribe(NEC(showInMar, 'last'));
                    resSub.RxThrottleTime = RxThrottleTime.subscribe(NEC(showInRes));


         `,},
    {
        name: 'debounceTime',
        title: 'debounceTime:有click就取消上一次的，间隔时间可超过1秒，最后发送最新值',
        caption: '说明：' + '最后一行为实际发出的事件',
        hits: 762,
        useful: 875,
        //line: 2,
        marbleText: 'debounceTime',
        code: `

        //editArea

        let RxClick,RxDebounceTime;
        RxClick =Rx.Observable.fromEvent(document,'click');
        RxDebounceTime = RxClick.debounceTime(1000);

        //editArea


            marSub.RxClick = RxClick.subscribe(NEC(showInMar, 1));
            marSub.RxDebounceTime = RxDebounceTime.subscribe(NEC(showInMar, 'last'));
         resSub.RxDebounceTime = RxDebounceTime.subscribe(NEC(showInRes));

         `,},
    {
        name: 'concatMap',
        title: 'concatMap:先转换成高阶observable（map），再转换成一阶observable',
        caption: '说明：此处累计click的次数，然后按顺序依次执行',
        hits: 762,
        useful: 875,
        //line: 2,
        marbleText: 'concatMap',
        code: `

        //editArea

        let RxClick,RxInterval,RxConcatMap;
        RxClick = Rx.Observable.fromEvent(document,'click').take(3);
        RxInterval = Rx.Observable.interval(1000).take(3);
        RxConcatMap = RxClick.concatMap(ev=>RxInterval);

        //editArea


            marSub.RxClick = RxClick.subscribe(NEC(showInMar, 1));
            marSub.RxConcatMap = RxConcatMap.subscribe(NEC(showInMar, 'last'));
            resSub.RxConcatMap = RxConcatMap.subscribe(NEC(showInRes));


         `,},
    {
        name: 'concatAll',
        title: 'concatAll：将高阶observable(类似obs1$.map(obs2$))转换成一阶observable',
        caption: '说明：此处所展示效果相当于使用了concatMap，此处用的是先map 后concatAll',
        hits: 762,
        useful: 875,
        //line: 2,
        marbleText: 'concatAll',
        code: `

        //editArea

        let RxClick,RxInterval,highOrder,RxConcatAll;
        RxClick = Rx.Observable.fromEvent(document,'click');
        RxInterval = Rx.Observable.interval(1000).take(3);
        highOrder = RxClick.map(ev=>RxInterval);
        RxConcatAll = highOrder.concatAll();

        //editArea


            marSub.RxClick = RxClick.subscribe(NEC(showInMar, 1));
            marSub.RxConcatAll = RxConcatAll.subscribe(NEC(showInMar, 'last'));
                      resSub.RxConcatAll = RxConcatAll.subscribe(NEC(showInRes));

        `,
    },
    {
        name: 'concat',
        title: 'concat:将2个源按顺序合并,点击3次鼠标后合并interval',
        caption: '',
        hits: 1235,
        useful: 451,
        //line: 2,
        marbleText: 'concat',
        code: `

        //editArea

        let RxClick,RxInterval,RxConcat;
        RxClick = Rx.Observable.fromEvent(document,'click').take(3);
        RxInterval = Rx.Observable.interval(1000).take(3);
        RxConcat = RxClick.concat(RxInterval);

        //editArea


            marSub.RxClick = RxClick.subscribe(NEC(showInMar, 1));
            marSub.RxConcat = RxConcat.subscribe(NEC(showInMar, 'last'));
                     resSub.RxConcat = RxConcat.subscribe(NEC(showInRes));

        `,
    }
]
export const notFoundData = {
    title: '无数据',
    name: '无数据',
    caption: '无数据',
    code: '无数据',
    //line: 0,
    marbleText: '无数据'
}


function fillDeepList() {
    for (var i = 0; i < Data.length; i++) {
        let deepObj = {
            id: count++,
            name: Data[i].name,
            firstCapital:Data[i].name[0].toUpperCase(),
            hits: Data[i].hits,
            useful: Data[i].useful
        }
        _deepList.push(deepObj)
    }
    return _deepList;
}
_deepList = fillDeepList()

/*
 * deepList=[
 *   {id:1,name:xxx,hits:1,useful:1},
 *   {id:2,name:xxx,hits:5,useful:21},
 *   {id:3,name:xxx,hits:2341,useful:541}
 * ]
 *
 *
 *
 */


export let deepList = _deepList

function NEC(showInWhere, whichLine) {
    return {
        next: (v)=> {
            showInWhere(v, whichLine)
        },
        error: ()=> {
            showInWhere('error', whichLine)
        },
        complete: ()=> {
            showInWhere('complete', whichLine)
        }
    }
}

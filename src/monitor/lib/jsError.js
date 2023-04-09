import getlastEvent from "../utils/getLastEvent"
import getSelector from "../utils/getSelector"
import tracker from "../utils/tracker";

export function injectJsError(){
    window.addEventListener("error",function(event){
        let lastEvent = getlastEvent();// 获取最后一个交互事件
        console.log(getSelector(lastEvent.composedPath()));
        let log = {
            kind:"stability",//监控指标的大类
            type:"error",// 小类型，这是一个错误
            errorType:"jsError",
            url:"",//路由报错的地址
            message:event.message,//报错信息
            filename:event.filename,//哪个文件报错
            position:`${event.lineno}:${event.colno}`,//代码的行和列
            stack:getLines(event.error.stack),
            selector:lastEvent ? getSelector(lastEvent.composedPath()):'',//代表最后一个操作的元素
        }
        tracker.send(log)
        console.log("错误信息",log);
    });

    function getLines(stack){
        return stack.split("\n").slice(1).map(item => item.replace(/^\s+at\s+/g,"")).join("^")
    }

}   
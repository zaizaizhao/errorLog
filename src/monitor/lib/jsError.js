import getLastEvent from "../utils/getLastEvent";
import getlastEvent from "../utils/getLastEvent"
import getSelector from "../utils/getSelector"
import tracker from "../utils/tracker";

export function injectJsError() {
  window.addEventListener("error", function (event) {
    let lastEvent = getlastEvent();
    let log;
    // <script> <link>标签加载出错也会触发error
    if(event.target && (event.target.src || event.target.href)){
        //src是script标签的属性，href为link标签的属性
         log = {
            kind: "stability",//监控指标的大类
            type: "error",// 小类型，这是一个错误
            message: event,
            errorType: "resourceError",
            filename: event.target.src || event.target.href,//哪个文件报错
            tagName:event.target.tagName,
            selector: getSelector(event.target),//代表最后一个操作的元素
          }
    }else{
        log = {
            kind: "stability",//监控指标的大类
            type: "error",// 小类型，这是一个错误
            errorType: "jsError",
            message: event.message,//报错信息
            filename: event.filename,//哪个文件报错
            position: `${event.lineno}:${event.colno}`,//代码的行和列
            stack: getLines(event.error.stack),
            selector: lastEvent ? getSelector(lastEvent.composedPath()) : '',//代表最后一个操作的元素
          }
    }
    //<script> <link>标签加载出错
    console.log("error",event);
// 获取最后一个交互事件
    //这里获取的event为错误事件，需要点击事件去获取选择的元素
    
    // tracker.send(log);
  }, true);


  window.addEventListener("unhandledrejection", (event) => {
    //1.获取最后的触发事件event信息
    let lastEvent = getLastEvent();
    let message = "";
    let filename;
    let line = 0;
    let column = 0;
    let stack = "";
    let reason = event.reason;
    if (typeof reason == "string") {//promise中没有catch到的错误
      message = reason;
    } else if (typeof reason == "object") {//说明是一个错误对象
      if (reason.stack) {
        /**
         * TypeError: Cannot set properties of undefined (setting 'error')
            at http://localhost:8080/:22:38
            at new Promise (<anonymous>)
            at promiseErrorClick (http://localhost:8080/:21:13)
            at HTMLInputElement.onclick (http://localhost:8080/:13:108)
        */
        let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
        filename = matchResult[1];
        line = matchResult[2];
        column = matchResult[3];
        console.log(matchResult);
      }
      message = reason.message;
      stack = getLines(reason.stack);

    }

    let log = {
      kind: "stability",//监控指标的大类
      type: "error",// 小类型，这是一个错误
      errorType: "promiseError",
      message,//报错信息
      filename,//哪个文件报错
      position: `${line}:${column}`,//代码的行和列
      stack,
      selector: lastEvent ? getSelector(lastEvent.path ? lastEvent.path : lastEvent.composedPath()) : '',//代表最后一个操作的元素
    }
    tracker.send(log)
  }, true)

  function getLines(stack) {
    return stack.split("\n").slice(1).map(item => item.replace(/^\s+at\s+/g, "")).join("^")
  }

}   
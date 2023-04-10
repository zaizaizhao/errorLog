import getLastEvent from "../utils/getLastEvent";
import getlastEvent from "../utils/getLastEvent"
import getSelector from "../utils/getSelector"
import tracker from "../utils/tracker";

export function injectJsError() {
  window.addEventListener("error", function (event) {
    let lastEvent = getlastEvent();// 获取最后一个交互事件
    //这里获取的event为错误事件，需要点击事件去获取选择的元素
    let log = {
      kind: "stability",//监控指标的大类
      type: "error",// 小类型，这是一个错误
      errorType: "jsError",
      url: "",//路由报错的地址
      message: event.message,//报错信息
      filename: event.filename,//哪个文件报错
      position: `${event.lineno}:${event.colno}`,//代码的行和列
      stack: getLines(event.error.stack),
      selector: lastEvent ? getSelector(lastEvent.composedPath()) : '',//代表最后一个操作的元素
    }
    tracker.send(log)
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
    console.log("event.reason.stack", reason);
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
      stack = getLines(reason.stack);

    }
    let log = {
      kind: "stability",//监控指标的大类
      type: "error",// 小类型，这是一个错误
      errorType: "promiseError",
      url: "",//路由报错的地址
      message,//报错信息
      filename,//哪个文件报错
      position: `${line}:${column}`,//代码的行和列
      stack,
      selector: lastEvent ? getSelector(lastEvent.composedPath()) : '',//代表最后一个操作的元素
    }
    tracker.send(log)
  }, true)

  function getLines(stack) {
    return stack.split("\n").slice(1).map(item => item.replace(/^\s+at\s+/g, "")).join("^")
  }

}   
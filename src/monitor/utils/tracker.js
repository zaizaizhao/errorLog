let host = "cn-shanghai.log.aliyuncs.com";
let project = "zhaoyananmonitor";//阿里云项目名字
let logstoreName = "zhaoyananmonitor-store";//store名字
let userAgent = require("user-agent")
function getExtraData() {
  return {
    title: document.title,
    url: location.href,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).name,
  }

}
class SendTracker {

  constructor() {
    this.url = `https://${project}.${host}/logstores/${logstoreName}/track`;
    this.xhr = new XMLHttpRequest;
  }
  send(data = {}) {
    let extradata = getExtraData();
    let log = { ...extradata, ...data };
    for (let key in log) {
      //阿里云要求对象不能是数字
      if (typeof log[key] == "number") {
        log[key] = `${log[key]}`
      }
    }
    let body = JSON.stringify({
      __logs__: [log],
    });
    this.xhr.open("POST", this.url, true);
    this.xhr.setRequestHeader("x-log-apiversion", "0.6.0");//api版本号
    this.xhr.setRequestHeader("x-log-bodyrawsize", body.length);//请求体的大小
    this.xhr.setRequestHeader("Content-Type", "application/json");
    this.xhr.onload = function () {
      // console.log(this.xhr.response);
    }
    this.xhr.error = function (error) {
      // console.log(error);
    }
    this.xhr.send(body);

  }
}
export default new SendTracker();
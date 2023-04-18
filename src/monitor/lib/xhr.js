import tracker from "../utils/tracker";

export function injectXHR(){
    let XMLHttpRequest = window.XMLHttpRequest;
    let oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method,url,async){
        if(!url.match(/logstores/) && !url.match(/sockjs/)){
            this.logData = {method,url,async};
        }
        return oldOpen.apply(this,arguments);

    }

    let oldSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body){
        if(this.logData){
            //发送之前记录开始的时间
            let startTime = Date.now();
            let handler = (type) => (event) => {
                let duration = Date.now() - startTime + 'ms';
                let status = this.status;
                let statusText = this.statusText
                tracker.send({
                    kind:"stability",
                    type:"url",
                    //type --- 闭包的一丢丢应用
                    eventType: type,//load error abort
                    pathName:this.logData.url,
                    status:status + '-' + statusText,
                    duration,
                    response:this.response? JSON.stringify(this.response):"",
                    params:body || ""
                })
            }
            //正常就不监听了
            // this.addEventListener("load",handler("load"),false);
            this.addEventListener("error",handler("error"),false)
            this.addEventListener("abort",handler("abort"),false)
        }
        return oldSend.apply(this,arguments);
    }
}
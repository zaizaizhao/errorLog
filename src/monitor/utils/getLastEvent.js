let lastEvent;
['click','touchstart',"mousedown","keydown","mouseover"].forEach(eventType => {
    document.addEventListener(eventType,(event) => {
        lastEvent = event
    },{
        capture:true,//在捕获阶段执行
        passive:true// 默认不阻止默认事件
    })
})

export default function (){
    //闭包，实现lastEvent持久化
    return lastEvent;
}
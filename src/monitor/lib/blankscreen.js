import tracker from "../utils/tracker";
import onload from "../utils/onload";

export function blankScreen(){
    //如果测试点的最外层元素在以下三个元素中，说明该点位的最外层元素还没加载，此时该点位部分处于白屏，若页面中，大于某一个
    //数值的点处于白屏，此时就认为页面处于白屏阶段。
    let wrapperElements = ['html','body','#container'];
    let emptyPoints = 0;
    function getSelector(element){
        if(element.id){
            return "#"+ element.id;
        } else if(element.className){// a    b  c => a.b.c
            //!!就是将所有其他类型都转换成boolean型
            //!!{} 就是true
            //!!'' 就是false
            return "." + element.className.split(" ").filter(item => !!item).join(".");
        }else{
            return element.nodeName.toLowerCase();
        }
    }
    function iswrapper(element){
        let selector = getSelector(element);
        if(wrapperElements.indexOf(selector) != -1){
            emptyPoints++;
        }
    }
    onload(function(){
        for(let i = 1; i <= 9; i++){
            let xElement = document.elementsFromPoint(window.innerWidth * i /10,window.innerHeight / 2);
            let yElement = document.elementsFromPoint(window.innerWidth / 2 ,window.innerHeight * i /10);
            iswrapper(xElement[0]);
            iswrapper(yElement[0]);
        }
        console.log(emptyPoints);
        //如果空白点大于16，则代表白屏
        if(emptyPoints > 16){
            let centerElements = document.elementFromPoint(window.innerWidth / 2,window.innerWidth / 2)
            tracker.send({
                kind:"stability",
                type:"blank",
                emptyPoints,
                screen:window.screen.width + 'x' +window.screen.height,
                viewPoints:window.innerWidth + 'x' + window.innerHeight,
                selector:getSelector(centerElements),
                message:`页面的检测白屏点存在${16}个，页面处于白屏阶段`
            })
            // console.log({
            //         kind:"stability",
            //         type:"blank",
            //         emptyPoints,
            //         screen:window.screen.width + 'x' +window.screen.height,
            //         viewPoints:window.innerWidth + 'x' + window.innerHeight,
            //         selector:getSelector(centerElements),
            //         message:`页面的检测白屏点存在${16}个，页面处于白屏阶段`
            //     });
        }
    })
}
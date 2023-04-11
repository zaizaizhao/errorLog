function getSelector(path){
    return path.reverse().filter(element => {
        return element != document && element != window
    }).map((element) => {
        if(element.id){
            return `${element.nodeName.toLowerCase()}#${element.id}`
        }else if(element.className && typeof element.className == "string"){
            return `${element.nodeName.toLowerCase()}.${element.className}`
        }else{
            return element.nodeName.toLowerCase()
        }
    }).join(" ")
}
export default function(pathOrTarget){
    //pathOrTarget可能是个数组或者对象
    if(Array.isArray(pathOrTarget)){
        return getSelector(pathOrTarget);
    }else{
        let path = [];
        while(pathOrTarget){
            path.push(pathOrTarget);
            pathOrTarget = pathOrTarget.parentNode;
        }
        return getSelector(path)
    }
}
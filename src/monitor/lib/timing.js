import tracker from "../utils/tracker";
import onload from "../utils/onload";

export function timing(){
    onload(function() {
        setTimeout(() => {
            /**Navigation Timing Level 2 草案中，已经废弃了 PerformanceTiming 接口，
             * 并且提供了新的接口 PerformanceNavigationTiming 代替其功能，performance.getEntriesByType("navigation") 获取 */
            const {
                fetchStart,
                connectStart,
                connectEnd,
                requestStart,
                responseStart,
                responseEnd,
                loadEventEnd,
                domInteractive,
                domContentLoadedEventStart,
                domContentLoadedEventEnd,
                loadEventStart,
            } = performance.getEntriesByType('navigation')[0];
            tracker.send({
                kind:"experience",//用户体验指标
                type:"timing",//统计每个阶段的时间
                connectTime: connectEnd - connectStart,
                //TTFB 是Time to First Byte 的缩写，指的是浏览器开始收到服务器响应数据的时间（后台处理时间+重定向时间）
                ttfbTime:responseStart - requestStart,//首字节的到达时间
                responseTime:responseEnd - responseStart,//响应的读取时间
                parseDomTime:loadEventEnd - loadEventStart,//Dom解析的时间
                domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,//执行DOMContentLoaded回调的时间
                timeToInteractiveTime:domInteractive - fetchStart,//首次可以交互的时间
                loadTime: loadEventStart - fetchStart,//完整的加载时间

            })
        },3000)
    })
}
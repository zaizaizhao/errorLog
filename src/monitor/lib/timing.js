import tracker from "../utils/tracker";
import onload from "../utils/onload";
import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";

export function timing() {
  let FMP, LCP;
  //监控FMP
  new PerformanceObserver((entryList, observer) => {
    let perfEntries = entryList.getEntries();
    FMP = perfEntries[0];
    observer.disconnect()
  }).observe({ entryTypes: ['element'] });

  //监控LCP
  new PerformanceObserver((entryList, observer) => {
    let perfEntries = entryList.getEntries();
    LCP = perfEntries[0];
    observer.disconnect()
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  //检测first-input-delay FID
  new PerformanceObserver((entryList, observer) => {
    let lastEvent = getLastEvent();
    console.log("lastEvent",lastEvent,lastEvent.composedPath(),lastEvent.path);
    let firstInput = entryList.getEntries()[0];
    console.log("firstInput",firstInput);
    if(firstInput){
      //processingStart是开始处理的时间，startTime是事件触发的时间，差值就是处理的延迟
      let inputDelay = firstInput.processingStart - firstInput.startTime;
      let duration = firstInput.duration;
      if(inputDelay > 0 || duration > 0){
          tracker.send({
          kind: "experience",//用户体验指标
          type: "timing",//统计每个阶段的时间
          inputDelay,//处理的延迟
          duration,
          startTime:firstInput.startTime,
          selector: lastEvent ? getSelector(lastEvent.target) : ''
        })
      }

    }
   
  }).observe({ type:"first-input",buffered:true });


  onload(function () {
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
      // tracker.send({
      //   kind: "experience",//用户体验指标
      //   type: "timing",//统计每个阶段的时间
      //   connectTime: connectEnd - connectStart,
      //   //TTFB 是Time to First Byte 的缩写，指的是浏览器开始收到服务器响应数据的时间（后台处理时间+重定向时间）
      //   ttfbTime: responseStart - requestStart,//首字节的到达时间
      //   responseTime: responseEnd - responseStart,//响应的读取时间
      //   parseDomTime: loadEventEnd - loadEventStart,//Dom解析的时间
      //   domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,//执行DOMContentLoaded回调的时间
      //   timeToInteractiveTime: domInteractive - fetchStart,//首次可以交互的时间
      //   loadTime: loadEventStart - fetchStart,//完整的加载时间
      // })
      let FP = performance.getEntriesByName("first-paint")[0];
      console.log(FP);
      let FCP = performance.getEntriesByName("first-contentful-paint")[0];
      tracker.send({
        kind: "experience",//用户体验指标
        type: "paintTiming",//统计绘制的时间
        firstPaint: FP.startTime,
        firstMeaningfulPaint: FMP.startTime,
        firstContentfulPaint: FCP.startTime,
        largetstContentfulPaint: LCP.startTime,
      })
    }, 3000)
  })
}
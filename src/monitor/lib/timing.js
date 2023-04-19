import tracker from "../utils/tracker";
import onload from "../utils/onload";

export function timing() {
  console.log(performance);

  let FMP, LCP;
  var ob = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
      const { startTime } = entry;
      console.log('[assets-load-monitor] PerformanceObserver fcp:', startTime);

      // 上报startTime操作
    }
  });
  ob.observe({ entryTypes: ["mark"] });
  // ob.observe({ entryTypes: ['element'] })
  console.log(ob);

  // new PerformanceObserver((entryList, observer) => {
  //   console.log("---", entryList);

  //   let perfEntries = entryList.getEntries();
  //   console.log(perfEntries);

  //   FMP = perfEntries[0];
  //   observer.disconnect()
  // }).observe({ entryTypes: ['element'] });

  // new PerformanceObserver((entryList, observer) => {
  //   let perfEntries = entryList.getEntries();
  //   LCP = perfEntries[0];
  //   observer.disconnect()
  // }).observe({ entryTypes: ['largest-contentful-paint'] });

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
      let FCP = performance.getEntriesByName("first-contentful-paint")[0];
      console.log("FP", FP);
      console.log("FCP", FCP);
      console.log("FMP", FMP);
      console.log("LCP", LCP);
    }, 3000)
  })
}
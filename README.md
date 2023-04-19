<h1 align="center">Welcome to Error Log 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img alt="Version" src="https://img.shields.io/github/watchers/zaizaizhao/errorLog?style=social" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> 一个简单的前端埋点方案

## Install

```sh
npm install
```
Run
```sh
npm run dev
```
> 白屏埋点原理
####  __*如何检测白屏*__
![Alt text](images/%E7%99%BD%E5%B1%8F.png)
##### 页面中放几个point，通过DocumentOrShadowRoot.elementsFromPoint()来监听这些点的元素数组是否是body。

> 页面加载的时间记录

####  __*关键API*__
##### Navigation Timing Level 2 草案中，已经废弃了 PerformanceTiming 接口，并且提供了新的接口 PerformanceNavigationTiming 代替其功能，performance.getEntriesByType("navigation") 获取

####  __*几个关键时间点*__
##### 1.*TTFB*：是Time to First Byte 的缩写，指的是浏览器开始收到服务器响应数据的时间（后台处理时间+重定向时间）
##### 2.*responseTime*：响应的读取时间
##### 3.*parseDomTime*：loadEventEnd - loadEventStart,//Dom解析的时间Dom解析时间
##### 4.*domContentLoadedTime*: domContentLoadedEventEnd - domContentLoadedEventStart,//执行DOMContentLoaded回调的时间
##### 5.*timeToInteractiveTime*:domInteractive - fetchStart,//首次可以交互的时间
##### 6.*loadTime*: loadEventStart - fetchStart,//完整的加载时间

####  __*性能指标*__
![Alt text](images/%E6%8D%95%E8%8E%B7.PNG)
## Author

👤 **马腾化云东**

* Github: [@zaizaizhao](https://github.com/zaizaizhao/errorLog)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
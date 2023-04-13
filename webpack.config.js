const path = require('path');
const HTMLWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  // context: process.cwd(),
  entry: './src/index.js',
  mode: "development",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "monitor.js"
  },
  devServer: {
    // static: path.resolve(__dirname, 'dist'),
    // historyApiFallback: true,
    // 实际上是node的express服务
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // 如果你想在所有其他中间件之前运行一个中间件或者当你从 `onBeforeSetupMiddleware` 配置项迁移时，
      // 可以使用 `unshift` 方法
      middlewares.unshift({
        name: "",
        // `path` 是可选的
        path: '/success',
        middleware: (req, res) => {
          res.json({ message: "success request" });
        },
      });
      // 如果你想在所有其他中间件之后运行一个中间件或者当你从 `onAfterSetupMiddleware` 配置项迁移时，
      // 可以使用 `push` 方法
      middlewares.push({
        // `path` 是可选的
        path: '/error',
        middleware: (req, res) => {
          res.json({ error: "error request" });
        },
      });
      return middlewares;
    },
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./src/index.html",
      inject: "head"
    })
  ]
}
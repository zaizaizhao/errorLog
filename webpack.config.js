const path = require('path');
const HTMLWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  context: process.cwd(),
  entry: './src/index.js',
  mode: "development",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "monitor.js"
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    // historyApiFallback: true,
    // 实际上是node的express服务
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.get('/success', (_, response) => {
        console.log(234);
        response.json('setup-middlewares option GET');
      });
      devServer.app.post('/error', (_, response) => {
        response.json('setup-middlewares option GET');
      });
      middlewares.unshift({
        name: 'first-in-array',
        middleware: (req, res) => {
          res.send('Foo!');
        },
      });
      return middlewares;
    }
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./src/index.html",
      inject: "head"
    })
  ]
}
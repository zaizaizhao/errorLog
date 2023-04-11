const path = require('path');
const HTMLWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    context:process.cwd(),
    entry:'./src/index.js',
    mode:"development",
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:"monitor.js"
    },
    devServer:{
        static:path.resolve(__dirname,'dist'),
        historyApiFallback: true,
    },
    plugins:[
        new HTMLWebpackPlugin({
            template:"./src/index.html",
            inject:"head"
        })
    ]
}
const webpack = require('webpack');
console.log(process.env)
module.exports = new webpack.DefinePlugin({
  'process.env': {
    HOST_URL: JSON.stringify(process.env.HOST_URL)
  }
})
var webpack = require('webpack');

module.exports = {
  entry:[
    './assets7Intro/Entry.js'
  ],
  output: {
    path: __dirname + '/build7IntroTestRoy/',
    publicPath: 'build7Intro/',
    filename: 'bundle.js'
  },
  watch: true,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        loaders: ["babel-loader","jsx?harmony"]
      },
      {
        test: /\.(scss)$/,
        loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: 'url-loader?limit=4096'
      }
    ]
  },

  plugins : [
    new webpack.DefinePlugin({
      "process.env" : {
        // NODE_ENV: JSON.stringify('production')
        NODE_ENV: JSON.stringify('development')
      }
    })
  ]


};

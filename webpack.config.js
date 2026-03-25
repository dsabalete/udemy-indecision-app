const path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      loader: 'babel-loader',
      test: /\.js$/,
      exclude: /node_modules/
    }, {
      test: /\.s?css$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: { api: 'modern' }
        }
      ]
    }]
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    static: path.join(__dirname, 'public'),
    port: 8080,
    historyApiFallback: true,
    hot: true
  }
};

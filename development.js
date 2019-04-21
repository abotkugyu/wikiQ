import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const src  = path.resolve(__dirname, 'data/nodejs/src')
const dist = path.resolve(__dirname, 'data/nodejs/dist')

export default {
  mode: 'development',
  entry: path.resolve(src + '/wikiq.js'),
  output: {
    path: dist,
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: ["transform-react-jsx"]
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: src + '/index.html',
      filename: 'index.html'
    })
  ]
}
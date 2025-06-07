const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => ({
  entry: {
    background: './src/background.js',
    popup: './src/popup/popup.js',
    options: './src/options/options.js',
    suspended: './src/suspended/suspended.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/popup/popup.html', to: 'popup/popup.html' },
        { from: 'src/options/options.html', to: 'options/options.html' },
        { from: 'src/suspended/suspended.html', to: 'suspended/suspended.html' },
        { from: 'src/icons', to: 'icons' }
      ]
    })
  ],
  devtool: argv.mode === 'development' ? 'source-map' : false
});

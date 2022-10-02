const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/game.ts',

  devServer: {
    static: [
      { directory: path.join(__dirname, 'dist') },
      { directory: path.join(__dirname, 'static') },
    ],
    compress: true,
    port: 9000,
  },

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'static', 'img'),
          to: path.join(__dirname, 'dist', 'img')
        },
        {
          from: path.join(__dirname, 'static', 'index.htm'),
          to: path.join(__dirname, 'dist', 'index.htm')
        }
      ]
    })
  ]
};

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',              // Start building from index.js in src folder
  output: {
    path: path.resolve(__dirname, 'dist'), // Bundle will be output into a new folder called "dist"
    filename: 'bundle.js',                // Bundle name
    publicPath: '/'
  },
  mode: 'development',                  // Change to 'production' for production build
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3000,
    historyApiFallback: true,   // Useful for React Router so refreshes work correctly
    open: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,          // Process both .js and .jsx files
        exclude: /node_modules/,
        use: 'babel-loader'       // Use Babel to transpile code
      },
      {
        test: /\.css$/,           // Process CSS files
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']    // So you can import files without specifying .js or .jsx extension
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'  // Use the standard index.html in public folder as a template
    })
  ]
};

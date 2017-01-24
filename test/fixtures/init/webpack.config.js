const webpack = require('webpack');

module.exports = function () {
  const NODE_ENV = process.env.NODE_ENV || 'development';

  const plugins = [
    new webpack.NoEmitOnErrorsPlugin(),
  ];

  // if (NODE_ENV !== 'development') {
  //   plugins.push(
  //     new webpack.optimize.UglifyJsPlugin({
  //       compress: {
  //         warnings: false,
  //         screw_ie8: true,
  //         conditionals: true,
  //         unused: true,
  //         comparisons: true,
  //         sequences: true,
  //         dead_code: true,
  //         evaluate: true,
  //         if_return: true,
  //         join_vars: true,
  //       },
  //       output: {
  //         comments: false
  //       },
  //     }),
  //     new webpack.optimize.OccurrenceOrderPlugin(),
  //   );
  // }

  return {
    context: './src/scripts',
    entry: {
      app: './app'
    },
    output: {
      path:     './build/static/js',
      filename: '[name].js',
      library:  '[name]'
    },
    watch: NODE_ENV === 'development',
    watchOptions: {
      aggregateTimeout: 100
    },
    devtool: NODE_ENV === 'development' ? 'cheap-module-inline-source-map' : false,
    module:  {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', { 'modules': false }],
            ],
            plugins: ['transform-runtime']
          }
        }
      ],
    },
    plugins: plugins
  }
};

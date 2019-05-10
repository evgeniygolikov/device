import path from 'path';
import fileSystem from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

function createHTMLPlugins(templatePath) {
  const templateFiles = fileSystem.readdirSync(path.resolve(__dirname, templatePath))
    .filter(file => file.includes('.html'));
  return templateFiles.map(file => {
    const [name, extension] = file.split('.');
    return new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: path.resolve(__dirname, `${templatePath}/${name}.${extension}`),
      filename: `${name}.html`,
    });
  });
}

const config = {
  entry: {
    main: './src/js/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  devtool: 'eval-sourcemap',
  devServer: {
    overlay: true,
    port: 3000,
    host: '0.0.0.0'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.html$/,
      include: path.resolve(__dirname, 'src/includes'),
      use: [{
        loader: 'html-loader'
      }]
    }, {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[hash].[ext]',
          outputPath: 'images/'
        }
      }, {
        loader: 'image-webpack-loader',
        options: {
          disable: true
        }
      }]
    }, {
      test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/'
        }
      }]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css'
    })
  ].concat(createHTMLPlugins('./src'))
};

export default function configure(env, options) {
  const isProduction = options.mode === 'production';
  config.devtool = isProduction ? false : 'eval-sourcemap';
  return config;
}
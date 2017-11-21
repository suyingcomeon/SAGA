'use strict'
// 里面又自己的注释
// 打包环境
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  // 入口文件，路径相对于本文件所在的位置，可以写成字符串、数组、对象
  context: path.resolve(__dirname, '../'),
  // 入口
  entry: {
    app: './src/main.js'
  },
  //出口
  output: {
    // 输出文件，路径相对于本文件所在的位置
    path: config.build.assetsRoot,
    filename: '[name].js',
     // 设置publicPath这个属性会出现很多问题：
        // 1.可以看成输出文件的另一种路径，差别路径是相对于生成的html文件；
        // 2.也可以看成网站运行时的访问路径；
        // 3.该属性的好处在于当你配置了图片CDN的地址，本地开发时引用本地的图片资源，
        // 上线打包时就将资源全部指向CDN了，如果没有确定的发布地址不建议配置该属性，特别是在打包图片时，路径很容易出现混乱，如果没有设置，则默认从站点根目录加载
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    // require时省略的扩展名，遇到.vue结尾的也要去加载
    extensions: ['.js', '.vue', '.json'],
    // 模块别名地址，方便后续直接引用别名，无须写长长的地址，注意如果后续不能识别该别名，需要先设置root
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  // 模块加载器
  // loader让webpack能够去处理那些非javascript文件，（webpack自身只能理解javascript),loader可以将所有
  // 类型的的文件转换为webpack能够处理的有效模块
  // 1.识别出应该被对应的loader进行转换的的那些文件使用test属性
  // 2.转换这些文件从而使其能够被添加到依赖图中（并且最终添加到bundle中）（user属性）
  module: {
    // loader相当于gulp里的task，用来处理在入口文件中require的和其他方式引用进来的文件，
    // test是正则表达式，匹配要处理的文件；loader匹配要使用的loader，
    // "-loader"可以省略；include把要处理的目录包括进来，exclude排除不处理的目录
    rules: [
      ...(config.dev.useEslint? [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: !config.dev.showEslintErrorsInOverlay
        }
      }] : []),
       //  使用vue-loader 加载 .vue 结尾的文件
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      // 使用babel 加载 .js 结尾的文件
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // 包括这些的都需要解析
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // 把较小的图片转换成base64的字符串内嵌在生成的js文件里
          limit: 10000,
          // 路径要与当前配置文件下的publicPath相结合
          // 引用utils.assetsPath加上当前的环境是dev或者是其他环境
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // limit表示在10000以内还是图片的url, 超过转换为base64z的字符串
          limit: 10000,
         // 把较小的图标转换成base64的字符串内嵌在生成的js文件里
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        // web字体简介---字体格式有太多选择，但是没有一个能在所有的浏览器上通用，这表示你必须
        // 使用多种字体方案来保持用户跨平台的一致体验
        // https://zhuanlan.zhihu.com/p/28179203----网址---https://www.cnblogs.com/xcsn/p/6019048.html
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}

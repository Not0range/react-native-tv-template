const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const package = require('./package.json');
const versions = package.version.split('+');

const babelLoaderTv = {
  test: /\.(?:js|mjs|cjs)$/,
  include: [
    path.resolve(__dirname, 'index.web.js'),
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'node_modules/react-native-web'),
    //TODO add needed for transpile packages
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [
        'module:metro-react-native-babel-preset',
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'entry',
            corejs: '3.37',
            targets: {
              chrome: '51',
              ie: '11',
            },
          },
        ],
      ],
      plugins: [
        'react-native-web',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
      ],
    },
  },
};

const babelLoaderWeb = {
  test: /\.(?:js|mjs|cjs)$/,
  include: [
    path.resolve(__dirname, 'index.web.js'),
    path.resolve(__dirname, 'src'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: ['module:metro-react-native-babel-preset'],
      plugins: ['react-native-web'],
    },
  },
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  type: 'asset/resource',
};

const tsLoaderConfiguration = {
  test: /\.ts(x)?$/,
  loader: 'ts-loader',
  exclude: {
    and: [/node_modules/],
    not: [/node_modules\/react-native\/Libraries\/NewAppScreen/],
  },
  options: {
    configFile: 'tsconfig-web.json',
    allowTsInNodeModules: true,
  },
};

module.exports = env => {
  const platform = env.platform ?? 'web';
  const entry = {
    bundle: path.resolve(__dirname, 'index.web.js'),
  };
  entry.version = path.resolve(__dirname, 'src', 'version.js');
  if (platform !== 'web') {
    entry.polyfills = path.resolve(__dirname, 'src', 'polyfills.js');
  }

  return {
    entry: entry,
    output: {
      filename: '[name].web.js',
      path: path.resolve(__dirname, 'dist'),
      assetModuleFilename: 'assets/[name][ext]',
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'public', to: '.' },
          { from: 'assets/fonts', to: './fonts' },
          { from: `platforms/${platform}/`, to: '.' },
        ],
      }),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(versions[0]),
        BUILD_NUMBER: JSON.stringify(versions[1]),
      }),
    ],
    module: {
      rules: [
        platform === 'web' ? babelLoaderWeb : babelLoaderTv,
        tsLoaderConfiguration,
        imageLoaderConfiguration,
      ],
    },
    ignoreWarnings: [],
    devServer: {
      static: {
        directory: './dist',
      },
    },
    resolve: {
      alias: {
        'react-native$': 'react-native-web',
        'react-native-linear-gradient$': 'react-native-web-linear-gradient',
        'react-native-localization$': 'react-localization',
      },
      extensions: [
        '.web.js',
        '.js',
        '.web.jsx',
        '.jsx',
        '.web.ts',
        '.ts',
        '.web.tsx',
        '.tsx',
      ],
    },
  };
};

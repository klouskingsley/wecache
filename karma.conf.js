module.exports = function (config) {
  var opt = {
    singleRun: true,
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'dist/wecache.js',
      'node_modules/fakemp/dist/fakemp.umd.js',
      'test/helpers/wx.js',
      {pattern: 'test/test.js', watched: false},
    ],
    port: 9876,
    autoWatch: false,
    browsers: ['Chrome'],
    concurrency: 1,
    browserDisconnectTimeout: 6000,
    processKillTimeout: 6000,
  }

  config.set(opt)
}

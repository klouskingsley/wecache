
describe('sync api', function () {
  it('set, get', function () {
    wecache.set('foo', 'bar')
    console.log(wecache.get('foo'), wx.getStorageSync('WECACHE'))
    assert(wecache.get('foo') === 'bar')
  })
})

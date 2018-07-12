
describe('sync api', function () {
  it('set, get', function () {
    wecache.set('foo', 'bar')
    assert(wecache.get('foo') === 'bar')
  })

  it('incr, decr', function () {
    wecache.set('inde', 8)
    wecache.incr('inde')
    assert(wecache.get('inde') === 9)
    wecache.decr('inde')
    assert(wecache.get('inde') === 8)
  })

  it('remove', function () {
    wecache.set('remove', 'rr')
    assert(wecache.get('remove') === 'rr')
    wecache.remove('remove')
    assert(wecache.get('remove') === undefined)
  })

  it('expire ms', function (done) {
    wecache.set('em', {em: 'hhh'}, 100)
    assert(wecache.get('em').em === 'hhh')
    setTimeout(() => {
      assert(wecache.get('em') === undefined)
      done()
    }, 150)
  })

  it('expire date', function (done) {
    const d = new Date(new Date().getTime() + 100)
    wecache.set('ed', 'bbb', d)
    assert(wecache.get('ed') === 'bbb')
    setTimeout(() => {
      assert(wecache.get('ed') === undefined)
      done()
    }, 150)
  })

  it('clear', function () {
    wecache.set('c1', 'clear1')
    assert(wecache.get('c1') === 'clear1')
    wecache.set('c2', 'clear2')
    assert(wecache.get('c2') === 'clear2')
    wecache.clear()
    assert(wecache.get('c1') === undefined)
    assert(wecache.get('c2') === undefined)
  })
})

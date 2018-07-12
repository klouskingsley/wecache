(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.wecache = factory());
}(this, (function () { 'use strict';

  var MILLISECONDS_OF_ONE_THOUSAND_DAYS = 1000 * 24 * 3600 * 1000;
  var MILLISECONDS_OF_ONE_DAY = 24 * 3600 * 1000;

  var wecache = new Wecache()

  function Wecache(opt) {
    opt = typeof opt === 'object' ? opt : {};
    this.cacheKey = opt.cacheKey || 'WECACHE';
    this.defaultExpire = checkExpire(opt.defaultExpire) ? opt.defaultExpire : MILLISECONDS_OF_ONE_DAY;
  }

  Wecache.prototype.createInstance = function (opt) {
    return new Wecache(opt)
  };

  Wecache.prototype.get = function (key) {
    checkKey(key);
    return this._get(this._removeExpire(this._getCache()))
  };

  Wecache.prototype.set = function (key, value, expire) {
    checkKey(key);
    var caches = this._getCache();
    caches = this._set(caches, key, value, expire);
    caches = this._removeExpire(caches);

    return this._setCache(caches)
  };

  Wecache.prototype.incr = function (key) {
    checkKey(key);
    var caches = this._getCache();
    var value = this._get(caches, key);
    caches = this._set(caches, key, value + 1);
    caches = this._removeExpire(caches);
    return this._setCache(caches)
  };

  Wecache.prototype.decr = function (key) {
    checkKey(key);
    var caches = this._getCache();
    var value = this._get(caches, key);
    caches = this._set(caches, key, value - 1);
    caches = this._removeExpire(caches);
    return this._setCache(caches)
  };

  Wecache.prototype.remove = function (key) {
    checkKey(key);
    var caches = this._getCache();
    caches = this._remove(caches, key);
    return this._setCache(caches)
  };

  Wecache.prototype.clear = function () {
    return this._setCache({})
  };

  Wecache.prototype._get = function (caches, key) {
    caches = caches || {};
    return caches[key] && caches[key].value
  };

  Wecache.prototype._set = function (caches, key, value, expire) {
    caches = caches || {};
    expire = checkExpire(expire) ? expire : this.defaultExpire;
    var now = (new Date).getTime();
    var expireTime;
    if (typeof expire === 'number') {
      if (expire === 0) {
        expireTime = 0;
      } else if (expire <= MILLISECONDS_OF_ONE_THOUSAND_DAYS) {
        expireTime = now + expire;
      } else {
        expireTime = expire;
      }
    } else if (Object.prototype.toString.call(expire) === '[object Date]') {
      expireTime = expire.getTime();
    }
    caches[key] = {
      key: key,
      value: value,
      expire: expireTime
    };
    return caches
  };

  Wecache.prototype._getCache = function () {
    var self = this;

    return wx.getStorageSync(self.cacheKey)
  };

  Wecache.prototype._setCache = function (caches) {
    var self = this;

    console.log(wx.getStorageSync(self.cacheKey), caches, wx.getStorageInfoSync())
    wx.setStorageSync({
      key: self.cacheKey,
      data: caches
    })
    console.log(wx.getStorageSync(self.cacheKey), caches)
  };

  Wecache.prototype._isExpire = function (value, now) {
    now = now || (new Date).getTime();
    if (value.expire === 0) {
      return false
    }
    return value.expire < now
  };

  Wecache.prototype._removeExpire = function (caches) {
    caches = caches || {};
    var now = (new Date).getTime();
    var ret = {};
    for (var key in caches) {
      if (!this._isExpire(caches[key], now)) {
        ret[key] = caches[key];
      }
    }
    return ret
  };

  Wecache.prototype._remove = function (caches, key) {
    caches = caches || {};
    var ret = {};
    for (var k in caches) {
      if (k !== key) {
        ret[k] = caches[k];
      }
    }
    return ret
  };

  function checkKey(key) {
    var type = typeof key;
    if ((type !== 'number' && type !== 'string') || key === '') {
      throw new TypeError('key should not be a string(not "") or a number')
    }
  }

  function checkExpire(expire) {
    if (typeof expire === 'number') {
      return true
    }
    if (Object.prototype.toString.call(expire) === '[object Date]') {
      return true
    }
    return false
  }

  return wecache;

})));

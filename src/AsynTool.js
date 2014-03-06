var AsynTool = function() {
  if (!(this instanceof AsynTool)) {
    return AsynTool();
  }
  this._fired = {};
  this._callbacks = {};
};

var _assign = function(eventName1, eventName2, cb, once) {
  var proxy = this,
    length,
    i = 0,
    argsLength = arguments.length,
    bind,
    _all,
    callback,
    events,
    isOnce,
    times = 0,
    flag = {};
  if (argsLength < 3) {
    return proxy;
  }
  events = Array.prototype.slice.apply(arguments, [0, argsLength - 2]);
  callback = arguments[argsLength - 2];
  isOnce = arguments[argsLength - 1];

  if (!isFunction(callback)) {
    return proxy;
  }

  length = events.length;
  bind = function(key) {
    var method = isOnce ? "once" : "bind";
    proxy[method](key, function(data) {
      proxy._fired[key] = proxy._fired[key] || {};
      proxy._fired[key].data = data;
      if (!flag[key]) {
        flag[key] = true;
        times++;
      }
    });
  };

  for (i = 0; i < length; i++) {
    bind(events[i]);
  }

  _all = function(event) {
    if (times < length) {
      return;
    }
    if (!flag[event]) {
      return;
    }
    var data = [];
    for (i = 0; i < length; i++) {
      data.push(proxy._fired[events[i]].data);
    }
    if (isOnce) {
      proxy.removeListener("all", _all);
    }
    callback.call(null, data);
  };
  proxy.addListener("all", _all);
};
extend(AsynTool.prototype, {
  addListener: function(ev, callback) {
    this._callbacks = this._callbacks || {};
    this._callbacks[ev] = this._callbacks[ev] || [];
    this._callbacks[ev].push(callback);
    return this;
  },
  removeListener: function(ev, callback) {
    var calls = this._callbacks,
      list,
      i,
      l;
    if (!ev) {
      this._callbacks = {};
    } else if (calls) {
      if (!callback) {
        calls[ev] = [];
      } else {
        list = calls[ev];
        if (!list) {
          return this;
        }
        l = list.length;
        for (i = 0; i < l; i++) {
          if (callback === list[i]) {
            list[i] = null;
            break;
          }
        }
      }
    }
    return this;
  },
  trigger: function(eventName, data) {
    var list,
      ev,
      callback,
      args,
      i,
      l;
    var both = 2;
    var calls = this._callbacks;
    while (both--) {
      ev = both ? eventName : "all";
      list = calls[ev];
      if (list) {
        for (i = 0, l = list.length; i < l; i++) {
          if (!(callback = list[i])) {
            list.slice(i, 1);
            i--;
            l--;
          } else {
            args = both ? Array.prototype.slice.call(arguments, 1) : arguments;
            callback.apply(this, args);
          }
        }
      }
    }
    return this;
  },
  once: function(ev, callback) {
    var proxy = this;
    var wrapper = function() {
      callback.apply(proxy, arguments);
      proxy.removeListener(ev, wrapper);
    };
    proxy.addListener(ev, wrapper);
    return proxy;
  },
  all: function(eventName1, eventName2, callback) {
    var args = Array.prototype.concat.apply([], arguments);
    args.push(true);
    _assign.apply(this, args);
    return this;
  },
  removeAll: function(event) {
    return this.removeListener(event);
  }
});
AsynTool.prototype.on = AsynTool.prototype.addListener;
AsynTool.prototype.fire = AsynTool.prototype.trigger;
AsynTool.prototype.unbind = AsynTool.prototype.removeListener;
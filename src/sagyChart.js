(function(name, factory) {
  var root = this;
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root[name] = factory();
  }
}).call(this, 'sagyChart', function() {
  //some global variable
  var im_version = '0.13.8',
    im_obj = {},
    im_string = im_obj.toString,
    // im_hasOwn = im_obj.hasOwnProperty,
    MINUTE = 60000,
    HOUR = MINUTE * 60,
    DAY = HOUR * 24,
    MONTH = DAY * 31,
    YEAR = DAY * 366,
    secondTimer = {
      minute: MINUTE,
      hour: HOUR,
      day: DAY,
      month: MONTH,
      year: YEAR
    },
    shortFormater = {
      minute: '%H:%M',
      hour: '%H',
      day: '%d',
      month: '%m',
      year: '%Y'
    },
    longFormater = {
      minute: '%H:%M',
      hour: '%H:%M',
      day: '%m.%d',
      month: '%Y.%m',
      year: '%Y'
    },
    math = Math,
    mathRound = math.round,
    mathRandom = math.random,
    // mathFloor = math.floor,
    // mathCeil = math.ceil,
    mathMax = math.max,
    mathMin = math.min,
    // mathAbs = math.abs,
    mathPow = math.pow,
    root = (typeof window === 'object' && window) || this,
    document = root.document,
    highchart = Highcharts,
    units = root.unitDocs = {
      'Wh': {
        lowerLevel: null,
        higherLevel: 'kWh',
        ratio: 1000
      },
      'kWh': {
        lowerLevel: 'Wh',
        higherLevel: 'MWh',
        ratio: 1000
      },
      'MWh': {
        lowerLevel: 'kWh',
        higherLevel: 'GWh',
        ratio: 1000
      },
      'GWh': {
        lowerLevel: 'MWh',
        higherLevel: 'TWh',
        ratio: 1000
      },
      'TWh': {
        lowerLevel: 'GWh',
        higherLevel: 'PWh',
        ratio: 1000
      },
      'PWh': {
        lowerLevel: 'TWh',
        higherLevel: 'EWh',
        ratio: 1000
      },
      'EWh': {
        lowerLevel: 'PWh',
        higherLevel: 'ZWh',
        ratio: 1000
      },
      'ZWh': {
        lowerLevel: 'EWh',
        higherLevel: 'YWh',
        ratio: 1000
      },
      'YWh': {
        lowerLevel: 'ZWh',
        higherLevel: null,
        ratio: 1000
      },
      'W': {
        lowerLevel: null,
        higherLevel: 'kW',
        ratio: 1000
      },
      'kW': {
        lowerLevel: 'W',
        higherLevel: 'MW',
        ratio: 1000
      },
      'MW': {
        lowerLevel: 'kW',
        higherLevel: 'GW',
        ratio: 1000
      },
      'GW': {
        lowerLevel: 'MW',
        higherLevel: 'TW',
        ratio: 1000
      },
      'TW': {
        lowerLevel: 'GW',
        higherLevel: 'PW',
        ratio: 1000
      },
      'PW': {
        lowerLevel: 'TW',
        higherLevel: 'EW',
        ratio: 1000
      },
      'EW': {
        lowerLevel: 'PW',
        higherLevel: 'ZW',
        ratio: 1000
      },
      'ZW': {
        lowerLevel: 'EW',
        higherLevel: 'YW',
        ratio: 1000
      },
      'YW': {
        lowerLevel: 'ZW',
        higherLevel: null,
        ratio: 1000
      },
      '元': {
        lowerLevel: null,
        higherLevel: '万元',
        ratio: 10000
      },
      '万元': {
        lowerLevel: '元',
        higherLevel: '亿元',
        ratio: 10000
      },
      '亿元': {
        lowerLevel: '万元',
        higherLevel: null,
        ratio: 10000
      },
      'g': {
        lowerLevel: null,
        higherLevel: 'kg',
        ratio: 1000
      },
      'kg': {
        lowerLevel: 'g',
        higherLevel: 'T',
        ratio: 1000
      },
      'T': {
        lowerLevel: 'kg',
        higherLevel: 'kT',
        ratio: 1000
      },
      'kT': {
        lowerLevel: 'T',
        higherLevel: 'MT',
        ratio: 1000
      },
      'MT': {
        lowerLevel: 'kT',
        higherLevel: null,
        ratio: 1000
      },
      '克': {
        lowerLevel: null,
        higherLevel: '千克',
        ratio: 1000
      },
      '千克': {
        lowerLevel: '克',
        higherLevel: '吨',
        ratio: 1000
      },
      '吨': {
        lowerLevel: '千克',
        higherLevel: '千吨',
        ratio: 1000
      },
      '千吨': {
        lowerLevel: '吨',
        higherLevel: '兆吨',
        ratio: 1000
      },
      '兆吨': {
        lowerLevel: '千吨',
        higherLevel: null,
        ratio: 1000
      },
      'J': {
        lowerLevel: null,
        higherLevel: 'kJ',
        ratio: 1000
      },
      'kJ': {
        lowerLevel: 'J',
        higherLevel: 'MJ',
        ratio: 1000
      },
      'MJ': {
        lowerLevel: 'kJ',
        higherLevel: null,
        ratio: 1000
      },
      'mL': {
        lowerLevel: null,
        higherLevel: 'L',
        ratio: 1000
      },
      'L': {
        lowerLevel: 'mL',
        higherLevel: 'm³',
        ratio: 1000
      },
      'm³': {
        lowerLevel: 'L',
        higherLevel: null,
        ratio: 1000
      }
    };

  highchart.setOptions({
    global: {
      useUTC: false
    }
  });

  var sagyChart = function() {
    var args = arguments,
      options = args[0],
      callback = args[1];
    if (isString(options)) {
      options = {
        renderTo: args[0]
      };
    }
    return new sagyChart.fn.init(options, callback);
  };

  function isBool(b) {
    return typeof b === "boolean";
  }

  function isString(s) {
    return typeof s === 'string';
  }

  function isArray(arr) {
    return im_string.call(arr) === '[object Array]';
  }

  function isFunction(func) {
    return im_string.call(func) === '[object Function]';
  }

  function isNumber(n) {
    return typeof n === 'number';
  }

  function isEmptyObject(obj) {
    var name;
    for (name in obj) {
      return false;
    }
    return true;
  }

  function generateID() {
    return 'sagy' + mathRandom().toString(36).substring(2, 6); // + Math.random().toString(36).substring(2, 15)
  }

  function error(msg) {
    throw new Error(msg);
  }

  function log(obj) {
    console.log(obj);
  }

  function each(obj, callback) {
    var value,
      i = 0,
      length;
    if (obj) {
      if (isArray(obj)) {
        length = obj.length;
        for (; i < length; i++) {
          value = callback.call(obj[i], i, obj[i]);
          if (value === false) {
            break;
          }
        }
      } else {
        for (i in obj) {
          value = callback.call(obj[i], i, obj[i]);
          if (value === false) {
            break;
          }
        }
      }
      return obj;
    }
  }

  function extend(a, b) {
    var n;
    if (!a) {
      a = {};
    }
    for (n in b) {
      a[n] = b[n];
    }
    return a;
  }

  function deepCopy() {
    var src, copyIsArray, copy, name, options, clone,
      target = {},
      i = 0,
      length = arguments.length;
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (copy && (typeof copy === 'object' || (copyIsArray = isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && isArray(src) ? src : [];
            } else {
              clone = src && typeof src === 'object' ? src : {};
            }
            target[name] = merge(clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  }

  function merge() {
    var i,
      len = arguments.length,
      ret = {},
      doCopy = function(copy, original) {
        var value, key;
        if (typeof copy !== 'object') {
          copy = {};
        }
        for (key in original) {
          if (original.hasOwnProperty(key)) {
            value = original[key];
            if (value && typeof value === 'object' && im_string.call(value) !== '[object Array]' && typeof value.nodeType !== 'number') {
              copy[key] = doCopy(copy[key] || {}, value);
            } else {
              copy[key] = original[key];
            }
          }
        }
        return copy;
      };
    for (i = 0; i < len; i++) {
      ret = doCopy(ret, arguments[i]);
    }
    return ret;
  }

  if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisArg */ ) {
      "use strict";

      if (this === void 0 || this === null)
        throw new TypeError();

      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== "function")
        throw new TypeError();

      var res = [];
      var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
      for (var i = 0; i < len; i++) {
        if (i in t) {
          var val = t[i];

          // NOTE: Technically this should Object.defineProperty at
          //       the next index, as push can be affected by
          //       properties on Object.prototype and Array.prototype.
          //       But that method's new, and collisions should be
          //       rare, so use the more-compatible alternative.
          if (fun.call(thisArg, val, i, t))
            res.push(val);
        }
      }

      return res;
    };
  }

  if (!Array.prototype.map) {
    Array.prototype.map = function(fun /*, thisArg */ ) {
      "use strict";

      if (this === void 0 || this === null)
        throw new TypeError();

      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== "function")
        throw new TypeError();

      var res = new Array(len);
      var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
      for (var i = 0; i < len; i++) {
        // NOTE: Absolute correctness would demand Object.defineProperty
        //       be used.  But this method is fairly new, and failure is
        //       possible only if Object.prototype or Array.prototype
        //       has a property |i| (very unlikely), so use a less-correct
        //       but more portable alternative.
        if (i in t)
          res[i] = fun.call(thisArg, t[i], i, t);
      }

      return res;
    };
  }

  function zeroTime(a) {
    a.setHours(0);
    a.setMinutes(0);
    a.setSeconds(0);
    a.setMilliseconds(0);
    return a.getTime();
  }

  function numFormat(val, returnNum) {
    var num = parseFloat(val);
    var decimal, isMinus = false,
      resultStr;
    if (!isNaN(num)) {
      if (num < 0) {
        isMinus = true;
        num *= -1;
      }
      decimal = num > 10 ? 10 : 100;
      num = mathRound(num * decimal) / decimal;
      if (returnNum) {
        return isMinus ? num * -1 : num;
      }
      if (num >= 100000) {
        resultStr = num.toExponential(1);
      } else {
        resultStr = num.toString();
      }
      if (isMinus) {
        resultStr = '-' + resultStr;
      }
      return resultStr;
    } else {
      if (returnNum) {
        return null;
      } else {
        return '--';
      }
    }
  }

  function Point(x, y) {
    if (x) {
      this.x = x;
    }
    this.y = y;
  }

  var defaultTemplate = {
    chart: {
      backgroundColor: 'rgba(255,0,0,0)',
      renderTo: 'chart_container'
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      series: {
        turboThreshold: 200000,
        shadow: false
      }
    },
    title: {
      text: null
    },
    xAxis: {
      tickWidth: 0,
      lineWidth: 0,
      title: {
        text: null
      },
      labels: {}
    },
    yAxis: {
      tickWidth: 0,
      lineWidth: 0,
      title: {
        text: null
      },
      labels: {}
    }
  };
  var defaultOptions = {
    chartOption: defaultTemplate,
    renderTo: '',
    // resourcePath: './images/sagyChart/',
    autoAxis: true,
    autoTooltip: false,
    autoAxisOption: {
      minute: 10,
      hour: 2,
      day: 2,
      month: 1,
      year: 1
    },
    needClear: true,
    useShortFormater: true,
    subline: {
      enabled: false,
      lines: [],
      renderTo: '',
      deviation: 0
    },
    convertUnit: {
      enabled: false,
      consistent: false
    },
    ajaxOption: {
      url: './chart',
      transferData: {
        // timeType: 1,
        // timeOrCount: 24,
        // endTime: new Date - 0,
        // building: '',
        // equipment: '',
        // energyType: 1,
        // functionType: 0,
        // formula: '',
        // isPerMeter: false,
      },
      index: 0,
      callback: null,
      pointHandler: null,
      isJson: true
    }
  };
  /**
   * initialise Highcharts' dom node
   * @param   options
   * @param   parentNode
   * @return {Highchart} chart obj
   */
  function initChartNode(options, renderTo) {
    // var chartId = generateID(),
    //   chartDiv,
    //   parentNode = renderTo;
    // chartDiv = document.createElement('div');
    // chartDiv.setAttribute('id', chartId);
    // if (isString(renderTo)) {
    //   parentNode = document.getElementById(renderTo);
    // }
    // parentNode.appendChild(chartDiv);
    options.chart.renderTo = renderTo;
    return new highchart.Chart(options);
  }
  /**
   * 计算时间类型
   * @param  {[type]}   prev   前一个
   * @param  {Function} next   后一个
   * @param  {[type]}   _ratio 精度
   * @return {[type]}          返回时间类型(按显示方式分类)   1小时:分钟  2月.天  3 月  4年
   */
  function calculateTimeType(arr, _ratio) {
    var ratio = _ratio || 1,
      length = arr.length,
      first = arr[0],
      prev = arr[1],
      next = arr[2],
      last = arr[length - 1],
      milliseconds,
      time_obj;
    //hack 年度数据
    if (length === 1) {
      time_obj = new Date(first);
      if (time_obj.getMonth() === 0 && time_obj.getDate() === 1) {
        return 'year';
      }
      if (time_obj.getDate() === 1) {
        return 'month';
      }
      return 'day';
    }
    //hack 报警数据
    if ((last - first) < HOUR * 6) {
      return 'minute';
    }

    milliseconds = next - prev;
    switch (true) {
      case milliseconds <= HOUR * ratio:
        return 'hour';
      case milliseconds <= DAY * ratio:
        return 'day';
      case milliseconds <= MONTH * ratio:
        return 'month';
      case milliseconds > MONTH * ratio:
        return 'year';
    }
  }

  function iterator(name, scope) {
    return function() {
      scope[name].apply(scope, arguments);
    };
  }
  sagyChart.fn = sagyChart.prototype = {
    sagyChart: im_version,
    constructor: sagyChart,
    init: function(userOption, callback) {
      var sagy = this,
        options,
        subline;
      if (!userOption.chartOption) {
        error('chartOption为必选项!');
      }
      userOption.chartOption = merge(defaultTemplate, userOption.chartOption);
      sagy.options = options = merge(defaultOptions, userOption);
      if (options.autoAxis) {
        options.chartOption.xAxis.labels.formatter = sagy.axisFormatter();
        options.chartOption.xAxis.tickPositioner = sagy.tickPositioner();
      }
      // if (options.autoTooltip) {
      //   options.chartOption.plotOptions.series.point.events.mouseOver.mouseOut = func_pointMouseover;
      //   options.chartOption.plotOptions.series.point.events.mouseOut = func_pointMouseout;
      // }
      if (isString(options.renderTo) && !document.getElementById(options.renderTo)) {
        error('页面不存在id为' + options.renderTo + '的元素');
      }
      sagy.subline = subline = new Subline(sagy, options.subline);
      sagy.showLine = iterator('show', subline);
      sagy.hideLine = iterator('hide', subline);
      sagy.adjustLine = iterator('adjust', subline);
      sagy.chart = initChartNode(options.chartOption, options.renderTo);
      sagy.transferData = options.ajaxOption.transferData;
      sagy.version = im_version;
      if (isFunction(callback)) {
        callback.call(sagy);
      }
    },
    refresh: function(userOption, callback) {
      var sagy = this,
        options = sagy.options.ajaxOption,
        transferData,
        _userOption,
        _callback;
      if (userOption) {
        _userOption = userOption.transferData ? userOption : {
          transferData: userOption
        };
        transferData = merge(options.transferData, _userOption.transferData);
        options = merge(options, _userOption);
        options.transferData = transferData;
        sagy.options.ajaxOption = options;
        sagy.transferData = transferData;
      }
      _callback = callback ? callback : options.callback;
      $.ajax({
        type: 'POST',
        datatype: 'json',
        data: options.isJson ? options.transferData : JSON.stringify(options.transferData),
        url: options.url,
        success: function(json) {
          var status;
          if (json && json.yData && json.yData.length !== 0) {
            sagy.setData(json, options.index);
            status = true;
          } else {
            sagy.clearData(options.index);
            log('ajax:' + options.url + ' return null');
            status = false;
          }
          if (isFunction(_callback)) {
            _callback.call(sagy, status, json);
          }
        },
        error: function() {
          error('ajax:' + options.url + ' error!');
        }
      });
    },
    //todo 单位平米驻图需要换颜色
    setData: function(json, _index) {
      var sagy = this,
        subline = sagy.subline,
        lines = subline.lines,
        chart = sagy.chart,
        options = sagy.options,
        unit = options.convertUnit.enabled ? json.unit : null,
        index = ~~_index,
        xData = json.xData,
        yData = json.yData,
        isDatetime = false,
        i = 0;
      if (!isArray(yData)) {
        error('返回json格式有误,yData必须是数组.');
      }
      if (isArray(xData) && isNumber(xData[0])) {
        isDatetime = true;
      } else if (isArray(xData) && isString(xData[0])) {
        isDatetime = false;
        chart.xAxis[0].update({
          categories: xData
        });
      }
      if (options.autoAxis && isDatetime) {
        sagy.options.timeType = calculateTimeType(xData, options.axisRatio);
      }
      if (options.needClear) {
        sagy.clearData();
      }
      //兼容其它格式
      if (!xData) {
        chart.series[index].setData(yData);
      } else if (isArray(yData) && isArray(yData[0])) {
        for (i = 0; i < yData.length; i++) {
          sagy.setValueOnly(xData, yData[i], i, isDatetime, unit, json.optional);
        }
      } else {
        sagy.setValueOnly(xData, yData, index, isDatetime, unit, json.optional);
      }
      if (options.subline.enabled) {
        each(json.lines, function(i, item) {
          lines[i].value = item.value;
        });
        if (!isEmptyObject(subline.showed)) {
          sagy.adjustLine();
        }
      }
    },
    setValueOnly: function(xData, yData, index, isDatetime, unit, optional) {
      var sagy = this,
        chart = sagy.chart,
        options = sagy.options,
        pointHandler = options.ajaxOption.pointHandler,
        series = chart.series,
        list = [],
        unitTemp,
        values,
        min,
        point,
        max,
        latestIndex = null,
        today = zeroTime(new Date()),
        i = 0;
      var each_function = function(key, value) {
        if (parseInt(key) === i) {
          point.optional = value;
          return false;
        }
      };
      if (unit) {
        unitTemp = sagy.convertUnitArr(yData, unit);
        sagy.unit = unitTemp.unit;
        yData = unitTemp.data;
      }
      options.ajaxOption.index = index;
      values = yData.filter(function(val) {
        return val !== null;
      });
      min = mathMin.apply(math, values);
      max = mathMax.apply(math, values);

      for (i = yData.length - 1; i >= 0; i--) {
        if (isDatetime && xData[i] < today)
          break;
        if (yData[i] !== null) {
          latestIndex = i;
          break;
        }
      }

      for (i = 0; i < yData.length; i++) {
        point = new Point(isDatetime ? xData[i] : null, yData[i]);
        //TODO 是否改写point的this信息实现方式
        if (isFunction(pointHandler)) {
          point.isMin = point.y === min;
          point.isMax = point.y === max;
          if (latestIndex === i)
            point.isLatest = true;
          //TODO 优化optional的算法
          if (optional) {
            each(optional, each_function);
          }
          pointHandler.call(point, sagy.options.ajaxOption);
        }
        point.y = point.y === null ? null : mathRound(point.y * 100) / 100;
        list.push(point);
      }

      // index = index > lenSeries || index < lenSeries * -1 ? lenSeries - 1 : index;
      i = +index + (index < 0 ? series.length : 0);
      if (series[i]) {
        series[i].setData(list);
      } else {
        log('不存在的series,可能因为错误index.');
      }
    },
    clearData: function( /*index, isDeep*/ ) {
      var series = this.chart.series,
        args = arguments,
        index,
        lenSeries = series.length,
        j;
      if (args.length === 0) {
        each(series, function(i, item) {
          item.setData(null);
        });
      } else if (isNumber(args[0])) {
        index = args[0];
        index = index > lenSeries || index < lenSeries * -1 ? lenSeries - 1 : index;
        j = +index + (index < 0 ? lenSeries : 0);
        if (args[1]) {
          series[j].destroy();
        } else {
          series[j].setData(null);
        }
      }
    },
    axisFormatter: function() {
      var sagy = this,
        options = sagy.options,
        formatter = options.useShortFormater ? shortFormater : longFormater;
      return function() {
        return highchart.dateFormat(formatter[options.timeType], this.value);
      };
    },
    //todo 将时间类型改写为更优雅的方式,不再使用switch
    tickPositioner: function() {
      var sagy = this,
        options = sagy.options,
        autoAxisOption = options.autoAxisOption;
      var handleShows = function(xArr, intervalCount) {
        var length = xArr.length;
        if (length < 1) {
          return [];
        }
        var arr,
          curr,
          start = xArr[0],
          end = xArr[length - 1],
          interval = secondTimer[options.timeType] * intervalCount;
        start = start - start % interval + interval;
        curr = start;
        arr = [start];
        while (curr < end) {
          curr += interval;
          curr < end && arr.push(curr);
        }
        return arr;
      };
      return function() {
        var shows = this.series[0].xData;
        return handleShows(shows, autoAxisOption[options.timeType]);
      };
    },
    destroy: function() {
      var sagy = this;
      sagy.chart.destroy();
      sagy.chart = null;
      document.getElementById(sagy.options.renderTo).innerHTML = '';
    },
    redraw: function() {
      var sagy = this;
      sagy.chart = new highchart.Chart(sagy.options.chartOption);
      sagy.refresh();
    }
  };
  sagyChart.fn.init.prototype = sagyChart.fn;
  //todo 添加重置单位转换方法
  sagyChart.fn.convertUnitArr = function(arr, baseUnit) {
    var options = this.options.convertUnit,
      subline = this.subline,
      max = mathMax.apply(math, arr),
      baseUnitObj = units[baseUnit],
      convertUnit = baseUnit,
      len = max < 10 ? -1 : 0,
      temp = max,
      tempObj = baseUnitObj,
      ratio,
      i,
      templist = [];
    if (!baseUnitObj) {
      return {
        data: arr,
        unit: baseUnit
      };
    }
    ratio = baseUnitObj.ratio;
    if (len === 0) {
      while (temp >= ratio * 10) {
        temp = temp / ratio;
        if (units[tempObj.higherLevel]) {
          convertUnit = tempObj.higherLevel;
          len++;
          tempObj = units[tempObj.higherLevel];
        } else {
          break;
        }
      }
    } else {
      convertUnit = baseUnitObj.lowerLevel;
    }
    if (options.consistent && options.convertedUnit) {
      convertUnit = options.convertedUnit;
      len = options.convertedLen;
    } else {
      options.convertedUnit = convertUnit;
      options.convertedLen = len;
    }
    for (i = 0; i < arr.length; i++) {
      if (arr[i] === null) {
        templist.push(null);
      } else {
        templist.push(arr[i] * mathPow(ratio, len * -1));
      }
    }
    if (!isEmptyObject(subline.showed)) {
      each(subline.lines, function(i, item) {
        item.convertedValue = item.value * mathPow(ratio, len * -1);
      });
    }
    return {
      data: templist,
      unit: convertUnit
    };
  };

  sagyChart.convertUnitArr = function(arr, baseUnit /*, key, returnNum*/ ) {
    var args = arguments,
      max,
      dataArr,
      baseUnitObj = units[baseUnit],
      convertUnit = baseUnit,
      len,
      temp,
      tempObj = baseUnitObj,
      ratio,
      i,
      key,
      returnNum = false;
    if (!baseUnitObj || !arr) {
      return {
        data: arr,
        unit: baseUnit
      };
    }
    if (args.length > 2) {
      if (isString(args[2])) {
        key = args[2];
        returnNum = !!args[3];
      } else if (isBool(args[2])) {
        returnNum = args[2];
      }
    }
    dataArr = arr.map(function(item) {
      if (key) {
        return item[key];
      } else {
        return item;
      }
    });
    max = mathMax.apply(math, dataArr);
    len = max < 10 ? -1 : 0;
    temp = max;
    ratio = baseUnitObj.ratio;

    if (len === 0) {
      while (temp >= ratio * 10) {
        temp = temp / ratio;
        if (units[tempObj.higherLevel]) {
          convertUnit = tempObj.higherLevel;
          len++;
          tempObj = units[tempObj.higherLevel];
        } else {
          break;
        }
      }
    } else {
      convertUnit = baseUnitObj.lowerLevel;
    }
    for (i = 0; i < arr.length; i++) {
      if (key) {
        temp = arr[i][key];
        arr[i][key] = numFormat(temp * mathPow(ratio, len * -1), returnNum);
      } else {
        temp = arr[i];
        arr[i] = numFormat(temp * mathPow(ratio, len * -1), returnNum);
      }
    }
    return {
      data: arr,
      unit: convertUnit
    };
  };

  sagyChart.fn.convertUnit = sagyChart.convertUnit = function(value, baseUnit, returnNum) {
    var convertUnit = baseUnit,
      baseUnitObj = units[baseUnit],
      len = value < 10 ? -1 : 0,
      temp = value,
      tempObj = baseUnitObj,
      ratio;
    if (!baseUnitObj || !value) {
      return {
        data: numFormat(value, returnNum),
        unit: baseUnit
      };
    }
    ratio = baseUnitObj.ratio;
    if (len === 0) {
      while (temp >= ratio * 10) {
        temp = temp / ratio;
        if (units[tempObj.higherLevel]) {
          convertUnit = tempObj.higherLevel;
          len++;
          tempObj = units[tempObj.higherLevel];
        } else {
          break;
        }
      }
    } else {
      convertUnit = baseUnitObj.lowerLevel;
    }
    if (value == null) {
      temp = null;
    } else {
      temp = value * mathPow(ratio, len * -1);
    }
    return {
      data: numFormat(temp, returnNum),
      unit: convertUnit
    };
  };

  function Subline() {
    this.init.apply(this, arguments);
  }
  Subline.prototype = {
    constructor: Subline,
    init: function(sagy, options) {
      var subline = this,
        lines = options.lines;
      if (options.renderTo) {
        subline.node = document.getElementById(options.renderTo);
        //subline.height = lineNode.clientHeight;
      }
      each(lines, function(i, item) {
        if (item.renderTo) {
          item.node = document.getElementById(item.renderTo);
        } else {
          item.node = subline.node;
        }
      });
      subline.sagy = sagy;
      subline.options = options;
      subline.lines = lines;
      subline.showed = {};
    },
    show: function() {
      var args = arguments,
        subline = this,
        lines = subline.lines,
        showed = subline.showed;
      if (args.length === 0) {
        each(lines, function(i, item) {
          showed['line' + i] = item;
          if (item.node) {
            item.node.style.display = 'block';
          }
        });
      } else if (isNumber(args[0])) {
        each(args, function(i, item) {
          showed['line' + item] = lines[item];
          if (lines[item].node) {
            lines[item].node.style.display = 'block';
          }
        });
      } else {
        each(args[0], function(i, item) {
          showed['line' + i] = lines[i] = merge(lines[i], item);
          if (lines[i].node) {
            lines[i].node.style.display = 'block';
          }
        });
      }
      subline.adjust();
    },
    hide: function(index) {
      var subline = this,
        yAxis = subline.sagy.chart.yAxis,
        showed = subline.showed;
      index = ~~index;
      each(showed, function(key) {
        yAxis[index].removePlotLine(key);
        if (showed[key].node) {
          showed[key].node.style.display = 'none';
        }
      });
      showed = {};
    },
    adjust: function() {
      var subline = this,
        showed = subline.showed,
        deviation = subline.options.deviation,
        chart = subline.sagy.chart,
        top = chart.plotTop,
        bottom = chart.plotSizeY,
        yAxises = chart.yAxis,
        yAxis;
      each(showed, function(key, item) {
        yAxis = yAxises[~~item.index];
        yAxis.removePlotLine(key);
      });
      each(showed, function(key, item) {
        var path,
          node,
          plotSvg,
          value = item.convertedValue || item.value;
        yAxis = yAxises[~~item.index];
        yAxis.addPlotLine({
          color: item.color,
          dashStyle: 'Solid',
          width: 2,
          value: value,
          id: key,
          zIndex: 99
        });
        if (item.node) {
          node = item.node;
          if (value > yAxis.max) {
            node.style.top = (top - node.scrollHeight / 2 + deviation) + 'px';
          } else if (value < yAxis.min) {
            node.style.top = (top + bottom - node.scrollHeight / 2 + deviation) + 'px';
          } else {
            plotSvg = yAxis.plotLinesAndBands[yAxis.plotLinesAndBands.length - 1].svgElem;
            plotSvg.shadow(true);
            path = plotSvg.d;
            top = path.split(' ', 3)[2];
            node.style.top = (top - node.scrollHeight / 2 + deviation) + 'px';
          }
        }
      });
    }
  };
  sagyChart.numFormat = numFormat;
  sagyChart.version = im_version;
  return sagyChart;
});

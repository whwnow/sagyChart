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
  var im_version = '0.12.1',
    im_obj = {},
    im_string = im_obj.toString,
    // im_hasOwn = im_obj.hasOwnProperty,
    MINUTE = 60000,
    HOUR = MINUTE * 60,
    DAY = HOUR * 24,
    MONTH = DAY * 31,
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
      'L': {
        lowerLevel: null,
        higherLevel: 'T',
        ratio: 1000
      },
      'm³': {
        lowerLevel: 'L',
        higherLevel: null,
        ratio: 1000
      }
    };
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
      decimal = num >= 10000 ? 1 : num >= 1000 ? 10 : num >= 100 ? 100 : num >= 10 ? 1000 : 10000;
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

  //todo 扩展Array的filter,防止低版本IE报错

  function Point(x, y) {
    if (x) {
      this.x = x;
    }
    this.y = y;
  }
  var func_pointMouseover = function() {
    var chart = this.series.chart;
    if (chart.hoverPoint) {
      func_pointMouseout.call(this);
    }
    chart.svg_yRect = chart.renderer.image(chart.resourcePath + 'panel_Y.png', chart.plotLeft - 80, this.plotY + chart.plotTop - 21, 80, 50).attr({
      fill: 'white',
      zIndex: 99
    }).add();
    var yStr = numFormat(this.y);
    var yfontsize = yStr.length > 4 ? 20 : 28;
    var yfontsizepx = yfontsize + 'px';
    var xString;
    chart.svg_yText = chart.renderer.text(yStr, chart.plotLeft - 43, this.plotY + chart.plotTop + yfontsize / 2).attr({
      zIndex: 100,
      'text-anchor': 'middle'
    }).css({
      color: 'white',
      fontSize: yfontsizepx
    }).add();
    chart.svg_xRect = chart.renderer.image(chart.resourcePath + 'panel_X.png', chart.plotLeft + this.plotX - 52, chart.plotTop + chart.plotHeight, 102, 60).attr({
      fill: 'white',
      zIndex: 99
    }).add();
    switch (chart.timeType) {
      case 1:
        xString = highchart.dateFormat('%H:%M', this.x);
        break;
      case 2:
        xString = highchart.dateFormat('%H:%M', this.x);
        break;
      case 3:
      case 4:
        xString = highchart.dateFormat('%m.%d', this.x);
        break;
      case 5:
        xString = highchart.dateFormat('%m', this.x);
        break;
      default:
        xString = highchart.dateFormat('%H:%M', this.x);
    }
    chart.svg_xText = chart.renderer.text(xString, chart.plotLeft + this.plotX, chart.plotTop + chart.plotHeight + 45).attr({
      zIndex: 100,
      'text-anchor': 'middle'
    }).css({
      color: 'white',
      fontSize: '32px'
    }).add();
    chart.hoverPoint = this;
  };
  var func_pointMouseout = function() {
    var chart = this.series.chart;
    if (chart.svg_xText) {
      chart.svg_xText.destroy();
      chart.svg_xRect.destroy();
      chart.svg_yText.destroy();
      chart.svg_yRect.destroy();
      chart.svg_xText = null;
      chart.svg_xRect = null;
      chart.svg_yText = null;
      chart.svg_yRect = null;
    }
    chart.hoverPoint = null;
  };
  var func_tickPositioner = function() {
    var chart = this.chart,
      shows = chart.series[0].xData,
      result;
    //todo upper_limit 由option决定
    var handleShows = function(xArr, upper_limit) {
      var length = xArr.length,
        spacing_number = 1,
        arr = [],
        i = 0;
      while (length / spacing_number > upper_limit) {
        spacing_number++;
      }
      for (i = 0; i < length; i += spacing_number) {
        arr.push(xArr[i]);
      }
      return arr;
    };
    switch (chart.timeType) {
      case 1:
        result = handleShows(shows, 12);
        break;
      case 2:
        result = handleShows(shows, 16);
        break;
      case 3:
        result = handleShows(shows, 31);
        break;
      case 4:
        result = handleShows(shows, 31);
        break;
      default:
        result = null;
    }
    return result;
  };
  var func_axisFormatter = function() {
    var chart = this.chart,
      result = null;
    switch (chart.timeType) {
      case 1:
        result = highchart.dateFormat('%H:%M', this.value);
        break;
      case 2:
        result = highchart.dateFormat('%m.%d', this.value);
        break;
      case 3:
        result = highchart.dateFormat('%m', this.value);
        break;
      case 4:
        result = highchart.dateFormat('%Y', this.value);
        break;
    }
    return result;
  };
  var defaultTemplate = {
    chart: {
      backgroundColor: 'rgba(255,0,0,0)',
      // spacingBottom: 20,
      // marginRight: 110,
      // marginLeft: 110,
      //marginTop: 110,
      // spacingLeft: 0,
      renderTo: 'chart_container'
      // height: 650,
      //marginBottom: 240,
      //marginRight:100,
      // plotBorderWidth: 1,
      // plotBackgroundColor: '#fffff9'
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      // column: {
      //   pointPadding: 0,
      //   borderWidth: 0,
      //   groupPadding: 0.1,
      //   pointPlacement: 'on',
      // },
      series: {
        turboThreshold: 200000,
        stickyTracking: true,
        shadow: false
        // point: {
        //   events: {
        //     mouseOver: func_pointMouseover,
        //     mouseOut: func_pointMouseout
        //   }
        // }
      }
    },
    // tooltip: {
    //   enabled: true,
    //   animation: false,
    //   formatter: function() {
    //     return false;
    //   },
    //   crosshairs: [{
    //     x: true,
    //     dashStyle: 'ShortDash',
    //     width: 1
    //   }, {
    //     y: true,
    //     dashStyle: 'ShortDash',
    //     width: 1,
    //     zIndex: 10
    //   }]
    // },
    title: {
      text: null
    },
    xAxis: {
      // alternateGridColor: 'rgba(242,253,242,0.5)',
      tickLength: 0,
      tickWidth: 0,
      lineWidth: 0,
      // gridLineColor: '#B2EAC7',
      // gridLineDashStyle: 'longDash',
      // gridLineWidth: 1,
      // type: 'datetime',
      title: {
        text: null
      }
      // labels: {
      //   enabled: true,
      //   style: {
      //     fontSize: 20,
      //     fontFamily: 'Arial',
      //     color: '#aaaaaa'
      //   },
      //   formatter: func_axisFormatter
      // },
      // offset: 25,
      // tickPositioner: func_tickPositioner
    },
    yAxis: {
      // startOnTick: false,
      // tickPixelInterval: 80,
      tickWidth: 0,
      lineWidth: 0,
      // offset: 150,
      // alternateGridColor: 'rgba(244,248,248,0.5)',
      // gridLineColor: '#B2EAC7',
      // gridLineDashStyle: 'longDash',
      title: {
        text: null
      }
      // labels: {
      //   align: 'right',
      //   enabled: true,
      //   y: 10,
      //   style: {
      //     fontSize: 20,
      //     fontFamily: 'Arial',
      //     color: '#aaaaaa'
      //   }
      // }
    }
    // series: [{
    //   turboThreshold: 200000,
    //   // type: 'column',
    //   // color: '#e59c9b',
    //   data: [],
    //   // states: {
    //   //   hover: {
    //   //     enabled: false
    //   //   }
    //   // },
    //   shadow: false,
    //   // zIndex: 8
    // }]
  };
  var defaultOptions = {
    chartOption: defaultTemplate,
    renderTo: '',
    resourcePath: './images/sagyChart/',
    autoAxis: false,
    autoTooltip: false,
    subline: {
      enabled: false,
      lines: [],
      renderTo: '',
      deviation: 0
    },
    convertUnit: {
      enabled: true,
      consistent: false,
      //baseUnit: 'kWh',
      //convertedUnit: null,
      //convertedLen: null
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
    var chartId = generateID(),
      chartDiv,
      parentNode = renderTo;
    chartDiv = document.createElement('div');
    chartDiv.setAttribute('id', chartId);
    if (isString(renderTo)) {
      parentNode = document.getElementById(renderTo);
    }
    parentNode.appendChild(chartDiv);
    options.chart.renderTo = chartId;
    return new highchart.Chart(options);
  }
  /**
   * 计算时间类型
   * @param  {[type]}   prev   前一个
   * @param  {Function} next   后一个
   * @param  {[type]}   _ratio 精度
   * @return {[type]}          返回时间类型(按显示方式分类)   1小时:分钟  2月.天  3 月  4年
   */
  function calculateTimeType(prev, next, _ratio) {
    var ratio = _ratio || 1,
      milliseconds,
      time_obj;
    if (!next) {
      time_obj = new Date(prev);
      if (time_obj.getMonth() === 0 && time_obj.getDate() === 1) {
        return 4;
      } else {
        return 2;
      }
    }
    milliseconds = next - prev;
    switch (true) {
      case milliseconds <= HOUR * ratio:
        return 1;
      case milliseconds <= DAY * ratio:
        return 2;
      case milliseconds <= MONTH * ratio:
        return 3;
      case milliseconds > MONTH * ratio:
        return 4;
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
        chart,
        subline;
      if (!userOption.chartOption) {
        error('chartOption为必选项!');
      }
      userOption.chartOption = merge(defaultTemplate, userOption.chartOption);
      options = merge(defaultOptions, userOption);
      if (options.autoAxis) {
        options.chartOption.xAxis.labels.formatter = func_axisFormatter;
        options.chartOption.xAxis.tickPositioner = func_tickPositioner;
      }
      if (options.autoTooltip) {
        options.chartOption.plotOptions.series.point.events.mouseOver.mouseOut = func_pointMouseover;
        options.chartOption.plotOptions.series.point.events.mouseOut = func_pointMouseout;
      }
      if (isString(options.renderTo) && !document.getElementById(options.renderTo)) {
        error('页面不存在id为' + options.renderTo + '的元素');
      }
      sagy.subline = subline = new Subline(sagy, options.subline);
      sagy.showLine = iterator('show', subline);
      sagy.hideLine = iterator('hide', subline);
      sagy.adjustLine = iterator('adjust', subline);
      chart = initChartNode(options.chartOption, options.renderTo);
      chart.resourcePath = options.resourcePath;
      sagy.options = options;
      sagy.chart = chart;
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
            _callback.call(sagy, status);
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
        index = ~~_index,
        xData = json.xData,
        yData = json.yData,
        isDatetime = false,
        i = 0,
        tempData;
      if (!isArray(yData)) {
        error('返回json格式有误,yData必须是数组.');
      }
      if (isArray(xData) && isNumber(xData[0])) {
        isDatetime = true;
        //todo 计算xAxis的index
      } else if (isArray(xData) && isString(xData[0])) {
        isDatetime = false;
        chart.xAxis[0].update({
          categories: xData
        });
      }
      if (options.autoAxis || options.autoTooltip && isDatetime) {
        //不再判断yData个数,只根据时间间隔
        /*tempData = isArray(yData[0]) ? yData[0] : yData;
        while (i < (tempData.length - 1) && tempData[i] === null || tempData[i + 1] === null) {
          i++;
        }
        if (i >= tempData.length) {
          chart.timeType = 6;
        } else {
          chart.timeType = calculateTimeType(xData[i], xData[i + 1], options.axisRatio);
        }*/
        chart.timeType = calculateTimeType(xData[i], xData[i + 1], options.axisRatio);
      }
      if (isArray(yData) && isArray(yData[0])) {
        for (i = 0; i < yData.length; i++) {
          sagy.setValueOnly(xData, yData[i], i, isDatetime, json.unit, json.optional);
        }
      } else {
        sagy.setValueOnly(xData, yData, index, isDatetime, json.unit, json.optional);
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
        // latestX,
        isDoFindLatest = true,
        list = [],
        unitTemp,
        values,
        min,
        point,
        max,
        temp,
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
      for (i = 0; i < yData.length; i++) {
        point = new Point(isDatetime ? xData[i] : null, yData[i]);
        if (isFunction(pointHandler)) {
          point.isMin = point.y === min;
          point.isMax = point.y === max;
          if (optional) {
            each(optional, each_function);
          }
          pointHandler.call(point, sagy.options.ajaxOption);
        }
        point.y = point.y === null ? null : mathRound(point.y * 100) / 100;
        list.push(point);
      }
      for (i = list.length - 1; i >= 0; i--) {
        // todo 大于2小时是否加点
        /*if (isDatetime && latestX) {
          if((latestX- xData[i])>HOUR*2){

          }
        }
        latestX = yData[i] === null ? null : xData[i];*/
        temp = list[i];
        if (isDatetime && isDoFindLatest && temp.y !== null && temp.x > zeroTime(new Date())) {
          isDoFindLatest = false;
          temp.isLatest = true;
        } else {
          temp.isLatest = false;
        }
      }
      // index = index > lenSeries || index < lenSeries * -1 ? lenSeries - 1 : index;
      i = +index + (index < 0 ? series.length : 0);
      if (series[i]) {
        series[i].setData(list);
      } else {
        error('不存在的series,可能因为错误index.');
      }
    },
    clearData: function(index, isDeep) {
      var series = this.chart.series,
        lenSeries = series.length,
        j;
      index = index > lenSeries || index < lenSeries * -1 ? lenSeries - 1 : index;
      j = +index + (index < 0 ? lenSeries : 0);
      if (isDeep) {
        series[j].destroy();
      } else {
        series[j].setData(null);
      }
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
  sagyChart.fn.convertUnit = sagyChart.convertUnit = function(value, baseUnit, returnNum) {
    var convertUnit = baseUnit,
      baseUnitObj = units[baseUnit],
      len = value < 10 ? -1 : 0,
      temp = value,
      tempObj = baseUnitObj,
      ratio;
    if (!baseUnitObj || isNaN(value)) {
      return {
        data: value,
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

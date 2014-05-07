var moment = require('moment');
exports.index = function(req, res) {
  res.render('index', {
    title: 'Express'
  });
};

function getData(val, time, isRandom) {
  var first = parseInt(time, 10) || 1377100800000, //1377100800000,
    i,
    xArray = [],
    yArray = [],
    len = isRandom ? 100 : 24,
    sum = first,
    add;
  val = parseInt(val, 10) || 1;
  for (i = 0; i < len; i++) {
    if (i === len - 1) {
      yArray.push(null);
    } else {
      yArray.push(Math.random() * val);
    }
    if (isRandom) {
      add = parseInt(Math.random() * (1000 * 60 * 3 - 1000 * 60 * 1 - 1) + 1000 * 60 * 1, 10);
    } else {
      add = 1000 * 60 * 60;
    }
    xArray.push(sum);
    sum += add;
  }
  return {
    xData: xArray,
    yData: yArray,
    unit: "kWh"
  };
}
var MINUTE = 60000,
  HOUR = MINUTE * 60,
  DAY = HOUR * 24;

function getDay() {
  var val = 1000,
    date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth(),
    day = date.getDate(),
    seconds = new Date(year, month, day).getTime(),
    xArr = [],
    yArr = [],
    i,
    length = 24;
  for (i = 0; i < length; i++) {
    xArr.push(seconds);
    seconds += HOUR;
    yArr.push(Math.round(Math.random() * val * 100) / 100);
  }
  return {
    xData: xArr,
    yData: yArr,
    unit: 'kWh'
  };
}

exports.getDay = function(req, res) {
  var val = 1000,
    date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth(),
    day = date.getDate(),
    seconds = new Date(year, month, day).getTime(),
    xArr = [],
    yArr = [],
    i,
    length = 24;
  for (i = 0; i < length; i++) {
    xArr.push(seconds);
    seconds += HOUR;
    yArr.push(Math.round(Math.random() * val * 100) / 100);
  }
  res.send({
    xData: xArr,
    yData: yArr,
    unit: 'kWh'
  });
};

exports.getDayRandom = function(req, res) {
  var val = 1000,
    date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth(),
    day = date.getDate(),
    seconds = new Date(year, month, day).getTime(),
    originalSeconds = seconds,
    xArr = [],
    yArr = [];
  while (seconds < originalSeconds + DAY) {
    xArr.push(seconds);
    seconds += parseInt(Math.random() * (1000 * 60 * 3 - 1000 * 60 * 1 - 1) + 1000 * 60 * 1, 10);
    yArr.push(Math.round(Math.random() * val * 100) / 100);
  }
  res.send({
    xData: xArr,
    yData: yArr,
    unit: 'kWh'
  });
};

exports.getMonth = function(req, res) {
  var val = 100000,
    date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth(),
    seconds = new Date(year, month, 1).getTime(),
    xArr = [],
    yArr = [],
    i,
    length = moment().daysInMonth();
  for (i = 0; i < length; i++) {
    xArr.push(seconds);
    seconds += DAY;
    yArr.push(Math.round(Math.random() * val * 100) / 100);
  }
  res.send({
    xData: xArr,
    yData: yArr,
    unit: 'kWh'
  });
};

exports.getTwoSeries = function(req, res) {
  var val = 100000,
    date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth(),
    seconds = new Date(year, month, 1).getTime(),
    xArr = [],
    yArr = [],
    yBrr = [],
    i,
    length = moment().daysInMonth();
  for (i = 0; i < length; i++) {
    xArr.push(seconds);
    seconds += DAY;
    yArr.push(Math.round(Math.random() * val * 100) / 100);
    yBrr.push(Math.round(Math.random() * val * 100) / 100);
  }
  res.send({
    xData: xArr,
    yData: [yArr, yBrr],
    unit: 'kWh'
  });
};

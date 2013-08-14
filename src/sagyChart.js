(function(window, undefined) {
	//7.7 for fun~
	//some global variable
	var im_version = "0.0.1",
		im_obj = {},
		im_string = im_obj.toString,
		im_hasOwn = im_obj.hasOwnProperty,
		document = window.document,
		MINUTE = 3600,
		HOUR = MINUTE * 60,
		DAY = HOUR * 24,
		WEEK = DAY * 7;
	//document.createElement("div")
	//setAttribute("className", "t")
	var sagyChart = function() {
		var args = arguments,
			options = args[0],
			callback = args[1];
		if (isString(options)) {
			options = {
				renderTo: args[0],
				template: "a"
			};
		}
		return new sagyChart.fn.init(options, callback);
	};

	function isString(s) {
		return typeof s === "string";
	}

	function isArray(arr) {
		return im_string.call(arr) === "[object Array]";
	}

	function isFunction(func) {
		return im_string.call(func) === "[object Function]";
	}

	function generateID() {
		return "sagy" + Math.random().toString(36).substring(2, 6); // + Math.random().toString(36).substring(2, 15)
	}

	function error(msg) {
		throw new Error(msg);
	}

	function log(obj) {
		console.log(obj);
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

	/**
	 * 更新
	 * @return {object} 更新结果
	 */

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

	function Point(x, y) {
		this.x = x;
		this.y = y;
		this.isMin = false;
		this.isMax = false;
		this.isLast = false;
		this.color = "";
	}

	var defaultOptions = {
		template: "a",
		chartOption: {},
		renderTo: "",
		resourcePath: "/Images/sagyChart/",
		subline: {
			enabled: true,
			lines: [{
				color: "#87B6FE",
				name: "参考值"
			}, {
				color: "#87B6FE",
				name: "报警值"
			}]
		},
		convertUnit: {
			enabled:true,
			consistent:false,
			baseUnit:"kWh"
		},
		ajaxOption: {
			url: "",
			transferData: {
				// timeType: 1,
				// timeOrCount: 24,
				// endTime: new Date - 0,
				// building: "",
				// equipment: "",
				// energyType: 1,
				// functionType: 0,
				// formula: "",
				// isPerMeter: false,
			},
			index: 0,
			callback: null,
			pointHandler: null
		}
	};

	var func_pointMouseover = function() {
		var chart = this.series.chart;
		if (chart.hoverPoint) {
			func_pointMouseout.call(this);
		}
		chart.svg_yRect = chart.renderer.image(chart.resourcePath + "panel_Y.png", chart.plotLeft - 80, this.plotY + chart.plotTop - 21, 80, 50).attr({
			fill: "white",
			zIndex: 99
		}).add();
		var yStr = formatStr(this.y);
		var yfontsize = yStr.length > 4 ? 24 : 30;
		var yfontsizepx = yfontsize + "px";
		var xString;
		chart.svg_yText = chart.renderer.text(yStr, chart.plotLeft - 42, this.plotY + chart.plotTop + yfontsize / 2).attr({
			zIndex: 100,
			"text-anchor": "middle"
		}).css({
			color: "white",
			fontSize: yfontsizepx
		}).add();
		chart.svg_xRect = chart.renderer.image(chart.resourcePath + "panel_X.png", chart.plotLeft + this.plotX - 52, chart.plotTop + chart.plotHeight, 102, 60).attr({
			fill: "white",
			zIndex: 99
		}).add();
		switch (chart.timeType) {
			case 1:
				xString = Highcharts.dateFormat("%H:%M", this.x);
				break;
			case 2:
				xString = Highcharts.dateFormat("%H:%M", this.x);
				break;
			case 3:
			case 4:
				xString = Highcharts.dateFormat("%m.%d", this.x);
				break;
			case 5:
				xString = Highcharts.dateFormat("%m", this.x);
				break;
		}
		chart.svg_xText = chart.renderer.text(xString, chart.plotLeft + this.plotX, chart.plotTop + chart.plotHeight + 45).attr({
			zIndex: 100,
			"text-anchor": "middle"
		}).css({
			color: "white",
			fontSize: "32px"
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
		var chart = this.chart;
		var result;
		switch (chart.timeType) {
			case 1:
				if (chart.recentLength < 15) {
					result = chart.series[0].xData;
				}
				break;
			case 3:
			case 4:
				if (chart.recentLength < 30) {
					result = chart.series[0].xData;
				}
				break;
			default:
				result = null;
		}
		return result;
	};

	var func_axisFormatter = function() {
		var chart = this.chart,
			prev = chart.prev || "",
			result;
		switch (chart.timeType) {
			case 1:
				result = Highcharts.dateFormat("%H:%M", this.value);
				break;
			case 2:
				result = Highcharts.dateFormat("%H:%M", this.value);
				break;
			case 3:
			case 4:
				result = Highcharts.dateFormat("%m.%d", this.value);
				break;
			case 5:
				result = Highcharts.dateFormat("%m", this.value);
				break;
		}
		chart.prev = result;
		if (result === prev) {
			result = "";
		}
		return result;
	};

	var defaultTemplate = {
		/**
		 * 建筑对比柱图
		 * @type {Object}
		 */
		a: {
			chart: {
				backgroundColor: "rgba(255,0,0,0)",
				spacingBottom: 20,
				marginRight: 80,
				marginLeft: 110,
				//marginTop: 110,
				spacingLeft: 0,
				renderTo: "chart_container",
				height: 650,
				//marginBottom: 240,
				//marginRight:100,
				plotBorderWidth: 1,
				plotBackgroundColor: "#fffff9"
			},
			legend: {
				enabled: false
			},
			credits: {
				enabled: false,
			},
			plotOptions: {
				connectNulls: false,
				series: {
					stickyTracking: false,
					pointPadding: 0,
					borderWidth: 0,
					groupPadding: 0.1,
					pointPlacement: "on",
					shadow: false,
					point: {
						events: {
							mouseOver: func_pointMouseover,
							mouseOut: func_pointMouseout
						}
					}
				}
			},
			tooltip: {
				enabled: true,
				animation: false,
				formatter: function() {
					return false;
				},
				crosshairs: [{
					x: true,
					dashStyle: "ShortDash",
					width: 1
				}, {
					y: true,
					dashStyle: "ShortDash",
					width: 1,
					zIndex: 10
				}]
			},
			title: {
				text: null
			},
			xAxis: {
				alternateGridColor: "rgba(242,253,242,0.5)",
				tickLength: 0,
				tickWidth: 0,
				gridLineColor: "#B2EAC7",
				gridLineDashStyle: "longDash",
				gridLineWidth: 1,
				type: "datetime",
				title: {
					text: null
				},
				labels: {
					enabled: true,
					style: {
						fontSize: 20,
						fontFamily: "Arial",
						color: "#aaaaaa"
					},
					formatter: func_axisFormatter
				},
				offset: 25,
				lineWidth: 0,
				tickPositioner: func_tickPositioner
			},
			yAxis: {
				startOnTick: false,
				tickPixelInterval: 80,
				tickWidth: 0,
				offset: 150,
				alternateGridColor: "rgba(244,248,248,0.5)",
				gridLineColor: "#B2EAC7",
				gridLineDashStyle: "longDash",
				title: {
					text: null
				},
				lineWidth: 0,
				labels: {
					align: "right",
					enabled: true,
					y: 10,
					style: {
						fontSize: 20,
						fontFamily: "Arial",
						color: "#aaaaaa"
					}
				}
			},
			series: [{
				turboThreshold: 200000,
				type: "column",
				color: "columnColor",
				data: [],
				connectNulls: false,
				states: {
					hover: {
						enabled: false
					}
				},
				shadow: false,
				zIndex: 8
			}]
		},
		b: {}
	};

	function formatStr(val) {
		var num = parseFloat(val);
		var decimal, isMinus = false,
			resultStr;
		if (!isNaN(num)) {
			if (num < 0) {
				isMinus = true;
				num *= -1;
			}
			decimal = num >= 10000 ? 1 : num >= 1000 ? 10 : num >= 100 ? 100 : num >= 10 ? 1000 : 10000;
			num = Math.round(num * decimal) / decimal;
			if (num >= 100000) {
				resultStr = num.toExponential(1);
			} else {
				resultStr = num.toString();
			}
			if (isMinus) {
				resultStr = "-" + resultStr;
			}
			return resultStr;
		} else {
			return "";
		}
	}

	function initSublineNode(options, parentNode) {
		var sublineId = generateID(),
			sublineDiv,
			i,
			list,
			templist = [];
		sublineDiv = document.createElement("div");
		sublineDiv.setAttribute("id", sublineId);
		sublineDiv.style.height = "52px";
		sublineDiv.style.width = "252px";
		sublineDiv.style.float = "right";
		parentNode.appendChild(sublineDiv);
		list = options.lines;
		for (i = 0; i < list.length; i++) {
			templist.push([i, list[i].name]);
		}
		$("#" + sublineId).ComboBox({
			list: templist,
			//enableMobile: true,
			comboBox: {
				width: 252, //定义ComboBox边框宽度
				height: 52,
			},
			defaultOption: "请选择辅助线",
			callback: function(item) {
				console.log(item);
			}
		});
		options.comboRef = $("#" + sublineId);
	}

	/**
	 * initialise Highcharts' dom node
	 * @param   options
	 * @param   parentNode
	 * @return {Highchart} chart obj
	 */

	function initChartNode(options, parentNode) {
		var chartId = generateID(),
			chartDiv,
			i,
			list,
			templist = [];
		chartDiv = document.createElement("div");
		chartDiv.setAttribute("id", chartId);
		chartDiv.style.height = "100%";
		chartDiv.style.width = "100%";
		parentNode.appendChild(chartDiv);
		options.chart.renderTo = chartId;
		return new Highcharts.Chart(options);
	}

	function calculateTimeType(milliseconds) {
		switch (true) {
			case milliseconds <= 10 * MINUTE:
				return 1;
			case milliseconds > 10 * MINUTE && milliseconds <= HOUR:
				return 2;
			case milliseconds > HOUR && milliseconds <= DAY:
				return 3;
			case milliseconds > DAY && milliseconds <= WEEK:
				return 4;
			case milliseconds > WEEK:
				return 5;
			default:
				return 2;
		}
	}
	sagyChart.fn = sagyChart.prototype = {
		sagyChart: im_version,
		constructor: sagyChart,
		init: function(userOptions, callback) {
			var sagy = this,
				options,
				boxNode,
				chart,
				chartOption;
			if (isString(userOptions.template)) {
				chartOption = defaultTemplate[userOptions.template];
				userOptions.chartOption = chartOption;
			}

			options = merge(defaultOptions, userOptions);
			boxNode = document.getElementById(options.renderTo);

			if (!boxNode) {
				error("given a wrong dom id!");
			}

			if (options.subline.enabled) {
				initSublineNode(options.subline, boxNode);
			}

			chart = initChartNode(options.chartOption, boxNode);
			sagy.options = options;
			//todo what should be in info

			// sagy.info = {
			//	chart: chart
			// };
			sagy.chart = chart;

			if (isFunction(callback)) {
				callback.call(sagy);
			}
		},
		refresh: function(userOption, callback) {
			var sagy = this,
				options = sagy.options.ajaxOption,
				_userOption,
				_callback;
			_userOption = userOption.transferData ? userOption : {
				transferData: userOption
			};
			if (userOption) {
				extend(options, _userOption);
			}
			_callback = callback ? callback : options.callback;
			$.ajax({
				type: "POST",
				datatype: "json",
				data: options.transferData,
				url: options.url,
				success: function(json, textStatus) {
					if (json && json.length !== 0) {
						sagy.setChartData(json, options.index, options.pointHandler);
					} else {
						log(options.url + " return null");
					}
				},
				error: function() {
					log("ajax:" + options.url + " error!");
				},
				// status: 200
				// statusText: "OK"
				complete: function(e) {
					if (isFunction(_callback)) {
						var status = e.statusText === "OK" ? true : false;
						_callback.call(sagy, status);
					}
				}
			});
		},
		setChartData: function(json, index, pointHandler) {
			var sagy = this,
				chart = sagy.chart,
				series = chart.series,
				xArray = json.xDate,
				yArray = json.yData,
				len = xArray.length,
				i,
				list = [],
				point,
				min = Math.min.apply(Math, json.yData),
				max = Math.max.apply(Math, json.yData),
				findLastData = true;
			//todo
			//验证数字

			chart.timeType = calculateTimeType(xArray[1] - xArray[0]);
			chart.recentLength = xArray.length;

			for (i = len - 1; i >= 0; i--) {
				point = new Point(xArray[i], yArray[i]);
				if (isFunction(pointHandler)) {
					point.isMin = point.y === min;
					point.isMax = point.y === max;
					if (point.y && findLastData) {
						findLastData = false;
						point.isLast = true;
					} else {
						point.isLast = false;
					}
					point = pointHandler.call(point, sagy.options.transferData);
				}
				point.y = Math.round(point.y * 100) / 100;
				list.push(point);
			}
			index = index > series.length ? series.length - 1 : index;
			series[index].setDate(list);
		},
		destroy: function() {
			var sagy = this;
			sagy.chart.destroy();
			sagy.chart = null;
			sagy.info = {};
			document.getElementById(sagy.options.renderTo).innerHTML = "";

		},
		redraw: function() {
			var sagy = this;
			sagy.chart = new Highcharts.Chart(sagy.options.chartOption);
			sagy.refresh();
		}
	};
	sagyChart.fn.init.prototype = sagyChart.fn;



	if (typeof window === "object" && typeof window.document === "object") {
		window.sagyChart = sagyChart;
	}
})(window);
(function(win, doc) {
	//some global variable
	var im_version = "0.0.1",
		im_obj = {},
		im_string = im_obj.toString,
		im_hasOwn = im_obj.hasOwnProperty,
		createEle = doc.createElement;
	//doc.createElement("div")
	//setAttribute("className", "t")
	var sagyChart = function() {
		var args = arguments,
			options = args[0],
			callback = args[1];
		if (isString(options)) {
			options = {
				renderTo: args[0]
			};
			// args = Array.prototype.slice.call(args, 1);
		}
		return new sagyChart.fn.init(options, callback);
	};

	function isString(s) {
		return typeof s === "string";
	}

	function isArray(arr) {
		return Object.prototype.toString.call(arr) === "[object Array]";
	}

	function isFunction(func) {
		return Object.prototype.toString.call(func) === "[object Function]";
	}

	function generateID() {
		return "sagy" + Math.random().toString(36).substring(2, 6); // + Math.random().toString(36).substring(2, 15)
	}

	function error(msg) {
		throw new Error(msg);
	}

	function log(obj) {
		window.console && console.log(obj);
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

						if (value && typeof value === 'object' && Object.prototype.toString.call(value) !== '[object Array]' && typeof value.nodeType !== 'number') {
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
		// var i,
		// 	len = arguments.length,
		// 	ret = arguments[0] || {},
		// 	doCopy = function(copy, original) {
		// 		var value, oldVal, key;

		// 		if (typeof copy !== "object") {
		// 			copy = {};
		// 		}

		// 		for (key in original) {
		// 			if (im_hasOwn.call(original, key) && im_hasOwn.call(copy, key)) {
		// 				value = original[key];
		// 				oldVal = copy[key];
		// 				if (im_string.call(value) !== im_string.call(oldVal)) continue;
		// 				if (value && typeof value === "object" && Object.prototype.toString.call(value) !== "[object Array]" && typeof value.nodeType !== "number") {
		// 					copy[key] = doCopy(copy[key] || {}, value);

		// 				} else {
		// 					copy[key] = original[key];
		// 				}
		// 			}
		// 		}
		// 		return copy;
		// 	};
		// for (i = 1; i < len; i++) {
		// 	ret = doCopy(ret, arguments[i]);
		// }

		// return ret;
	}


	//defaultOptions
	var defaultOptions = {
		template: "a",
		chartOption: {

		},
		renderTo: "",
		resourcePath: "/Images/sagyChart/",
		subline: {
			enable: true,
			lines: [{
				color: "#87B6FE",
				name: "参考值"
			}, {
				color: "#87B6FE",
				name: "参考值"
			}]
		},
		isConvertUnit: true,
		ajaxParameter: {
			timeType: 1,
			timeOrCount: 24,
			endTime: new Date - 0,
			building: "",
			equipment: "",
			energyType: 1,
			functionType: 0,
			formula: "",
			isPerMeter: false
		}
	};

	var svg_xText, svg_xRect, svg_yText, svg_yRect;

	var func_pointMouseover = function() {
		var defaultOpt = defaultOptions,
			params = defaultOpt.ajaxParam;
		//BuildingCompare.mouseoverItem = this;
		var chart = this.series.chart;
		if (svg_xText && svg_yText) {
			svg_xText.destroy();
			svg_xRect.destroy();
			svg_yText.destroy();
			svg_yRect.destroy();
		}
		svg_yRect = chart.renderer.image(defaultOpt.resourcePath + "panel_Y.png", chart.plotLeft - 80, this.plotY + chart.plotTop - 21, 80, 50).attr({
			fill: "white",
			zIndex: 99
		}).add();
		var yStr = this.y.formatStr();
		var yfontsize = Math.min(32, Math.max(22, parseInt(120 / yStr.length)));
		var yfontsizepx = yfontsize + "px";
		var xString = null;
		svg_yText = chart.renderer.text(yStr, chart.plotLeft - 42, this.plotY + chart.plotTop + parseFloat(yfontsize) / 2).attr({
			zIndex: 100,
			"text-anchor": "middle"
		}).css({
			color: "white",
			fontSize: yfontsizepx
		}).add();
		svg_xRect = chart.renderer.image(defaultOpt.resourcePath + "panel_X.png", chart.plotLeft + this.plotX - 52, chart.plotTop + chart.plotHeight, 102, 60).attr({
			fill: "white",
			zIndex: 99
		}).add();
		switch (AnalyseChart.timeType) {
			case 1:
				var instance = AnalyseChart.instance();
				if (instance.currentTimeMax != "") {
					if ((instance.currentTimeMax - instance.currentTimeMin) / 86400000 > 7) {
						xString = Highcharts.dateFormat("%m.%d", this.x);
					} else {
						xString = Highcharts.dateFormat("%H:%M", this.x);
					}
				} else {
					xString = Highcharts.dateFormat("%H:%M", this.x);
				}
				break;
			case 2:
				var instance = AnalyseChart.instance();
				if (instance.currentTimeMax != "") {
					if ((instance.currentTimeMax - instance.currentTimeMin) / 86400000 > 7) {
						xString = Highcharts.dateFormat("%m.%d", this.x);
					} else {
						xString = Highcharts.dateFormat("%H:%M", this.x);
					}
				} else {
					xString = Highcharts.dateFormat("%H:%M", this.x);
				}
				break;
			case 3:
				xString = Highcharts.dateFormat("%m.%d", this.x);
				break;
			case 4:
				xString = Highcharts.dateFormat("%m", this.x);
				break;
		}
		svg_xText = chart.renderer.text(xString, chart.plotLeft + this.plotX, chart.plotTop + chart.plotHeight + 45).attr({
			zIndex: 100,
			"text-anchor": "middle"
		}).css({
			color: "white",
			fontSize: "32px"
		}).add();

		return false;
	};

	var func_pointMouseout = function() {
		var params = defaultOptions.ajaxParam;
		if (svg_xText && svg_yText) {
			svg_xText.destroy();
			svg_xRect.destroy();
			svg_yText.destroy();
			svg_yRect.destroy();
		}
	};

	var func_tickPositioner = function() {
		var params = defaultOptions.ajaxParam;
		if ((AnalyseChart.timeType == 4 || AnalyseChart.timeType == 3) && this.chart.series[0].xData.length < 30) {
			return this.chart.series[0].xData;
		} else if (AnalyseChart.timeType == 1 && this.chart.series[0].xData.length < 15) {
			return this.chart.series[0].xData;
		} else {
			return null;
		}
	};

	var func_axisFormatter = function() {
		var params = defaultOptions.ajaxParam;
		instance = AnalyseChart.instance(),
		result = null,
		dateObj = new Date(this.value),
		hour = dateObj.getHours(),
		day = dateObj.getDate(),
		month = dateObj.getMonth(),
		isRepeat = false;
		switch (AnalyseChart.timeType) {
			case 1:
				if (instance.currentTimeMax != "") {
					if ((instance.currentTimeMax - instance.currentTimeMin) / 86400000 > 7) {
						result = (month + 1) + "." + day;
					} else {
						result = hour % 2 == 0 ? hour : "";
					}
				} else {
					result = hour % 2 == 0 ? hour : "";
				}
				break;
			case 2:
				result = (month + 1) + "." + day;
				break;
			case 3:
				result = (month + 1) + "." + day;
				break;
			case 4:
				result = month + 1;
				break;
		};
		if (this.isFirst && result == 0) result = "";
		return result.toString();
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
				renderTo: this.options.container,
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
					//zIndex: 10
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
				//showFirstLabel: false,
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
				//startOnTick: true,
				//endOnTick: true,
				//minPadding: 0,
				//maxPadding: 0,
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
				offset: 10,
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
				//name: "用电量",
				type: "column",
				//id: "dataseries",
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

	function setData() {}

	sagyChart.fn = sagyChart.prototype = {
		sagyChart: im_version,
		constructor: sagyChart,
		init: function(userOptions, callback) {
			var options,
				chartId = generateID(),
				sublineId = generateID(),
				checkboxId = generateID(),
				boxDiv,
				chartDiv,
				sublineDiv,
				checkboxDiv;
			options = merge(defaultOptions, userOptions);
			boxDiv = doc.getElementById(options.renderTo);
			if (!boxDiv) {
				error("can't find the element! maybe a wrong id has been set!");
				return;
			}

			chartDiv = createEle("div");
			chartDiv.setAttribute("id", id);
			//1.创建dom.id
			//2.辅助线dom
			//3.
			this.info = {};
		},
		refresh: function(option, callback) {

		},
		destroy: function() {

		},
		//测试redraw能否重绘宽度
		redraw: function() {

		}
	};
	sagyChart.fn.init.prototype = sagyChart.fn;



	/**
	 * 异步工具部分
	 * @return {AsynTool} 异步工具实例
	 */
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
		};

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
			};
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
			this._callbacks[ev].pash(callback);
			return this;
		},
		removeListener: function(ev, callback) {
			var calls = this._callbacks,
				list
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
							j--;
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
			}
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
	EventProxy.prototype.on = EventProxy.prototype.addListener;
	EventProxy.prototype.fire = EventProxy.prototype.trigger;
	EventProxy.prototype.unbind = EventProxy.prototype.removeListener;

})(window, document);
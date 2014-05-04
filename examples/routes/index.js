/*
 * GET home page.
 */

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
	val = parseInt(val, 10)||1;
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

exports.chart = function(req, res) {
	res.send(getData(req.body.number, req.body.startTime, req.body.isRandom));
};
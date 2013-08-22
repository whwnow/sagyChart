/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', {
		title: 'Express'
	});
};

function getData(val) {
	var first = 1377100800000,
		i,
		xArray = [],
		yArray = [];
	for (i = 0; i < 24; i++) {
		if (i === 23) {
			yArray.push(null);
		} else {
			
			yArray.push(Math.random() * val);
		}
		xArray.push(first + i * 1000 * 60 * 60);
	}
	return {
		xData: xArray,
		yData: yArray,
		unit: "kWh"
	};
}

exports.chart = function(req, res) {
	res.send(getData(req.body.number));
};
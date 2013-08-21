/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', {
		title: 'Express'
	});
};

exports.chart = function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});
	res.send("respond with a resource");
};
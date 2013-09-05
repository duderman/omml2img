var xslt = require('node_xslt');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var crypto = require('crypto');
var Deferred = require('jsdeferred').Deferred;
var imagemagick = require('imagemagick');
var self = this;
/**
 * Enables debugging messages. If true result file doesn't disappears
 * @const
 * @type {boolean}
 */
var DEBUG = true;
/**
 * Array that contains availible file formats
 * @const
 * @type {Array.<string>}
 */
var availibleFormats = ['jpeg', 'png', 'gif', 'jpg'];

/**
 *
 * Execute shell scripts
 *
 * @returns {string} Result file name
 *
 */
function executeExternal() {
	var d = new Deferred();
	var files_dir = path.resolve(__dirname, 'files');
	var tmp_name = 'tmp_' + crypto.createHash('sha1').update(Math.random().toString()).digest('hex');
	var exec_string = 'echo \'' + transformedString + '\' > ' + files_dir + '/' + tmp_name + '.mml && ' + path.resolve(__dirname, 'lib/jeuclid/bin/mml2xxx') + ' ' + files_dir + '/' + tmp_name + '.mml ' + files_dir + '/' + tmp_name + '.' + self.options.file_type + ' -backgroundColor ' + self.options.backgroundColor + ' -fontSize ' + self.options.fontSize + (!DEBUG ? ' && rm ' + files_dir + '/' + tmp_name + '.mml' : '');
	if (DEBUG)
		console.log('exec_string: ', exec_string);
	exec(exec_string, function(error, stdout, stderr) {
		if (error !== null) {
			if (DEBUG)
				console.error('exec error: ', error);
			d.fail(new Error('Error while executing external script: ' + error.message));
		}
		d.call(files_dir + '/' + tmp_name + '.' + self.options.file_type);
	});
	return d;
}

/**
 *
 * Read results of previous function
 * @see executeExternal
 *
 * @returns {{string Image data, { number width, number height} dimensions Contain image features }}
 *
 */
function readResult(tmp_name) {
	var d = new Deferred();
	var data = fs.readFile(tmp_name, self.options.encoding, function(err, data) {
		if (err)
			d.fail(err);
		var image = {
			'data': data
		};
		imagemagick.identify(tmp_name, function(err, features) {
			if (err)
				d.fail(err);
			image.dimensions = {
				width: features.width,
				height: features.height
			};
			if (!DEBUG)
				fs.unlinkSync(tmp_name);
			d.call(image);
		});
	});
	return d;
}

/**
 *
 * Render equation image representation from string containing Office MathML
 *
 * @requires omml
 * @requires cb
 *
 * @param {string} omml String with Office MathML
 * @param {[{[encoding=utf8]: string In which encoding image data will be returned, [backgroundColor=white]: string, [fontColor=40]: number, [file_type=png]: string File type for image}]} options Must of them identical with mml2xxx generator
 * @param {function(string Contain image data in given encoding, Error)} cb Callback
 *
 */
exports.renderFromString = function(omml, options, cb) {
	if (arguments.length == 2 && typeof arguments[1] == 'function' && typeof arguments[0] == 'string') {
		cb = options;
		options = null;
	}
	if (cb == null)
		throw new Error('I need callback');
	if (omml == null || typeof omml != 'string')
		cb(null, new Error('Wrong argument passed as omml to renderer'));
	if (options == null)
		this.options = {};
	else
		this.options = options;
	this.options.encoding = this.options.encoding || 'utf8';
	this.options.backgroundColor = this.options.backgroundColor || 'white';
	this.options.fontSize = this.options.fontSize || 40;
	this.options.file_type = this.options.file_type || 'png';
	this.options.file_type = this.options.file_type.replace('.', '').trim();
	if (availibleFormats.indexOf(this.options.file_type) == -1)
		cb(null, new Error('Wrong file_type passed to renderer'));
	try {
		stylesheet = xslt.readXsltFile(path.resolve(__dirname, 'lib/OMML2MML.XSL'));
		document = xslt.readXmlString(omml);
		var parameters = [];
		transformedString = xslt.transform(stylesheet, document, parameters);
	} catch (e) {
		cb(null, new Error('Error when trying to convert OMML to MML: ' + e.message));
	}

	Deferred.call(executeExternal).next(readResult).next(function(img) {
		cb(img);
	})
		.error(function(error) {
			cb(null, new Error('Error while converting: ' + error+'\n'+error.stack));
		});
}
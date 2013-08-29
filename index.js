var xslt = require('node_xslt');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var crypto = require('crypto');
var Deferred = require('jsdeferred').Deferred;
/**
 * Enables debugging messages
 * @const
 * @type {boolean}
 */
var DEBUG = false;
/**
 * Array that contains availible file formats
 * @const
 * @type {Array.<string>}
 */
var availibleFormats = ['jpeg', 'png', 'gif', 'jpg'];


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
	if(cb == null)
		throw new Error('I need callback');
	if (omml == null || typeof omml != 'string')
		cb(null, new Error('Wrong argument passed as omml to renderer'));
	if(options == null)
		options = {};
	options.encoding = options.encoding || 'utf8';
	options.backgroundColor = options.backgroundColor || 'white';
	options.fontSize = options.fontSize || 40;
	options.file_type = options.file_type || 'png';
	options.file_type = options.file_type.replace('.', '').trim();
	if (availibleFormats.indexOf(options.file_type) == -1)
		cb(null, new Error('Wrong file_type passed to renderer'));

	try {
		stylesheet = xslt.readXsltFile(path.resolve(__dirname, 'files/OMML2MML.XSL'));
		document = xslt.readXmlString(omml);
		var parameters = [];
		transformedString = xslt.transform(stylesheet, document, parameters);
	} catch (e) {
		cb(null, new Error('Error when trying to convert OMML to MML: ' + e.message));
	}

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
		var exec_string = 'echo \'' + transformedString + '\' > ' + files_dir + '/' + tmp_name + '.mml && ' + path.resolve(__dirname, 'lib/jeuclid/bin/mml2xxx') + ' ' + files_dir + '/' + tmp_name + '.mml ' + files_dir + '/' + tmp_name + '.' + options.file_type + ' -backgroundColor ' + options.backgroundColor + ' -fontSize ' + options.fontSize + ' && rm ' + files_dir + '/' + tmp_name + '.mml';
		if (DEBUG)
			console.log('exec_string: ', exec_string);
		exec(exec_string, function(error, stdout, stderr) {
			if (error !== null) {
				if (DEBUG)
					console.error('exec error: ', error);
				d.fail(new Error('Error while executing external script: ' + error.message));
			}
			d.call(files_dir + '/' + tmp_name + '.' + options.file_type);
		});
		return d;
	}
	
	/**
	 *
	 * Read results of previous function
	 * @see executeExternal
	 *
	 * @returns {string} Image data
	 *
	 */
	function readResult(tmp_name) {
		var d = new Deferred();
		var data = fs.readFile(tmp_name, options.encoding, function(err, data) {
			if (err)
				d.fail(err);
			fs.unlinkSync(tmp_name);
			d.call(data);
		});
		return d;
	}

	Deferred.call(executeExternal).next(readResult).next(function(data) {
		cb(data);
	})
		.error(function(error) {
			cb(null, new Error('Error while converting: ' + error));
		});
}
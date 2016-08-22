const fs = require('fs');
const path = require('path');

const exec = require('child_process').exec;
const crypto = require('crypto');

const libxslt = require('libxslt');
const libxmljs = libxslt.libxmljs;
const sizeOf = require('image-size');
const _ = require('underscore');


module.exports = {

	/**
	 * The storage of module options with default values
	 *
	 * @access	private
	 * @type	{Object}
	*/
	_options: {
		// Debugging mode
		debug: false,

		// Colorize debugging output
		colorize: false,

		// Path to temporary directory
		tmp_dir: path.resolve(__dirname, 'files'),

		// Flag for a delete a temporary files
		remove_file: true,

		// In which encoding image data will be returned
		encoding: 'utf8',

		// Background color of image file
		backgroundColor: 'white',

		// Font size uses in image file
		fontSize: 40,

		// File type for image
		file_type: 'png'
	},


	/**
	 * Array with namespases of XML document
	 *
	 * @access	private
	 * @type	{Array}
	*/
	_namespaces: [
		{ prefix: 'm', href: 'http://schemas.openxmlformats.org/officeDocument/2006/math' },
		{ prefix: 'mml', href: 'http://www.w3.org/1998/Math/MathML' },
		{ prefix: 'o', href: 'urn:schemas-microsoft-com:office:office' },
		{ prefix: 'r', href: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships' },
		{ prefix: 'v', href: 'urn:schemas-microsoft-com:vml' },
		{ prefix: 'w', href: 'http://schemas.openxmlformats.org/wordprocessingml/2006/main' },
		{ prefix: 'w10', href: 'urn:schemas-microsoft-com:office:word' },
		{ prefix: 'wp', href: 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing' }
	],


	/**
	 * Array that contains availiable file formats
	 *
	 * @access	private
	 * @type	{Array}
	*/
	_availableFormats: ['jpeg', 'png', 'gif', 'jpg'],


	/**
	 * Render equation image representation from string containing Office MathML
	 *
	 * @access	public
	 * @param	{String}	String with Office MathML code
	 * @param	{Object}	Renderer options, optional parameter
	 * @returns	{Object}
	*/
	renderFromString: function (omml, options) {
		return new Promise((resolve, reject) => {

			if (!_.isString(omml))
				throw new Error('Wrong argument passed as omml to renderer');

			this._setOptions(options);

			libxslt.parseFile(path.resolve(__dirname, 'lib/OMML2MML.XSL'), function (err, stylesheet) {
				if (err) return reject(err);

				return resolve(stylesheet);
			})
		})
		.then((stylesheet) => {
			"use strict";

			let document = libxmljs.parseXml(omml);
			this._addNamespaces(document);

			let documentStr = document.toString();
			this._debug('Office MathML as XML: ', documentStr);

			const transformedString = stylesheet.apply(documentStr);
			this._debug('Transformed String: ', transformedString);
			return this._writeMml(transformedString);
		})
		.then(this._executeExternal.bind(this))
		.then(this._readImage.bind(this))
	},


	/**
	 * Setup custom options
	 *
	 * @access	private
	 * @param	{Object}	Options for customization default options
	 * @returns null
	 */
	_setOptions: function (options) {
		if (_.isObject(options)) {
			this._options = _.defaults(options, this._options);

			if (this._availableFormats.indexOf(this._options.file_type) == -1)
				throw new Error('Wrong file_type passed to renderer');
		}
	},


	/**
	 * Adds missing namespaces to XML through pointers of object
	 *
	 * @access	private
	 * @param	{Object}	libxmljs Document
	 * @returns	null
	*/
	_addNamespaces: function (document) {
		this._namespaces.forEach(function (ns) {
			this.namespace(ns.prefix, ns.href);
		}, document.root())
	},


	/**
	 * Write MathML to temporary file
	 *
	 * @access	private
	 * @param	{String}	String that contains MathML
	 * @returns	{String}	Path to mml file
	*/
	_writeMml: function (str) {
		return new Promise((resolve, reject) => {
			const tmpPath = path.normalize(`${this._options.tmp_dir}/${crypto.createHash('sha1').update(str).digest('hex')}.mml`);
			fs.writeFile(tmpPath, str, function (err) {
				if (err) return reject(err);
				resolve(tmpPath);
			})
		})
	},


	/**
	 * Execute shell command
	 *
	 * @access	private
	 * @param	{String}	Path to mml file
	 * @returns	{String}	Path to image file
	*/
	_executeExternal: function (mmlPath) {
		return new Promise((resolve, reject) => {
			const imagePath = mmlPath.replace('.mml', `.${this._options.file_type}`);

			const execArgs = [
				path.resolve(__dirname, 'lib/jeuclid/bin/mml2xxx'),
				mmlPath,
				imagePath,
				`-backgroundColor ${this._options.backgroundColor}`,
				`-fontSize ${this._options.fontSize}`
			];

			const execStr = execArgs.join(' ');
			this._debug('Execute command:', execStr);
			exec(execStr, (err, stdout, stderr) => {
				if (err) return reject(err);

				if (!this._options.debug && this._options.remove_file) {
					fs.unlink(mmlPath, function (err) {
						if (err) return reject(err);
						resolve(imagePath);
					})
				}
				else {
					resolve(imagePath);
				}
			});
		})
	},


	/**
	 * Read image file
	 *
	 * @access	private
	 * @param	{String}	Path to image file
	 * @returns	{Object}
	*/
	_readImage: function (imagePath) {
		return new Promise((resolve, reject) => {
			fs.readFile(imagePath, this._options.encoding, (err, encodedData) => {
				if (err) return reject(err);

				const dim = sizeOf(imagePath);

				resolve({
					data: encodedData,
					dimension: {
						width: dim.width,
						height: dim.height
					}
				});
			});
		})
	},


	/**
	 * Print debug info
	 *
	 * @access	private
	 * @param	{Arguments}
	 * @returns	null
	*/
	_debug: function () {
		if (this._options.debug) {
			_.each(arguments, (arg, i) => {

				const info = [];

				// Print colorized
				if (this._options.colorize) {
					// First argument is caption of info data
					if (i == 0)
						info.push('\x1b[33m\x1b[1m');
					else
						info.push('\033[36m');
				}

				info.push(arg);

				if (this._options.colorize) {
					// Setup default color options
					info.push('\033[0m');
				}

				console.log(...info);
			})
		}
	}
}
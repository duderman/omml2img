omml2img
========

Node module for converting Office MathML objects to images in PNG, GIF and JPEG formats

Installation
--------
Use `npm` to install package

    npm install omml2img
Usage
--------
The usage of module is very simple. All you need is pass to a function named `renderFromString` omml-text, options for renderer(optional) and callback. In that callback you will get the image data (if everything succes) or error (the Error instance if something went wrong). For example:
```javascript
require('omml2img').renderFromString(string_with_omml, {file_type: 'jpeg', encoding: 'base64' })
.then(function (image) {
    console.log('OK! The image is', image.data);
})
.catch(function (err) {
    console.error('Oops :(', err);
);
```
Options
--------
There are few options that you can pass to a `renderFromString` function in `options` object:
  * `tmp_dir` - Path to temporary directory. Default - `files` in the module directory
  * `encoding` - In which encoding image data will be returned. Default - utf8
  * `backgroundColor` - Background color of image file. Default - white
  * `fontColor` -Font size uses in image file. Default - 40
  * `file_type` - File type for image. Default - png
  * `remove_file` - Flag for a delete a temporary files. Default - true

Also are availabe two options for debugging:
  * `debug` - Option to enable debug logging. Default - false
  * `colorize` - Option to colorize log output. Default - false


Many of them identical with mml2xxx generator.

Dependencies & Requirements
--------
The module uses [JEuclid](http://jeuclid.sourceforge.net/) that work on Java. So Java must be installed on machine.
The libraries and programms you must install too use module:
* [Python](http://www.python.org/)
* [ImageMagick](http://www.imagemagick.org/)

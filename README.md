omml2img
========

Node module for converting Office MathML objects to images

Installation
--------
Use `npm` to install package

    npm install omml2img
Usage
--------
The usage of module is very simple. All you need is pass to a function named `renderFromString` omml-text, options for renderer(optional) and callback. In that callback you will get the image data (if everything succes) or error (the Error instance if something went wrong). For example:
```javascript
require('omml2img').renderFromString(string_with_omml, {file_type: 'jpeg', encoding: 'base64' },
    function(image_data, error){
        if(error)
            console.error('Oops :(', error);
        else
            console.log('OK! The image is', image_data);
    });
```
    
Dependencies & Requirements
--------
The module uses [JEuclid](http://jeuclid.sourceforge.net/) that work on Java. So Java must be installed on machine. Also, module will work only on linux. Sorry for that.
The libraries and programms you must install too use module:
* [libxml2](http://www.xmlsoft.org/) (libxml2-dev package for Debian-based distros)
* [libxslt](http://xmlsoft.org/xslt/index.html) (libxslt-dev package for Debian-based distros)
* [libexslt](http://xmlsoft.org/xslt/EXSLT/) (libxslt-dev package for Debian-based distros)
* xml2-config (Needs to be on PATH)
* [ImageMagick](http://www.imagemagick.org/)
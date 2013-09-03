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
    
Dependencies
--------
The module uses [JEuclid][1] that work on Java. So Java must be installed on machine. Also, module will work only on linux. Sorry for that.

[1]:['http://jeuclid.sourceforge.net/']

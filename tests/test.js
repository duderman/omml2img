var renderer = require('omml2img');
var assert = require('assert');
var omml_text = [];
var Deferred = require('jsdeferred').Deferred;
omml_text.push('<m:oMath xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">cos</m:t></m:r><m:d><m:dPr><m:begChr m:val="("/><m:endChr m:val=")"/></m:dPr><m:e><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">a</m:t></m:r></m:e></m:d></m:oMath>');
omml_text.push('<m:oMath xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"><m:f><m:num><m:nary><m:naryPr><m:chr m:val="∑"/><m:subHide m:val="1"/><m:supHide m:val="1"/></m:naryPr><m:sub/><m:sup/><m:e><m:nary><m:naryPr><m:chr m:val="∭"/><m:subHide m:val="1"/><m:supHide m:val="1"/></m:naryPr><m:sub/><m:sup/><m:e><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">d</m:t></m:r></m:e></m:nary><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">∓</m:t></m:r><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">−</m:t></m:r><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">a</m:t></m:r></m:e></m:nary><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">+</m:t></m:r><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">z</m:t></m:r></m:num><m:den><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">∞</m:t></m:r><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">∂</m:t></m:r><m:d><m:dPr><m:begChr m:val="⟦"/><m:endChr m:val="⟧"/></m:dPr><m:e><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">a</m:t></m:r></m:e></m:d></m:den></m:f></m:oMath>');
omml_text.push('<m:oMath xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">ln</m:t></m:r><m:d><m:dPr><m:begChr m:val="("/><m:endChr m:val=")"/></m:dPr><m:e><m:acc><m:accPr><m:chr m:val="⃗"/></m:accPr><m:e><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">z</m:t></m:r></m:e></m:acc><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">⋅</m:t></m:r><m:d><m:dPr><m:begChr m:val="{"/><m:endChr m:val="}"/></m:dPr><m:e><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">a</m:t></m:r><m:f><m:num><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">a</m:t></m:r></m:num><m:den><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">b</m:t></m:r></m:den></m:f></m:e></m:d></m:e></m:d></m:oMath>');

Deferred.loop(omml_text.length, function(i) {
	assert.doesNotThrow(function() {
		renderer.renderFromString(omml_text[i], null, function(img, err) {
			if (err)
				console.error(err);
			assert(img.data);
			assert.equal(typeof img.data, 'string');
			assert(img.dimensions.width)
			assert(img.dimensions.height)
			if (typeof img.dimensions.width != 'number' || typeof img.dimensions.height != 'number') {
				console.log('Image dimensions: ', img.dimensions);
				assert.fail('dimensions type', 'number', 'Renderer return wrong dimensions', '!=');
			}
			console.log('Success!', i);
		});
	});
})
.error(function(err) {
	console.error(''+ err.stack);
})
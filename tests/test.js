var renderer = require('omml2img');
var assert = require('assert');


var ommlArr = [];
ommlArr.push('<m:oMath><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">cos</m:t></m:r><m:d><m:dPr><m:begChr m:val="("/><m:endChr m:val=")"/></m:dPr><m:e><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">a</m:t></m:r></m:e></m:d></m:oMath>');
ommlArr.push('<m:oMath><m:f><m:num><m:nary><m:naryPr><m:chr m:val="∑"/><m:subHide m:val="1"/><m:supHide m:val="1"/></m:naryPr><m:sub/><m:sup/><m:e><m:nary><m:naryPr><m:chr m:val="∭"/><m:subHide m:val="1"/><m:supHide m:val="1"/></m:naryPr><m:sub/><m:sup/><m:e><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">d</m:t></m:r></m:e></m:nary><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">∓</m:t></m:r><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">−</m:t></m:r><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">a</m:t></m:r></m:e></m:nary><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">+</m:t></m:r><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">z</m:t></m:r></m:num><m:den><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">∞</m:t></m:r><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">∂</m:t></m:r><m:d><m:dPr><m:begChr m:val="⟦"/><m:endChr m:val="⟧"/></m:dPr><m:e><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">a</m:t></m:r></m:e></m:d></m:den></m:f></m:oMath>');
ommlArr.push('<m:oMath><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">ln</m:t></m:r><m:d><m:dPr><m:begChr m:val="("/><m:endChr m:val=")"/></m:dPr><m:e><m:acc><m:accPr><m:chr m:val="⃗"/></m:accPr><m:e><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">z</m:t></m:r></m:e></m:acc><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">⋅</m:t></m:r><m:d><m:dPr><m:begChr m:val="{"/><m:endChr m:val="}"/></m:dPr><m:e><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">a</m:t></m:r><m:f><m:num><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">a</m:t></m:r></m:num><m:den><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">b</m:t></m:r></m:den></m:f></m:e></m:d></m:e></m:d></m:oMath>');

var callsArr = ommlArr.map((omml) => {
	return renderer.renderFromString(omml, { encoding: 'base64', tmp_dir: require('path').resolve(__dirname, 'tmp') });
})

Promise.all(callsArr)
.then(function (res) {
	res.forEach(function (img, i) {
		assert(img.data);
		assert.equal(typeof img.data, 'string');
		assert(img.dimensions.width)
		assert(img.dimensions.height)
		if (typeof img.dimensions.width != 'number' || typeof img.dimensions.height != 'number') {
			console.log('Image dimensions: ', img.dimensions);
			assert.fail('dimensions type', 'number', 'Renderer return wrong dimensions', '!=');
		}
		console.log('Success!', i);
	})
})
.catch(function (err) {
	console.log(err);
})
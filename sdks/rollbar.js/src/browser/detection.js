// This detection.js module is used to encapsulate any ugly browser/feature
// detection we may need to do.

// Figure out which version of IE we're using, if any.
// This is gleaned from http://stackoverflow.com/questions/5574842/best-way-to-check-for-ie-less-than-9-in-javascript-without-library
// Will return an integer on IE (i.e. 8)
// Will return undefined otherwise
function getIEVersion() {
	var undef;
	if (!document) {
		return undef;
	}

  var v = 3,
    div = document.createElement('div'),
    all = div.getElementsByTagName('i');

  while (
    div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
      all[0]
    );

  return v > 4 ? v : undef;
}

var Detection = {
  ieVersion: getIEVersion
};

module.exports = Detection;

function supportedLatestJs() {
	try {
		let esLatestTest = new Function('(a = 0) => { async function test() { return 2 * 2 } return test; }');
		// if it fails, then return false
		return true;
	}
	catch (error) {
		return false;
	}
}

function loadDynamicJs(urlParam, onLoadCallbackParam) {

	var onLoadCallback = function() {
		// console.log('loaded: ' + urlParam);
	};

	if(onLoadCallbackParam) {
		onLoadCallback = onLoadCallbackParam;
	}

	if(!urlParam) {
		return false;
	}

	var script = document.createElement('script');
	script.type = 'text/javascript';

	if (script.readyState) {  // IE
		script.onreadystatechange = function() {
			if (script.readyState == 'loaded' || script.readyState == 'complete') {
				script.onreadystatechange = null;
				onLoadCallback();
			}
		}
	} else {  // non-IE
		script.onload = onLoadCallback;
	}

	script.src = urlParam;
	document.getElementsByTagName('head')[0].appendChild(script);

	return true;
}
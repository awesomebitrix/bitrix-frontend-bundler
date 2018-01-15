var JsLoaderModule = (function() {
	var supportedLatestES = function() {
		try {
			let esLatestTest = new Function('(a = 0) => { async function test() { return 2 * 2 } return test; }');

			// if it fails -> return false

			return true;
		}
		catch (error) {
			return false;
		}
	};

	var addJs = function(urlParam, afterLoadCallback) {

		var afterLoad = function() {
			// console.log('loaded: ' + urlParam);
		};

		if(afterLoadCallback) {
			afterLoad = afterLoadCallback;
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
					afterLoad();
				}
			}
		} else {  // non-IE
			script.onload = afterLoad;
		}

		script.src = urlParam;
		document.getElementsByTagName('head')[0].appendChild(script);

		return true;
	};

	return {
		supportedLatestES: supportedLatestES,
		addJs: addJs
	}
})();
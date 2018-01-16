var JsLoaderModule = (function() {
	var supportedLatestES = function() {
		// ES2017 check
		try {
			// sneaky-sneaky function, that uses ES2015's arrow functions and ES2017's async/await
			let esLatestFunction = new Function('async (a = 0) => { let test = () => 2 * 2; let result = await test(); return result; }');

			// this browser definitely supports ES2017!
			return true;
		}
		catch (error) {
			// this browser is little bit old... falling back to ES5...
			return false;
		}
	}();

	function addJs(urlParam, afterLoadCallback) {

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
	}

	return {
		supportedLatestES: supportedLatestES,
		addJs: addJs
	}
})();
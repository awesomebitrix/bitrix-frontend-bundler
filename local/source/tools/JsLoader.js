var JsLoader = (function() {
	var es2017 = function() {
		// ES2017 check
		try {
			// sneaky-sneaky function, that uses ES2015's arrow functions and ES2017's async/await
			let esLatestFunction = new Function('async (a = 0) => { let test = () => 2 * 2; let result = await test(); return result; }');

			// this browser definitely supports ES2017!
			return true;

		} catch (error) {
			// this browser is little bit old... falling back to ES5...
			return false;
		}
	}();

	function load(url, callback) {

		if(!url) {
			return false;
		}

		var onLoad = function() {
			// console.log('loaded: ' + urlParam);
		};

		if(callback) {
			onLoad = callback;
		}

		var script = document.createElement('script');
		script.type = 'text/javascript';

		if (script.readyState) {  // IE
			script.onreadystatechange = function() {
				if (script.readyState == 'loaded' || script.readyState == 'complete') {
					script.onreadystatechange = null;
					onLoad();
				}
			}
		} else {  // non-IE
			script.onload = onLoad;
		}

		script.src = url;
		document.getElementsByTagName('head')[0].appendChild(script);

		return true;
	}

	return {
		es2017: es2017,
		load: load
	}
})();
angular.module('app')
.factory('Password', function (){

// }
// function Password() {

		function getStrength(pass) {
	    var score = 0;
	    if (!pass)
	        return score;

	    // award every unique letter until 5 repetitions
	    var letters = new Object();
	    for (var i=0; i<pass.length; i++) {
	        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
	        score += 5.0 / letters[pass[i]];
	    }

	    // bonus points for mixing it up
	    var variations = {
	        digits: /\d/.test(pass),
	        lower: /[a-z]/.test(pass),
	        upper: /[A-Z]/.test(pass),
	        nonWords: /\W/.test(pass),
	    }

	    var variationCount = 0;
	    for (var check in variations) {
	      variationCount += (variations[check] == true) ? 1 : 0;
	    }
	    score += (variationCount - 1) * 10;

	    if(score > 100) score = 100;

	    return parseInt(score);
		}

		return {
			getStrength: function(pass) {
				return getStrength(pass);
			}
	};
});


	angular.module('app')
	.factory('authInterceptor', ['$rootScope', '$q','$window', authInterceptorFunc]);

	function authInterceptorFunc($rootScope, $q, $window) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStoragetoken;
      }
      return config;
    },
    response: function(response){
      if(response.status == 401){
        //handle this case here
        console.log('User not authorized!!');
      }
      return response || $q.when(response);
    }
  };
}

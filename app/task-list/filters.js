angular.module('tastFilters', [])

.filter('open', function() {
	console.log(input);
  return function(input) {
    if(input['fields']['status']['name'] == Open){
    	return true;
    } else{
    	return false;
    }
  };
});
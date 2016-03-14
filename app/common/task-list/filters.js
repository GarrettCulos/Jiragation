angular.module('appFilters', [])

.filter('priority', function() {
  return function(input) {
  	var baseURL = ''
  	var rageface_icon= 'img/rageface.png';
	var major_icon='img/rageface.png';
	var high_icon= 'img/rageface.png';
	var medium_icon= 'img/rageface.png';
	var low_icon = 'img/foreveralone.png';
  	switch(input){
      case 'Critical': 
      	return rageface_icon;
      	break;
      case 'Major': 
      	return major_icon;
      	break;
      case 'High': 
      	return high_icon;
      	break;
      case 'Medium': 
      	return medium_icon; 
      	break;
      case 'Low': 
      	return low_icon;
      	break;
  	}
  };
});

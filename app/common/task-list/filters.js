angular.module('appFilters', [])

.filter('priorityF', function() {
  return function(input) {
  	var rageface_icon= 'img/rageface.png';
    var sup_son = 'img/supson.png';
    var low_icon = 'img/foreveralone.png';

  	switch(input.name){
      case 'Critical': 
      	return rageface_icon;
      	break;
      case 'Low': 
      	return low_icon;
      	break;
      default: 
        return input.iconUrl;
  	}
  };
})
.filter('statusF', function() {
  return function(input, taskList) {
    
    // console.log(input);

    // angular.forEach(status, function(taskList, key) {
    //   if(status.isActive == true){
    //     if(status.name == input.fields.status.name){
    //       return true;
    //     }
    //   }
    // })
    return true;
  };
});

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
    
    var output = [];
    angular.forEach(input, function(task, key1) {
      angular.forEach(taskList, function(status, key2) {
        if(status.isActive == true){
          if(status.name == task.fields.status.name){
          // console.log(status.name + ' VS ' + task.fields.status.name);
             output.push(task);
          }
        }
      });
    });
    
    return output;
  };
});

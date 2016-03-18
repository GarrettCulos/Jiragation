'use strict';

angular.module('appFilters',[])

.constant("moment", moment)

.filter('priorityF', function() {
  return function(input) {
  	var rageface_icon= 'img/rageface.png';
    var sup_son = 'img/supson.png';
    var low_icon = 'img/foreveralone.png';

  	switch(input.name){
      case 'Critical': 
      	return rageface_icon;
      	break;
      case 'Minor': 
        return low_icon;
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
})

.filter('dateF', function() {
  return function(input) {
    var unixtime = Date.parse(input)/1000;
    var dateObj = new Date(unixtime*1000);
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth()
    // var monthWords = months[month];
    var date = dateObj.getDate();
    var hour = dateObj.getHours();
    // var min = dateObj.getMinutes();
    // var sec = dateObj.getSeconds();
    var res = date + '.' + month + '.' + year + ' h:' + hour;
    console.log(res);
    return res;
  };
});

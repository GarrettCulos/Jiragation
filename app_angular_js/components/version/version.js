'use strict';

angular.module('Jiragation.version', [
  'Jiragation.version.interpolate-filter',
  'Jiragation.version.version-directive'
])

.value('version', '0.1');

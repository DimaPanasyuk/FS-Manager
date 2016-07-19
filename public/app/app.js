(function() {
  angular
  .module('main', [
    'ngRoute', 
    'ngResource',
    'main.foldersList',
    'main.folder',
    'main.file'
  ])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/folders'
      });
  }]);
})();
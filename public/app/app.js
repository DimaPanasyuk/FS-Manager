(function() {
  angular
  .module('main', [
    'ngRoute', 
    'ngResource',
    'main.shared',
    'main.foldersList',
    'main.folder',
    'main.file'
  ])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/folders'
      });
  }])
  .controller('Main', Main);

  Main.$inject = [
    '$scope', 
    '$rootScope'
  ];
  function Main($scope, $rootScope) {
    var sessionToken = sessionStorage.getItem('gridType');
    $scope.gridType = (sessionToken) ? sessionToken : 'blocks';
    $scope.setGridType = setGridType;

    function setGridType(type) {
      $scope.gridType = type;
      sessionStorage.setItem('gridType', type);
    }
  }
})();
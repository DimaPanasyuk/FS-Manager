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
  .controller('Main', Main)
  .run(['$rootScope', '$location', '_url', function($rootScope, $location, _url) {
    $rootScope.$on('$locationChangeStart', function() {
      var parsedUrl = _url.parse($location.url());
      if (parsedUrl === '/folders') {
        $rootScope.openedItems = [
          {
            name: 'app',
            type: 'home'
          }
        ];
      } else {
        $rootScope.openedItems = parsedUrl;
      }
      console.log($rootScope.openedItems);
    });
  }]);

  Main.$inject = [
    '$scope', 
    '$rootScope',
    '$location'
  ];
  function Main($scope, $rootScope, $location) {
    var sessionToken = sessionStorage.getItem('gridType');
    $scope.gridType = (sessionToken) ? sessionToken : 'blocks';

    $scope.setGridType = setGridType;
    $scope.handleItemClick = handleItemClick;

    function setGridType(type) {
      $scope.gridType = type;
      sessionStorage.setItem('gridType', type);
    }

    function handleItemClick(path) {
      $location.path(path);
    }
  }
})();
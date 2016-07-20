(function() {
  angular
  .module('main.folder')
  .config(folderConfig);

  folderConfig.$inject = ['$routeProvider'];
  function folderConfig($routeProvider) {
    $routeProvider
    .when('/folders/:name/path/:path', {
      templateUrl: 'app/folder/folder.html',
      controller: 'Folder',
      resolve: {
        folderPromise: ['folderService', '$route', function(folderService, $route) {
          return folderService.getFolder({
            name: $route.current.params.name,
            path: decodeURIComponent($route.current.params.path)
          });
        }]
      }
    });
  }
})();
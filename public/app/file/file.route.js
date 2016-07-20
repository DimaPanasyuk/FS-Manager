(function() {
  angular
  .module('main.file')
  .config(fileConfig);

  fileConfig.$inject = ['$routeProvider'];
  function fileConfig($routeProvider) {
    $routeProvider
    .when('/files/:name/path/:path', {
      templateUrl: 'app/file/file.html',
      controller: 'File',
      resolve: {
        filePromise: ['fileService', '$route', function(fileService, $route) {
          return fileService.getFileInfo({
            name: $route.current.params.name,
            path: decodeURIComponent($route.current.params.path)
          });
        }]
      }
    });
  } 
})();
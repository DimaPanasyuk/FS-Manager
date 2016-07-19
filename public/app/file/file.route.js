(function() {
  angular
  .module('main.file')
  .config(fileConfig);

  fileConfig.$inject = ['$routeProvider'];
  function fileConfig($routeProvider) {
    $routeProvider
    .when('/folders/:folderName/files/:fileName/:ext', {
      templateUrl: 'app/file/file.html',
      controller: 'File',
      resolve: {
        filePromise: ['fileService', '$route', function(fileService, $route) {
          return fileService.getFileInfo({
            folderName: $route.current.params.folderName,
            fileName: $route.current.params.fileName,
            extension: $route.current.params.ext
          });
        }]
      }
    });
  } 
})();
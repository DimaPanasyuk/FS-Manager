(function() {
  angular
  .module('main.foldersList')
  .config(foldersListConfig);

  foldersListConfig.$inject = ['$routeProvider'];
  function foldersListConfig($routeProvider) {
    $routeProvider
    .when('/folders', {
      templateUrl: 'app/foldersList/foldersList.html',
      controller: 'FoldersList',
      resolve: {
        foldersPromise: ['foldersListService', function(foldersListService) {
          return foldersListService.getFolders();
        }]
      }
    });
  }
})();
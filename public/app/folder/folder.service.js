(function() {
  angular
  .module('main.folder')
  .service('folderService', folderService);

  folderService.$inject = ['$resource'];
  function folderService($resource) {
    var folderResource = $resource('/api/folders/:name', {name: '@name'});
    return {
      getFolder: getFolder
    };

    function getFolder(options) {
      console.log(options);
      return folderResource
              .get(options)
              .$promise;
    }
  }
})();
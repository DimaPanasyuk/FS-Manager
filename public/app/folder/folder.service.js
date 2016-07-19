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
      var name = options.name;
      return folderResource
              .get({name: name})
              .$promise;
    }
  }
})();
(function() {
  angular
  .module('main.foldersList')
  .service('foldersListService', foldersListService);
  foldersListService.$inject = ['$resource'];
  function foldersListService($resource) {
    var foldersResource = $resource('/api/folders', {}, {
      createNew: {
        method: 'POST'
      }
    });
    var folderResource = $resource('/api/check/:name', {name: '@name'});
    return {
      getFolders: getFolders,
      checkIfEmpty: checkIfEmpty,
      createNewItem: createNewItem
    };

    function getFolders() {
      return foldersResource
              .get({})
              .$promise;
    }

    function checkIfEmpty(name) {
      return folderResource
              .get({name: name})
              .$promise;
    }

    function createNewItem(options) {
      return foldersResource
              .createNew(options)
              .$promise;
    }
  }
})();
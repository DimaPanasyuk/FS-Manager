(function() {
  angular
  .module('main.shared', [])
  .service('foldersListService', foldersListService);
  foldersListService.$inject = ['$resource'];
  function foldersListService($resource) {
    var foldersResource = $resource('/api/items', {}, {
      createNew: {
        method: 'POST'
      }
    });
    var folderResource = $resource('/api/check/:name', {name: '@name'});
    var removeFolderResource = $resource('/api/folders/:name', {name: '@name'}, {
      removeItem: {
        method: 'DELETE'
      }
    });
    return {
      getFolders: getFolders,
      checkIfEmpty: checkIfEmpty,
      createNewItem: createNewItem,
      removeItem: removeItem
    };

    function getFolders() {
      return foldersResource
              .get({})
              .$promise;
    }

    function checkIfEmpty(options) {
      return folderResource
              .get(options)
              .$promise;
    }

    function createNewItem(options) {
      return foldersResource
              .createNew(options)
              .$promise;
    }

    function removeItem(options) {
      return removeFolderResource
              .removeItem(options)
              .$promise;              
    }
  }
})();
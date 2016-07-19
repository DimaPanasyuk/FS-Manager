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

    function removeItem(options) {
      return removeFolderResource
              .removeItem(options)
              .$promise;              
    }
  }
})();
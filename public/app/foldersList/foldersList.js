(function() {
  angular
  .module('main.foldersList')
  .controller('FoldersList', FoldersList);

  FoldersList.$inject = [
    '$scope', 
    '$rootScope', 
    'foldersPromise',
    '$location',
    'foldersListService',
    '$window'
  ];
  function FoldersList($scope, $rootScope, foldersPromise, $location, foldersListService, $window) {
    foldersPromise
    .$promise
    .then(function(data) {
      $scope.items = data.items;
    });

    $scope.getData = getData;
    $scope.openCreateModal = openCreateModal;
    $scope.setType = setType;
    $scope.createNewItem = createNewItem;
    $scope.removeItem = removeItem;

    function getData(data) {
      if (isFolder(data)) {
        if (data.empty) {
          data.empty = false;
        } else {
          foldersListService
          .checkIfEmpty(data.name)
          .then(function(resp) {
            if (resp.content) {
              $location.path('/folders/' + data.name);
            } else {
              toastr.info('<b>Folder ' + data.name + ' is empty!</b>');
              data.empty = true;
            }
          });
        }
      } else {
        console.log(data.name);
        $location.path('folders/app/files/'+ data.name.split('.')[0] + '/' + data.name.split('.')[1] + '');
      }
    }

    function openCreateModal() {
      $scope.newItem = {
        type: 'folder'
      };
    }

    function setType(type) {
      $scope.newItem.type = type;
    }

    function removeItem(item) {
      var data = angular.extend({}, item);
      data.name = (item.type === 'file') ? item.name.split('.')[0] : item.name;
      data.parent = 'app';
      data.ext =  (item.type === 'file') ? item.name.split('.')[1] : null;
      foldersListService
      .removeItem(data)
      .then(function(data) {
        if (data.status) {
          toastr.success('<b>Item ' + item.name + ' deleted successfully!</b>');
        } else {
          toastr.error('<b>Error while deleting item!</b>');
        }
      })
      .then(getFolders);
    }

    function createNewItem() {
      var options = angular.extend({}, $scope.newItem);
      options.parent = 'app';
      foldersListService
      .createNewItem(options)
      .then(function(data) {
        if (data.status) {
          toastr.success('<b>New item created successfully!</b>');
        } else {
          toastr.error('<b>Error while creating new item!</b>');
        }
      })
      .then(getFolders);
    }

    function isFolder(item) {
      return (item.name.indexOf('.') > -1) ? false : true;
    }
    
    function getFolders(data) {
      foldersListService
      .getFolders()
      .then(function(data) {
        $scope.items = data.items;
      });
    }
  }
})();
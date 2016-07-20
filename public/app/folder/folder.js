(function() {
  angular
  .module('main.folder')
  .controller('Folder', Folder);

  Folder.$inject = [
    '$scope', 
    '$rootScope', 
    'folderPromise',
    '$location',
    'foldersListService',
    'folderService',
    '$window',
    '$route'
  ];
  function Folder($scope, $rootScope, folderPromise, 
    $location, foldersListService, folderService, $window, $route) {
    folderPromise
    .$promise
    .then(function(data) {
      $scope.items = data.items;
    });

    $scope.getData = getData;
    $scope.openCreateModal = openCreateModal;
    $scope.openFolderExtendModal = openFolderExtendModal;
    $scope.setType = setType;
    $scope.createNewItem = createNewItem;
    $scope.removeItem = removeItem;
    $scope.extendFolder = extendFolder;

    function getData(data) {
      if (isFolder(data)) {
        if (data.empty) {
          data.empty = false;
        } else {
          foldersListService
          .checkIfEmpty(data)
          .then(function(resp) {
            if (resp.content) {
              $location.path('/folders/' + data.name + '/path/' + encodeURIComponent(data.path));
            } else {
              toastr.info('<b>Folder ' + data.name + ' is empty!</b>');
              data.empty = true;
            }
          });
        }
      } else {
        $location.path('files/'+ data.name.split('.')[0] + '/path/' + encodeURIComponent(data.path));
      }
    }

    function openCreateModal() {
      $scope.newItem = {
        type: 'folder'
      };
      $scope.creationType = 'new';
    }

    function openFolderExtendModal(item) {
      $scope.newItem = {
        type: 'folder',
        folderPath: item.path
      };
      $scope.creationType = 'extend';
    }

    function extendFolder() {
      var options = angular.extend({}, $scope.newItem);
      foldersListService
      .createNewItem(options)
      .then(function(data) {
        if (data.status) {
          toastr.success('<b>New item created successfully!</b>');
        } else {
          toastr.error('<b>Error while creating new item!</b>');
        }
      })
      .then(getItems);
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
      .then(getItems);
    }

    function createNewItem() {
      var options = angular.extend({}, $scope.newItem);
      options.folderPath = rootPath;
      foldersListService
      .createNewItem(options)
      .then(function(data) {
        if (data.status) {
          toastr.success('<b>New item created successfully!</b>');
        } else {
          toastr.error('<b>Error while creating new item!</b>');
        }
      })
      .then(getItems);
    }

    function isFolder(item) {
      return (item.name.indexOf('.') > -1) ? false : true;
    }
    
    function getItems(data) {
      folderService
      .getFolder({
        name: $route.current.params.name,
        path: decodeURIComponent($route.current.params.path)
      })
      .then(function(data) {
        $scope.items = data.items;
      });
    }
  }
})();

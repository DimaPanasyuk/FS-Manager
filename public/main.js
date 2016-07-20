(function() {
  angular
  .module('main.file', []);
})(); 
(function() {
  angular
  .module('main.folder', [
    'main.shared'
  ]);
})();
(function() {
  angular.module('main.foldersList', [
    'main.shared'
  ]);
})();
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
(function() {
  angular
  .module('main', [
    'ngRoute', 
    'ngResource',
    'main.shared',
    'main.foldersList',
    'main.folder',
    'main.file'
  ])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/folders'
      });
  }])
  .controller('Main', Main);

  Main.$inject = [
    '$scope', 
    '$rootScope'
  ];
  function Main($scope, $rootScope) {
    var sessionToken = sessionStorage.getItem('gridType');
    $scope.gridType = (sessionToken) ? sessionToken : 'blocks';
    $scope.setGridType = setGridType;

    function setGridType(type) {
      $scope.gridType = type;
      sessionStorage.setItem('gridType', type);
    }
  }
})();
(function() {
  angular
  .module('main.file')
  .controller('File', File);

  File.$inject = [
    '$scope', 
    '$rootScope', 
    'filePromise', 
    'fileService',
    '$route',
    '$location'
  ];
  function File($scope, $rootScope, filePromise, fileService, $route, $location) {
    
    filePromise
    .$promise
    .then(function(data) {
      $scope.file = data.file;
    });
    $scope.updateFile = updateFile;

    function updateFile() {
      var params = $route.current.params;
      
      fileService
      .updateFile({
        fileName: params.name,
        path: decodeURIComponent(params.path),
        newName: $scope.file.name,
        newContent: $scope.file.content
      })
      .then(function(data) {
        if (data.status) {
          toastr.success('<b>File updated successfully!</b>');
          history.back();
        } else {
          toastr.error('<b>File update error!</b>');
        }
      });
    }
  }
})();
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
(function() {
  angular
  .module('main.file')
  .service('fileService', fileService);

  fileService.$inject = ['$resource'];
  function fileService($resource) {
    const fileResource = $resource('/api/files/:name', {
      folderName: '@folderName',
      fileName: '@fileName'
    }, {
      updateFile: {
        method: 'PUT'
      }
    });
    return {
      getFileInfo: getFileInfo,
      updateFile: updateFile
    };

    function getFileInfo(options) {
      return fileResource
              .get(options)
              .$promise;
    }

    function updateFile(options) {
      console.log(options);
      return fileResource
              .updateFile({
                name: options.fileName
              },{
                newName: options.newName,
                data: options.newContent,
                path: options.path
              })
              .$promise;
    }
  }
})();
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

(function() {
  angular
  .module('main.folder')
  .config(folderConfig);

  folderConfig.$inject = ['$routeProvider'];
  function folderConfig($routeProvider) {
    $routeProvider
    .when('/folders/:name/path/:path', {
      templateUrl: 'app/folder/folder.html',
      controller: 'Folder',
      resolve: {
        folderPromise: ['folderService', '$route', function(folderService, $route) {
          return folderService.getFolder({
            name: $route.current.params.name,
            path: decodeURIComponent($route.current.params.path)
          });
        }]
      }
    });
  }
})();
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
    var rootPath = null;
    foldersPromise
    .$promise
    .then(function(data) {
      $scope.items = data.items;
      rootPath = data.rootPath;
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
        console.log(data.name);
        $location.path('/files/'+ data.name.split('.')[0] + '/path/' + encodeURIComponent(data.path));
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
      .then(getFolders);
    }

    function setType(type) {
      $scope.newItem.type = type;
    }

    function removeItem(item) {
      var data = angular.extend({}, item);
      data.name = (item.type === 'file') ? item.name.split('.')[0] : item.name;
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
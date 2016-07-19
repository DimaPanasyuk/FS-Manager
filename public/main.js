(function() {
  angular
  .module('main.file', []);
})(); 
(function() {
  angular
  .module('main.folder', []);
})();
(function() {
  angular.module('main.foldersList', []);
})();
(function() {
  angular
  .module('main', [
    'ngRoute', 
    'ngResource',
    'main.foldersList',
    'main.folder',
    'main.file'
  ])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/folders'
      });
  }]);
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
        folderName: params.folderName,
        fileName: params.fileName,
        extension: params.ext,
        newName: $scope.file.name,
        newContent: $scope.file.content
      })
      .then(function(data) {
        if (data.status) {
          toastr.success('<b>File updated successfully!</b>');
          $location.path('/folders');
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
(function() {
  angular
  .module('main.file')
  .service('fileService', fileService);

  fileService.$inject = ['$resource'];
  function fileService($resource) {
    const fileResource = $resource('/api/folders/:folderName/files/:fileName/:extension', {
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
              .get({
                folderName: options.folderName,
                fileName: options.fileName,
                extension: options.extension
              })
              .$promise;
    }

    function updateFile(options) {
      return fileResource
              .updateFile({
                folderName: options.folderName,
                fileName: options.fileName,
                extension: options.extension
              },{
                oldName: options.fileName,
                newName: options.newName,
                newContent: options.newContent
              })
              .$promise;
    }
  }
})();
(function() {
  angular
  .module('main.folder')
  .controller('Folder', Folder);

  Folder.$inject = ['$scope', '$rootScope', 'folderPromise'];
  function Folder($scope, $rootScope, folderPromise) {
    folderPromise
    .$promise
    .then(function(data) {
      $scope.items = data.items;
      console.log(data);
    });
  }
})();
(function() {
  angular
  .module('main.folder')
  .config(folderConfig);

  folderConfig.$inject = ['$routeProvider'];
  function folderConfig($routeProvider) {
    $routeProvider
    .when('/folders/:name', {
      templateUrl: 'app/folder/folder.html',
      controller: 'Folder',
      resolve: {
        folderPromise: ['folderService', '$route', function(folderService, $route) {
          return folderService.getFolder({name: $route.current.params.name});
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
      var name = options.name;
      return folderResource
              .get({name: name})
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
      .then(function() {
        foldersListService
        .getFolders()
        .then(function(data) {
          $scope.items = data.items; 
        });
      });
    }

    function isFolder(item) {
      return (item.name.indexOf('.') > -1) ? false : true;
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
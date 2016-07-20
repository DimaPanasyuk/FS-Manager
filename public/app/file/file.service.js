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
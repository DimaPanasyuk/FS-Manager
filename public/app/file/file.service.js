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
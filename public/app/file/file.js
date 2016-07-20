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
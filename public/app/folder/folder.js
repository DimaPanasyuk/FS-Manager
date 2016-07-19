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
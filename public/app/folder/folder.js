(function() {
  angular
  .module('main.folder')
  .controller('Folder', Folder);

  Folder.$inject = [
    '$scope', 
    '$rootScope', 
    'folderPromise',
    '$location'
  ];
  function Folder($scope, $rootScope, folderPromise, $location) {
    folderPromise
    .$promise
    .then(function(data) {
      $scope.items = data.items;
      console.log(data);
    });

    $scope.open = open;

    function open() {

    }
  }
})();

(function() {
  angular
  .module('main.shared')
  .service('_url', urlParser);

  function urlParser() {
    return {
      parse: parse
    };

    function parse(url) {
      if (pathExists(url)) {
        var pathIndex = findPathIndex(url);
        return parsePath(extractPath(url, pathIndex));
      } else {
        return url;
      }
    }

    function pathExists(url) {
      return url.indexOf('/path/') > -1;
    }

    function findPathIndex(url) {
      return url.lastIndexOf('/path/');
    }

    function extractPath(url, index) {
      var pathToken = index + 6;
      return extractHomeFolder(decodePath(url.slice(pathToken)));
    }

    function parsePath(path) {
      var _parsed = path
                    .split('/')
                    .filter(function(item) {
                      return item.length > 0;
                    })
                    .map(function(item) {
                      if (item.indexOf('.') > -1) {
                        return {
                          name: item,
                          type: 'file'
                        };
                      } else {
                        if (item === 'app') {
                          return {
                            name: item,
                            type: 'home'
                          };
                        }
                        return {
                          name: item,
                          type: 'folder'
                        };
                      }
                    });
      return _parsed;
    }

    function decodePath(path) {
      return decodeURIComponent(decodeURIComponent(path));
    }

    function extractHomeFolder(url) {
      var _folderIndex = url.indexOf('/app/');
      return url.slice(_folderIndex);
    }
  }
})();
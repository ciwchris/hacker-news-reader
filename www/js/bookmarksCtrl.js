
angular.module('hn.controllers')
.controller('BookmarksCtrl', function($scope, bookmarkService) {
    $scope.init = function() {
        $scope.bookmarks = bookmarkService.list();
    }

    $scope.openStory = function(url) {
        window.open(url, '_system', 'location=yes');
    };

    $scope.saveStory = function(story) {
        bookmarkService.toggle(story);
    };
});

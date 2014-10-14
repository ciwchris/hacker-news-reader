
angular.module('hn.controllers')
.controller('TopNewsCtrl', function($scope, $location, $cordovaToast, $cordovaClipboard, newsService, bookmarkService) {
    $scope.init = function() {
        newsService.getTopNews().then(
            function(items) {
                $scope.news = items;
        });
    };

    $scope.showComments = function(id) {
        $location.path('app/comments/' + id + '/');
    };

    $scope.copyUrl = function(url) {
        $cordovaClipboard.copy(url).then(function () {
            $cordovaToast.show('copied', 'short', 'bottom');
        },
        function () {
            $cordovaToast.show('failed to copy', 'short', 'bottom');
        });
    };

    $scope.openStory = function(url) {
        window.open(url, '_system', 'location=yes');
    };

    $scope.saveStory = function(story) {
        bookmarkService.toggle(story);
    };
});

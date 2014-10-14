
angular.module('hn.controllers')
.controller('NewsCtrl', function($scope, $location, $cordovaToast, $cordovaClipboard, newsService, bookmarkService) {
    $scope.init = function() {
        // $scope.news = newsService.getFakeNews();
        newsService.getNews().then(
            function(items) {
                $scope.news = items;
        });
    };

    $scope.loadMore = function(lastId) {
        newsService.getNewsFrom(lastId -1).then(
            function(items) {
                $scope.news = items;
        });
    };

    $scope.copyUrl = function(url) {
        $cordovaClipboard.copy(url).then(function () {
            $cordovaToast.show('copied', 'short', 'bottom');
        },
        function () {
            $cordovaToast.show('failed to copy', 'short', 'bottom');
        });
    };


    $scope.showComments = function(id) {
        $location.path('app/comments/' + id + '/');
    };

    $scope.openStory = function(url) {
        window.open(url, '_system', 'location=yes');
    };

    $scope.saveStory = function(story) {
        bookmarkService.toggle(story);
    };
});

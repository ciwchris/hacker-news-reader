angular.module('hn.controllers', ['ngStorage'])

.controller('AppCtrl', function() {
})
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
})
.controller('NewsCtrl', function($scope, $ionicLoading, newsService, bookmarkService) {
    $scope.init = function() {
        $scope.news = newsService.getFakeNews();
        // $ionicLoading.show({template: 'Loading...'});
        // newsService.getNews().then(
        //     function(items) {
        //         $scope.news = items;
        //         $ionicLoading.hide();
        // });
    };

    $scope.openStory = function(url) {
        window.open(url, '_system', 'location=yes');
    };

    $scope.saveStory = function(story) {
        bookmarkService.toggle(story);
    };
})

.factory('bookmarkService', function($localStorage) {
    function list() {
        return $localStorage.bookmarks;
    }

    function toggle(story) {
        story.saved = !story.saved;
        if (story.saved) {
            $localStorage.bookmarks.push(story);
        } else {
            $localStorage.bookmarks = _.reject($localStorage.bookmarks, {id: story.id});
        }
    }

    return {
        list: list,
        toggle: toggle
    };
})
.factory('newsService', function($q, $http) {
    function getFakeNews() {
        return fakeNews.items;
    }
    function getNews() {
        var deferred = $q.defer();

        $http({method: 'GET', url: 'http://api.ihackernews.com/page'})
        .success(function(data, status, headers, config) {
            deferred.resolve(data.items);
        }).error(function(data, status, headers, config) {
            deferred.resolve([{'title': data},{'title': status}]);
        });
        return deferred.promise;
    }

    return {
        getNews: getNews,
        getFakeNews: getFakeNews
    };
});


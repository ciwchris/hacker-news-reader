angular.module('hn.controllers', ['angular-data.DSCacheFactory'])

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
.controller('NewsCtrl', function($scope, newsService, bookmarkService) {
    $scope.init = function() {
        // $scope.news = newsService.getFakeNews();
        newsService.getNews().then(
            function(items) {
                $scope.news = items;
        });
    };

    $scope.openStory = function(url) {
        window.open(url, '_system', 'location=yes');
    };

    $scope.saveStory = function(story) {
        bookmarkService.toggle(story);
    };
})

.factory('bookmarkService', function(DSCacheFactory) {
    function list() {
        return DSCacheFactory.get('bookmarks').get('bookmarks');
    }

    function toggle(story) {
        story.saved = !story.saved;
        var bookmarks = DSCacheFactory.get('bookmarks').get('bookmarks');
        if (story.saved) {
            bookmarks.push(story);
        } else {
            bookmarks = _.reject(bookmarks, {id: story.id});
        }
        DSCacheFactory.get('bookmarks').put('bookmarks', bookmarks);
    }

    return {
        list: list,
        toggle: toggle
    };
})
.factory('newsService', function($q, $http, $ionicLoading, DSCacheFactory) {
    function getFakeNews() {
        var news = DSCacheFactory.get('news').get('news');
        if (news) {
            return news;
        } else {
            DSCacheFactory.get('news').put('news', fakeNews.items);
            return fakeNews.items;
        }
    }

    function getNews() {
        var deferred = $q.defer();

        var news = DSCacheFactory.get('news').get('news');
        if (news) {
            deferred.resolve(news);
        } else {
            $ionicLoading.show({template: 'Loading...'});
            $http({method: 'GET', url: 'http://api.ihackernews.com/page'})
            .success(function(data, status, headers, config) {
                DSCacheFactory.get('news').put('news', data.items);
                deferred.resolve(data.items);
                $ionicLoading.hide();
            }).error(function(data, status, headers, config) {
                deferred.resolve([{'title': data},{'title': status}]);
                $ionicLoading.hide();
            });
        }
        return deferred.promise;
    }

    return {
        getNews: getNews,
        getFakeNews: getFakeNews
    };
});



angular.module('hn.services')
.factory('newsService', function($q, $http, $ionicLoading, DSCacheFactory, $firebase) {

    function getTopNews() {
        var deferred = $q.defer();

        var news = DSCacheFactory.get('top.news').get('top.news');
        if (news) {
            deferred.resolve(news);
        } else {
            $ionicLoading.show({template: 'Loading...'});

            var ref = new Firebase("https://hacker-news.firebaseio.com/v0/topstories");
            $firebase(ref).$asArray().$loaded().then(function (stories) {
                $ionicLoading.hide();
                var news = [];
                for (var i = 0; i < stories.length; i++) {
                    var ref = new Firebase("https://hacker-news.firebaseio.com/v0/item/" + stories[i].$value);
                    $firebase(ref).$asObject().$loaded().then(function (item) {
                        news.push(item);
                        // Seems quick enough, we'll not use this and instead wait for all of them
                        // if (news.length % 9 === 0) {
                        //     deferred.resolve(news);
                        // }
                        if (i + 1 >= stories.length) {
                            deferred.resolve(news);
                            DSCacheFactory.get('top.news').put('top.news', news);
                        }
                    });
                }
            });
        }
        return deferred.promise;
    }

    function getFakeNews() {
        var news = DSCacheFactory.get('news').get('news');
        if (news) {
            return news;
        } else {
            DSCacheFactory.get('news').put('news', fakeNews);
            return fakeNews;
        }
    }

    function getStory(id, stories, storyCount, deferred) {
        var ref = new Firebase("https://hacker-news.firebaseio.com/v0/item/" + id);
        $firebase(ref).$asObject().$loaded().then(function (item) {
            if (item.type === 'story' && item.title && (angular.isUndefined(item.deleted) || !item.deleted)) {
                stories.push(item);
                storyCount--;
                $ionicLoading.show({template: 'Loading: ' + (10 - storyCount)});
            }
            if (storyCount > 0) { getStory(--id, stories, storyCount, deferred); }
            else { showStories(stories, deferred); }
        },
        function (e) {
            // some hacker news items can't be accessed, we'll just skip them
            console.error("Error retrieving story: ");
            console.error(e);
            getStory(--id, stories, storyCount, deferred);
        });
    }

    function showStories(stories, deferred) {
        DSCacheFactory.get('news').put('news', stories);
        deferred.resolve(stories);
        $ionicLoading.hide();
    }

    function getNews() {
        var deferred = $q.defer();

        var news = DSCacheFactory.get('news').get('news');
        if (news) {
            deferred.resolve(news);
        } else {
            $ionicLoading.show({template: 'Loading...'});

            var ref = new Firebase("https://hacker-news.firebaseio.com/v0/maxitem");
            $firebase(ref).$asObject().$loaded().then(function (maxItemNumber) {
                getStory(maxItemNumber.$value, [], 10, deferred);
            });
        }
        return deferred.promise;
    }

    function getNewsFrom(id) {
        var deferred = $q.defer();

        var news = DSCacheFactory.get('news').get('news');
        if (news && _.find(news, function(item) { return item.id === id; })) {
            deferred.resolve(news);
        } else {
            $ionicLoading.show({template: 'Loading...'});
            getStory(id, news, 10, deferred);
        }
        return deferred.promise;
    }

    return {
        getTopNews: getTopNews,
        getNews: getNews,
        getNewsFrom: getNewsFrom,
        getFakeNews: getFakeNews,
    };
});

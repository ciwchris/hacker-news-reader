
angular.module('hn.services')
.factory('commentsService', function($q, $http, $ionicLoading, DSCacheFactory, $firebase) {
    var comments = [];

    function getFakeComments() {
        return fakeComments;
    }

    function getComments(id) {
        var deferred = $q.defer();

        if (comments[id]) {
            deferred.resolve(comments[id]);
        } else {
            $ionicLoading.show({template: 'Loading...'});
            var ref = new Firebase("https://hacker-news.firebaseio.com/v0/item/" + id);
            $firebase(ref).$asObject().$loaded().then(function (item) {
                getKids(item, deferred);
            });
        }

        return deferred.promise;
    }

    function getKids(item, deferred) {
        var itemComments = [];
        for (var i = 0; i < item.kids.length; i++) {
            var ref = new Firebase("https://hacker-news.firebaseio.com/v0/item/" + item.kids[i]);
            $firebase(ref).$asObject().$loaded().then(function (comment) {
                itemComments.push(comment);
                if (itemComments.length === item.kids.length) {
                    comments[item.id] = itemComments;
                    deferred.resolve(itemComments);
                    $ionicLoading.hide();
                }
            });
        }
    };

    return {
        getComments: getComments,
        getFakeComments: getFakeComments,
    };
});

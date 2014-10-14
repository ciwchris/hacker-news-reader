
angular.module('hn.controllers')
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
});

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('hn.services', ['angular-data.DSCacheFactory', 'firebase']);
angular.module('hn.controllers', []);
angular.module('hn', ['ionic', 'hn.controllers', 'hn.services', 'ngCordova'])

.run(function($ionicPlatform, DSCacheFactory) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  DSCacheFactory('news', { storageMode: 'localStorage', maxAge: 1000 * 60 * 20, deleteOnExpire: 'aggressive' });
  DSCacheFactory('top.news', { storageMode: 'localStorage', maxAge: 1000 * 60 * 20, deleteOnExpire: 'aggressive' });
  var bookmarks = DSCacheFactory('bookmarks', { storageMode: 'localStorage' });
  if (!angular.isArray(bookmarks.get('bookmarks'))) {
    bookmarks.put('bookmarks', []);
  }
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.top-news', {
      url: "/top-news",
      views: {
        'menuContent' :{
          templateUrl: "templates/top-news.html"
        }
      }
    })

    .state('app.news', {
      url: "/news",
      views: {
        'menuContent' :{
          templateUrl: "templates/news.html"
        }
      }
    })

    .state('app.bookmarks', {
      url: "/bookmarks",
      views: {
        'menuContent' :{
          templateUrl: "templates/bookmarks.html"
        }
      }
    })
    .state('app.comments', {
      url: "/comments/:id/:index",
      views: {
        'menuContent' :{
          templateUrl: "templates/comments.html"
        }
      }
    })
    ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/top-news');
});


angular.module('hn.controllers')
.controller('CommentsCtrl', function($scope, $location, $stateParams, commentsService) {
    $scope.init = function() {
        // $scope.comments = commentsService.getFakeComments($stateParams.id);
        commentsService.getComments($stateParams.id).then(
            function(comments) {
                $scope.comments = comments;
        });
    }

    $scope.showComments = function(index) {
        $location.path('app/comments/' + index + '/');
    }
});

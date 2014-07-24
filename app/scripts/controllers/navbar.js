'use strict';

angular.module('angularPassportApp')
  .controller('NavbarCtrl', function ($scope, Auth, $location) {
    $scope.menu = [
//	{
//      "title": "Blogs",
//      "link": "blogs"
//    },
	{
      "title": "Boards",
      "link": "boards"
	}];

    $scope.authMenu = [
//	{
//      "title": "Create New Blog",
//      "link": "blogs/create"
//    },
    {
      "title": "Create New Board",
      "link": "boards/create"
	}];

    $scope.logout = function() {
      Auth.logout(function(err) {
        if(!err) {
          $location.path('/login');
        }
      });
    };
  });

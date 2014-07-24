'use strict';

angular.module('angularPassportApp')
  .controller('BoardsCtrl', function ($scope, Boards, UserService, $location, $routeParams, $rootScope, socket) {
  
  $scope.allUsers = [];

  var promise = UserService.getUsers();
  promise.then(function(data) {
  $scope.allUsers = data;
  });
  
  // toggle selection for a given user by name
  $scope.toggleSelection = function toggleSelection(user) {
    var idx = $scope.allowedUsers.indexOf(user);

    // is currently selected
    if (idx > -1) {
      $scope.allowedUsers.splice(idx, 1);
    }

    // is newly selected
    else {
      $scope.allowedUsers.push(user);
    }
  };
	$scope.allowedUsers = [];
	$scope.access = "public";

    $scope.create = function() {
      var board = new Boards({
        title: this.title,
        content: this.content,
		users: $scope.allowedUsers,
		access: $scope.access
      });
      board.$save(function(response) {
        $location.path("boards/" + response._id);
      });

      this.title = "";
      this.content = "";
    };

    $scope.remove = function(board) {
      board.$remove();

      for (var i in $scope.boards) {
        if ($scope.boards[i] == board) {
          $scope.boards.splice(i, 1);
        }
      }
    };

    $scope.update = function() {
      var board = $scope.board;
      board.users = $scope.allowedUsers;
      board.$update(function() {
        $location.path('boards/' + board._id);
      });
    };

    $scope.find = function() {
      Boards.query(function(boards) {
        $scope.boards = boards;
      });
    };

    $scope.findOne = function() {
      Boards.get({
        boardId: $routeParams.boardId
      }, function(board) {
        $scope.board = board;
        $scope.allowedUsers = board.users;
		console.info('load');
		socket.emit('load', board);
      });
    };
  });

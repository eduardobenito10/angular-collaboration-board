'use strict';

angular.module('angularPassportApp')
	.controller('NotesCtrl',function($scope, Notes, UserService, $routeParams, socket, $rootScope) {
		
	$scope.notes = [];
	$scope.notifications = [];
    $scope.messageText;

	Notes.query({
        boardId: $routeParams.boardId
      }, function(notes) {
        $scope.notes = notes;
      });
  
	var promise = UserService.getUsers();
	  promise.then(function(data) {
	  $scope.users = data;
	});

	socket.on('onNoteCreated', function(data) {
		$scope.notes.push(data);
        $scope.notifications.push(data.notification);
	});
	
    socket.on('onNoteUpdated', function(data) {
        $scope.notifications.push(data.notification);
	});

	socket.on('onNoteDeleted', function(data) {
		$scope.handleDeletedNoted(data._id);
	});
    
	socket.on('onMsgReceived', function(data) {
        $scope.notifications.push(data);
	});

	// Outgoing
	$scope.createNote = function(board) {
		var note = {
			text: 'New Note',
			y: '50',
			x: '10',
			author: '',
			complete: false,
			board: board
		};

        note.notification = {text:$rootScope.currentUser.username + ' created a new note'};
		socket.emit('createNote', note);
    }

	$scope.deleteNote = function(_id) {
		$scope.handleDeletedNoted(_id);
		socket.emit('deleteNote', {_id: _id});
	};

	$scope.handleDeletedNoted = function(_id) {
		var oldNotes = $scope.notes,
		newNotes = [];

		angular.forEach(oldNotes, function(note) {
			if(note._id !== _id) newNotes.push(note);
		});

		$scope.notes = newNotes;
	}

	$scope.updateNote = function(note) {
            note.notification = {text:$rootScope.currentUser.username + ' updated a note'};
			socket.emit('updateNote', note);
	};

	$scope.sendMessage = function() {
            var data = {text:$rootScope.currentUser.username + ':' + $scope.messageText};
            console.info(data);
			socket.emit('sendMessage', data);
	};

});

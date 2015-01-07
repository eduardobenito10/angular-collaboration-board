'use strict';

angular.module('angularPassportApp')
	.controller('NotesCtrl',function($scope, Notes, UserService, $routeParams, socket) {
		
	$scope.notes = [];

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
		console.info('onNoteCreated');
		$scope.notes.push(data);
	});

	socket.on('onNoteDeleted', function(data) {
		$scope.handleDeletedNoted(data._id);
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

		console.log(note);
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
			socket.emit('updateNote', note);
	};

});

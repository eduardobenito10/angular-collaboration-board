'use strict';

angular.module('angularPassportApp')
	.controller('stickyController',function($scope, Author, socket) {
		
	$scope.notes = [];
	
	// Incoming
	socket.on('init', function(data) {
		console.info('oninit');
		console.info(data);
		$scope.notes = data;
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
			board: board._id
		};

		socket.emit('createNote', note);
    }

	$scope.deleteNote = function(_id) {
		console.info('delete Note');
		$scope.handleDeletedNoted(_id);

				//$scope.ondelete({
				//	_id: _id
				//});
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
			$scope.authors = Author.authors;

			socket.on('onNoteUpdated', function(data) {
				// Update if the same note
				if($scope.note != undefined && data._id == $scope.note._id) {
					$scope.note.text = data.text;
					$scope.note.author = data.author;
				}				
			});

			// Outgoing
			$scope.updateNote = function(note) {
				socket.emit('updateNote', note);
			};
	
			$scope.updateAuthor = function(note, author) {
				socket.emit('updateNote', note);
			};

			/*$scope.deleteNote = function(_id) {
				$scope.ondelete({
					_id: _id
				});
			};*/

		})
.directive('stickyNote', function(socket, Author) {
	var linker = function(scope, element, attrs) {
			element.draggable({
				stop: function(event, ui) {
					socket.emit('moveNote', {
						_id: scope.note._id,
						x: ui.position.left,
						y: ui.position.top
					});
				}
			});

			socket.on('onNoteMoved', function(data) {
				// Update if the same note
				if(data._id == scope.note._id) {
					element.animate({
						left: data.x,
						top: data.y
					});
				}
			});

			// Some DOM initiation to make it nice
			element.css('left', '10px');
			element.css('top', '50px');
			element.hide().fadeIn();
			
		};


	return {
		restrict: 'A',
		link: linker,
		controller: 'stickyController',
		scope: {
			note: '=',
			ondelete: '&'
		}
	};
})

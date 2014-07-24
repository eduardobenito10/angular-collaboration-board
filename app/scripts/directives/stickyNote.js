'use strict';

angular.module('angularPassportApp')
.directive('stickyNote', function(socket) {
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
		scope: {
			note: '=',
			ondelete: '&',
			board: '='
		}
	};
})

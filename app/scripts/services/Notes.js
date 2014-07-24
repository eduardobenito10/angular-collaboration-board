'use strict';

angular.module('angularPassportApp')
  .factory('Notes', function ($resource) {
    return $resource('api/notes/:boardId', {
      boardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });

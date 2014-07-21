'use strict';

angular.module('angularPassportApp')
  .factory('Boards', function ($resource) {
    return $resource('api/boards/:boardId', {
      boardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });

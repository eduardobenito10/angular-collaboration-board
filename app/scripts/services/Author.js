'use strict';

angular.module('angularPassportApp')
 .service( 'Author', [ '$rootScope', function( $rootScope ) {
  var service = {
    authors: [
		{"id":1,"name":"edu"},
		{"id":2,"name":"pepe"},
		{"id":3,"name":"pablo"}
    ],

    addAuthor: function ( author ) {
      service.authors.push( author );
      $rootScope.$broadcast( 'authors.update' );
    }
  }

  return service;
}]);

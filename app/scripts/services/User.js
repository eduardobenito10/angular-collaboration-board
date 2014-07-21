'use strict';

angular.module('angularPassportApp')
  .factory('User', function ($resource) {
    return $resource('/auth/users/:id/', {},
      {
        'update': {
          method:'PUT'
        }
      });
  })
  .service('UserService', [ '$rootScope','$http','$q', function( $rootScope, $http, $q ) {
    return{
      getUsers : function(){
        var deferred = $q.defer();
        $http.get('/api/users').success(function(data, status) {
            // Some extra manipulation on data if you want...
            deferred.resolve(data);
        }).error(function(data, status) {
            deferred.reject(data);
        });

        return deferred.promise;
      }
    }
  }
]);

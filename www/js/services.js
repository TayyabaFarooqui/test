/**
 * Created by Tayyaba Farooqui on 4/8/2016.
 */
angular.module('starter.services', [])

  .factory('BlankFactory', [function(){

  }])
  .service('LoginService', function($q,$http) {
    return {
      loginUser: function(name, pw) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var user,password;
        console.log(name);console.log(pw);
        $http.get("/admin/login").success(function (response) {
          console.log(response[0].USERNAME);console.log(response[0].PASSWORD);
          user = response[0].USERNAME;
          password=response[0].PASSWORD;
        });
        if(name == user)
        {
          console.log('user is correct');
        }
        if (name == user && pw == password) {
          deferred.resolve('Welcome ' + name + '!');
        } else {
          deferred.reject('Wrong credentials.');
        }
        promise.success = function(fn) {
          promise.then(fn);
          return promise;
        }
        promise.error = function(fn) {
          promise.then(null, fn);
          return promise;
        }
        return promise;
      }
    }
  })

  .service('BlankService', [function(){

  }]);



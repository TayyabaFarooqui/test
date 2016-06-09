
var refresh;
var url;
var extension;
var filename;
var rurl;
angular.module('starter.controllers', [])
  .controller('mainPageCtrl', function($scope,StorageService) {
    refresh=function() {
      $scope.tasks = StorageService.getAll();
      //$http.get("/admin").success(function (response) {
      //  console.log("I got the data i requested");
      //  $scope.tasks = response;
      //});
    };

    refresh();

    $scope.remove=function(task)
    {

      StorageService.remove(task);
    }
  })
  .controller('loginCtrl2', function($scope, LoginService, $ionicPopup, $state,$http) {
    $scope.data = {};
    var user,password;
    //console.log(name);console.log(pw);
    $http.get(base_url+"/admin/login").success(function (response) {

      // console.log(response[0].USERNAME);console.log(response[0].PASSWORD);
      user = response[0].USERNAME;
      password=response[0].PASSWORD;
    });

    $scope.login = function() {
      if($scope.data.username == user && $scope.data.password == password)
        $state.go('Notifications');
      else
      {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      }

    }

  })


  .controller('view2Ctrl', function($scope,$http, $timeout, $stateParams) {

  // console.log($stateParams.id + "is the id")
  // $http.get('/admin/' + $stateParams.id).success(function(response) {
  //   $scope.v=response[0];
  //})
  $scope.v={};
  console.log($stateParams.sender  + " is the sender")
  $scope.v.SENDER=$stateParams.sender;
  $scope.v.RECIEVER=$stateParams.reciever;
  $scope.v.NOTICE=$stateParams.notice;
  // $scope.v=StorageService.get($stateParams.t);



  //                $timeout(function() {
  //                  // anything you want can go here and will safely be run on the next digest.
  //                  $scope.$apply();
  //                })



})

  .controller('newMessageCtrl',  function($state,$scope,$http,StorageService,ImageUploadFactory,$cordovaCamera) {
    $scope.collection = {
      selectedfile : ''
    };
   $scope.myVar=true;

    $scope.attachFile = function()
    {

      window.plugins.mfilechooser.open([], function (uri) {
        //Here uri provides the selected file path.
        console.log('file path', uri);
        alert(uri);
        url=uri;
        extension =uri.split(".").pop().toString();
        filename= uri.split("/").pop();
        $scope.collection.selectedfile = filename;
        $scope.myVar=false;

        $state.go('NewAnnouncement');

      }, function (error) {
        console.log('Error', error);
        alert(error);
      });
    //{ var path2;
    //  var path;

//      fileChooser.open(function(uri) {
//        url=uri;
//        $scope.collection.selectedfile = uri.split("/").pop();
//        alert(uri);
//
//        //filepath
//        var uripath = uri;
//
//        window.FilePath.resolveNativePath(uripath, successNative, failNative);
//
//        function failNative(e) {
//          console.error('Houston, we have a big problem :(');
//        }
//
//        function successNative(finalPath) {
//          path = 'file://'+ finalPath;
//           path2=finalPath;
//          alert('path '+path2);
//          // callbackContext.success("file://" + filePath);
//          console.log('path '+path2);
//
//          window.resolveLocalFileSystemURL(path, success, fail);
//
//          function fail(e) {
//            console.error(e);
//          }
//
//          function success(fileEntry) {
//            fileEntry.file(function(file) {
//              var reader = new FileReader();
//              reader.onloadend = function(e) {
//                var content = this.result;
//                console.log(content);
//                //alert(content);
//              };
//
//              reader.readAsText(file); // Finally !
//
//            });
//
//          }
//        }
//
//
//        //filepath
//
//
//
//      }

//      );

    };
    $scope.nmsg={};
    $scope.newmsg = function () {
      //getting cloudinary url
      if ($scope.myVar == false)
      {
        ImageUploadFactory.uploadImage(url).then(
          function (result) {
            alert('return from imageuploadfactory');

            var url = result.secure_url || '';
            rurl = url;
            alert('url is' + url);
            var urlSmall;
            if($scope.nmsg.RECIEVER.toString() == 'All')
            {
              console.log('in all for url');
              $http.get(base_url + "/gettokens/" + $scope.nmsg.SENDER + '/' + $scope.nmsg.NOTICE + '?RECIEVER=' + 'Students' + '&URL=' + rurl + '&FILE=' + filename).success(function (response) {
                console.log('success for student in url');

                //  $http.get("http://192.168.1.105:3000/push/"+$scope.nmsg.SENDER+'/'+$scope.nmsg.NOTICE).success(function (response) {



                StorageService.add($scope.nmsg);
                //$state.go('Notifications');
              });
              $http.get(base_url + "/gettokens/" + $scope.nmsg.SENDER + '/' + $scope.nmsg.NOTICE + '?RECIEVER=' + 'Faculty' + '&URL=' + rurl + '&FILE=' + filename).success(function (response) {
                console.log('success for faculty in url')
                $state.go('Notifications');

                //  $http.get("http://192.168.1.105:3000/push/"+$scope.nmsg.SENDER+'/'+$scope.nmsg.NOTICE).success(function (response) {

              });

            }
            else {
              console.log('in else');
              $http.get(base_url + "/gettokens/" + $scope.nmsg.SENDER + '/' + $scope.nmsg.NOTICE + '?RECIEVER=' + $scope.nmsg.RECIEVER + '&URL=' + rurl + '&FILE=' + filename).success(function (response) {
                console.log('success in else');

                //  $http.get("http://192.168.1.105:3000/push/"+$scope.nmsg.SENDER+'/'+$scope.nmsg.NOTICE).success(function (response) {
                console.log($scope.nmsg);
                console.log($scope.nmsg.NOTICE);


                StorageService.add($scope.nmsg);
                $state.go('Notifications');
              });
            }

            //if(result && result.eager[0]) urlSmall = result.eager[0].secure_url || '';

            // Do something with the results here.

            //   $cordovaCamera.cleanup();

          },
          function (err) {
            alert('fail');
            // Do something with the error here
            // $cordovaCamera.cleanup();

          }
        );
    }
//getting cloudinary url

      else
      {
        if($scope.nmsg.RECIEVER.toString() == 'All')
        {
          console.log('in all without url');
          $http.get(base_url + "/gettokens/" + $scope.nmsg.SENDER + '/' + $scope.nmsg.NOTICE + '?RECIEVER=' + 'Students' + '&URL=' + rurl + '&FILE=' + filename).success(function (response) {
            console.log('success for student without url');

            //  $http.get("http://192.168.1.105:3000/push/"+$scope.nmsg.SENDER+'/'+$scope.nmsg.NOTICE).success(function (response) {



            StorageService.add($scope.nmsg);
            //$state.go('Notifications');
          });
          $http.get(base_url + "/gettokens/" + $scope.nmsg.SENDER + '/' + $scope.nmsg.NOTICE + '?RECIEVER=' + 'Faculty' + '&URL=' + rurl + '&FILE=' + filename).success(function (response) {
            console.log('success for faculty without url');
            $state.go('Notifications');

            //  $http.get("http://192.168.1.105:3000/push/"+$scope.nmsg.SENDER+'/'+$scope.nmsg.NOTICE).success(function (response) {

          });

        }
        else {
          console.log('anokha else without url');
          $http.get(base_url + "/gettokens/" + $scope.nmsg.SENDER + '/' + $scope.nmsg.NOTICE + '?RECIEVER=' + $scope.nmsg.RECIEVER + '&URL=' + rurl + '&FILE=' + filename).success(function (response) {
            console.log('success for anokha else');

            //  $http.get("http://192.168.1.105:3000/push/"+$scope.nmsg.SENDER+'/'+$scope.nmsg.NOTICE).success(function (response) {
            //console.log($scope.nmsg);
            //console.log($scope.nmsg.NOTICE);


            StorageService.add($scope.nmsg);
            $state.go('Notifications');
          });
        }

      }


      //$http.get("http://192.168.1.105:3000/gettokens/"+$scope.nmsg.SENDER+'/'+$scope.nmsg.NOTICE+'?RECIEVER=' + $scope.nmsg.RECIEVER+'&URL='+rurl +'&FILE='+filename).success(function (response) {
      //  console.log('success');
      //
      //    //  $http.get("http://192.168.1.105:3000/push/"+$scope.nmsg.SENDER+'/'+$scope.nmsg.NOTICE).success(function (response) {
      //      console.log($scope.nmsg);
      //      console.log($scope.nmsg.NOTICE);
      //
      //
      //     StorageService.add($scope.nmsg);
      //  $state.go('Notifications');
      //    });
     // });

      //$http.post('http://192.168.1.105:3000/admin',JSON.stringify($scope.nmsg)).success(function(response)
      //{
      //  $http.get("http://192.168.1.105:3000/push/"+$scope.nmsg.SENDER+'/'+$scope.nmsg.NOTICE).success(function (response) {
      //    console.log($scope.nmsg);
      //    console.log($scope.nmsg.NOTICE);
      //
      //
      //    StorageService.add($scope.nmsg);
      //  });
      //
      //});
    };
  })

  .controller('EventsCtrl', function($scope,$http, $timeout, $stateParams,StorageService) {
    $scope.events = StorageService.getAllevents();

    $scope.remove=function(event)
    {
      console.log("in remove controller +"+ event.title);
      StorageService.removeEvent(event);
    }

  })

  .controller('EventDetailsCtrl', function($scope,$http, $timeout, $stateParams) {
    $scope.e={};
    $scope.e.title=$stateParams.title;
    $scope.e.desc=$stateParams.desc;
  })

  .controller('NewEventCtrl', function($scope,$http, $timeout, $stateParams,StorageService,$state) {

    $scope.event={};
    $scope.create=function()
    {
      console.log('event title'+ $scope.event.title);
      console.log('event desc'+ $scope.event.desc);

      $http.post(base_url +'/postevents',$scope.event).success(function(response)
      {
        console.log('success');


         StorageService.addevent($scope.event);
        $state.go('Events');
      });

    }

  })

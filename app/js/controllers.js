'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', function($scope) {

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }])
  .controller("4SQ_Search", ['$scope', '$http', '$location', function($scope, $http, $location) {
  	$scope.searchResponse;
  	$scope.recentCheckins = null;
  	$scope.user = null;
  	$scope.venueDetails = null;
  	$scope.venueDetailsId = null;

  	$scope.queryString;
  	$scope.nearbyLocation = "Sarajevo";

  	$scope.CLIENT_ID = "YH5E510G0YPIEFFA2ZEQWGN0SGI2WKI54QTUXZZDP1A331EY";
  	$scope.CLIENT_SECRET = "W54BBZWVYDUTYT0FC0NMKMNXTX3HT5B4THDWZZFDFT25AA4Y";
  	$scope.REDIRECT_URL = "http://localhost:8000/app/index.html"
 
	$scope.getToken = function() {
    	var $path = $location.path();
    	var $access_token_index = $path.search("/access_token") + "/access_token=".length;
    	return $path.substr($access_token_index, 48);
    };

    $scope.search = function() {
        $http(
	   	{
        	method: 'GET',
        	url: 'https://api.foursquare.com/v2/venues/search',
        	params: {
       			client_id: $scope.CLIENT_ID,
       			client_secret: $scope.CLIENT_SECRET,
				v: 20130815,
				near: $scope.nearbyLocation,
				query: $scope.queryString
        	},
      	}).
      	success(function(data, status, headers, config) {
      		$scope.searchResponse = data.response;
        	// this callback will be called asynchronously
        	// when the response is available
      	}).	
      	error(function(data, status, headers, config) {
        	// called asynchronously if an error occurs
        	// or server returns response with an error status.
      	});	
    };

   	$scope.userInfo = function() {
        $http(
	   	{
        	method: 'GET',
        	url: 'https://api.foursquare.com/v2/users/self',
        	params: {
       			client_id: $scope.CLIENT_ID,
       			client_secret: $scope.CLIENT_SECRET,
				v: 20130815,
				oauth_token: $scope.getToken()
        	},
      	}).
      	success(function(data, status, headers, config) {
      		$scope.user = data.response.user;
        	// this callback will be called asynchronously
        	// when the response is available
      	}).	
      	error(function(data, status, headers, config) {
      		$scope.user = null;
        	// called asynchronously if an error occurs
        	// or server returns response with an error status.
      	});	
    };

   	$scope.recentCheckin = function() {
        $http(
	   	{
        	method: 'GET',
        	url: 'https://api.foursquare.com/v2/checkins/recent',
        	params: {
       			client_id: $scope.CLIENT_ID,
       			client_secret: $scope.CLIENT_SECRET,
				v: 20130815,
				oauth_token: $scope.getToken()
        	},
      	}).
      	success(function(data, status, headers, config) {
      		$scope.recentCheckins = data.response.recent;
        	// this callback will be called asynchronously
        	// when the response is available
      	}).	
      	error(function(data, status, headers, config) {
      		console.log("Failure");
      		$scope.recentCheckins = data;
        	// called asynchronously if an error occurs
        	// or server returns response with an error status.
      	});	
    };

    $scope.checkin = function(venueId) {
        $http(
	   	{
        	method: 'POST',
        	url: 'https://api.foursquare.com/v2/checkins/add',
        	params: {
       			client_id: $scope.CLIENT_ID,
       			client_secret: $scope.CLIENT_SECRET,
				v: 20130815,
				venueId: venueId,
				oauth_token: $scope.getToken()
        	},
      	}).
      	success(function(data, status, headers, config) {
      		console.log("Success: " + data);
        	// this callback will be called asynchronously
        	// when the response is available
      	}).	
      	error(function(data, status, headers, config) {
      		console.log("Failure");
      		window.alert("Cannot CheckIn !!!")
        	// called asynchronously if an error occurs
        	// or server returns response with an error status.
      	});	

      	$scope.userInfo();
    };

    $scope.authenticate = function() {
  		window.location.href = 
  		"https://foursquare.com/oauth2/authenticate?client_id=" + $scope.CLIENT_ID + 
  		"&response_type=token" + 
  		"&redirect_uri=" + $scope.REDIRECT_URL;
    }

    $scope.isLoggedIn = function() {
    	return($scope.user != null);
    }

    $scope.expandVenue = function(venueId) {
        $http(
	   	{
        	method: 'GET',
        	url: 'https://api.foursquare.com/v2/venues/' + venueId,
        	params: {
       			client_id: $scope.CLIENT_ID,
       			client_secret: $scope.CLIENT_SECRET,
				v: 20130815
        	},
      	}).
      	success(function(data, status, headers, config) {
      		$scope.venueDetails = data.response.venue;
      		$scope.venueDetailsId = venueId;
        	// this callback will be called asynchronously
        	// when the response is available
      	}).	
      	error(function(data, status, headers, config) {
      		console.log("Failure");
        	// called asynchronously if an error occurs
        	// or server returns response with an error status.
      	});	
    }

    $scope.showDetails = function(venueId) {
    	return(venueId == $scope.venueDetailsId);
    }

    $scope.userInfo();
    //$scope.recentCheckin();

  }]);
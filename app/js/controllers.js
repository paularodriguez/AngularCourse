'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('LandingPageController', [function() {
	
  }])
.controller('WaitlistController', ['$scope', 'partyService', 'textMessageService', function($scope, partyService, textMessageService) {
	//Bind firebase parties to $scope
	$scope.parties = partyService.parties;
	
	//Object to store data from the waitlist form
	$scope.newParty = {name: '', phone: '', size: '', done: false, notified: 'No'};
	
	//Function to save a new party to the waitlist
	$scope.saveParty = function(){
		partyService.saveParty($scope.newParty);
		$scope.newParty = {name: '', phone: '', size: '', done: false, notified: 'No'};
	};
	//Function to send a text message to a party
	$scope.sendTextMessage = function(party){
		textMessageService.sendTextMessage(party);
	};
  }])
.controller('AuthController', ['$scope', 'authService', function($scope, authService){
	
	$scope.user = {email: '', password: ''};
	$scope.authService = authService;
	

	//Method to register a new user using AuthService.
	$scope.register = function(){
		authService.register($scope.user);
	};

	//Log in a user using the authService.
	$scope.login = function(){
		authService.login($scope.user);	
	};

	//Log out a user using the authService.
	$scope.logout = function(){
		authService.logout();
	};
}]);
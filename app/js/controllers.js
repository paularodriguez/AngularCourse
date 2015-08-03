'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('LandingPageController', [function() {
	
  }])
.controller('WaitlistController', ['$scope', '$firebase', 'FIREBASE_URL', function($scope, $firebase, FIREBASE_URL) {
	var partiesRef = new Firebase(FIREBASE_URL + 'parties');

	$scope.parties = $firebase(partiesRef);
	$scope.party = {name: '', phone: '', size: '', done: false, notified: 'No'};
	//Function to save a new party to the waitlist
	$scope.saveParty = function(){
		$scope.parties.$add($scope.newParty);
		$scope.newParty = {name: '', phone: '', size: '', done:false, notified: 'No'};
	};
	//Function to send a text message to a party
	$scope.sendTextMessage = function(party){
		var textMessageRef = new Firebase(FIREBASE_URL + 'textMessages');
		var textMessages = $firebase(textMessageRef);
		var newTextMessage = {
			phoneNumber: party.phone,
			size : party.size,
			name: party.name
		}
		textMessages.$add(newTextMessage);
		party.notified = 'Yes';
		$scope.parties.$save(party.$id);
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
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
.value('FIREBASE_URL', 'https://waitandeat-paula.firebaseio.com/')
//This factory is used to refactor the code to create a firebase. Then, this 
//service is injected to the other services
.factory('dataService', function($firebase, FIREBASE_URL){
	var dataRef = new Firebase(FIREBASE_URL);
	var fireData = $firebase(dataRef);

	return fireData;
})
.factory('partyService', function(dataService){
	var users = dataService.$child('users');

	var partyServiceObject = { 
		saveParty: function(party, userId){
			users.$child(userId).$child('parties').$add(party);
		}, 
		getPartiesByUserId: function(userId){
			return users.$child(userId).$child('parties');
		}
	};
	return partyServiceObject;
})
.factory('textMessageService', function(dataService, partyService){
	//Before
	//var textMessageRef = new Firebase(FIREBASE_URL + 'textMessages');
	//var textMessages = $firebase(textMessageRef);
	
	//After refactoring with dataService
	var textMessages = dataService.$child('textMessages');

	var textMessageServiceObject = {
		sendTextMessage : function(party, userId){
			var newTextMessage = {
				phoneNumber: party.phone,
				size : party.size,
				name: party.name
			};
			textMessages.$add(newTextMessage);
			partyService.getPartiesByUserId(userId).$child(party.$id).$update({notified:'Yes'});
		}
	};
	return textMessageServiceObject;
})
.factory('authService', function($firebaseSimpleLogin, $location, $rootScope, FIREBASE_URL){
	var authRef = new Firebase(FIREBASE_URL);
	var auth = $firebaseSimpleLogin(authRef);
	var authServiceObject =  {
		register: function(user){
			auth.$createUser(user.email, user.password).then(function(data){
				console.log(data);
				authServiceObject.login(user);
			});
		},
		login: function(user){
			auth.$login('password', user).then(function(data){
			console.log(data);
			$location.path('/waitlist');
		});
		},
		logout:function(){
			auth.$logout();
			$location.path('/');
		}, 
		getCurrentUser: function(){
			return auth.$getCurrentUser();
		}
	};

	$rootScope.$on("$firebaseSimpleLogin:login", function(e, user){
		//Here we have to save currentUser on our rootScope.
		$rootScope.currentUser = user;
	});

	$rootScope.$on("$firebaseSimpleLogin:logout", function(){
		//Here we have to delete the currentUser.
		$rootScope.currentUser = null;
	});
	return authServiceObject;
});
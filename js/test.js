/*
 * Test Object
 */
var TestEU = {
	isTesting: false,
	"testLoadAllUserData": function() {
		requestUserProfile();
		requestUserCircles();

		setTimeout(function() {
			console.log(getUserProfile());
			console.log(getUserCircles());
			console.log(getCourses());
		}, 1000);
	},
	"testStartPrepagoCounter": function() {
		// Prepago Session
		var hours = Math.floor((Math.random() * 24) + 1);
		var minutes = Math.floor((Math.random() * 60) + 1);
		var seconds = Math.floor((Math.random() * 60) + 1);

		objUserTimerData = {
			"data": {
				"durationOfSession": 5,
				"kindOfSession": "Prepago",
				"startOfSession": "2014-02-27 " 
					+ hours + ":"
					+ minutes + ":"
					+ seconds
			}
		}

		if (!isAdministrator && objUserTimerData.data && objUserTimerData.data.durationOfSession) {
			activateCounter();
		} else {
			objUserTimerData = null;
		}

		this.isTesting = true;
		this.testTimerServices();
	},
	"testStartPospagoCounter": function() {
		// Pospago Session

		var hours = Math.floor((Math.random() * 24) + 1);
		var minutes = Math.floor((Math.random() * 60) + 1);
		var seconds = Math.floor((Math.random() * 60) + 1);
		
		objUserTimerData = {
			"data": {
				"durationOfSession": 1,
				"kindOfSession": "Pospago",
				"startOfSession": "2014-02-27 " 
					+ hours + ":"
					+ minutes + ":"
					+ seconds
			}
		}

		/*
		if (!isAdministrator && objUserTimerData.data && objUserTimerData.data.durationOfSession) {
			activateCounter();
		} else {
			objUserTimerData = null;
		} */

		this.isTesting = true;
		this.testTimerServices();
	},
	"testTimerServices": function() {
		listTimerServices = []

		for (var i = 0; i < 20; i++) {
			listTimerServices.push({
				"nombre": "Service " + i, 
				"url": "http://www.google.com"
			});
		}

		objTimerGetServices = {
			"data": {
				"servicios": listTimerServices,
				"id_beneficiario": "10",
				"municipio": null,
				"fecha_inicio_operacion": "2012-12-12",
				"sede": null,
				"institution": null,
				"departamento": null,
				"vereda": null
			}
		}

		// Login on LMS
		LearningServices.request.requestLoginToLMS();
		// Inscribe user to group with data.id_beneficiario
		LearningServices.request.requestInscribeUserToGroup();

		console.log('Inscribe to group');

		// Load timer services
		loadTimerServices();
	}
}
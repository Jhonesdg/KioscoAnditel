
// Objects
var LogUser = LogUser || {};
var TimerServices = TimerServices || {};
var GoogleServices = GoogleServices || {};
var SystemServices = SystemServices || {};
var ExternalServices = ExternalServices || {};
var LearningServices = LearningServices || {};


var kindOfSession = null;
var lastLog = null;

// Variables
var ALERT_TIME = 10 * 60 * 1000; // 10 Minutes
var TIMES_TO_WAIT_UNTIL_LOGIN = 5;


var currentService = null;
var currentIpAddress = null;
var sessionStatus = 'open';


var doTimerRequest = false;
var dateBeforeTimer = null;

var googleLoginUrl = null;
var countPermissionsMessages = 0;

var isPrepago = false;
var isOfflineUser = false;
var lastStartOfSession = null;

var listenAlerts = true;
var isMinimized = false;
var startCounter = false;
var isAdministrator = false;
var startOfflineCounter = false;

var userAge = 0;
var continueRequest = true;
var continueLoginStatus = true;
var continueUserDataRequest = true;
var showEditProfileCancelButton = true;
var continueCommunityDataRequest = true;
var loadDesktopOnce = true;
var enableNoConnectionPermission = false;

var isCloseSessionMessage = true;

var lastAlert = null;
var sessionType = null;
var intervalListener = null;
var intervalCheckStatus = null;
var intervalCountListener = null;
var intervalGoogleAccount = null;


var timesLoginMessage = 0;

var dictServices = {};

var listServicesWithoutCost = [
	'Gobierno en linea',
	'Internet educativo',
	'Internet seguro'
]

var listNewWindowServices = [
    'Documentos en linea'
]

var listOmittedServices = [
	'Escaner',
	'Impresiones',
	'Fotocopias',
	'Uso del PC',
	'Uso del PC offline',
	'Llamadas telefonicas local, nacional y todo operador celular',
	'Navegar por internet',
	'Gobierno en linea',
	'Correo electronico',
	'Documentos en linea',
	'Portal de noticias',
	'Lectura de noticias',
]

var listImages = [];
var listServices = [];

var dictSituation = {};
var dictUsedServices = {};

var objAlert = null;
var objCourses = null;
var objListAwards = null;
var objUserProfile = null;
var objUserCircles = null;
var objNewsDocument = null;
var objBlogDocument = null;
var objProfileFields = null;
var objTimerServices = null;
var objUserTimerData = null;
var objUserDriveData = null;
var objUserActivities = null;
var objLMSUserProfile = null;
var objTimerSaveRating = null;
var objTimerGetServices = null;
var objRecurrentRequest = null;
var objTimerCreateService = null;
var objUserTimerParameters = null;

var objUserEditProfile = {
	'gender': null,
	'sector': null,
	'document': null,
	'last_name': null,
	'ubication': null,
	'situation': null,
	'birthdate': null,
	'first_name': null,
	'mobile_phone': null,
	'document_type': null,
	'ocupation_info': null,
	'ethnical_group': null,
	'educational_level': null,
	'socioeconomic_status': null,
};

/*
 * *** Getters ***
 */

function getCourses() {
	return objCourses;
}

function getUserProfile() {
	return objUserProfile;
}

function getUserCircles() {
	return objUserCircles;
}

function getNewsDocument() {
	return objNewsDocument;
}

function getBlogDocument() {
	return objBlogDocument;
}

function getUserDriveData() {
	return objUserDriveData;
}

function getProfileFields() {
	return objProfileFields;
}

function getTimerServices() {
	return objTimerServices;
}

function getUserTimerData() {
	return objUserTimerData;
}

function getUserListAwards() {
	return objListAwards;
}

function getLMSUserProfile() {
	return objLMSUserProfile;
}

function getUserActivities() {
	return objUserActivities;
}

function getUserEditProfile() {
	return objUserEditProfile;
}

function getTimerSaveRating() {
	return objTimerSaveRating;
}

function getTimerGetServices() {
	return objTimerGetServices;
}

function getDictUsedServices() {
	return getDictUsedServices;
}

function getTimerCreateService() {
	return objTimerCreateService;
}

function getUserTimerParameters() {
	return objUserTimerParameters;
}

/*
 * *** End Getters ***
 */



/*
 * *** Requests for get user data ***
 */

function requestUserDriveData() {
	var requestComplete = null;
	var method = "GET"
	var url = properties.getProfileDataUrl("google_drive_data");
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.onload = function(e) {
		var txtUserData = "";
		
		try {
			txtUserData = xhr.responseText;
			txtUserData = txtUserData.split("value:")[1];
			txtUserData = txtUserData.replace(/\\/g, "");
			txtUserData = txtUserData.replace(/\"\"/g, "\"");
			objUserDriveData = JSON.parse(txtUserData);
		} catch(e) { }
	};
	xhr.send();
}

function requestXAPI(func, serviceLink, serviceTitle) {
	var url = properties.LMS + 'api/convert/?func=' + func

	if(serviceLink && serviceTitle) {
		url += '&service_link=' + serviceLink;
		url += '&service_title=' + serviceTitle;
	}
	

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.onload = function() {
		console.log(xhr.responseText);
	}
	xhr.send();
}


function requestXAPIPoll(func, comment) {
	var url = properties.LMS + 'api/convert/?func=' + func

	if(comment) {
		url += '&comment=' + comment;
	}
	

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.onload = function() {
		console.log(xhr.responseText);
	}
	xhr.send();
}


function requestUserDriveData() {
	var requestComplete = null;
	var method = "GET"
	var url = properties.getProfileDataUrl("google_drive_data");
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.onload = function(e) {
		var txtUserData = "";
		
		try {
			txtUserData = xhr.responseText;
			txtUserData = txtUserData.split("value:")[1];
			txtUserData = txtUserData.replace(/\\/g, "");
			txtUserData = txtUserData.replace(/\"\"/g, "\"");
			objUserDriveData = JSON.parse(txtUserData);
		} catch(e) { }
	};
	xhr.send();
}

function requestUserActivities() {
	var requestComplete = null;
	var method = "GET"
	var url = properties.getProfileDataUrl("google_plus_activities_data");
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.onload = function(e) {
		var txtUserData = xhr.responseText;
		try {
			txtUserData = txtUserData
				.split("value:")[1]
				.replace(/({)([a-zA-Z0-9]+)(:)/,'$1"$2"$3"');
			objUserActivities = JSON.parse(txtUserData);
		} catch(e) {
			if (txtUserData && txtUserData != "None") {
				objUserActivities = {"result": "Error parsing data"};
			}
		}
	};

	if (!getUserActivities()) {
		xhr.send();
	}
	
}

/*
function requestUserProfile() {
	var requestComplete = null;
	var method = "GET"
	var url = properties.getProfileDataUrl("google_plus_profile_data");
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.onload = function(e) {
		var txtUserData = "";
		txtUserData = xhr.responseText;

		try {
			txtUserData = txtUserData.split("value:")[1];
			txtUserData = txtUserData.replace(/\\/g, "");
			txtUserData = txtUserData.replace(/\"\"/g, "\"");
			objUserProfile = JSON.parse(txtUserData);

			requestLMS();
			requestUserTimerParameters();
		} catch(e) { }
	};

	if (!getUserProfile()) {
		xhr.send();
	}
}
*/

/*
function requestUserCircles(callbackFunction) {
	var requestComplete = null;
	var method = "GET"
	var url = properties.getProfileDataUrl("google_plus_circles_data");
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.onload = function(e) {
		var txtUserData = "";
		try {
			txtUserData = xhr.responseText;
			txtUserData = txtUserData.split("value:")[1];
			txtUserData = txtUserData.replace(/\\/g, "");
			txtUserData = txtUserData.replace(/\"\"/g, "\"");
			txtUserData = txtUserData.replace(/\\\""/g, "");
			txtUserData = txtUserData.replace(/:\",/g, ":\"\",");
			objUserCircles = JSON.parse(txtUserData);

			if(callbackFunction) {
				callbackFunction();
			}
				
		} catch(e) { 
			if (txtUserData && txtUserData != "None") {
				objUserCircles = {"result": "Error parsing data"}
			}
		}
	};

	if (!getUserCircles()) {
		xhr.send();
	}
}
*/

function requestUserListAwards() {
	var requestComplete = null;
	var method = "GET";

	var url = properties.getLMSListAwardsUrl();
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.onload = function(e) {
		try {
			var txtUserData = xhr.responseText;
			objListAwards = JSON.parse(txtUserData);
		} catch(e) { }
	};

	if (!getUserListAwards()) {
		xhr.send();
	}
}

function requestUserSaveProfileData(callback) {
	var requestComplete = null;
	var method = "GET";

	var url = properties.getUserSaveProfileDataUrl() 
		+ "?"
		+ "profileObject="
		+ JSON.stringify(getUserEditProfile());

	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.onload = function(e) {
		try {
			var txtResponse = xhr.responseText;
			var objResponse = JSON.parse(txtResponse);

			console.log(objResponse);
			objUserTimerData = null;
			objUserTimerParameters = null;

			setUserTimerData(objUserEditProfile);
			//requestUserTimerParameters();
		} catch (e) {
			console.log(e);
		}
	};
	xhr.send();
}

function logoutUserLMS(callback) {
	var requestComplete = null;
	var method = "GET";

	var url = properties.getLMSUserLogoutUrl() 

	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.onload = function(e) {
		try {
			var txtResponse = xhr.responseText;
			var objResponse = JSON.parse(txtResponse);
			console.log(objResponse);
		} catch (e) {
			console.log(e);
		}
	};
	xhr.send();
}

function parseTimerParameters() {
	var estrato = 0;
	var listSituation = [];
	
	if (objUserTimerParameters["situacion_particular"]) {
		listSituation = objUserTimerParameters["situacion_particular"].split(',');
	}

	if (objUserTimerParameters["estrato"]) {
		estrato = objUserTimerParameters["estrato"].split(' ')[1];
		estrato = parseInt(estrato);
	}

	objUserTimerParameters["situacion_particular"] = listSituation;
	objUserTimerParameters["estrato"] = estrato;
}

/*
 * List of all kiosko services:
 * 
 * "Navegar por internet"
 * "Impresiones"
 * "Fotocopias"
 * "Escaner"
 * "Llamadas telefonicas local, nacional y todo operador celular"
 * "Videocoferencia"
 * "Internet educativo"
 * "Portal de noticias"
 * "Lectura de noticias"
 */
function requestTimerCreateService(serviceName, amount) {
	var username = ""
    var profileUser = objUserProfile.username; //getUsername(getUserProfile());

    if (profileUser) {
        username = profileUser;     
    } else {
        username = 'offlineuser';
    }
    
    var data = "service=UnifiedDesktop"
		+ "&"
		+ "method=registerSessionServices"
		+ "&"
		+ "serviceKey=p0sM4rTKv9"
		+ "&"
		+ "session_data={"
			+ "\"username\": \"" + username + "\","
		 	+ "\"service\":\"" + serviceName + "\","
		 	+ "\"amount\":"+ amount + ","
		 	+ "\"type\":\"Servicio\""
		+ "}";
	
	var requestComplete = null;
	var method = "GET"
 
	var url = properties.getTimerDataUrl() + "?" + data;
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.onload = function(e) {
		try {
			var txtUserData = xhr.responseText;
			objTimerCreateService = JSON.parse(txtUserData);
		} catch(e) { }
	};
 
	if (!getTimerCreateService()) {
		xhr.send();
	}
}

function requestSaveRating(rating) {
	var data = "service=UnifiedDesktop"
		+ "&"
		+ "method=saveRating"
		+ "&"
		+ "serviceKey=p0sM4rTKv9"
		+ "&"
		+ "score=" + rating
		+ "&"
		+ "username=" + objUserProfile.username //getUsername(getUserProfile())
		+ "&"
		+ "callback=jsonpCallback"
	
	var requestComplete = null;
	var method = "GET"
 
	var url = properties.getTimerDataUrl() + "?" + data;
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.onload = function(e) {
		try {
			var txtUserData = xhr.responseText;
			objTimerSaveRating = JSON.parse(txtUserData);
		} catch(e) { }
	};
 
	if (!getTimerSaveRating()) {
		xhr.send();
	}
}

function requestTimerGetServices() {
	var data = "service=UnifiedDesktop"
		+ "&"
		+ "method=getDataKVD"
		+ "&"
		+ "serviceKey=p0sM4rTKv9"

	var requestComplete = null;
	var method = "GET"
 
	var url = properties.getTimerDataUrl() + "?" + data;
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);

	xhr.onload = function(e) {
		// Login on LMS
		LearningServices.request.requestLoginToLMS();

		try {
			var txtUserData = xhr.responseText;
			objTimerGetServices = JSON.parse(parseJSONP(txtUserData));
		} catch(e) { console.log(e); }

		// Inscribe user to group with data.id_beneficiario
		LearningServices.request.requestInscribeUserToGroup();

		// Load timer services
		loadTimerServices();
	};

	if (!getTimerGetServices()) {
		xhr.send();
	}
}

function getFindObjectById(idSearch, listObjects){
	for (var i = 0; i < listObjects.length; i++) {
		if (listObjects[i].id == idSearch) {
			return listObjects[i];
		}
	}

	return null;
}

function requestTimerServices() {
	var method = "GET"

	var data = "service=UnifiedDesktop"
		+ "&"
		+ "method=getCurrentServiceConsumption"
		+ "&"
		+ "username=username"
		+ "&"
		+ "serviceKey=p0sM4rTKv9";

	var url = properties.getTimerDataUrl() + "?" + data;
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.onload = function(e) {
		try {
			var txtUserData = xhr.responseText;
			objTimerServices = JSON.parse(txtUserData);
		} catch(e) { }
	};

	if (!getTimerServices()) {
		xhr.send();
	}
}

function activateCounter() {
	kindOfSession = getUserTimerData().data.kindOfSession;
	var durationOfSession = getUserTimerData().data.durationOfSession;

	if (!kindOfSession) {
		console.log('(!) Error: kindOfSession is empty');
	}

	if (!durationOfSession) {
		console.log('(!) Error: durationOfSession is empty');
	}

	if (kindOfSession == 'Prepago' || kindOfSession == 'Pospago') {
		startCounter = true;
		$('.offline-ico-ser').hide();
	}

	if (kindOfSession == 'Prepago') {
		var seconds = durationOfSession * 60;
		var time = secondsToTime(seconds);
		isPrepago = true;
		
		regressiveCounter(time.h, time.m, time.s);
	} else if (kindOfSession == 'Pospago') {
		progresiveCounter();
	}
}

function getProfileImageSize(url, size) {
	return url.split("sz")[0] + "sz=" + size;
}

function setUserProfileData(objUserTimerParameters) {
	objUserEditProfile['gender'] = objUserTimerParameters.userdata.genero;
	objUserEditProfile['sector'] = objUserTimerParameters.userdata.sector;
	objUserEditProfile['document'] = objUserTimerParameters.userdata.documento;
	objUserEditProfile['ubication'] = objUserTimerParameters.userdata.ubication_type;
	objUserEditProfile['last_name'] = objUserTimerParameters.userdata.apellido;
	objUserEditProfile['situation'] = objUserTimerParameters.userdata.situacion_particular;
	objUserEditProfile['birthdate'] = objUserTimerParameters.userdata.fecha_nacimiento;
	objUserEditProfile['first_name'] = objUserTimerParameters.userdata.nombre;
	objUserEditProfile['mobile_phone'] = objUserTimerParameters.userdata.telefono;
	objUserEditProfile['document_type'] = objUserTimerParameters.userdata.tipo_documento;
	objUserEditProfile['ocupation_info'] = objUserTimerParameters.userdata.ocupacion;
	objUserEditProfile['ethnical_group'] = objUserTimerParameters.userdata.grupo_etnico;
	objUserEditProfile['educational_level'] = objUserTimerParameters.userdata.nivel_educativo;
	objUserEditProfile['socioeconomic_status'] = objUserTimerParameters.userdata.estrato;
}

function setUserTimerData(objUserEditProfile) {
	objUserTimerParameters.userdata['genero'] = objUserEditProfile['gender'];
	objUserTimerParameters.userdata['sector'] = objUserEditProfile['sector'];
	objUserTimerParameters.userdata['nombre'] = objUserEditProfile['first_name'];
	objUserTimerParameters.userdata['estrato'] = objUserEditProfile['socioeconomic_status'];
	objUserTimerParameters.userdata['apellido'] = objUserEditProfile['last_name'];
	objUserTimerParameters.userdata['telefono'] = objUserEditProfile['mobile_phone'];
	objUserTimerParameters.userdata['documento'] = objUserEditProfile['document'];
	objUserTimerParameters.userdata['ocupacion'] = objUserEditProfile['ocupation_info'];
	objUserTimerParameters.userdata['grupo_etnico'] = objUserEditProfile['ethnical_group'];
	objUserTimerParameters.userdata['tipo_documento'] = objUserEditProfile['document_type'];
	objUserTimerParameters.userdata['ubication_type'] = objUserEditProfile['ubication'];
	objUserTimerParameters.userdata['nivel_educativo'] = objUserEditProfile['educational_level'];
	objUserTimerParameters.userdata['situacion_particular'] = objUserEditProfile['situation'];
}

var loadImage = function(uri, callback, param) {
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';
	xhr.onload = function() {
		if (param) {
			callback(window.URL.createObjectURL(xhr.response), uri, param);
		} else {
			callback(window.URL.createObjectURL(xhr.response), uri);
		}
	}
	
	xhr.open('GET', uri, true);
	xhr.send();
}

/*
 * System services request
 */
SystemServices.request = {
	requestLocalIp: function(callbackSuccess) {
		// NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
		var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

		if (RTCPeerConnection) (function () {
			var rtc = new RTCPeerConnection({iceServers:[]});
			if (1 || window.mozRTCPeerConnection) {	  // FF [and now Chrome!] needs a channel/stream to proceed
				rtc.createDataChannel('', {reliable:false});
			};
			
			rtc.onicecandidate = function (evt) {
				// convert the candidate to SDP so we can run it through our general parser
				// see https://twitter.com/lancestout/status/525796175425720320 for details
				if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
			};
			rtc.createOffer(function (offerDesc) {
				grepSDP(offerDesc.sdp);
				rtc.setLocalDescription(offerDesc);
			}, function (e) { console.warn("offer failed", e); });
			
			
			var addrs = Object.create(null);
			addrs["0.0.0.0"] = false;
			
			function grepSDP(sdp) {
				var hosts = [];
				sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
					if (~line.indexOf("a=candidate")) {	 // http://tools.ietf.org/html/rfc4566#section-5.13
						var parts = line.split(' '),		// http://tools.ietf.org/html/rfc5245#section-15.1
							addr = parts[4],
							type = parts[7];
						if (type === 'host') {
							currentIpAddress = addr;
						}
					} else if (~line.indexOf("c=")) {	   // http://tools.ietf.org/html/rfc4566#section-5.7
						var parts = line.split(' '),
							addr = parts[2];
					}
				});
			}
		})(); 
	}
}

/*
 * Timer services request
 */
TimerServices.request = {
	requestUserTimerData: function(callbackSuccess, callbackError, callbackConnectionError) {
		var listKeys = [];
		var dictUserdata = {};
		var profile = getUserProfile();

		if (getUserTimerParameters()) {
			dictUserdata = getUserTimerParameters().userdata
			listKeys = Object.keys(dictUserdata);
		}

		// if (dictUserdata["documento"] == null || dictUserdata["documento"] == "") {
		// 	return;
		// }

		for (var i = 0; i < listKeys.length; i++) { 
			var isnotEdad = dictUserdata["edad"] == null || dictUserdata["edad"] == "" || dictUserdata["edad"] == "0";
			var isnotEstrato = dictUserdata["estrato"] == null || dictUserdata["estrato"] == "" || dictUserdata["estrato"] == "0";
			var isNotDocument = dictUserdata["documento"] == null || dictUserdata["documento"] == "" || dictUserdata["documento"] == "0";

			if (isNotDocument) {
				objUserTimerParameters.userdata["documento"] = Math.floor(Date.now() / 1000) + "";
			}

			if (isnotEdad) {
				objUserTimerParameters.userdata["edad"] = 0;
			}

			if (isnotEstrato) {
				objUserTimerParameters.userdata["estrato"] = 0;
			}

			if (dictUserdata[listKeys[i]] == null || dictUserdata[listKeys[i]] == "") { 
				objUserTimerParameters.userdata[listKeys[i]] = "0" 
			} 
		}

		// User data settings
		var genero = getUserTimerParameters().userdata.genero;
		var estratoId = getUserTimerParameters().userdata["estrato"];
		var ocupacionId = getUserTimerParameters().userdata["ocupacion"];
		var tipoDocumentoId = getUserTimerParameters().userdata["tipo_documento"];
		var nivelEducativoId = getUserTimerParameters().userdata["nivel_educativo"];

		getUserTimerParameters().userdata.correo_electronico = profile.email;

		if (genero.length == 1 && genero != "0") {
			dictGenre =  {
				"M": "Masculino",
				"F": "Femenino"
			}
			getUserTimerParameters().userdata.genero = dictGenre[genero];
		}

		// Document type validation
		if (!isNaN(tipoDocumentoId)) {
			tipoDocumentoId = parseInt(tipoDocumentoId);
			getUserTimerParameters().userdata.tipo_documento = objProfileFields.document_types[tipoDocumentoId][1];
		}

		// Educational level validation
		if (!isNaN(nivelEducativoId)) {
			nivelEducativoId = parseInt(nivelEducativoId);
			var object = getFindObjectById(nivelEducativoId, objProfileFields.educational_level)

			if (object) {
				getUserTimerParameters().userdata.nivel_educativo = object.name; 
			}
			
		}

		// Ocupation validation
		if (!isNaN(ocupacionId)) {
			ocupacionId = parseInt(ocupacionId);
			var object = getFindObjectById(ocupacionId, objProfileFields.ocupation);

			if (object) {
				getUserTimerParameters().userdata.ocupacion = object.name; 
			}
			
		}

		// POSmart access settings
		getUserTimerParameters().ip = currentIpAddress;
		getUserTimerParameters().userdata = JSON.stringify(getUserTimerParameters().userdata);
		getUserTimerParameters().serviceKey = "p0sM4rTKv9";

		var parameters = Object.keys(getUserTimerParameters()).map(function(key){ 
			if (key == "userdata") {
				return encodeURIComponent(key) + '=' + getUserTimerParameters()[key];
			} else {
				return encodeURIComponent(key) + '=' + encodeURIComponent(getUserTimerParameters()[key]); 
			}
		}).join('&');

		var requestComplete = null;
		var method = "GET"

		var url = properties.getTimerDataUrl() + "?" + parameters;

		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.timeout = 10000;
		xhr.onload = function(e) {
			try {
				var txtUserData = xhr.responseText;
				objUserTimerData = JSON.parse(parseJSONP(txtUserData));
			} catch(e) { }

			requestTimerGetServices();

			if (objUserTimerData 
				&& objUserTimerData.data 
				&& objUserTimerData.data.durationOfSession
				&& objUserTimerData.data.startOfSession != lastStartOfSession) {

				if(callbackSuccess) callbackSuccess();
				continueCounter = true;
				activateCounter();

				lastStartOfSession = objUserTimerData.data.startOfSession;
			} else if (callbackError) {

				objUserTimerData = null;
				objUserProfile = null;
				callbackError();
			}
		};

		if (callbackConnectionError) {
			xhr.onerror = function(e) {
				objUserTimerData = null;
				objUserProfile = null;
				callbackConnectionError();
			}

			xhr.ontimeout = function(e) {
				objUserTimerData = null;
				// objUserProfile = null;
				callbackConnectionError();
			}
		}
		
		getUserTimerParameters().userdata = JSON.parse(getUserTimerParameters().userdata);

		if (!getUserTimerData()) {
			xhr.send();
		}

		if (TestEU.isTesting) {
			if (objUserTimerData 
				&& objUserTimerData.data 
				&& objUserTimerData.data.durationOfSession
				&& objUserTimerData.data.startOfSession != lastStartOfSession
				&& callbackSuccess) {

				callbackSuccess();
			} else if (callbackError) {

				callbackError();
			}
		}
		
	}
}

/*
 * External services request
 */
ExternalServices.request = {
	/*
	 * Load resources like Feeds RSS and other stuff.
	 */
	requestHtmlDocument: function(url, sourceType) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url); // Method GET or POST
		xhr.onload = function(e) {
			var parser = new DOMParser(); 
			var responseText = xhr.responseText;

			if (sourceType == 'news') {
				objNewsDocument = parser.parseFromString(responseText, "text/xml");
			} else if (sourceType == 'blogs') {
				objBlogDocument = parser.parseFromString(responseText, "text/xml");
			}
		};
		xhr.send();
	}
}

LearningServices.request = {
	/*
	 * This methods make login on Learning Plantaform.
	 * optionally you can pass an callback method on success.
	 */
	requestLoginToLMS: function(callbackSuccess) {
		var profile = objUserProfile;

		if (!profile) {
			return;
		}

		var username = profile.username;
		var token = "U6jzyaeCXCUgE";
		var method = "GET"
		var url = properties.getLMSLoginUrl(username, token);

		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.onload = function(e) {
			try {
				var responseText = xhr.responseText;
				objLMSUserProfile = JSON.parse(responseText);
			} catch(e) { 
				console.log("(!) Error parsing JSON on LearningServices.request.requestLoginToLMS method. Details: " + e);
			}

			LearningServices.request.requestAlertMessages();

			// Callback
			if (callbackSuccess) callbackSuccess();
			
			//requestUserListAwards();
		};
		xhr.send();
	},
	requestAlertMessages: function(callbackSuccess) {
		var url = properties.getAlertsUrl();
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.onload = function(e) {
			var txtUserData = "";
			txtUserData = xhr.responseText;

			try {
				if (txtUserData) { 
					objAlert = JSON.parse(txtUserData);
					objAlert = objAlert[0]
				}
			} catch(e) { 
				console.log("(!) Error parsing JSON on LearningServices.request.requestAlertMessages method. Details: " + e);
			}

			if (callbackSuccess) callbackSuccess();
		};

		if (!objAlert) {
			xhr.send();
		}
	}, 

	// This method request profile lists to select.
	requestProfileEditValues: function(callbackSuccess) {
		var requestComplete = null;
		var method = "GET";
		var url = properties.getProfileFieldsUrl()

		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.onload = function(e) {
			try {
				var txtResponse = xhr.responseText;
				objProfileFields = JSON.parse(txtResponse);
			} catch(e) { 
				console.log("(!) Error parsing JSON on LearningServices.request.requestProfileFields method. Details: " + e);
			}

			if (callbackSuccess) callbackSuccess();
		};

		xhr.send();
	},

	// Get all profile data of the user stored on LMS
	requestProfileData: function(callbackSuccess) {
		var method = "GET"
		var parameters = 'username=' + objUserProfile.username; //getUsername(getUserProfile());

		var url = properties.getUserTimerParametersUrl() + '?' + parameters;
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.onload = function(e) {
			try {
				var txtUserData = xhr.responseText;
				objUserTimerParameters = JSON.parse(txtUserData);

				// Save user's data of timer on objUserEditProfile object.
				setUserProfileData(objUserTimerParameters);

				parseTimerParameters();

				// Set from Edit Profile to userdata
				setUserTimerData(objUserEditProfile);

				// Send parameters to Timer
				//requestUserTimerData();
			} catch(e) { 
				console.log("(!) Error parsing JSON on LearningServices.request.requestProfileData method. Details: " + e);
			}

			if (callbackSuccess) callbackSuccess();
		};

		xhr.send();
	},

	/*
	 * This method loads LMS courses
	 */
	requestCourses: function(callbackSuccess, limit) {
		var page = 1;
		var limit = limit ? limit : 10;

		var requestComplete = null;
		var method = "GET"

		var url = properties.getCoursesUrl(page, limit);
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);

		xhr.onload = function(e) {
			try {
				var txtUserData = xhr.responseText;
				objCourses = JSON.parse(txtUserData);
			} catch(e) { 
				console.log("(!) Error parsing JSON on LearningServices.request.requestCourses method. Details: " + e);
			}

			if (callbackSuccess) callbackSuccess();
		};

		xhr.send();
	},
	requestInscribeUserToGroup: function() {
		var data = "";
		var group_id = "";
		
		var method = "GET"
		var requestComplete = null;

		var town = objTimerGetServices.data.municipio;
		var venue = objTimerGetServices.data.sede;
		var province = objTimerGetServices.data.departamento;
		var institution = objTimerGetServices.data.institucion;
		var id_beneficiary = objTimerGetServices.data.id_beneficiario;
		var population_center = objTimerGetServices.data.vereda;
		var start_operation_date = objTimerGetServices.data.fecha_inicio_operacion;
		
		if (id_beneficiary) {
			group_id = groupFormat(id_beneficiary);
		}

		if (town) data += "town=" + town + "&";
		if (venue) data += "venue=" + venue + "&";
		if (province) data += "province=" + province + "&";
		if (group_id) data += "groupname=" + group_id + "&";
		if (institution) data += "institution=" + institution + "&";
		if (population_center) data += "population_center=" + population_center + "&";
		
		if (!start_operation_date) {
			start_operation_date = '2004-04-04';
		}
		
		data += "start_operation_date=" + start_operation_date + "&";

		data = data.substring(0, data.length - 1);

		var url = properties.getInscribeUserToGroupUrl() + "?" + data;
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);

		console.log("url: " + url);

		xhr.onload = function(e) {
			try {
				var txtUserData = xhr.responseText;
				console.log(txtUserData);
			} catch(e) { console.log(e); }
		};

		xhr.send();
	}
}


/*
 * GoogleServices requests
 */
GoogleServices.request = {
	objElement: null,

	strWebviewId: null,
	strServiceUrl: null,

	// Loads and webview with json value
	__loadJSONWebview: function(intWebviewId, strUrl) {
		webviewLoginGoogleServices = document.getElementById(intWebviewId);
		webviewLoginGoogleServices.src = strUrl;
		return webviewLoginGoogleServices;
	},

	// This method loads data from server must to execute first with 
	// events created.
	loadJSONWebview: function() {
		return this.__loadJSONWebview(this.strWebviewId, this.strServiceUrl);
	},

	/* 
	 * Get JSON with profile data from JSON Google Profile Webview.
	 * 
	 * Usage: 
	 * An callback is required to get the data and you must to write it like this:
	 * requestProfileData(function(result) { 
	 *    // The code must to be here
	 * });
	 */
	requestObject: function (callbackSuccess, callbackError) {
		var webviewLoginGoogleServices = document.getElementById(this.strWebviewId);
		var codeToExecute = "document.getElementsByTagName('body')[0].innerText";
		
		if (!webviewLoginGoogleServices) {
			return;
		}

		webviewLoginGoogleServices.executeScript({ 
				code: codeToExecute
			}, function(jsonObject) {
				jsonObject = jsonObject[0];
				jsonObject = JSON.parse(jsonObject);
				GoogleServices.request.objElement = jsonObject;
				console.log("Executes!!!");
				/*
				 * If anybody needs do something with that data 
				 * can use an callback to do it.
				 */
				if (callbackSuccess) callbackSuccess(jsonObject);
			}
		);
	},

	requestUserProfile: function (callbackSuccess, callbackError) {
		var requestComplete = null;
		var method = "GET";

		var url = properties.getUserSaveProfileDataUrl() 
			+ "?"
			+ "profileObject="
			+ JSON.stringify(getUserEditProfile());

		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.onload = function(e) {
			try {
				var txtResponse = xhr.responseText;
				var objResponse = JSON.parse(txtResponse);

				console.log(objResponse);
				objUserTimerData = null;
				objUserTimerParameters = null;

				setUserTimerData(objUserEditProfile);
				//requestUserTimerParameters();
			} catch (e) {
				console.log(e);
			}
		};
		xhr.send();
	},

	// This need to be executed on webview events
	// when webview is ready or the load is finished
	webviewOnReadyEvent: function(callbackSuccess) {
		this.requestObject(callbackSuccess);
	}
}

/*
 * With this object you can get User log
 */
LogUser = {
	saveLog: function() {
		var strType = kindOfSession;
		var profile = getUserProfile();

		var hours = $("#hours").text();
		var minutes = $("#minutes").text();
		var seconds = $("#seconds").text();

		var strUserEmail = profile ? profile.email : "";
		var strUserTime = hours + ':' + minutes + ':' + seconds;
	
		if (getUserTimerData() && getUserTimerData().data) {
			strType = getUserTimerData().data.kindOfSession;
		} 
		LogUser.writeLog(strUserEmail, strUserTime, strType, dictServices, sessionStatus);
	},
	writeLog: function(strUserEmail, strUserTime, strType, dictServices, strSessionStatus) {
		var logId = randomString(8, '#Aa');
		var dtCurrentDate = "" + new Date();
		var services = JSON.stringify(dictServices);

		if (!objUserTimerData || !strUserEmail || !strUserTime || !strType || !dictServices || !strSessionStatus) {
			return; 
		}

		console.log(objUserTimerData)
		var objLog = { 
			'id': logId,
			'type': strType, // Timer type
			'time': strUserTime, // Time
			'date': dtCurrentDate, // Date
			'email': strUserEmail, // E-mail
			'status': strSessionStatus,
			'services': services, // Service's list
			'objUserTimerData': JSON.stringify(objUserTimerData)
		};

		listLog.push(objLog);

		console.log('(L) User activity log is saving...');

		chrome.storage.local.set({
			'user_log_timer': listLog
		});
	},

	executeThreadSaveLog: function() {
		intervalLog = setInterval(function() {
			if (getUserProfile()) {
				LogUser.saveLog();
			}
		}, 10000);
	},
		
	getLastLog: function(fnCallback) {
		chrome.storage.local.get('user_log_timer', function(r){ 
			var listLogs = r['user_log_timer'];
			var lastElement = listLogs[listLogs.length - 1];

			fnCallback(lastElement);
		});
	}
}

LogUser.executeThreadSaveLog();
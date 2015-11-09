/*
 * Objects
 */
var isCounterOver = false;

var listLog = [];
var objectProfile = null; // Object profile 
var userSessionKey = null; // User Session Key
var intervalCounter = null;
var continueCounter = true;

function getUrlXAPI(func, serviceLink, serviceTitle) {
	var url = properties.LMS + 'api/convert/?func=' + func

	if(serviceLink && serviceTitle) {
		url += '&service_link=' + serviceLink;
		url += '&service_title=' + serviceTitle;
	}

	return url;
}

function calculateAge(birthday) { // birthday is a date
	var ageDifMs = Date.now() - birthday.getTime();
	var ageDate = new Date(ageDifMs); // miliseconds from epoch
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function isOnline(no,yes){
	var xhr = new XMLHttpRequest();
	xhr.open("GET","https://accounts.google.com/");
	xhr.timeout = 1000;

	xhr.onload = function(){ 
		if(xhr.status != 408 && xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
			yes();
		} else {
			no();
		}
	}

	xhr.onerror = function(){
		no();
	}
	xhr.send();
}

function getUserSessionKey() {
	return userSessionKey;
}

function requestSessionParameter() {
	return "?user_session_key=" + getUserSessionKey()
}

// @corecode_begin getProtectedData
function xhrWithAuth(method, url, interactive, callback) {
	var access_token;
	var retry = true;

	getToken();

	function getToken() {
		chrome.identity.getAuthToken({ interactive: interactive }, function(token) {
			if (chrome.runtime.lastError) {
				callback(chrome.runtime.lastError);
				return;
			}
			access_token = token;
			requestStart();
		});
	}

	function requestStart() {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
		xhr.onload = requestComplete;
		xhr.send();
	}

	function requestComplete() {
		if (this.status == 401 && retry) {
			retry = false;
			chrome.identity.removeCachedAuthToken({ token: access_token }, getToken);
		} else {
			callback(null, this.status, this.response);
		}
	}
}

/** 
 * Usage:
 * 1. requestUserInfo()
 * 2. getObjectProfile()
 */
function requestUserInfo() {
	var profileDataUrl = 'https://www.googleapis.com/plus/v1/people/me';

	xhrWithAuth('GET', profileDataUrl, false, function (error, status, response) {
		if (!error && status == 200) {
			// Asign profile information to userInformation.
			objectProfile = JSON.parse(response);
		} else {
			console.log("(*) Problem when tried getting user data.")
		}
	});
}

function getObjectProfile() {
	return objectProfile;
}

function ajaxCallUserInformation(interactive) {
	xhrWithAuth('GET', this.profileUrl, interactive, onUserInfoFetched);
}

function randomString(length, chars) {
	var mask = '';
	if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
	if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if (chars.indexOf('#') > -1) mask += '0123456789';
	if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
	var result = '';
	for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
	return result;
}

function generateUserSessionKey() {
	userSessionKey = randomString(16, "#Aa");
}

function differenceBetweenTwoDates(firstDate, secondDate) {
	var miliseconds = firstDate - secondDate;
	var seconds = parseInt(miliseconds / 1000);
	var minutes = parseInt(seconds / 60)
	var hours = parseInt(minutes / 60)

	var object = {
		"convertToMiliseconds": miliseconds,
		"convertToSeconds": seconds,
		"convertToMinutes": minutes,
		"convertToHours": hours
	}

	return object;
}

function getUsername(profile) {
	var username = '';
	var email = '';

	if (profile && profile.emails) {
		email = profile.emails[0].value
	}
	
	if (email) {
		username = email
			.replace('.com', '')
			.replace(/\./g, '')
			.replace('@', '');
	}

	return username;
}

function regressiveCounter(hours, minutes, seconds) {
	var strHours = "";
	var strSeconds = "";
	var strMinutes = "";

	intervalCounter = setInterval(function() {
		if (continueCounter) {
			if (minutes == 0) {
				if (hours > 0) {
					minutes = 60;
					hours--;
				}
			}

			if (seconds == 0) {
			
				if (minutes > 0) {
					seconds = 60;
					minutes--;
				}
			}

			if (seconds > 0) {
				seconds--;
			}

			strSeconds = seconds < 10 ? "0" +  seconds : seconds;
			strMinutes = minutes < 10 ? "0" +  minutes : minutes;
			strHours = hours < 10 ? "0" +  hours : hours;

			$("#seconds").text(strSeconds);
			$("#minutes").text(strMinutes);
			$("#hours").text(strHours);

			if ($("#hours").text() == "00" && $("#minutes").text() == "00" && $("#seconds").text() == "00") {
				isCounterOver = true;
			}
		}
	}, 1000);
}

function progresiveCounter(nuHours, nuMinutes, nuSeconds) {
	var seconds = nuSeconds ? nuSeconds : 0;
	var minutes = nuMinutes ? nuMinutes : 0;
	var hours = nuHours ? nuHours : 0;

	var strSeconds = "";
	var strMinutes = "";
	var strHours = "";

	intervalCounter = setInterval(function() {
		seconds++;

		if (seconds == 60) {
			seconds = 0;
			minutes++;
		}

		if (minutes == 60) {
			minutes = 0;
			hours++;
		}

		strSeconds = seconds < 10 ? "0" +  seconds : seconds;
		strMinutes = minutes < 10 ? "0" +  minutes : minutes;
		strHours = hours < 10 ? "0" +  hours : hours;

		$("#seconds").text(strSeconds);
		$("#minutes").text(strMinutes);
		$("#hours").text(strHours);
	}, 1000);	
}

function secondsToTime(secs) {
	var hours = Math.floor(secs / (60 * 60));
	
	var divisor_for_minutes = secs % (60 * 60);
	var minutes = Math.floor(divisor_for_minutes / 60);

	var divisor_for_seconds = divisor_for_minutes % 60;
	var seconds = Math.ceil(divisor_for_seconds);
	
	var obj = {
		"h": hours,
		"m": minutes,
		"s": seconds
	};
	return obj;
}

function parseJSONP(strJSONResponse) {
	return strJSONResponse.replace('jsonpCallback(', '').replace(')', '');
}

function groupFormat(id_beneficiary) {
	group_id = "";
	number_group = parseInt(id_beneficiary);

	if (number_group < 10) {
		group_id = '000' + number_group;
	} else if (number_group >= 10 && number_group < 100) {
		group_id = '00' + number_group;
	} else if (number_group >= 100 && number_group < 1000) {
		group_id = '0' + number_group;
	} else if (number_group >= 1000 && number_group < 10000) {
		group_id = number_group;
	}

	return group_id;
}


generateUserSessionKey();

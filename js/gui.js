var BROWSER_SERVICE = "Navegar por internet"

var startCounterCalls = false;
var desktopIsLoaded = false;

var sessionStatus = 'open';

var intervalCommunity = null;

/*
 * Object to control account graphic behaviors
 */
var AccountView = AccountView || {};
AccountView = {
	showLoginScreen: function() {
		/* 
		 * Webview-object events for a awesome user login
		 * this avoid the ghost webview monster.
		 */
		$("#webviewLoginDiv").html('<webview id="webview-object" src="' + properties.getLoginUrl() + '"></webview>');
		
		/*
		 * Separated login events.
		 */
		webviewLoginEvents();

		/*
		 * Show multipurpose modal
		 */ 
		$("#multipurpose-modal").modal({
			backdrop: 'static',
			keyboard: false
		});

		$("#multipurpose-modal").modal('show');
	},
	showCreateAccountScreen: function() {
		$("#webviewCreateAccountDiv").html('<webview id="create-account-webview-object" src="' + properties.getGoogleCreateAccountUrl() + '"></webview>');

		/*
		 * Separated create account webview events
		 */
		webviewCreateAccountEvents();

		$("#create-account-modal").modal({
			backdrop: 'static',
			keyboard: false
		});

		$("#create-account-modal").modal('show');
	}, 
	showWelcomeMessage: function() {
		$("#modal-welcome").modal({
			backdrop: 'static',
			keyboard: false
		});
	}
}

/*
 * *** End requests for get user data ***
 */

/*
 * Check internet connection.
 */

function counterListener() {
	intervalCountListener = setInterval(function() {
		if (startCounterCalls) {
			if (isCounterOver) {
				if (isAdministrator) {
					logout();
					startCounterCalls = false;
				} else {
					openLogoutDialog();
					startCounterCalls = false;
				}
			}
		}
	}, 1000);
}

function checkConnection() {
	var condition = navigator.onLine ? true : false;
	return condition;
}

function sendToXAPI(funct, url, service) {
	var xapiUrl = getUrlXAPI(funct, url, service);
	$("#xapi-webview-object").attr('src', xapiUrl);
}

/*
 * This function convert an text with 'https://' or 'http://'
 * into a HTML document with clickeable links.
 */
function convertLinksToHTML(text) {
	strResultText = '';
	lstConvertedWords = [];

	lstWords = text.split(' ');

	for (var i = 0; i < lstWords.length; i++) {
		var word = lstWords[i];

		/*
		 * This confusing condition verify if http exists in 
		 * the word.
 		 */
		if (word.indexOf('http') != -1) {
			lstConvertedWords.push('<a href="#" class="link-edu" url="' + word + '">' + word + '</a>')
		} else {
			lstConvertedWords.push(word)
		}
	}

	/*
	 * Convert lstConvertedWords to text again.
	 */
	for (var i = 0; i < lstConvertedWords.length; i++) {
		var word = lstConvertedWords[i];
		strResultText += word;

		if (i != lstConvertedWords.length - 1) {
			strResultText += ' ';
		}
	}

	return strResultText;
}

/*
 * Listener that shows and advice when 5 minutes left.
 */
function alertListener() {
	setInterval(function() {
		if (objAlert && objAlert.fields.message != lastAlert && getUserProfile()) {
			var messageText = objAlert.fields.message;
			var messageHtml = convertLinksToHTML(messageText);

			$('#alertText').html(messageHtml);

			$("#modal-alert").modal({
				backdrop: 'static',
				keyboard: false
			});

			$("#modal-alert").modal('show');
			lastAlert = messageText;
			LearningServices.request.requestAlertMessages();

			$('.link-edu').on('click', function(evt) {
				
				var itemElement = getItemServiceHtml(properties.SERVICE_EDUCATIVE_INTERNET);

				if (listServices.indexOf(itemElement) == -1) {
					listServices.push(itemElement);
				}

				

				var email = getUserProfile().email;
				var id = getUserProfile().id;
				var url = $(this).attr('url');

				linkToEducation(url);

				$('.back-to-services').on('click', function(evt) {
					var educaWebview = document.getElementById("educa-service-webview");
					educaWebview.terminate();

					loadEducation(getUserProfile(), getCourses());
					requestTimerCreateService(properties.SERVICE_EDUCATIVE_INTERNET, 1);
				});

				$("#modal-alert").modal('hide');
			});

		}
	}, ALERT_TIME);
}

/* 
 * This function runs a background process to detect when the network it's off 
 */
function checkStatus(check_cicle_time){
	var isLoadOnlineLogin = true;

	intervalCheckStatus = setInterval(function(){
		isOnline(
			function(){
				$('#offline-mark').show();

				// Offline toggle
				$('#online-div').hide();
				$('#offline-div').show();
				isLoadOnlineLogin = false;
			},
			function(){
				$('#offline-mark').hide();

				// Online toggle
				$('#online-div').show();
				$('#offline-div').hide();
				if (isLoadOnlineLogin) {
					isLoadOnlineLogin = false;

					if (!$("#login-google-services").attr("src")) {
						$("#logout-webview-object").attr("src", properties.LOGOUT_URL);
					}
				}
			}
		);
	}, check_cicle_time);

	$('#offline-mark').hide();
}

/* This function is for verfification of profile is full */
function emptyProfile(){
	return false;
}

/* This function trigger the notification when the profile isn't full */
function triggerEmptyProfile(){

}

/*
 * Open and close slide bars
 */
function sidebarActions() {
	$('#open-sidebar').on('click', function(evt){
		$(evt.currentTarget).addClass('hide-open-sidebar');
		$('#sideBar').animate({ width: "100px" }, 900);
	});
	$('#side-hide').on('click', function(evt){
		$(document).find('.hide-open-sidebar').removeClass('hide-open-sidebar');
		$('#sideBar').animate({ width: "0px" }, 900);
	});
}

/* 
 * This function executes actions whether if the profile it's full or not 
 */
function checkProfile(){
	var isEmpty = emptyProfile();
	if(isEmpty){
		triggerEmptyProfile();
	}
}

/* 
 * This function append the desktop events 
 */
function desktopEvents(profile, courses){
	//Init chronometer
	//$('#chron1').Chron({});

	// Set event for logout
	$('#logout').on('click', function(evt){
		evt.preventDefault();

		/*
		 * Only users that aren't administrators
		 * can rate the poll.
		 */
		if (isAdministrator) {
			logout();
		} else {
			openLogoutDialog();
		}
	});

	$('div#profile').on('click', function(evt) {
		evt.preventDefault();
		loadProfile(profile, courses);
	});

	$('div#community').on('click', function(evt) {
		evt.preventDefault();
		loadCommunity(profile, courses);
	});

	$('div#education').on('click', function(evt) {
		evt.preventDefault();
		loadEducation(profile, courses);
	});

	$('div#services').on('click', function(evt) {
		evt.preventDefault();
		loadServices(profile, courses);
	});

	$('div#administration').on('click', function(evt) {
		evt.preventDefault();
		loadAdministration(profile, courses);
	});

	$('#controlToProfile').on('click', function(evt){
		evt.preventDefault();
		loadProfile(profile, courses);
	});
}

/*
 * Session closed log, so when 'muggles' logut then
 * will change the session status to closed.
 */
function sendSessionClosedLog() {
	sessionStatus = 'closed';
	//console.log('[DEBUG] - sessionStatus: ' + sessionStatus);
	LogUser.saveLog();
}

/*
 * Function that make every action for close
 * session.
 */
function logout() {
	sendSessionClosedLog();
	loadEvents();
	initialSetup();
	logoutUser();
	generateUserSessionKey();
	loadLogin();
	loadEvents();
}

/*
 * Function to generate items HTML
 */
function getHtmlItemSmall(objectName, id) {
	return '<a href="#" class="list-group-item">'
				+ '<table>'
				+ '<tr>'
				+ '<td style="padding-right: 10px;">'
				+ (id ? '<img id="' + id + '" class="img-circle">' : '')
				+ '</td>'
				+ '<td>'
				+ '<h5 class="list-group-item-heading">'
				+ objectName
				+ '</h5>'
				+ '</td>'
				+ '<tr>'
			+ '</a>';
}

/*
 * Function to generate items HTML
 */
function getHtmlItem(objectName, url, cssClass, imageUrl) {
	var srcParam = imageUrl ? 'src="' + imageUrl + '"' : '';
	var idParam = cssClass ? 'class="' + cssClass + ' img-circle"' : 'class="img-circle"';

	imgTag = '<img ' + idParam + ' ' + srcParam + ' style="width: 50px; height: 50px;"> &nbsp;';

	return  '<a href="#" class="list-group-item link-community clear"  url="' + url + '">'
				+ '<div style="height: 60px;">'
				
				//+ '<h4 class="list-group-item-heading">'
				+ '<div class="pull-left">'
				+ imgTag
				+ "</div>"
				+ '<div class="pull-left" º="width: 200px;">'
				+ objectName
				+ "</div>"
				//+ '</h4>'
			+ '</div>'
			+ '</a>';
}

/*
 * Fill profiles divs with google plus data
 */
function setProfileResources() {
	var listActivities = [];

	if (getUserActivities()) {
		listActivities = getUserActivities().items;
	} 

	if(!listActivities) {
		return;
	}
	
	if (listActivities.length > 0) {
		$('#blog-container').html("");
	}
	
	for (var i = 0; i < listActivities.length; i++) {
		var title = listActivities[i].title;
		var imageUrl = listActivities[i].actor.image.url;
		var itemId = 'small-item-' + (i + 1);
		var txtHtml = getHtmlItemSmall(title, itemId);

		if (title) {
			$('#blog-container').append(txtHtml);
		}

		loadImage(imageUrl, function(image, e, id){
			$('#' + id).attr('src', image);
		}, itemId);
	}
}


/*
 * Make link to profile.
 */
function linkToProfile(service) {
	var embedded_profile_tpl = $('#embedded-profile-tpl').html();
	$('#home-content-container').html(embedded_profile_tpl);
	$("#link-personal-calendar").show();
	$("#profile-webview").attr("src", service);

	$('#link-personal-calendar').on('click', function(evt) {
		$("#profile-webview").attr("src", properties.LMS + 'schedule/calendar/compact_month/' + getUsername(getUserProfile()));
		$("#link-personal-calendar").hide();
	});

	$('.back-to-services').on('click', function(evt) {
		var profileWebview = document.getElementById("profile-webview");
		profileWebview.terminate();

		loadProfile(getUserProfile(), getCourses());
		//requestTimerCreateService(currentService, objDates.convertToMinutes);
	});
}

/*
 * Screen redirections
 */ 
function loadProfile(profile, courses) {
	LearningServices.request.requestLoginToLMS();

	var courses_list = "<ul style='padding-left: 10px;padding-top:0;'>";
	
	var imageUrl = "";

	if (profile.avatar_image) {
		imageUrl = profile.avatar_image;
	}
	
	var imageUrlSized = getProfileImageSize(imageUrl, 120);

	$('#main-nav').removeClass('blue-bg').removeClass('yellow-bg').removeClass('red-bg').removeClass('profile').removeClass('violet-bg');
	$('#content-container').addClass('profile');
	$('#main-nav').addClass('profile');
	$('#home-content-container').addClass('profile');
	$('#logo-nav').attr('src', '/images/logo_white.png');

	try {
		// Load items from google activities
		setProfileResources();
	} catch(e) {
		console.log('Error on setProfileResources method: ');
		console.log(e);
	}

	

	loadImage(imageUrlSized, function(image, e){
		$('#avatar-profile').attr('src', image);
	});

	if (courses) {
		$.each(courses,function(n,g){
			var course_image = g.fields.image != "" ? g.fields.image : "images/course.png";
			var tags = g.fields.tags.split(',');
			var tags_list = '<ul class="list-inline">';
			var uuid = g.fields.versioncourse.fields.uuid;
			var fullUrlImage = properties.getLMSMediaUrl() + course_image;
			// Here is where I put the current progress, if I had one
			var current_progress = 0;

			if(g.fields.description == ""){
				description = 'Aprende r&aacute;pido y f&aacute;cil, como hacer parte de la red, &uacute;nete y comparte tu opini&oacute;n.';
			}else{
				description = g.fields.description.substring(0, 128) + '...';
			}

			//console.log(g);

			$.each(tags,function(j,k){
				tags_list += '<li><span class="label label-success">'+k+'</span></li>';
			});
			tags_list += '</ul>';

			loadImage(fullUrlImage, function(image, e){
				$('#img-course-profile-' + g.pk).attr('style', 'background-image: url(\"' + image + "\")");
			});

			var user_progress = '<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="'+current_progress+'" aria-valuemin="0" aria-valuemax="100" style="width: '+current_progress+'%;">'+current_progress+'%</div></div>';

			courses_list += '<li class="media">'
				+ '<a class="pull-left" href="#">'
					+ '<img class="media-object course-image" id="img-course-profile-' + g.pk + '" alt="' + g.fields.name + '" src="">'
				+ '</a>'
					+ '<div class="media-body"><h4 class="media-heading"><a href="#" class="link-edu" url="' + properties.getOpenCourseUrl(uuid) + '">' + g.fields.name + '</a></h4>'
						+ '<p>' + description + '</p>'
						+ user_progress
						+ tags_list 
					+ '</div>'
				+ '</li>';
		});
	}
	
	courses_list += '</ul>';

	var badges = '<span class="text-muted">No has ganado alguna insignia.</span>';

	var profile_tpl = $('#profile-tpl').html();
	$('#home-content-container').html('<div id="content-container" class="container">'+profile_tpl+'</div>');

	if (objUserProfile.is_staff) {
		$('.is-admin').show();
		$('.not-admin').hide();
	}else{
		$('.is-admin').hide();
		$('.not-admin').show();
	}

	try {
		sidebarActions();
	} catch(e) {
		console.log('Error on sidebarActions method: ');
		console.log(e);
	}
		
	try {
		sideBarEvents();
	} catch(e) {
		console.log('Error on sideBarEvents method: ');
		console.log(e);
	} 
	
	var userTrimmedName = profile.first_name + ' ' + profile.last_name.charAt(0) + '.';

	$('#content-container').find('#user-name').text(userTrimmedName);
	$('#content-container').find('#user-mail').attr('src', profile.email).text(profile.email);

	if (getUserProfile().placesLived && getUserProfile().placesLived.length > 0) {
		$('#content-container').find('#user-city').text(getUserProfile().placesLived[0].value);
	} else {
		$('.city-panel').hide();
	}

	var gender = getUserProfile().gender;

	if(gender == "male"){
		$('#content-container').find('#user-sex').text('Hombre');
	}else if(gender == "female"){
		$('#content-container').find('#user-sex').text('Mujer');
	}

	var yearsOld = calculateAge(new Date(objUserEditProfile['birthdate']));
	$('#content-container').find('#user-birth').text(yearsOld);

	var userNotifications = '0';
	$('#content-container').find('.user-notifications').text(userNotifications);

	$('#content-container').find('#courses-container').append(courses_list);
	$('#content-container').find('#badges-container').append(badges);

	$('#return-home').on('click', function(evt){
		evt.preventDefault();
		loadDesktop(profile, courses);
		desktopEvents(profile, courses);
	});

	$("#webview-calendar").attr("src", properties.LMS + 'schedule/calendar/daily/' + getUsername(getUserProfile()));
	applyCalendarStyles();

	$('#daily-calendar').on('click', function(evt){
		evt.preventDefault();
		$("#webview-calendar").attr("src", properties.LMS + 'schedule/calendar/daily/' + getUsername(getUserProfile()));
		applyCalendarStyles();
	});

	$('#weekly-calendar').on('click', function(evt){
		evt.preventDefault();
		$("#webview-calendar").attr("src", properties.LMS + 'schedule/calendar/week/' + getUsername(getUserProfile()));
		applyCalendarStyles();
	});

	$('#month-calendar').on('click', function(evt){
		evt.preventDefault();
		$("#webview-calendar").attr("src", properties.LMS + 'schedule/calendar/compact_month/' + getUsername(getUserProfile()));
		applyCalendarStyles();
	})

	$('.link-profile').on('click', function(evt) {
		currentService = $(this).attr('service');
		var itemElement = getItemServiceHtml(currentService);

		linkToProfile($(this).attr('url'));

		if (currentService) {
			dateBeforeTimer = new Date();
			
			if (listServices.indexOf(itemElement) == -1) {
				listServices.push(itemElement);
			}
			
		}
		
	});

	/*$('.link-edu').on('click', function(evt) {
		//loadEducation(getUserProfile(), getCourses());
		var email = getUserProfile().emails[0].value;
		var id = getUserProfile().id;
		var url = properties.getLMSLoginRedirectUrl(email, id);

		var courseUrl = $(this).attr('url');
		var length = properties.LMS.length;
		var relativeUrl = courseUrl.replace(properties.LMS.substring(0, length - 1), "");
		var openCourseUrl = url + '&next=' + relativeUrl;

		//window.open(openCourseUrl);

		linkToEducation($(this).attr('url'));
	});*/

	$('.link-edu').on('click', function(evt) {
		
		var itemElement = getItemServiceHtml(properties.SERVICE_EDUCATIVE_INTERNET);

		if (listServices.indexOf(itemElement) == -1) {
			listServices.push(itemElement);
		}

		

		var email = getUserProfile().emails[0].value;
		var id = getUserProfile().id;
		var url = $(this).attr('url');
		
		linkToEducation(url);

		$('.back-to-services').on('click', function(evt) {
			//var educaWebview = document.getElementById("educa-service-webview");
			educaWebview.terminate();

			loadEducation(getUserProfile(), getCourses());
			requestTimerCreateService(properties.SERVICE_EDUCATIVE_INTERNET, 1);
		});
	});


	$('#edit-profile').on('click', function(evt){
		evt.preventDefault();
		loadEditProfile(profile, courses);
	});

	$('#edit-profile-google').on('click', function(evt){
		evt.preventDefault();
		linkToProfile(properties.ACCOUNT_SETTINGS_URL);
	});

	$('#controlToCommunity').on('click', function(evt){
		evt.preventDefault();
		loadCommunity(profile, courses);
	});

	$('#controlToDesktop').on('click', function(evt){
		evt.preventDefault();
		loadDesktop(profile, courses);
		desktopEvents(profile, courses);
	});

	$('#community-sub-menu').on('click', function(evt){
	evt.preventDefault();
		loadCommunity(profile, courses);
	});

	$('#education-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadEducation(profile, courses);
	});

	$('#services-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadServices(profile, courses);
	});

	$('#administration-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadAdministration(profile, courses);
	});

	applyCalendarStyles();

	//$("#foot").hide();
}

/*
 * Assign profile values to profile screen.
 */
function setEditProfileValues() {
	var profileEdit = getUserEditProfile();
	var listSituations = [];

	if (profileEdit.situation) {
		listSituations = profileEdit.situation.split(',');
	}

	for(var i = 0; i < listSituations.length; i++) {
		$('.situation[value=' + listSituations[i] + ']').attr('checked', 'checked');
	}

	$('#mobile').val(profileEdit['mobile_phone']);
	$('#document').val(profileEdit['document']);
	$('#birthdate').val(profileEdit['birthdate']);

	$("#ethnical_group option[value='" + profileEdit.ethnical_group + "']").attr('selected', 'selected');
	$("#ocupation option[value='" + profileEdit.ocupation_info + "']").attr('selected', 'selected');
	$("#economic_status option[value='" + profileEdit.socioeconomic_status + "']").attr('selected', 'selected');
	$("#education_level option[value='" + profileEdit.educational_level + "']").attr('selected', 'selected');
	$("#document-type option[value='" + profileEdit.document_type + "']").attr('selected', 'selected');
	$("#ubication option[value='" + profileEdit.ubication + "']").attr('selected', 'selected');
	$("#sector option[value='" + profileEdit.sector + "']").attr('selected', 'selected');

	if (profileEdit.gender == 'M') {
		$("#gender option[value='Masculino']").attr('selected', 'selected');
	} else if (profileEdit.gender == 'F') {
		$("#gender option[value='Femenino']").attr('selected', 'selected');
	}
	
}

/*
 * Generate option values
 */
function setFieldData(listData, idObject) {
	for(var i = 0; i < listData.length; i++) {
		$(idObject).append(
			'<option value="' + listData[i][0] + '">' + listData[i][1] + '</option>'
		)
	}
}

/*
 * Generate option values
 */
function setFieldDataName(listData, idObject) {
	for(var i = 0; i < listData.length; i++) {
		$(idObject).append(
			'<option value="' + listData[i][1] + '">' + listData[i][1] + '</option>'
		)
	}
}

/*
 * Generate option values
 */
function setFieldDataDict(listData, idObject) {
	for(var i = 0; i < listData.length; i++) {
		$(idObject).append(
			'<option value="' + listData[i]['id'] + '">' + listData[i]['name'] + '</option>'
		)
	}
}

/*
 * Generate option values
 */
function setFieldDataDictName(listData, idObject) {
	for(var i = 0; i < listData.length; i++) {
		$(idObject).append(
			'<option value="' + listData[i]['name'] + '">' + listData[i]['name'] + '</option>'
		)
	}
}

/*
 * Generate input values
 */
function setFieldDataMultiple(listData, idObject) {
	$(idObject).html("");
	for(var i = 0; i < listData.length; i++) {
		dictSituation[listData[i]['id']] = listData[i]['name'];

		$(idObject).append(
			  '<div class="checkbox">'
				 + '<label>'
					+ '<input type="checkbox" class="situation" value="' + listData[i]['id'] + '">' + listData[i]['name'] 
				+ '</label>'
			+ '</div>'
		)
	}
}

function loadEditProfileSettings() {
	if (!showEditProfileCancelButton) {
		$("#cancel-edit-profile").hide();
	}
	var profileFields = getProfileFields();

	if (profileFields) {
		var listSector = profileFields.sector;
		var listOcupation = profileFields.ocupation;
		var listSituation = profileFields.situation;
		var listEthnicalGroup = profileFields.ethnical_group;
		var listUbicationType = profileFields.ubication_type;
		var listDocumentTypes = profileFields.document_types;
		var listEducationalLevel = profileFields.educational_level;
		var listSocioEconomicStatus = profileFields.socioeconomic_status;

		console.log(listEducationalLevel)
		// List
		setFieldData(listDocumentTypes, '#document-type');
		setFieldData(listEthnicalGroup, '#ethnical_group');
		setFieldData(listSocioEconomicStatus, '#economic_status');
		
		setFieldDataName(listSector, '#sector');
		setFieldData(listUbicationType, '#ubication');

		// Dictionary
		setFieldDataDict(listOcupation, '#ocupation');
		setFieldDataDict(listEducationalLevel, '#education_level');

		// Dictionary with multiple selection
		setFieldDataMultiple(listSituation, "#situation");
	}
}

function getMultipleSelectionValues(className) {
	var listCheckedValues = $(className + ':checked');
	var selection = "";

	for(var i = 0; i < listCheckedValues.length; i++) {
		selection += $(listCheckedValues[i]).attr('value');

		if (i != listCheckedValues.length - 1) {
			selection += ",";
		}
	}

	return selection;
}

function loadEditProfile(profile, courses){
	LearningServices.request.requestLoginToLMS();
	//requestLMS();

	var edit_profile_tpl = $('#edit-profile-tpl').html();
	$('#home-content-container').removeClass('profile').addClass('edit-profile');
	$('#content-container').removeClass('profile').addClass('edit-profile');
	$('#content-container').html(edit_profile_tpl);

	$('#edit-situation').on('click', function(){
		$("#situacion-perfil").modal({
		  backdrop: 'static',
		  keyboard: false
		});
		$('#situacion-perfil').modal('show');
	});

	$('.back-to-services').on('click', function(evt) {
		loadProfile(getUserProfile(), getCourses());
	});

	sidebarActions();
	sideBarEvents();
	loadEditProfileSettings();

	setEditProfileValues();

	if (!showEditProfileCancelButton) {
		$("#open-sidebar").hide();
	}
	
	$('#save-edit-profile').on('click', function(evt){
		/*** Get data from form ***/
		var regNumber = /^\d+$/;

		var valueLastName = profile.last_name;
		var valueFirstName = profile.first_name;

		var inputGender = $("#gender").val();
		var inputMobile = $("#mobile").val();
		var inputDocument = $("#document").val();
		var inputBirthdate = $("#birthdate").val();

		var selectedOcupation = $("#ocupation option:selected").attr('value');
		var selectedUbication = $("#ubication option:selected").attr('value');
		var selectedDocumentType = $("#document-type option:selected").attr('value');
		var selectedEthnicalGroup = $("#ethnical_group option:selected").attr('value');
		var selectedEducationalLevel = $("#education_level option:selected").attr('value');
		var selectedSocioEconomicStatus = $("#economic_status option:selected").attr('value');

		var selectedSector = $("#sector option:selected").attr('value');

		var selectedSituation = getMultipleSelectionValues('.situation');

		/*** Set data from form ***/
		objUserEditProfile['last_name'] = valueLastName;
		objUserEditProfile['first_name'] = valueFirstName;
		
		objUserEditProfile['document'] = inputDocument;
		objUserEditProfile['birthdate'] = inputBirthdate;
		objUserEditProfile['mobile_phone'] = inputMobile;

		objUserEditProfile['gender'] = inputGender

		// Calculate age
		userAge = calculateAge(new Date(inputBirthdate));


		/*
		 * If user's age is greater than 100 then... well
		 * the user is too old to lost the last minutes of their life
		 * on this application.
		 */
		if (userAge > 100) {
			objUserEditProfile['birthdate'] = "";
		}

		objUserEditProfile['sector'] = selectedSector;
		objUserEditProfile['ubication'] = selectedUbication;
		objUserEditProfile['situation'] = selectedSituation;
		objUserEditProfile['document_type'] = selectedDocumentType;
		objUserEditProfile['ocupation_info'] = selectedOcupation;
		objUserEditProfile['ethnical_group'] = selectedEthnicalGroup;
		objUserEditProfile['educational_level'] = selectedEducationalLevel;
		objUserEditProfile['socioeconomic_status'] = selectedSocioEconomicStatus;

		// We don't have this field on form
		objUserEditProfile['location'] = "Kiosko";

		var listKeys = Object.keys(objUserEditProfile);
		var isFull = true;
		var errorMessages = '';

		for(var i = 0; i < listKeys.length; i++) { 
			var currentValue = objUserEditProfile[listKeys[i]];

			if (currentValue == null || currentValue == "" || currentValue == "0") {
				isFull = false;
				errorMessages = "Tienes que llenar completamente y de forma apropiada tu perfil para poder continuar.";
				break;
			}
		}

		if (objUserEditProfile["document"].length < 6) {
			isFull = false;
			errorMessages += "<br>Tu documento de identidad debe tener al menos 6 caracteres.";
		}

		
		if (!regNumber.test(objUserEditProfile["document"])) {
			isFull = false;
			errorMessages += "<br>Tu documento de identidad debe contener numeros solamente.";
		}

		if (objUserEditProfile["mobile_phone"].length != 10 || objUserEditProfile["mobile_phone"].substring(0,1) != '3') {
			isFull = false;
			errorMessages += "<br>Debes ingresar un n&uacute;mero celular v&aacute;lido.";
		}

		if (!regNumber.test(objUserEditProfile["mobile_phone"])) {
			isFull = false;
			errorMessages += "<br>Tu n&uacute;mero celular debe contener numeros solamente.";
		}

		if (isFull) {
			// Visual changes
			$("#cancel-edit-profile").show();
			$("#message-full-profile").hide();

			// Save data
			requestUserSaveProfileData();

			// Logic validation
			if (!showEditProfileCancelButton) {
				doTimerRequest = true;
				
				loadDesktop(profile, courses);
				desktopEvents(profile, courses);
				clearInterval(intervalCountListener);

				afterLoginEvents(profile, courses)

				showEditProfileCancelButton = true;
			} else {
				loadProfile(profile, courses);
			}
		} else {
			$("#message-full-profile").show();
			$("#message-full-profile").html(errorMessages);
		}
	});

	$('#cancel-edit-profile').on('click', function(evt){
		evt.preventDefault();
		loadProfile(profile, courses);
	});

	$('#return-home').on('click', function(evt){
		evt.preventDefault();
		loadDesktop(profile, courses);
		desktopEvents(profile, courses);
	});
}

function linkToCommunity(service) {
	var embedded_community_tpl = $('#embedded-community-tpl').html();
	var communityWebview = document.getElementById("community-webview");

	$('#home-content-container').html(embedded_community_tpl);
	$("#community-webview").attr("src", service);

	$('.back-to-services').on('click', function(evt) {
		var communityWebview = document.getElementById("community-webview");
		communityWebview.terminate();

		loadCommunity(getUserProfile(), getCourses());
	});

	//$("#foot").hide();
}

function getHtmlBigItem(title, image_id, description, active) {
	var textHtml = '';

	if (active) {
		textHtml = '<div class="item active">';
	} else {
		textHtml = '<div class="item">';
	}
	
	textHtml += '<div class="media">'
				+ '<a class="pull-left">'
					+ '<img src="/images/dummy_news.png" width="259" height="150" id="' + image_id + '" alt="" class="media-object">'
				+ '</a>'
				+ '<div class="media-body">'
					+ '<h4 class="media-heading" id="blog-first-news-title">' 
						+ title
					+ '</h4>'
					+ '<span id="blog-first-news-description">' 
						+ description
					+ '</span>'
				+ '</div>'
			+ '</div>'
		+ '</div>';
	return textHtml;
}

function loadBlog() {
	var sizeDescMin = 16;
	var sizeTitlMin = 32;
	
	var documentBlog = getBlogDocument();
	if (!documentBlog) return;

	var listItemsBlog = documentBlog.getElementsByTagName('item');

	for (var i = 0; i < listItemsBlog.length; i++) {
		var textItem = "";
		var htmlItem = "";
		var htmlBigItem = "";

		var currentElement = listItemsBlog[i];

		var title = currentElement.getElementsByTagName("title")[0];
		var urlItem = currentElement.getElementsByTagName("link")[0];
		var description = currentElement.getElementsByTagName("description")[0];

		title = title.textContent;
		description = description.textContent;

		urlItem = urlItem.textContent ? urlItem.textContent : urlItem;

		title = title.length > sizeTitlMin ? title.substring(0, sizeTitlMin) + "..." : title;
		description = description.length > sizeDescMin ? description.substring(0, sizeDescMin) + "..." : description;

		textItem = '<b style="font-weight: 900;">' 
						+ title
						+ '</b>'
						+ '<br>'
						+ description;

		htmlItem = getHtmlItem(textItem, urlItem, null, '/images/blogger.png');

		$('#list-blog-entries').append(htmlItem);
	}

	console.log("(!!) End loadBlogs");

}

function loadNews() {
	console.log("(!!) Begin loadNews");
	var documentNews = getNewsDocument();
	if (!documentNews) return;

	var listItemsNews = documentNews.getElementsByTagName('item');
	var active = true;

	var sizeTitlMax = 1024;
	var sizeDescMax = 512;

	for (var i = 0; i < listItemsNews.length; i++) {
		var parser = new DOMParser(); 
		var image_id = "image-news" + (i + 1);
		

		var title = listItemsNews[i].getElementsByTagName("title")[0].textContent;
		var description = listItemsNews[i].getElementsByTagName("description")[0].textContent;
		var urlItem = listItemsNews[i].getElementsByTagName("link")[0];

		htmlDescription = parser.parseFromString(description, "text/html");	
	
		objBody = htmlDescription.getElementsByTagName('body')[0];

		// Guess what? One line validations!
		objDiv = objBody ? objBody.getElementsByTagName('div')[0] : null;
		objImage = objDiv ? objDiv.getElementsByTagName('img')[0] : null;
		imageUrl = objImage ? objImage.getAttribute("src") : null;
	
		description = htmlDescription.getElementsByTagName("body")[0].textContent;

		if (urlItem.textContent) {
			urlItem = urlItem.textContent
		}

		if (title.length > sizeTitlMax) {
			title = title.substring(0, sizeTitlMax);
			title += "...";
		}

		if (description.length > sizeDescMax) {
			description = description.substring(0, sizeDescMax);
			description += "...";
		}
		

		if (active) {
			htmlBigItem = getHtmlBigItem(title, image_id, description, active);
			active = false;
		} else {
			htmlBigItem = getHtmlBigItem(title, image_id, description);
		}

		if (imageUrl) {
			loadImage(imageUrl, function(image, e, id){
				$('#' + id).attr('src', image);
			}, image_id);
		} 
		
		
		$('#list-news-big').append(htmlBigItem);

	} 

	console.log("(!!) End loadNews");
}

function loadDefaultPage() {
	$('#list-forums').html("");
	
	var url = "https://plus.google.com/u/0/115434588634903719038/posts"
	objectName = "Comunidad KVD"
	var classCss = 'item-0';
	var htmlItem = getHtmlItem(objectName, url, classCss);
	$('#list-forums').append(htmlItem);
	$('.' + classCss).attr('src', '/images/kvd_img.jpg');
}

function loadPeopleAndPages() {
	var listPages = [];

	loadDefaultPage();

	// If user doesn't have data on circles then stop getting resources
	if (!getUserCircles() || !getUserCircles().items) {
		return;
	}

	if (getUserCircles().items) {
		listPages = getUserCircles().items;
	}

	listImages = [];

	$('#list-people').html("");
	$('#chat-list').html("");

	var firstTimePeople = 1;

	for (var i = 0; i < listPages.length; i++) { 
		var currentObject = listPages[i];
		var displayName = currentObject.displayName;
		var url = currentObject.url;
		var classCss = 'item-' + (i + 1);
		var imageUrl = currentObject.image.url;
		var objectName = displayName.replace(/\./g, '');
		var htmlItem = getHtmlItem(objectName, url, classCss);

		if (currentObject.objectType == 'person'){ 
			// If there is people on the list then
			// clean list-people panel.
			if (firstTimePeople == 1) {
				
				firstTimePeople = 0;
			}

			$("#list-people").append(htmlItem);
			$("#chat-list").append(htmlItem);
		} else {
			$('#list-forums').append(htmlItem);
		}

		loadImage(imageUrl, function(image, e, classCss){
			$('.' + classCss).attr('src', image);
		}, classCss);
	}
}

function setCommunityEvents() {
	$('.link-community').on('click', function(evt) {
		if ($(this).attr('id') == 'link-news') {
			linkToCommunity(properties.NEWS_URL);

			var itemElement = getItemServiceHtml(properties.SERVICE_NEWS_PORTAL)

			if (listServices.indexOf(itemElement) == -1) {
				listServices.push(itemElement);
			}
		} else {
			var currentService = properties.SERVICE_COMMUNITY;
			var itemElement = getItemServiceHtml(currentService);
			
			linkToCommunity($(this).attr('url'));

			if (listServices.indexOf(itemElement) == -1) {
				listServices.push(itemElement);
			}
		}

		communityEvents();
		
	});
}

function setCommunityResources() {	
	loadPeopleAndPages();
	setCommunityEvents();
	loadBlog();
	loadNews();
}


function communityEvents() {
	var communityWebview = document.getElementById("community-webview");

	communityWebview.addEventListener("loadstart", function(e) {
		$('.community-loading-indicator').html('<img class="loader-image" src="/images/loading.gif"> Cargando...');
	});

	communityWebview.addEventListener("loadredirect", function(e) {
		//$('.community-loading-indicator').html('<img class="loader-image" src="/images/loading.gif"> Cargando...');
	});

	communityWebview.addEventListener("loadstop", function(e) {
		$('.community-loading-indicator').text("");
	});
}

function loadCommunity(profile, courses) {
	var community_tpl = $('#community-tpl').html();
	$('#home-content-container').html(community_tpl);

	//$('#chron1').Chron({});
	//setUserCommunity();
	sidebarActions();
	sideBarEvents();

	startCommunityProcess();
	//setCommunityResources();
	// Load cost services menu
	

	$('#main-nav').removeClass('blue-bg').removeClass('yellow-bg').removeClass('red-bg').removeClass('profile').removeClass('violet-bg');
	$('#main-nav').addClass('red-bg');
	$('#logo-nav').attr('src', '/images/logo_white.png');

	

	$('#return-home').on('click', function(evt){
		evt.preventDefault();
		loadDesktop(profile, courses);
		desktopEvents(profile, courses);
	});

	$('#controlToEducation').on('click', function(evt){
		evt.preventDefault();
		loadEducation(profile, courses);
	});

	$('#controlToProfile').on('click', function(evt){
		evt.preventDefault();
		loadProfile(profile, courses);
	});

	$('#profile-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadProfile(profile, courses);
	});

	$('#education-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadEducation(profile, courses);
	});

	$('#services-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadServices(profile, courses);
	});

	$('#administration-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadAdministration(profile, courses);
	});

	setCommunityEvents();
	//$("#foot").hide();
	// $('#content-container').find('#user-name').text(profile.displayName);
	// $('#content-container').find('#user-mail').attr('src', profile.emails[0].value).text(profile.emails[0].value);
}

function linkToEducation(service) {

	/*
	 * Browser controls for educational services.
	 */

	var embedded_educa_services_tpl = $('#embedded-educa-services-tpl').html();

	$('#home-content-container').html(embedded_educa_services_tpl);

	$("#educa-service-webview").attr("src", service);
	
	$('#educa-browser-back-button').on('click', function(evt) {
		var educaWebview = document.getElementById("educa-service-webview");
		educaWebview.back();
	});

	$('#educa-browser-forward-button').on('click', function(evt) {
		var educaWebview = document.getElementById("educa-service-webview");
		educaWebview.forward();
	});

	$('#educa-browser-home-button').on('click', function(evt) {
		var educaWebview = document.getElementById("educa-service-webview");
		educaWebview.src = service;
	});

	$('#educa-browser-refresh-button').on('click', function(evt) {
		var educaWebview = document.getElementById("educa-service-webview");
		educaWebview.reload();
	});

	$('.back-to-services').on('click', function(evt) {
		var educaWebview = document.getElementById("educa-service-webview");
		educaWebview.terminate();

		loadEducation(getUserProfile(), getCourses());
		requestTimerCreateService(properties.SERVICE_EDUCATIVE_INTERNET, 1);
	});
	
	/*
	 * Loader for educational services
	 */

	var educaWebview = document.getElementById("educa-service-webview");
	
	educaWebview.addEventListener("loadstart", function(e) {
		$('.educa-browser-loading-indicator').html('<img class="loader-image" style="width: 30px; height: 30px;" src="/images/loading.gif">');
	});

	educaWebview.addEventListener('newwindow', function(e) {
		$('#educa-service-webview').attr('src', e.targetUrl);
	});

	educaWebview.addEventListener("loadstop", function(e) {
		$('.educa-browser-loading-indicator').html('');
	});
}

function loadEducation(profile, courses) {
	var community_tpl = $('#educa-services-tpl').html();
	$('#home-content-container').html(community_tpl);
	// var courses_title = '<h3 style="margin-top: 0px;margin-bottom: 30px;">Cursos disponibles <span style="font-weight:100;color:#555;">(' + courses.length + ')</span></h3>';
	// var courses_list = '<div id="courses-container-services-list" class="row">';
	
	$('#main-nav').removeClass('blue-bg').removeClass('yellow-bg').removeClass('red-bg').removeClass('profile').removeClass('violet-bg');
	$('#main-nav').addClass('blue-bg');
	$('#logo-nav').attr('src', '/images/logo_white.png');

	sidebarActions();
	sideBarEvents();

	// $.each(courses,function(n,g){
	// 	var course_image = g.fields.image != "" ? g.fields.image : "images/course.png";
		
	// 	var tags = g.fields.tags.split(',');
	// 	var tags_list = '<ul class="list-inline">';
	// 	var fullUrlImage = properties.getLMSMediaUrl() + course_image;
		
	// 	loadImage(fullUrlImage, function(image, e){
	// 		$('#img-course-' + g.pk).attr('src', image);
	// 	});

	// 	var descrip = $.trim(g.fields.description).substring(0, 180).split(" ").slice(0, -1).join(" ") + "...";
	// 	courses_list += '<div class="col-sm-3 brick">'
	// 		+ '<img src="" id="img-course-' + g.pk + '" class="img-responsive img-center 90s course-image-brick" alt="' + g.fields.name + '">'
	// 		+ '<div><h4>' + g.fields.name + '</h4>'
	// 		+ '<p class="text-muted">' + descrip + '</p>'
	// 		+ '</div></div>';
	// });
	
	//courses_list += '</div>';

	$('#return-home').on('click', function(evt){
		evt.preventDefault();
		loadDesktop(profile, courses);
		desktopEvents(profile, courses);
	});

	// Load cost services menu


	$('.link-edu').on('click', function(evt) {
		
		var itemElement = getItemServiceHtml(properties.SERVICE_EDUCATIVE_INTERNET);

		if (listServices.indexOf(itemElement) == -1) {
			listServices.push(itemElement);
		}

		if ($(this).attr("id") == "lms-link") {
			// var email = getUserProfile().email;
			// var id = getUserProfile().id;
			var url = properties.getLMSCoursesRedirectUrl();
			var embedded_educa_services_tpl = $('#embedded-educa-services-tpl').html();

			$('#home-content-container').html(embedded_educa_services_tpl);
			$("#educa-service-webview").attr("src", url);

			$('.back-to-services').on('click', function(evt) {
				var educaWebview = document.getElementById("educa-service-webview");
				educaWebview.terminate();

				loadEducation(getUserProfile(), getCourses());
				requestTimerCreateService(properties.SERVICE_EDUCATIVE_INTERNET, 1);
			});

			
			linkToEducation(url);
		} else {
			linkToEducation($(this).attr('url'));
		}
	});

	$('#controlToCommunity').on('click', function(evt){
		evt.preventDefault();
		loadCommunity(profile, courses);
	});

	$('#controlToAdministration').on('click', function(evt){
		evt.preventDefault();
		loadAdministration(profile, courses);
	});

	$('#controlToServices').on('click', function(evt){
		evt.preventDefault();
		loadServices(profile, courses);
	});

	$('#profile-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadProfile(profile, courses);
	});

	$('#community-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadCommunity(profile, courses);
	});
	$('#services-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadServices(profile, courses);
	});

	$('#administration-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadAdministration(profile, courses);
	});

	//$("#foot").hide();
}

function linkToService(service) {
	var embedded_services_tpl = $('#embedded-service-tpl').html();
	$('#home-content-container').html(embedded_services_tpl);
	$("#service-webview").attr("src", service);
	var serviceWebview = document.getElementById("service-webview");

	serviceWebview.addEventListener('newwindow', function(e) {
		var newWebview = document.createElement('webview');
		
		document.body.appendChild(newWebview);
		e.window.attach(newWebview);
	});

	$('#browser-back-button').on('click', function(evt) {
		serviceWebview.back();
	});

	$('#browser-forward-button').on('click', function(evt) {
		serviceWebview.forward();
	});

	$('#browser-home-button').on('click', function(evt) {
		serviceWebview.src = service;
	});

	$('#browser-refresh-button').on('click', function(evt) {
		serviceWebview.reload();
	});


	$('#browser-go-button').on('click', function(evt) {
		var redirectUrl = $('#browser-address-bar').val();
		if (redirectUrl.substring(0, 4) != 'http') {
			redirectUrl = 'http://' + redirectUrl;
		}

		serviceWebview.src = redirectUrl;
	});

	$('#browser-form').on('submit', function(evt) {
		var redirectUrl = $('#browser-address-bar').val();
		if (redirectUrl.substring(0, 4) != 'http') {
			redirectUrl = 'http://' + redirectUrl;
		}

		serviceWebview.src = redirectUrl;
	});

	$('.back-to-services').on('click', function(evt) {
		var serviceWebview = document.getElementById("service-webview");
		serviceWebview.terminate();
		
		continueCounter = true;

		var dateAfterTimer = new Date();
		var objDates = differenceBetweenTwoDates(dateAfterTimer, dateBeforeTimer);
		var totalMinutes = objDates.convertToMinutes + 1;
		loadServices(getUserProfile(), getCourses());

		if (listServicesWithoutCost.indexOf(currentService) == -1) {
			requestTimerCreateService(currentService, totalMinutes);
		}

		if (dictServices[currentService]) {
			dictServices[currentService] += totalMinutes;
		} else {
			dictServices[currentService] = totalMinutes;
		}
		
		currentService = null;
	});
}

function loadAdministration(profile, courses){
	var administration_tpl = $('#administration-tpl').html();

	if (profile && courses) {
		$('#home-content-container').html(administration_tpl);
	} else {
		var home = $('#home-tpl').html();
		$('#main-info').html(home);

		$('#home-content-container').html(administration_tpl);
 
		$('#logout').on('click', function() {
			logout();
			loadLogin();
			loadEvents();
		});
		// Hide navigation buttons
		$('#sub-navigation').hide();
		$('.eu-control').hide();
		$('#open-sidebar').hide();
		$('#return-desktop').hide();
	}
	
	$('#main-nav').removeClass('blue-bg').removeClass('yellow-bg').removeClass('red-bg').removeClass('profile').removeClass('violet-bg');
	$('#main-nav').addClass('violet-bg');
	$('#logo-nav').attr('src', '/images/logo_white.png');

	$('#return-home').on('click', function(evt){
		evt.preventDefault();
		loadDesktop(profile, courses);
		desktopEvents(profile, courses);
	});

	sidebarActions();
	sideBarEvents();

	$('#lmsAdmin').on('click', function() {
		if (profile && courses) {
			var email = getUserProfile().emails[0].value;
			var id = getUserProfile().id;

			window.open(properties.getLMSAdminUrl(email, id));
		}
	});

	$('#timerAdmin').on('click', function() {
		window.open(properties.SERVER_ALTERNATIVE_TIMER_URL);
	});

	$('#controlBackToServices').on('click', function(evt){
		evt.preventDefault();
		loadServices(profile, courses);
	});

	$('#controlToEducation').on('click', function(evt){
		evt.preventDefault();
		loadEducation(profile, courses);
	});

	$('#profile-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadProfile(profile, courses);
	});

	$('#community-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadCommunity(profile, courses);
	});

	$('#education-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadEducation(profile, courses);
	});

}



function getItemServiceHtml(service) {
	return "<li class='dropdown-header'>" 
				+ service 
			+ "</li>";
}

function sideBarEvents() {
	$('#side-noticias').on('click', function() {
		loadCommunity(getUserProfile(), getCourses());
		linkToCommunity(properties.URL_GOOGLE_NEWS);
	});

	$('#side-blog').on('click', function() {
		loadCommunity(getUserProfile(), getCourses());
		linkToCommunity(properties.URL_BLOGGER);
	});

	$('#side-foro').on('click', function() {
		loadCommunity(getUserProfile(), getCourses());
		linkToCommunity(properties.URL_GOOGLE_COMMUNITIES);
	});

	$('#side-chat').on('click', function() {
		loadCommunity(getUserProfile(), getCourses());
		linkToCommunity(properties.URL_GOOGLE_PEOPLE);
	});
}

function getHtmlItemService(name, url) {
	var item = '<div class="col-sm-4 external-services">'
				+ '<div class="services-widget">'
					+ '<div class="text-center white">'
						+ '<h1>'
							+ '<a href="#" class="link-service" service="' + name + '" url="' + url + '">'
								+ '<i class="fa fa-globe"></i>'
							+ '</a>'
						+ '</h1>' 
					+ '</div>'
					+ '<div class="white">' + name + '</div>'
				+ '</div>'
			+ '</div>'
	return item;
}

function loadTimerServices() {
	var listTimerServices = [];

	if (!getTimerGetServices()) {
		return;
	}

	if (getTimerGetServices()) {
		listTimerServices = getTimerGetServices().data.servicios;
	}
	
	if (!listTimerServices) {
		return;
	}

	$(".external-services").remove();

	for (var i = 0; i < listTimerServices.length; i++) {
		var currentServiceName = listTimerServices[i].nombre;
		var currentServiceUrl = listTimerServices[i].url;
		var isOmitted = !(listOmittedServices.indexOf(currentServiceName) == -1);

		// If service is not omitted then add it to list of services.
		if (!isOmitted) {
			var serviceHtml = getHtmlItemService(currentServiceName, currentServiceUrl);
			$(".external-services-container").append(serviceHtml);
		}
	}
}

function servicesEvents() {
	var serviceWebview = document.getElementById("service-webview");

	serviceWebview.addEventListener("newwindow", function(e) {
		
	});

	serviceWebview.addEventListener("loadstart", function(e) {
		$('.browser-loading-indicator').html('<img class="loader-image" style="width: 30px; height: 30px;" src="/images/loading.gif">');
		$('.services-loading-indicator').html('<img class="loader-image" src="/images/loading.gif"> Cargando...');
		$('#browser-address-bar').val(serviceWebview.src);
	});

	serviceWebview.addEventListener("loadredirect", function(e) {
		$('#browser-address-bar').val(serviceWebview.src);
	});

	serviceWebview.addEventListener("loadstop", function(e) {
		$('.browser-loading-indicator').text("");
		$('#browser-address-bar').val(serviceWebview.src);
	});
	
}

function offlineTimerSettings() {
	objUserTimerParameters = {
		'ip': currentIpAddress,
		'serviceKey': 'p0sM4rTKv9',
		'service': 'UnifiedDesktop',
		'method': 'kindOfSession',
		'userdata': {
			"sector":"Urbano",
			"ciudad":{
				"depto_id":"",
				"depto_name":"",
				"id":"","name":""
			},
			"correo_electronico":"0",
			"nivel_educativo":"Bachiller",
			"fecha_nacimiento":"1991-12-12",
			"ocupacion": "Independiente",
			"location":"Kiosko",
			"ubication_type":"Vereda",
			"estrato":null,
			"telefono":"3187676588",
			"documento":"111111111",
			"username":"offline",
			"nombre":"Offline",
			"genero":"M",
			"apellido":"User",
			"grupo_etnico":"Rom",
			"otro_telefono":"0",
			"lgbti":"0",
			"address":"0",
			"tipo_documento":"Cedula",
			"edad":"22",
			"situacion_particular":"2,4,8,10,6"
		}
	}
}

function loadServices(profile, courses) {
	var services_tpl = $('#services-tpl').html();
	var isOnline = profile;

	if (isOnline) {
		$('#home-content-container').html(services_tpl);
	} else {
		startCounterCalls = true;

		SystemServices.request.requestLocalIp();

		var home = $('#home-tpl').html();
		$('#main-info').html(home);

		$('#home-content-container').html(services_tpl);
 

		$('#logout').on('click', function() {
			openLogoutDialog();
		});

		eventRateServices();

		$('#return-home').hide();

		// Hide navigation buttons
		$('#sub-navigation').hide();
		$("#services-title").hide();
		$('.eu-control').hide();
		$('#open-sidebar').hide();
		$('#return-desktop').hide();
		
		offlineTimerSettings();
	
		objProfileFields = {
			birthdate: "1991-12-12",
			document: "111111111",
			document_type: "Cedula",
			educational_level: 1,
			ethnical_group: "No pertenece a ningun grupo etnico",
			first_name: "Offline",
			gender: "M",
			last_name: "User",
			mobile_phone: "3189990088",
			ocupation_info: 12,
			sector: "Rural",
			situation: "13",
			socioeconomic_status: "2",
			ubication: "Barrio"
		}

		objUserProfile = {
			avatar_image: "/static/images/default-avatar.png",
			email: "0",
			first_name: "Offline",
			is_staff: false,
			last_name: "User",
			username: "offline"
		}

		TimerServices.request.requestUserTimerData(function(){ });
	}
	
	//$('#chron1').Chron({});

	if (isOnline && objUserProfile && objUserProfile.is_staff) {
		$('.is-admin').show();
		$('.not-admin').hide();
	}else{
		$('.is-admin').hide();
		$('.not-admin').show();
	}

	loadTimerServices();

	sidebarActions();
	sideBarEvents();



	$('#main-nav').removeClass('blue-bg').removeClass('yellow-bg').removeClass('red-bg').removeClass('profile').removeClass('violet-bg');
	$('#main-nav').addClass('yellow-bg');
	$('#logo-nav').attr('src', '/images/logo_white.png');

	$('#return-home').on('click', function(evt){
		evt.preventDefault();
		loadDesktop(profile, courses);
		desktopEvents(profile, courses);
	});

	$('#videoconference').on('click', function(evt) {
		$("#webview-object").attr("src", properties.getVideoConferenceUrl());
		$("#multipurpose-modal").modal("show");
	});

	$('.link-service').on('click', function(evt) {
		currentService = $(this).attr('service');
		
		var urlService = $(this).attr('url');

		if (($(this).attr('id') == 'use-computer') || !checkConnection()) {
			isMinimized = true;
			console.log('(i) El Escritorio Unificado se ha minimizado.');
			chrome.app.window.current().minimize();

			var itemElement = getItemServiceHtml(currentService);

			dateBeforeTimer = new Date();

			if (listServices.indexOf(itemElement) == -1) {
				listServices.push(itemElement);
			}

			// This thing send to xapi data of services
			sendToXAPI("service", "/", currentService);
			

			return false;
		}


		/* 
		 * If counter doesn't start then the user can't
		 * access to any service except if the service is on listServices Without cost
		 */ 
		if (!startCounter && listServicesWithoutCost.indexOf(currentService) == -1){
			return false;
		}
		
		if (isPrepago && listServicesWithoutCost.indexOf(currentService) != -1) {
			console.log("Continue Counter: " + continueCounter);
			continueCounter = false;
		} else {
			continueCounter = true;
		}
		
		if (listNewWindowServices.indexOf(currentService) != -1) {
			/*window.open(urlService);
			return false;*/
		}

		var itemElement = getItemServiceHtml(currentService);

		if (currentService == BROWSER_SERVICE) {
			$(".services-loading-indicator").hide();
			$("#browser-bar").show();
		} else {
			$(".services-loading-indicator").show();
			$("#browser-bar").hide();
		}

		linkToService(urlService);

		if (currentService) {
			dateBeforeTimer = new Date();
			if (listServices.indexOf(itemElement) == -1) {
				listServices.push(itemElement);

				// This thing send to xapi data of services
				sendToXAPI("service", urlService, currentService);
			}
			
			
		}
		
		servicesEvents();
	});

	$('#load-administration').on('click', function(evt){
		$('#main-nav').removeClass('yellow-bg').addClass('violet-bg');
		loadAdministration(profile, courses);
	});

	$('#controlToEducation').on('click', function(evt){
		evt.preventDefault();
		loadEducation(profile, courses);
	});

	$('#profile-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadProfile(profile, courses);
	});

	$('#community-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadCommunity(profile, courses);
	});

	$('#education-sub-menu').on('click', function(evt){
		evt.preventDefault();
		loadEducation(profile, courses);
	});

	//$("#foot").hide();
}

function validateEditProfile() {
	var keepSearch = true;
	var listKeys = Object.keys(getUserEditProfile());
	var email = getUserProfile().email;
	
	// TODO: Fix this, this is for testing
	for (var i = 0; i < listKeys.length; i++) { 
		var currentValue = getUserEditProfile()[listKeys[i]];
		if ((currentValue == null || currentValue == "" || currentValue == "0") && keepSearch) {
			$("#email-complete-profile").text(email);
			
			$("#modal-complete-profile").modal({
				backdrop: 'static',
				keyboard: false
			});
			$("#modal-complete-profile").modal("show");
			keepSearch = false;
		}
	}

	$('#link-edit-profile').addClass('disabled');
}

function eventRateServices() {
	$('#btn-rate-services').on('click', function(event) {
		var rateValue = $("#rating-service input").val();
		var rateComment = $("#rating-comment").val();

		if (rateValue) {
			
			$("#modal-closes-session").modal('hide');
			logout();
			logout();
		}

		if (rateComment) {
			requestXAPIPoll('poll', rateComment);
		}

		$("#rating-comment").val("");
	});
}


/* This function loads the desktop */
function loadDesktop(profile, courses) {
	LearningServices.request.requestLoginToLMS();
	var home = $('#home-tpl').html();
	var imageUrl = "";

	if (profile && profile.avatar_image) {
		imageUrl = profile.avatar_image;
	}

	$('.permission-warning').hide();
	loginSetup(); 
	// Validations for profile
	validateEditProfile();
	//$("#foot").show();

	$('#main-info').html(home);
	if (objUserProfile && objUserProfile.is_staff) {
		$('.is-admin').show();
		$('.not-admin').hide();
	} else {
		$('.is-admin').hide();
		$('.not-admin').show();
	}

	$('#main-info').find('#user-name').text(profile.displayName);
	$('#main-info').find('#nav-user-name').text(profile.displayName);

	loadImage(imageUrl, function(image, e){
		$('#main-info').find('#nav-user-image')
			.attr('alt', profile.displayName)
			.attr('src', image);

		$('#main-info').find('#user-image')
			.attr('alt', profile.displayName)
			.attr('src', image);
	});

	$("#chat-btn").on('click', function(event) {
		console.log("(1) Click chat btn");
		setCommunityResources();
	});

	$('#link-edit-profile').on('click', function() {
		showEditProfileCancelButton = false;
		loadEditProfile(profile, courses);
		$('#modal-complete-profile').modal('hide');
	});

	$('#accept-tos').on('click', function(event) {
		var acceptToS = $(this).is(':checked');
		if (acceptToS == true) {
			$('#link-edit-profile').removeClass('disabled');
		} else {
			$('#link-edit-profile').addClass('disabled');
		}
	});

	if (courses) {
		$('#main-info').find('#courses-count').text(courses.length);
		$('#main-info').find('#badges-count').text("0");
	}

	eventRateServices();
	// Load cost services menu
	

	clearInterval(intervalGoogleAccount);
}

/*
 * End of screen redirections
 */ 

/*
 * Events used after login
 */
function afterLoginEvents(profile, courses) {
	$("#loading-message").hide();
	var loginWebviewObject = document.getElementById("login-google-services");
	loginWebviewObject.terminate();

	var profile = getUserProfile();
	var courses = getCourses();
	
	/* 
	 * If the user is not administrator then
	 * don't request for the counter.
	 */
	if (isAdministrator) {
		var keys = ["managers"];

		chrome.storage.local.get(keys, function(result){
			var managers = result["managers"];
			var email = profile.emails[0].value;
			
			if (!managers) {
				managers = "";
			}

			managers += email + ";"
			chrome.storage.local.set({"managers": managers});
		});
	} else {
		var keys = ["users"];

		chrome.storage.local.get(keys, function(result){
			var users = result["users"];
			var email = profile.emails[0].value;
			
			if (!users) {
				users = "";
			}

			users += email + ";"
			chrome.storage.local.set({"users": users});
		});

		beforeCloseSessionListener();
	}
	
	loadDesktop(profile, courses);
	desktopEvents(profile, courses);
}

function loginSetup() {
	$("#multipurpose-modal").modal("hide");
	$("#login-google-services").attr("src", properties.getGoogleServicesUrl());
}

function openLoginDialog(loginUrl) {
	var url = properties.getOpenWidowPopupUrl(
		properties.getOpenLoginWidowPopupUrl(
			(
				loginUrl
			)
		).replace(/&/g, 'xANDx').replace(/\?/g, 'xQUESTIONMARKx')
	)
	window.open(url);
}

function openLogoutDialog() {
	$("#modal-closes-session").modal({
		backdrop: 'static',
		keyboard: false
	});

	$('#modal-closes-session').modal('show');
	$('#rating-service').raty();	
}

var openOnce = true;

function listenerGoogleAccount(webviewObject, callback) {
	intervalGoogleAccount = setInterval(function() {
		if (continueLoginStatus) {
			webviewObject.executeScript({
				code: 'var form = document.getElementsByTagName("form");'
					+ 'var id = form.length > 0 ? form[0].id : "";'
					+ '"" + id'
			}, function(result) { 
				callback(result);
			});
		}
	}, 5000);
}

/*
 * Webview Login Events: because we need separate it into a function.
 */
/* @deprecated */
function webviewLoginEventsOld() {
	var webviewObject = document.getElementById("webview-object");

	// webview id: webview-object
	webviewObject.addEventListener('loadstop', function(e) {
	//webviewObject.addEventListener('loadredirect', function(e) {
		listenerGoogleAccount(webviewObject, function(result) {
			var status = result[0];

			if (status == 'connect-approve') {
				timesLoginMessage = 0;
				enableNoConnectionPermission = true;
				//$(".permission-warning").show();
				$("#loading-message").hide();

				$("#create-account").removeAttr("disabled");
			}

			if (status == 'connect-approve') {
				timesLoginMessage = 0;
				enableNoConnectionPermission = true;
			}

			if (status == '') {
				if (enableNoConnectionPermission == true) {
					timesLoginMessage = 0;

					$("#webview-object").attr("src", properties.LOGIN_URL);
					enableNoConnectionPermission = false;
				}

				if (timesLoginMessage == TIMES_TO_WAIT_UNTIL_LOGIN) {
					timesLoginMessage = 0;

					// Load JSON data on view
					GoogleServices.request.strWebviewId = "login-google-services";
					GoogleServices.request.strServiceUrl = properties.getGoogleServicesProfileJSONUrl();
					GoogleServices.request.loadJSONWebview();

					continueRequest = true;
					
					$("#webviewLoginDiv").html('');
					$("#multipurpose-modal").modal("hide");
					
					$('.div-prelogin-loading').addClass('hidden');

					$("#modal-welcome").modal({
						backdrop: 'static',
						keyboard: false
					});
				}
				timesLoginMessage++;
			}
		});
	});
}

function webviewLoginEvents() {
	var secondTime = 0;
	var webviewObject = document.getElementById("webview-object");

	webviewObject.addEventListener('loadstop', function(e) {
		var lmsUrl = properties.LMS;
		console.log("intento", secondTime);
		console.log("webview-object", webviewObject);
		var currentUrl = webviewObject.src;
		console.log("currentUrl", currentUrl);
		var urlFirstPart = currentUrl.substring(0, lmsUrl.length);
		console.log(urlFirstPart);
		console.log("secondTime: " + secondTime);
		console.log("currentUrl: " + currentUrl);

		if (secondTime > 0 && urlFirstPart.indexOf(lmsUrl) != -1) {
			// Load JSON data on view
			GoogleServices.request.strWebviewId = "login-google-services";
			GoogleServices.request.strServiceUrl = properties.getGoogleServicesProfileJSONUrl();
			GoogleServices.request.loadJSONWebview();

			continueRequest = true;
			
			$("#webviewLoginDiv").html('');
			$("#multipurpose-modal").modal("hide");
			
			$('.div-prelogin-loading').addClass('hidden');

			$("#modal-welcome").modal({
				backdrop: 'static',
				keyboard: false
			});
		}

		secondTime++;
	});
}

/*
 * Webview Create Account Events: Because the best things take time.
 */
function webviewCreateAccountEvents() {
	var webviewCreateAccount = document.getElementById("create-account-webview-object");
}

/*
 * Login Events: Because every afterLoginEvents needs a loginEvents.
 */
function loginEvents() {
	$('#online-button-login').click(function() {
		AccountView.showLoginScreen();
	});

	$("#close-login-modal").on('click', function() {
		clearInterval(intervalGoogleAccount);
		$("#webviewLoginDiv").html('');

		//$("#refresh-login").click();
		loginEvents();
	});
}


/*
 * Create Account Events: This functions is created just for fun... and
 * a little of order.
 */
function createAccountEvents() {
	$('#create-account').on('click', function() {
		AccountView.showCreateAccountScreen();
	});

	$("#create-account-close-button").on('click', function(){
		$("#webviewCreateAccountDiv").html('');

		if (enableNoConnectionPermission == true) {
			$("#multipurpose-modal").modal({
				backdrop: 'static',
				keyboard: false
			});

			$("#multipurpose-modal").modal('show');
		}

		//$("#refresh-login").click();
		createAccountEvents();
	});
}

function loadEvents() {
	var webviewMultipurposeObject = document.getElementById("multipurpose-webview-object");
	var webviewLogoutObject = document.getElementById("logout-webview-object");
	var webviewLoadServices = document.getElementById("login-google-services");
	
	var control = 0;
	
	webviewLogoutObject.addEventListener('loadstop', function(e) {
		// Load Once
		if (control == 0) {
			$("#online-button-login").removeClass("disabled");
			control = 1;
		}
	});
	
	/*
	 * User login 
	 */
	loginEvents();

	/*
	 * Create account
	 */
	createAccountEvents();

	$('#activate-offline-mode').on('click', function() {
		loadLogin();
		loadEvents();
		$('#online-div').hide();
		$('#offline-div').show();
	});

	$('.refresh-login').on('click', function() {
		$('.modal-welcome-error-message').addClass('hidden');
		$('.modal-welcome-connection-error-message').addClass('hidden');
		$('.div-prelogin-loading').addClass('hidden');

		logout();
	});
	
	$('#activate-online-mode').on('click', function() {
		logout();
		$('#online-div').show();
		$('#offline-div').hide();
	});

	// webview id: login-google-services
	webviewLoadServices.addEventListener('newwindow', function(e) {
		googleLoginUrl = e.targetUrl;
		/*
		 * We see...
		 */
		/* $("#webview-object").attr("src", googleLoginUrl);

 		$("#multipurpose-modal").modal({
		  backdrop: 'static',
		  keyboard: false
		});

		$("#multipurpose-modal").modal('show');
		*/
	});

	webviewLoadServices.addEventListener('loadstop', function(e) {
		//$("#loading-message").attr("style", "display: none;");
		//$("#loading-message").text("Organizando tus datos...");
	});
}

function beforeCloseSessionListener() {
	setInterval(function() {
		if(isCloseSessionMessage && sessionType == 'Prepago' && $("#hours").text() == "00" && $("#minutes").text() == "05" && $("#seconds").text() == "00") {
			isCloseSessionMessage = false;

			$("#modal-before-closes-session").modal({
				backdrop: 'static',
				keyboard: false
			});
			$("#modal-before-closes-session").modal("show");
		}
	}, 1000);
}

function clearUserData() {
	userAge = null;
	listServices = [];
	dictServices = {};
	lastAlert = null;

	isCounterOver = false;
	startCounterCalls = false;
	continueCounter = false;

	
	
	objListAwards = null;
	objUserProfile = null;
	objUserCircles = null;
	objNewsDocument = null;
	objBlogDocument = null;
	objProfileFields = null;
	objTimerServices = null;
	objUserTimerData = null;
	objUserDriveData = null;
	objUserActivities = null;
	objLMSUserProfile = null;
	objTimerSaveRating = null;
	objTimerGetServices = null;	
	objRecurrentRequest = null;
	objTimerCreateService = null;
	objUserTimerParameters = null;

	objUserEditProfile = {
		'sector': null,
		'document': null,
		'last_name': null,
		'ubication': null,
		'situation': null,
		'first_name': null,
		'mobile_phone': null,
		'document_type': null,
		'ocupation_info': null,
		'ethnical_group': null,
		'educational_level': null,
		'socioeconomic_status': null,
	};

	loadDesktopOnce = true;
	continueRequest = false;
	continueUserDataRequest = false;
}

function clearCounter() {
	$("#seconds").text("00");
	$("#minutes").text("00");
	$("#hours").text("00");
}

function logoutLMS() {
	$('#multipurpose-webview-object').attr('src', properties.getLMSLogoutUrl());
	logoutUserLMS();
}

function logoutUser() {
	clearUserData();
	
	logoutLMS();

	sessionStatus = 'closed';
	startCounter = false;
	currentService = null;
	desktopIsLoaded = false;

	clearCounter();

	if (currentService) {
		var dateAfterTimer = new Date();
		var objDates = differenceBetweenTwoDates(dateAfterTimer, dateBeforeTimer);
		requestTimerCreateService(currentService, objDates.convertToMinutes);
	}

	var loginGoogleWebview = document.getElementById("login-google-services");
	loginGoogleWebview.terminate();

	$(".external-services").remove();

	// Delete webview to listen any object
	GoogleServices.request.strWebviewId = null;

	clearInterval(intervalListener);
	clearInterval(intervalGoogleAccount);
	clearInterval(intervalCounter);
}

/* This function loads the login screen */
function loadLogin() {
	LogUser.getLastLog(function(log) {
		lastLog = log;
		var oldObjUserTimerData = JSON.parse(lastLog.objUserTimerData);

		if (oldObjUserTimerData && oldObjUserTimerData.data) {
			lastStartOfSession = oldObjUserTimerData.data.startOfSession;
		}
	});

	var loginTemplate;
	var condition = checkConnection();

	// Closes the logout webview
	var webviewLogoutObject = document.getElementById("logout-webview-object");
	webviewLogoutObject.terminate();

	timesLoginMessage = 0;
	
	//$("#online-button-login").addClass("disabled");
	$("#create-account").removeAttr("disabled");
	$("#loading-message").show();

	$("#used-services-list").html('');
	$("#used-services-list").append(
		'<li class="dropdown-header">Ninguno</li>'
	);

	loginTemplate = $('#online-login-tpl').html();
	$('#main-info').html(loginTemplate);

	if(!condition){
		// Offline toggle
		$('#online-div').hide();
		$('#offline-div').show();
		//loginTemplate = $('#offline-login-tpl').html();
	} else {
		// Online toggle
		$('#online-div').show();
		$('#offline-div').hide();
	}

	$("#loading-message").text("");
	initialSetup();

	$("#refresh-login").click();

	// With this button the user enter into Unified Desktop
	$('.btn-prelogin-ok').on('click', function(event) {
		$('.div-prelogin-loading').addClass('hidden');
		$('.modal-welcome-connection-error-message').addClass('hidden');
		$('.modal-welcome-error-message').addClass('hidden');
		$('.modal-welcome-server-error-message').addClass('hidden');
		loginUnifiedDesktop(); 
	});

	$('#offline-button-login').on('click', function() {
		var keys = ["managers", "users"];
		var offlineEmail = $('#offline-input-login').val();

		if (!offlineEmail) {
			return;
		}

		if (offlineEmail == properties.OFFLINE_USER) {
			isOfflineUser = true;
			loadServices(null, null);
		} else if (offlineEmail == properties.OFFLINE_MANAGER) {
			isOfflineUser = true;
			loadAdministration(null, null);
		} else {
			isOfflineUser = true;
			chrome.storage.local.get(keys, function(result){
				console.log('(+) Offline Login');
				// Admin
				var listManagerEmails = [];
				var listStudentEmails = [];
				console.log('(+) Offline Login');
				// var thereIsAdmin = false;
				var offlineEmail = $('#offline-input-login').val();
				var managerEmails = result["managers"];
				var studentEmails = result["users"];
				console.log('(+) Offline Login');

				managerEmails = managerEmails ? managerEmails.replace(/ /g, '').replace(' ', '') : '';
				studentEmails = studentEmails ? studentEmails.replace(/ /g, '').replace(' ', '') : '';

				//console.log('managerEmails: ' + managerEmails);
				//console.log('studentEmails: ' + studentEmails);
				listManagerEmails = managerEmails.split(";");
				listStudentEmails = studentEmails.split(";");
				console.log('(+) Offline Login');
				if (listManagerEmails.indexOf(offlineEmail) != -1) {
					// thereIsAdmin = true;
					loadAdministration(null, null);
				}
				console.log('(+) Offline Login');
				if (listStudentEmails.indexOf(offlineEmail) != -1) {
					// thereIsAdmin = false;
					loadServices(null, null);
				}

				console.log('(+) Offline Login');
				if (listManagerEmails.indexOf(offlineEmail) == -1 && listStudentEmails.indexOf(offlineEmail) == -1) {
					$('.offline-error-alert').removeClass('hidden');
				}

			});
		}
	});
}

/* 
 * Things that need to be loaded first
 * like properties parameters
 */
function initialSetup() {
	$("#logout-webview-object").attr("src", properties.LOGOUT_URL);
}

/*
 * This function apply calendar Styles
 */
function applyCalendarStyles() {
	var webviewCalendar = document.getElementById("webview-calendar");

	webviewCalendar.addEventListener('loadstop', function () {
		webviewCalendar.insertCSS({code: "body{padding-top:0px !important;}"});
		webviewCalendar.executeScript({ 
			code: "document.getElementsByClassName('navbar')[0].remove();"
		});
	});
}

/*
 * Listener that controls fullscreen changes, will resize to fullscreen
 * again.
 */
function fullScreenListener() {
	intervalFullscreen = setInterval(function() {
		var isFullscreen = chrome.app.window.current().isFullscreen();

		// If the application is not full screen then turn fullscreen
		if (!isFullscreen){
			chrome.app.window.current().fullscreen();
		} 
	}, 100);
}


/*
 * Listener for minimized window
 */
function minimizedListener() {
	intervalMinimized = setInterval(function() {
		var isFullscreen = chrome.app.window.current().isFullscreen();
		var isMinimized = chrome.app.window.current().isMinimized();

		if (isMinimized == true) {
			startOfflineCounter = true;
		}

		if (isMinimized == false && startOfflineCounter) {
			startOfflineCounter = false;
			var dateAfterTimer = new Date();
			var objDates = differenceBetweenTwoDates(dateAfterTimer, dateBeforeTimer);
			var minutes = objDates.convertToMinutes + 1;

			var itemElement = getItemServiceHtml(currentService);

			if (listServices.indexOf(itemElement) == -1) {
				listServices.push(itemElement);
			}

			if (dictServices[currentService]) {
				dictServices[currentService] += minutes;
			} else {
				dictServices[currentService] = minutes;
			}

			

			requestTimerCreateService(currentService, minutes);
		}

	}, 1000);
}

/*
 * Ask if the session is still alive on localstorage.
 */
function isSessionStillAlive() {
	isAlive = false;

	if (lastLog && objUserProfile) {
		isAlive = objUserProfile.email == lastLog.email && lastLog.status == 'open';
	}

	return isAlive;
}

/*
 * Get the last session time.
 */
function setLastSessionTime() {
	var lastTimer = lastLog.time.split(':');
	kindOfSession = lastLog.type;

	$("#hours").text(lastTimer[0]);
	$("#minutes").text(lastTimer[1]);
	$("#seconds").text(lastTimer[2]);

	nuHours = parseInt(lastTimer[0]);
	nuMinutes = parseInt(lastTimer[1]);
	nuSeconds = parseInt(lastTimer[2]);

	objUserTimerData = JSON.parse(lastLog.objUserTimerData);

	if (kindOfSession == 'Prepago') {
		regressiveCounter(nuHours, nuMinutes, nuSeconds);
	} else if (kindOfSession == 'Pospago') {
		progresiveCounter(nuHours, nuMinutes, nuSeconds);
	}
}


/*
 *  Do login to Unified Desktop with some validations.
 */
function loginUnifiedDesktop() {
	$(".div-prelogin-loading").removeClass("hidden");

	if (!objUserProfile) {
		GoogleServices.request.requestObject(function(objElement) {
			// Get Profile
			objUserProfile = objElement;

			console.log(objUserProfile);
			console.log("(+) Get Google Profile");

			LearningServices.request.requestLoginToLMS(function() {
				console.log("(+) Get LMS Login.");
				LearningServices.request.requestProfileEditValues(function() {
					console.log("(+) Get Profile edit.");
					// Profile data from LMS
					LearningServices.request.requestProfileData(function() {
						console.log("(+) Get Profile data.");

							// Open EU
							loadLoginSettings();
							$(".div-prelogin-loading").removeClass("hidden");
							return;
					});
				});
				
			});
		}, function () { // Function that manages server error
			$(".div-prelogin-loading").addClass("hidden");
			$('.modal-welcome-server-error-message').removeClass("hidden");
		});
	}
	
}

/*
 * This method load login settings with user data from
 * LMS.
 */
function loadLoginSettings() {
	continueCounter = true;
	
	if (objUserProfile) {
		LearningServices.request.requestCourses(function() {
			$("#modal-welcome").modal('hide');
			$('#btn-enter-eu').removeClass("disabled");

			//loadDesktop(objUserProfile, objCourses);
			//desktopEvents(objUserProfile, objCourses);
			afterLoginEvents(objUserProfile, objCourses);

			// Blogs
			ExternalServices.request.requestHtmlDocument(properties.getBlogFeedUrl(), 'blogs');

			// News
			ExternalServices.request.requestHtmlDocument(properties.getNewsFeedUrl(), 'news');

			// This sentences will call circles load
			GoogleServices.request.strWebviewId = "multipurpose-webview-object";
			GoogleServices.request.strServiceUrl = properties.getGoogleServicesCirclesJSONUrl();
			GoogleServices.request.loadJSONWebview();
			console.log("(+) Circles request sended");

			desktopIsLoaded = true;
			startCounterCalls = true;
		});
	} // End if
}

/*
 * This method iniciate community data request.
 */
function startCommunityProcess() {
	intervalCommunity = setInterval(function() {
		if (!objUserCircles && desktopIsLoaded) {
			GoogleServices.request.requestObject(function(objElement) {
				objUserCircles = objElement;
				console.log(objUserCircles);
				setCommunityResources();
				clearInterval(intervalCommunity);
			});
		}
	}, 500);
	
		
	setCommunityResources();

}

/* Set ready events */
$(document).on('ready', function(){
	loadLogin();
	loadEvents();
});

// Things that need to be loaded first
initialSetup();

/*
 * Global listeners
 */
alertListener();
//loginListener();
counterListener();
minimizedListener();
fullScreenListener();

/*
 * Request IP address
 */ 
SystemServices.request.requestLocalIp();

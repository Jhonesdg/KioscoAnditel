var properties = {
	/*
	 * Attributes
	 */
	
	//LMS: "http://anditel.mooc4.org/",
	LMS: "http://anditel.mooc4.org/",
	KMELX_URL: "http://www.kmelx.com/",
	OFFLINE_MANAGER: "gestor1",
	OFFLINE_USER: "usuario1",
	//LMS: "http://anditel.mooc4.info:5000/",
	//LMS: "http://anditel.mooc4.info/",

	SERVER_TIMER_URL: "http://10.20.20.20:8080/",
	SERVER_ALTERNATIVE_TIMER_URL: "http://127.0.0.1:8080/posmart_kiosko/",
	LOGOUT_URL: "https://accounts.google.com/Logout?hl=es",
	SIGNUP_URL: "https://accounts.google.com/SignUp?hl=es",
	//LOGIN_URL: "https://accounts.google.com/o/oauth2/auth?client_id=1098043072371-qi5j6qggbe25omgev695i0lfvv5ljs4s.apps.googleusercontent.com&redirect_uri=postmessage&response_type=code%20token%20id_token%20gsession&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fblogger%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar%20https%3A%2F%2Fwww.google.com%2Fm8%2Ffeeds%2F%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.appdata%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.scripts%20https%3A%2F%2Fmail.google.com%2Fmail%2Ffeed%2Fatom%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.login%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.me%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutubepartner&include_granted_scopes=true&proxy=oauth2relay1072223428&origin=http%3A%2F%2Fanditel.mooc4.org&state=399103771%7C0.1351558&authuser=0&e=3100077",
	//LOGIN_URL: "https://accounts.google.com/o/oauth2/auth?client_id=1098043072371-qi5j6qggbe25omgev695i0lfvv5ljs4s.apps.googleusercontent.com&redirect_uri=postmessage&response_type=code+token+id_token+gsession&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fblogger+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar+https%3A%2F%2Fwww.google.com%2Fm8%2Ffeeds%2F+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.appdata+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.scripts+https%3A%2F%2Fmail.google.com%2Fmail%2Ffeed%2Fatom+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.me+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutubepartner&cookie_policy=single_host_origin&include_granted_scopes=true&proxy=oauth2relay287388041&origin=http%3A%2F%2Fanditel.mooc4.org&state=239077315%7C0.2923839996&&e=3100077&pageId=none",
	ACCOUNT_SETTINGS_URL: "https://www.google.com/settings/personalinfo",
	NEWS_URL: "http://noticiaskdv.blogspot.com/",
	BLOG_URL: "http://www.mintic.gov.co/portal/604/rss3-propertyvalue-596.rss",
	IP_URL: "http://l2.io/ip/",
	/*** Services ***/
	SERVICE_EDUCATIVE_INTERNET : "Internet educativo",
	SERVICE_NEWS_PORTAL: "Portal de noticias",
	SERVICE_SURFING_THE_INTERNET: "Navegar por internet",
	SERVICE_COMMUNITY: "Comunidad virtual",
	/*** Urls ***/
	URL_BLOGGER: "http://www.blogger.com",
	URL_GOOGLE_NEWS: "http://news.google.com",
	URL_GOOGLE_PEOPLE: "https://plus.google.com/people/find",
	URL_GOOGLE_COMMUNITIES: "https://plus.google.com/communities",

	/*** Functions ***/
	getLoginUrl: function() {
		var loginUrl = this.LMS;

		loginUrl += "login/google-oauth2/?next=/api/json_current_user_data/?html=1";
		return loginUrl;
	},
	getGoogleServicesUrl: function() {
		return this.LMS + "google_integration/google_services/" + requestSessionParameter();
	},
	getGoogleServicesProfileJSONUrl: function() {
		return this.LMS + "api/json_current_user_data/";
	},
	getGoogleServicesCirclesJSONUrl: function() {
		return this.LMS + "google_integration/google_set_circles/" + requestSessionParameter();
	},
	getProfileDataUrl: function(attribute) {
		return this.LMS + "google_integration/show_user_information/?" 
		+ "session_id=" + getUserSessionKey()
		+ "&"
		+ "attribute=" + attribute;
	},
	getCoursesUrl: function(page, limit) {
		return this.LMS + "lms/courses/json/fetch_available_courses/?"
		+ "page=" + page
		+ "&"
		+ "limit=" + limit
	},
	getLMSGoToCoursesUrl: function() {
		return this.LMS + "lms/courses/";
	},
	getLMSLoginUrl: function(username, token) {
		return this.LMS + "api/simple_login/?uid=" + username + "&tid=" + token;
	},
	getLMSLoginRedirectUrl: function(email, id) {
		return this.LMS + "google_integration/google_login_redirect/?" 
		+ "email=" + email
		+ "&"
		+ "google_user_id=" + id;
	},
	getOpenWidowPopupUrl: function(targetUrl) {
		return properties.LMS + "google_integration/open_popup_window/"
			+ "?"
			+ "next=" + targetUrl; 
	},
	getOpenLoginWidowPopupUrl: function(targetUrl) {
		return properties.LMS + "google_integration/open_popup_window/"
			+ "?"
			+ 'user_session_key=' + getUserSessionKey()
			+ '&'
			+ 'is_login=1'
			+ '&'
			+ "next=" + targetUrl; 
	},
	getOpenCourseUrl: function(uuid) {
		return properties.LMS + "lms/course/" + uuid + "/"; 
	},
	getLMSCoursesRedirectUrl: function() {
		return this.LMS;
	},
	getLMSLogoutUrl: function() {
		return this.LMS + "account/logout/";
	},
	getLMSMediaUrl: function() {
		return this.LMS + "media/";
	},
	getLMSListAwardsUrl: function() {
		return this.LMS + "api/json_list_awards/";
	},
	getLMSUserLogoutUrl: function() {
		return this.LMS + "api/json_logout/";
	},
	getNewsFeedUrl: function() {
		return this.NEWS_URL + "feeds/posts/default?alt=rss";
	},
	getBlogFeedUrl: function() {
		return this.BLOG_URL;
	},
	getTimerDataUrl: function() {
		return this.SERVER_TIMER_URL + "posmart_kiosko/controller";
	},
	getVideoConferenceUrl: function() {
		return "https://hangoutsapi.talkgadget.google.com/hangouts/_?gid=s~nmhangouts";
	},
	getUserTimerParametersUrl: function() {
		return this.LMS + "api/get_profile_data/";
	},
	getUserSaveProfileDataUrl: function() {
		return this.LMS + "api/set_profile_data/";
	},
	getInscribeUserToGroupUrl: function() {
		return this.LMS + "api/inscribe_user_to_group/";
	},
	getProfileFieldsUrl: function() {
		return this.LMS + "api/get_all_profile_fields/";
	},
	getAlertsUrl: function() {
		return this.LMS + "community/get_last_notice/";
	},
	getLMSAdminUrl: function(email, id) {
		return this.LMS + "google_integration/google_login_redirect/?" 
			+ "email=" + email
			+ "&"
			+ "google_user_id=" + id
			+ "&"
			+ "next=/general/reports/";
	},
	getTimerAdminUrl: function() {
		return this.SERVER_TIMER_URL + 'posmart_kiosko/';
	},
	getGoogleCreateAccountUrl: function() {
		return this.SIGNUP_URL;
	}
}

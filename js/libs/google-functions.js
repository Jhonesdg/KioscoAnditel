/*(function() {
  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/client:plusone.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})(); */

var profile = null;
var email = null;

/**
 * Utility function to show or hide elements by their IDs.
 */
function toggleElement(id) {
    var el = document.getElementById(id);
    if (el.getAttribute('class') == 'hide') {
        el.setAttribute('class', 'show');
    } else {
        el.setAttribute('class', 'hide');
    }
}

/**
 * BR DOM object
 */
function br() {
  return "<br>";
}

/**
 * Display profile data
 */
function displayProfile(profile){
    var listOrganizations = profile["organizations"];
    listOrganizations = listOrganizations == undefined ? [] : listOrganizations;

    var listPlacesLived = profile["placesLived"];

    document.getElementById('profile').innerHTML += '<img src="' + profile['image']['url'] + '" />' + br();
    document.getElementById('profile').innerHTML += profile['displayName'] + br();
    document.getElementById('profile').innerHTML += email + br();
    document.getElementById('profile').innerHTML += '<a href="' + profile["url"] + '">Google Plus Profile</a>' + br();
    document.getElementById('profile').innerHTML += profile["occupation"] + br();
    document.getElementById('profile').innerHTML += profile["skills"] + br();
    document.getElementById('profile').innerHTML += "Organizations:" + br();

    for(var i = 0; i < listOrganizations.length; i++) {
        document.getElementById('profile').innerHTML += '<li>' + listOrganizations[i]["name"] + '</li>';
    }

    document.getElementById('profile').innerHTML += "Ciudades:" + br();

    for(var i = 0; i < listPlacesLived.length; i++) {
        document.getElementById('profile').innerHTML += '<li>' + listPlacesLived[i]["value"] + '</li>';
    }

    document.getElementById('profile').innerHTML += br();
    document.getElementById('profile').innerHTML += "Applications:";
    document.getElementById('profile').innerHTML += "<li><a href='http://drive.google.com' target='_blank'>Google Drive</a></li>";
    document.getElementById('profile').innerHTML += "<li><a href='http://mail.google.com' target='_blank'>Gmail</a></li>";
    document.getElementById('profile').innerHTML += "<li><a href='http://calendar.google.com' target='_blank'>Calendar</a></li>";
    document.getElementById('profile').innerHTML += "<li><a href='http://youtube.com' target='_blank'>YouTube</a></li>";
    document.getElementById('profile').innerHTML += br();
    document.getElementById('profile').innerHTML += "<a href='https://accounts.google.com/Logout?hl=es'>Salir</a>"
    document.getElementById('profile').innerHTML += br();
    document.getElementById('profile').innerHTML += br();

    toggleElement('profile');

    $.post('/')
    
}

var auth = null;
/**
 * This method is called when user is logged in and after click login button
 */
function signinCallback(authResult) {
  console.log(" (+) Call Callback");
  auth = authResult;
  if (authResult['status']['signed_in']) {
    // Update the app to reflect a signed in user
    // Hide the sign-in button now that the user is authorized, for example:
    gapi.client.load('plus','v1', function() {
        var request = gapi.client.plus.people.get({
            'userId': 'me'
        });

        request.execute(function(obj) {
            profile = obj;

            // Filter the emails object to find the user's primary account, which might
            // not always be the first in the array. The filter() method supports IE9+.
            email = obj['emails'].filter(function(v) {
                return v.type === 'account'; // Filter out the primary email
            })[0].value; // get the email from the filtered results, should always be defined.

            displayProfile(profile);
            document.getElementById('signinButton').setAttribute('style', 'display: none;');
        });
    });

    gapi.client.load('drive','v2', function() {
      var request = gapi.client.drive.files.list();

      request.execute(function(obj){ 
        var listItems = obj["items"];

        document.getElementById('profile').innerHTML += br();
        document.getElementById('profile').innerHTML += "Documents:";

        for(var i = 0; i < listItems.length; i++) {
            var docObject = listItems[i];

            document.getElementById('profile').innerHTML += ""
                  + "<li>"
                  + "<img src='" 
                  + (docObject["iconLink"] ? docObject["iconLink"] : "#") // Icon Link
                  + "'> "
                  + "<a href='" 
                  + docObject["webContentLink"] // Web content Link
                  + "' target='_blank'>" 
                  + docObject["title"] // Title
                  + "</a></li>";
        }
      });
    });
  } else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    document.getElementById('signinButton').removeAttribute('style');
    console.log('Sign-in state: ' + authResult['error']);
  }
}
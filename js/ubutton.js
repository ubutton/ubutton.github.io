//this is the js file for ubutton html code
//	will get current location
// 	will get info from uber
//  then generate the button html code
//	inflate (fill) button html code into the div that is given
//

// buttonType is a number value standing for the type of buttonType
// 0 = mini
// 7 = full
// 1-6 should implement in stage 2

var currentLocation={};

function generateUbutton(dLat, dLng, dStringAddress){
	//this function is called when the client(resturant/ website that use this button)'s html code is run.
	//	entry point of this js
	//	will wait until doc is ready
	//	

	getCurrentLocation(dLat, dLng, dStringAddress);

}

function getCurrentLocation(dLat, dLng, dStringAddress){
	//this function will get the end-user's current location
	//
	// handle localStorage for settings
	// reference: http://www.w3schools.com/html/html5_webstorage.asp
	// this section is for retrieving previous settings
	// also for general setup
	// -note for localStorage:
	// --to get an item: localStorage.getItem("key");
	// --to set an item: localStorage.setItem("key", "value");
	// We should use key = HOSTNAME_keyValue (so that we have settings for different sites)
	//get if browser support local storage
	var browserSupportLocalStorage = (typeof(Storage) != "undefined");
	//get host name and use it as part of the key later
	var HOSTNAME = window.location.host;
	var KEY = HOSTNAME+"_shouldAlertBeforeGetsLocation";
	//set default action of shouldAlertBeforeGetsLocation to true
	var shouldAlertBeforeGetsLocation = true;

	//this block of `if` code will load and set shouldAlertBeforeGetsLocation if browser support and value avliable 
	if (browserSupportLocalStorage) {	//then retrieve settings
		
  		//since localStorage.getItem return a string, we use JSON.parse to parse it back to true/false
		var value = JSON.parse(localStorage.getItem(KEY));
		if (value !== null) {
				shouldAlertBeforeGetsLocation =  value;
			} else {	//it means this is the first time user running out app, so we should set the default value into the storage
				var default_shouldAlertBeforeGetsLocation = true;
				setShouldAlertBeforeGetsLocation(default_shouldAlertBeforeGetsLocation);
		}
	} else {	//if it does not support LocalStorage, then fall back to the defult settings.
		console.log("Browser does not support Web Storage");
		buildMiniButton(1);
		return 1;
	}

	//this function modify the shouldAlertBeforeGetsLocation and store the value to localStorage if available
	function setShouldAlertBeforeGetsLocation(inputValue){
		shouldAlertBeforeGetsLocation = inputValue;
		if (browserSupportLocalStorage){
			localStorage.setItem(KEY, inputValue);
		}
	}

	// =-=-=-=-=-=-=-=-=-=-= end of handling localStorage for settings =-=-=-=-=-=-=-=-=-=-=


	//
	// handling Geolocation, 
	// reference: http://www.w3schools.com/html/html5_geolocation.asp
	if (navigator.geolocation) {		//test if browser support geolocation
		if (shouldAlertBeforeGetsLocation) {	//will show user this message if it is first time running our app on this page.
			alert("In order to provided real-time infomation, we would need your current location.");
			setShouldAlertBeforeGetsLocation(false);
		}
		navigator.geolocation.getCurrentPosition(onSuccess, onFail);
	} else {
		console.log("Geolocation is not supported by this browser.");
	}

	function onFail(error) {
		switch(error.code) {
			case error.PERMISSION_DENIED:
				console.log("User denied the request for Geolocation.");
				//probably should promt something to the user here...
				break;
			case error.POSITION_UNAVAILABLE:
				console.log("Location information is unavailable.");
				break;
			case error.TIMEOUT:
				console.log("The request to get user location timed out.");
				break;
			case error.UNKNOWN_ERROR:
				console.log("An unknown error occurred.");
				break;
		}
		buildMiniButton(2);
	}

	function onSuccess(position) {

		//should call the uber API here to get the information.
		//and store the information in the local variable.
		if (position !== null){
			var cLat = position.coords.latitude;
			var cLng = position.coords.longitude;
			getInfoFromUber(dStringAddress, dLat, dLng, cLat, cLng);

		} else {
			console.log("An unknown error occurred.");
			buildMiniButton(3);
		}
	}
  

	//return { "lat":123.45, "lng":56.789};
}



function getInfoFromUber(dStringAddress, dLat, dLng, cLat, cLng){
	//this function will get real time info from uber
	//	check if uber is avliable in this area
	//	get real time info
	//	call buildButton

	// Uber API Constants
	var uberClientId = "VzXgBbV8WTXvPIzKvPFp2mi0Keq46jAQ";
	var uberServerToken = "r1AgYpOvxjgYgEUSTCP3rPnaCmYPE1NcOOZ0Mw3q";

	$.ajax({
		url: "https://api.uber.com/v1/estimates/price",
		headers: {
			Authorization: "Token " + uberServerToken
		},
		data: {
			start_latitude: cLat,
			start_longitude: cLng,
			end_latitude: dLat,
			end_longitude: dLng
		},
		success: function(result) {
			console.log("result");
			console.log(result);
			buildButton(cLat, cLng);
		}
	});



}

function buildButton(realTimeInfoFromUber_1, realTimeInfoFromUber_2){
	//this fucntion will build html code for button, and inflate the code into the div.

	document.getElementById("ubutton").innerHTML=
      "Latitude: " + realTimeInfoFromUber_1 + 
      "<br>Longitude: " + realTimeInfoFromUber_2;

}


function buildMiniButton(reason){
	//will build a mini button in case of failure
	//function failGeneratingUButton(errorCode){
	// 0: null
	// 1: Browser does not support Web Storage
	// 2: fail to get current location
	// 3: position is null

}


getCurrentLocation(37.789932,-122.390185,"Google San Francisco");


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

// Uber API Constants
var uberClientId = "VzXgBbV8WTXvPIzKvPFp2mi0Keq46jAQ";


function printButtonHTML(){

	var buttonHTML='<div id="ubutton" onclick=""><p id="ubutton-time" >ESTIMATING TIME</p></div>';
	document.write(buttonHTML);

}


function generateUbutton(dLat, dLng, dStringAddress){
	//this function is called when the client(resturant/ website that use this button)'s html code is run.
	//	entry point of this js
	//	will wait until doc is ready
	//	

	$(function() {
    	//console.log( "ready!" );
    	document.getElementById("ubutton").setAttribute( "onClick", "javascript: onButtonClicked(\""+dStringAddress+"\", "+dLat+", "+dLng+", "+0+", "+0+", \""+0+"\");");

		getCurrentLocation(dLat, dLng, dStringAddress);
	});
	

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
		//return 1;
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

	//should find a way to handle fail later
	$.ajax({
		url: "https://ancient-tor-1781.herokuapp.com/products?latitude="+cLat+"&longitude="+cLng,
		dataType: 'jsonp',
		success: function(productsResult) {
			if (productsResult.products.length==0){
				buildMiniButton(4);
			} else {
				var productId = productsResult.products[0].product_id;
				var imageURL = productsResult.products[0].image;
				var displayName = productsResult.products[0].display_name;

				$.ajax({
					url: "https://ancient-tor-1781.herokuapp.com/time?start_latitude="+cLat+"&start_longitude="+cLng,
					dataType: 'jsonp',
					success: function(timeResult) {
						var estimatedTimeInSec=0;
						for (var i=0; i <timeResult.times.length; i++){
							if (timeResult.times[i].product_id==productId){
								estimatedTimeInSec = timeResult.times[i].estimate;
								break;
							}
						}
						var estimatedTime = Math.ceil(estimatedTimeInSec/60);

						$.ajax({
							url: "https://ancient-tor-1781.herokuapp.com/price?start_latitude="+cLat+"&start_longitude="+cLng+"&end_latitude=37.7298549&end_longitude=-122.4225971",
							dataType: 'jsonp',
							success: function(priceResult) {
								var estimatedPriceRange="$0";
								var shouldDisplayPrice=false;
								for (var i=0; i <priceResult.prices.length; i++){
									if (priceResult.prices[i].product_id==productId){
										estimatedPriceRange = priceResult.prices[i].estimate;
										shouldDisplayPrice = (priceResult.prices[i].surge_multiplier==1);
										break;
									}
								}

								buildButton(dStringAddress, dLat, dLng, cLat, cLng, imageURL, displayName, estimatedTime, estimatedPriceRange, productId, shouldDisplayPrice);

							}
						});
					}
				});
			}
		}
	});


}

function onButtonClicked(dropoff_address, dropoff_latitude, dropoff_longitude, pickup_latitude, pickup_longitude, product_id){
	//dropoff_nickname

	dropoff_address=encodeURIComponent(dropoff_address.trim());

	// Simple device detection
	var isiOS = (navigator.userAgent.match('iPad') || navigator.userAgent.match('iPhone') || navigator.userAgent.match('iPod'));
	var isAndroid = navigator.userAgent.match('Android');
	var isWP = navigator.userAgent.match('Windows Phone') || navigator.userAgent.match('IEMobile');

	var siteURL = "https://m.uber.com/sign-up?"+ "client_id="+uberClientId+
									"&dropoff_address=\""+dropoff_address+"\""+
									"&dropoff_latitude="+dropoff_latitude+
									"&dropoff_longitude="+dropoff_longitude+
									"&pickup_latitude="+pickup_latitude+
									"&pickup_longitude="+pickup_longitude;
	var appURI = "uber://?"+"client_id="+"VzXgBbV8WTXvPIzKvPFp2mi0Keq46jAQ"+
								"&action=setPickup"+
								"&dropoff[latitude]="+dropoff_latitude+
								"&dropoff[longitude]="+dropoff_longitude+
								"&dropoff[nickname]="+dropoff_address+
								"&pickup=my_location";

	if (product_id!=0){

		siteURL = siteURL+"&product_id="+product_id;
		appURI = appURI+"&product_id="+product_id;
	}							



	// Redirect to Uber
	if (isiOS){
		setTimeout(function () { window.location = siteURL; }, 25);		//fall back url
		$('body').append('<iframe style="visibility: hidden;" src="'+ appURI +'" />');

	} else if ((isAndroid) || (isWP)){
		setTimeout(function () { window.location = siteURL; }, 25);		//fall back url
		window.location = appURI;

	} else {	// if (isOtherPlatform)
		window.location = siteURL;
	}


}


function buildButton(dStringAddress, dLat, dLng, cLat, cLng, imageURL, displayName, estimatedTime, estimatedPriceRange, productId, shouldDisplayPrice){
	document.getElementById("ubutton-time").innerHTML = "IN " + estimatedTime + " MIN";

	if (shouldDisplayPrice){
		document.getElementById("ubutton-time").innerHTML += " | " + estimatedPriceRange;
	}

	document.getElementById("ubutton").setAttribute( "onClick", "javascript: onButtonClicked(\""+dStringAddress+"\", "+dLat+", "+dLng+", "+cLat+", "+cLng+", \""+productId+"\");");

}


function buildMiniButton(reason){
	//will build a mini button in case of failure
	//function failGeneratingUButton(errorCode){
	// 0: null
	// 1: Browser does not support Web Storage
	// 2: fail to get current location
	// 3: position is null
	// 4: no uber services in this area
	var failReason="unknown";
	switch(reason){

		case 1: failReason="Browser does not support Web Storage"; break;
		case 2: failReason="ail to get current location"; break;
		case 3: failReason="position is null"; break;
		case 4: failReason="no uber services in this area"; break;
	}

	document.getElementById("ubutton-time").innerHTML= "Error:" + failReason;
}


//generateUbutton(37.789932,-122.390185,"Google San Francisco");




printButtonHTML();


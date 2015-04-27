//this is the js file for index.html
//  when user press ok, it will grab the address, 
//	convert it into lat lng,
//	generate html code for button using template
//	change layout and display the html code, as well as a google maps for the lat lng
//
// note: coding style: ALLCAPS for final values
// note: coding style: variables should be as descriptive as possible


var DIVID="map-canvas";


function buttonClicked(){
	//this function get called when user press the button
	//	entry point of this js
	//	will first convertAddress, buildHTML, and change layout + displayMap
	var inputAddress=document.getElementById('inputAddress').value;
	if ((inputAddress!=null)&&(inputAddress!="")){

		convertAddress(inputAddress);	
	} else {
		displayError("Address can not be empty");

	}

}

function displayError(errorMessage){
	//display error messages
	//should not use alert :)
	alert(errorMessage);
}


function convertAddress(stringAddress){
	//this function convert stringAddress into lat lng
	geocoder = new google.maps.Geocoder();
	var address = stringAddress;
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {

			//displayMap(37.419938, -122.083479, "Atom Cafe, Charleston Road, Mountain View, CA", DIVID);

			dLat=results[0].geometry.location.lat();
			dLng=results[0].geometry.location.lng();

			displayMap(dLat, dLng, stringAddress, DIVID);
		} else {
			displayError('Geocode was not successful for the following reason: ' + status);
		}
	});

}

function buildHTML(templateFile, lat, lng, stringAddress){
	//this function build button html code using the given template and return as string

	return "<div>some html code</div>";
}

function displayMap(lat, lng, divID){
	displayMap(lat, lng, "", divID);
}

function displayMap(lat, lng, stringAddress, divID){
	//this function display a map in the divID
	function initialize(lat, lng, stringAddress, divID) {
		var myLatlng = new google.maps.LatLng(lat,lng);
		var mapOptions = {
			zoom: 18,
			center: myLatlng
		}

		var map = new google.maps.Map(document.getElementById(divID), mapOptions);

		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			title: stringAddress
		});
	}
	google.maps.event.addDomListener(window, 'load', initialize(lat, lng, stringAddress, divID));
}


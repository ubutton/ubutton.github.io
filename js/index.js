//this is the js file for index.html
//  when user press ok, it will grab the address, 
//	convert it into lat lng,
//	generate html code for button using template
//	change layout and display the html code, as well as a google maps for the lat lng
//

function buttonClicked(){
	//this function get called when user press the button
	//	entry point of this js
	//	will first convertAddress, buildHTML, and change layout + displayMap


	displayMap(37.419938, -122.083479, "Atom Cafe, Charleston Road, Mountain View, CA", "map-canvas")
}

function displayError(errorMessage){
	//display error messages
	//should not use alert :)
	alert(errorMessage);
}


function convertAddress(stringAddress){
	//this function convert stringAddress into lat lng
	return { "lat":123.45, "lng":56.789};
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


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
			buildHTML("res/htmlTemplate.html",dLat, dLng, stringAddress)
		} else {
			displayError('Geocode was not successful for the following reason: ' + status);
		}
	});

}



function applyTemplate(template, properties) {
    var returnValue = "";

    var templateFragments = template.split("{{");

    returnValue += templateFragments[0];

    for (var i = 1; i < templateFragments.length; i++) {
        var fragmentSections = templateFragments[i].split("}}", 2);
        returnValue += properties[fragmentSections[0]];
        returnValue += fragmentSections[1];
    }

    return returnValue;
}

function buildHTML(templateFile, lat, lng, stringAddress){
	//this function build button html code using the given template and return as string
	$.get( templateFile, function( template ) {

		var properties = {
			dLat: lat,
			dLng: lng,
			dStringAddress: '"'+stringAddress+'"'
		};

		htmlCode = applyTemplate(template, properties);

		document.getElementById("resultHtml").innerHTML = htmlCode;
		console.log( "Load was performed." );

	});

	//return "<div>some html code</div>";
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
//To looks nicer 
function displayTitle()
{
	var red = [0, 100, 63];
	var orange = [40, 100, 60];
	var green = [75, 100, 40];
	var blue = [196, 77, 55];
	var purple = [280, 50, 60];

	var myName = "Uber Button Generator";
	var letterColors = [red,orange,green] 

  	bubbleShape = "circle"

	drawName(myName, letterColors,bounceBubbles());
}


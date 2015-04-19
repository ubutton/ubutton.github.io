//this is the js file for ubutton html code
//	will get current location
// 	will get info from uber
//  then generate the button html code
//	inflate (fill) button html code into the div that is given
//

function generateUbutton(dLat, dLng, dStringAddress){
	//this function is called when the client(resturant/ website that use this button)'s html code is run.
	//	entry point of this js
	//	will wait until doc is ready
	//	

}

function getCurrentLocation(){
	//this function will get the end-user's current location

	return { "lat":123.45, "lng":56.789};
}

function getInfoFromUber(dStringAddress, dLat, dLng, cLat, cLng){
	//this function will get real time info from uber
	//	check if uber is avliable in this area
	//	get real time info
	//	call buildButton

}

function buildButton(realTimeInfoFromUber_1, realTimeInfoFromUber_2){
	//this fucntion will build html code for button, and inflate the code into the div.

}


function buildMiniButton(reason){
	//will build a mini button in case of failure
}
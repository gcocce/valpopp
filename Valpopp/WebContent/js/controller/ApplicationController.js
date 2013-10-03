console.log("ApplicationController Script");


function settingsButton(){
	console.log("settingsButton");
	
	$("#dialog").show();
	
    $("#dialog").dialog({ 
        modal: true, 
        overlay: { 
            opacity: 0.8, 
            background: "black" 
        } 
    });	
}

function openButton(){
	console.log("openButton");
	
}


function playButton(){
	console.log("playButton");
	
}


function stopButton(){
	console.log("stopButton");
	
}

function quizButton(){
	console.log("quizButton");
	
}

function modeCheckbox(){
	console.log("modeCheckbox");
	
}

//***************************************************************

function setupEventListeners(){
	window.addEventListener('load', eventWindowLoaded, false);	
	
	
}





//***************************************************************
// Call back function for events




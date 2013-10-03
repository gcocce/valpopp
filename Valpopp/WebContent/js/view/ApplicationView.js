console.log("ApplicationView Script");

// Setup Layout When the Language Module Was Fully Loaded
function initLayout(e){
	removeProgressBar();
	
	// Enable buttons
	var button=document.getElementById("bt_open");
	button.disabled=false;
	
	button=document.getElementById("bt_settings");
	button.disabled=false;	
}


function removeProgressBar(){
	var div=document.getElementById("progress_bar");
	div.parentNode.removeChild(div);
	
	//Jquery mode
	//$( ".hello" ).remove();
}

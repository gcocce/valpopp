console.log("ApplicationView Script");


function ApplicationView(){
	
	// Public Methods
	this.initLayout=initLayout;
	
	
	
	// **************************************************************************
	// Private Methods
	function removeProgressBar(){
		var div=document.getElementById("progress_bar");
		
		if (div){
			div.parentNode.removeChild(div);
		}else{
			alert("null progress bar");
		}
		
		//Jquery mode
		//$( ".hello" ).remove();
	}
	
	
	// **************************************************************************
	// Public Methods
	
	// Setup Layout When the Language Module Was Fully Loaded
	function initLayout(e){
		console.log("ApplicationView.initLayout");

		removeProgressBar();
		
		// Enable buttons
		var button=document.getElementById("bt_open");
		button.disabled=false;
		
		button=document.getElementById("bt_settings");
		button.disabled=false;	
	}
	
	function activateScenarioCommands(e){
		console.log("ApplicationView.activateScenarioCommands");

		removeProgressBar();
		
		// Enable buttons
		var button=document.getElementById("bt_play");
		button.disabled=false;
		
		button=document.getElementById("bt_stop");
		button.disabled=false;
		
		button=document.getElementById("bt_mode");
		button.disabled=false;
	}
	
	
	
	
}






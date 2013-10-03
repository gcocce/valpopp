console.log("ScenarioView Script");

function ScenarioView(){
	
	// Public Methods
	this.activateScenarioCommands=activateScenarioCommands;
	
	// **************************************************************************
	// Private Methods
	function privateMethod(){

	}
	
	// **************************************************************************
	// Public Methods
	
	// Setup Layout When the Language Module Was Fully Loaded

	function activateScenarioCommands(){
		console.log("ApplicationView.activateScenarioCommands");
		
		// Enable buttons
		var button=document.getElementById("bt_play");
		button.disabled=false;
		
		button=document.getElementById("bt_stop");
		button.disabled=false;
		
		button=document.getElementById("bt_mode");
		button.disabled=false;
	}		
	
	//***************************************************************
	// Events
	//***************************************************************	
	
	// Events handled by the ApplicationController 
	$(window).on( "Event", someCalbackFunction);	
	
	
	//***************************************************************
	// Call back function for events
	//***************************************************************	
	
	function someCalbackFunction(e){
		
	}
}
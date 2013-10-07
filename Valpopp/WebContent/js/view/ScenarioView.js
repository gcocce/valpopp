console.log("ScenarioView Script");

/* Responsabilities:
 * 
 * Performs User Interface Display associated to the Scenario Layout
 * Performs Scenario Display
 */

function ScenarioView(){
	// ******************************************************************************
	// Properties
	// ******************************************************************************	
	
	
	
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	function privateMethod(){

	}
	
	
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************
	this.displayError=displayError;
	this.displayMsg=displayMsg;
	this.enableScenarioCommands=enableScenarioCommands;
	this.disableScenarioCommands=disableScenarioCommands;
	

	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	function displayMsg(html_msg){
		console.log("displayError: " + html_msg);   
	    
		$("#maindialog").dialog({
			autoOpen: false,
			modal: true,
			width: 500,
			height: 300,
			position: {  my: "center", at: "center", of: window  },
			resizable: true,
			title: "Scenario Message",
			buttons: {
				"Close": function(){
					$(this).dialog("close");
				}
			}
		});
		
		$("#maindialog").html(html_msg);
		
		$("#maindialog").dialog("open");		
	}
	
	// Display error message associated to the scenario
	function displayError(html_msg){
		
		console.log("displayError: " + html_msg);   
	    
		$("#maindialog").dialog({
			autoOpen: false,
			modal: true,
			width: 500,
			height: 300,
			position: {  my: "center", at: "center", of: window  },
			resizable: true,
			title: "Scenario Error Message",
			buttons: {
				"Close": function(){
					$(this).dialog("close");
				}
			}
		});
		
		$("#maindialog").html(html_msg);
		
		$("#maindialog").dialog("open");
	}
	
	// Setup Layout When the Language Module Was Fully Loaded

	function enableScenarioCommands(){
		console.log("ApplicationView.activateScenarioCommands");
		
		// Enable buttons
		var button=document.getElementById("bt_play");
		button.disabled=false;
		
		button=document.getElementById("bt_stop");
		button.disabled=false;
		
		button=document.getElementById("bt_mode");
		button.disabled=false;
		
		button=document.getElementById("bt_data");
		button.disabled=false;
	}
	
	function disableScenarioCommands(){
		console.log("ApplicationView.disableScenarioCommands");
		
		// Enable buttons
		var button=document.getElementById("bt_play");
		button.disabled=true;
		
		button=document.getElementById("bt_stop");
		button.disabled=true;
		
		button=document.getElementById("bt_mode");
		button.disabled=true;
		
		button=document.getElementById("bt_data");
		button.disabled=true;		
	}
	
	
	
	
	// ******************************************************************************
	// Events
	// ******************************************************************************	
	
	// Events handled by the ApplicationController 
	$(window).on( "Event", someCalbackFunction);	
	
	
	
	
	
	// ******************************************************************************
	// Call back function for events
	// ******************************************************************************	
	
	function someCalbackFunction(e){
		
	}
}
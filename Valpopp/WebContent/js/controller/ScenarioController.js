console.log("ScenarioController Script");

/* Responsabilities:
 * 
 * Capture Events associated to Scenario Layout and trigger the apropiate action
 * 
 */

function ScenarioController(){
	
	// Public Methods
	this.playButton=playButton;
	this.stopButton=stopButton;
	this.modeCheckbox=modeCheckbox;
	this.quizButton=quizButton;
	this.dataButton=dataButton;	

	
	// **************************************************************************
	// Private Methods
	function privateMethod(){

	}
	
	// **************************************************************************
	// Public Methods
	
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
	
	function dataButton(){
		console.log("dataButton");   
	    
		$("#maindialog").dialog({
			autoOpen: false,
			modal: true,
			width: 400,
			height: 400,
			position: {  my: "center", at: "center", of: window  },
			resizable: false,
			title: "Scenario Data",
			html: "",
			buttons: {
				"Dismiss": function(){
					$(this).dialog("close");
				}
			}
		});
	    
		/*
		$("#maindialog").html("");
		$("#maindialog").dialog("option", "title", "Loading...");
		$("#maindialog").load("ajax-data-1.html", function() {
			$(this).dialog("option", "title", $(this).find("h1").text());
			$(this).find("h1").remove();
		});
		*/
		
		$("#maindialog").dialog("open");
		
	}	

	
	//***************************************************************
	// Events
	//***************************************************************
	
	// Events handled by the ApplicationController 
	
	// Trigger when the default scenario file is already loaded the first time any user start the appliation
	$(window).on( "RemoteScenarioFileLoaded", initializeScenarioValidation);
	
	// Trigger when the schema file is already loaded
	$(window).on( "SchemaFileLoaded", initializeScenarioValidation);	
	
	
	
	//***************************************************************
	// Call back function for events
	//***************************************************************
	
	// Function to validate the default scenario loaded the first time any user start the application
	function initializeScenarioValidation(){
		console.log("ApplicationController.initializeScenarioValidation");
		
		if(scenarioSchema.getState()==scenarioSchema.SCHEMA_LOADED && scenarioModel.getState()==scenarioModel.SCENARIO_LOADED){
			//TODO: do validtion
			
			
			
			
			
		
			// If valid start scenario controls
			scenarioView.activateScenarioCommands();		
		}else{
			console.log("Scenario schema or scenario file not ready");
			console.log("Scenario State: " + scenarioModel.getState());
			console.log("Schema State: " + scenarioSchema.getState());	
		}	
	}
}
console.log("ScenarioController Script");

/* Responsabilities:
 * 
 * Capture Events associated to Scenario Layout and trigger the apropiate action
 */

function ScenarioController(){
	// ******************************************************************************
	// Properties
	// ******************************************************************************

	
	
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
	function privateMethod(){

	}
	
	
	
	// **************************************************************************
	// Public Methods Publication
	//***************************************************************************
	this.playButton=playButton;
	this.stopButton=stopButton;
	this.modeCheckbox=modeCheckbox;
	this.quizButton=quizButton;
	this.dataButton=dataButton;	
	//***************************************************************************
	// Public Methods Definition	
	//***************************************************************************
	
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
			buttons: {
				"Dismiss": function(){
					$(this).dialog("close");
				}
			}
		});
		
		$("#maindialog").html("");
		
		$("#maindialog").dialog("open");
		
	}	

	
	//***************************************************************************
	// Events Listeners
	//***************************************************************************
		
	// Trigger when the default scenario file is already loaded the first time any user start the application
	$(window).on( "RemoteScenarioFileLoaded", initializeScenarioValidation);
	
	// Trigger when the schema file is already loaded
	$(window).on( "SchemaFileLoaded", initializeScenarioValidation);	
	
	// Trigger when the schema file couldn't be loaded
	$(window).on( "SchemaFileLoadingError", schemaLoadingError);
	
	// Trigger when the scenario file couldn't be loaded
	$(window).on( "RemoteScenarioFileLoadingError", remoteScenarioLoadingError);
	
	// Trigger when all the nodes images download attempt has been processed
	$(window).on( "ScenarioNodeImgsProccessed", scenarioNodeImgProcessed);
	
	//***************************************************************************
	// Call back function for events
	//***************************************************************************
	
	// Function to validate the default scenario loaded the first time any user start the application
	// This function is called two times until both schema and scenario are already downloaded
	// If the syntax and logic of the scenario is ok it will automatically initiate the nodes images download
	// Once the images are downloaded the event ScenarioNodeImgsProccessed is triggered
	function initializeScenarioValidation(){
		console.log("ApplicationController.initializeScenarioValidation");
		
		if(scenarioSchema.getState()==scenarioSchema.SCHEMA_LOADED && scenarioModel.getState()==scenarioModel.SCENARIO_LOADED){	
			if (!scenarioModel.validateScenario()){
				applicationView.removeProgressBar();
				
				if (configModule.getUserMode().localeCompare("editor")==0){
					scenarioView.displayError(scenarioModel.getError());
				}else{
					scenarioView.displayError(utils.wrapErrorMsg("Scenario is not Valid!"));
				}
				
				return;
			}
		}else{ 
			// In the case one of the files is not ready
			console.log("Scenario schema or scenario file not ready");
			console.log("Scenario State: " + scenarioModel.getState());
			console.log("Schema State: " + scenarioSchema.getState());	
		}	
	}
	
	function schemaLoadingError(e){
		scenarioView.disableScenarioCommands();
		applicationView.removeProgressBar();
		applicationView.displayError('<div id="msg" class="error">Default SCHEMA is not a valid json.</div>');
	}
	
	function remoteScenarioLoadingError(e){
		scenarioView.disableScenarioCommands();
		applicationView.removeProgressBar();
		applicationView.displayError('<div id="msg" class="error">Scenario File is not a valid json.</div>');
	}
	
	// Initiate Scenario Display if all images has been downloaded
	// If one file is missing show error
	function scenarioNodeImgProcessed(e){
		applicationView.removeProgressBar();
		
		if (scenarioModel.getState()==scenarioModel.SCENARIO_OK){
			// In this case nodes images has been downloaded correctly.
			scenarioModel.normalizeScenario();
			
			scenarioView.initiateScenarioDisplay(scenarioModel.getContext());

			//scenarioView.displayMsg(utils.wrapMsg(scenarioModel.getOutput()));		
			
			//TODO: Initiate Scenario Images Download
			
		}else{
			scenarioView.displayError(utils.wrapErrorMsg(scenarioModel.getError()));
			return;
		}
		
	}
	
}

console.log("ScenarioController Script");


function ScenarioController(){

	// Public Methods
	this.somepublicMethod=somepublicMethod;

	
	// **************************************************************************
	// Private Methods
	function privateMethod(){
		
	}
	
	
	
	// **************************************************************************
	// Public Methods
	function somepublicMethod(){
		
		
	}


	
	//***************************************************************
	// Events
	//***************************************************************
	
	// Events handled by the ApplicationController 
	$(window).on( "RemoteScenarioFileLoaded", initializeScenarioValidation);
	$(window).on( "SchemaFileLoaded", initializeScenarioValidation);	
	
	
	
	//***************************************************************
	// Call back function for events
	//***************************************************************
	
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
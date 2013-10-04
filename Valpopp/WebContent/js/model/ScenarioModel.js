/* This class is intended to handle the scenario */

/* Responsabilities:
 * 
 * Contain Scenario Data
 * Control Scenario Data
 * Validate Scenario Data
 * 
 */

function ScenarioModel() {
	console.log("Scenario Object is created.");

	// ******************************************************************************
	// Constants
	var SCENARIO_NOTLOADED=0;
	var SCENARIO_LOADED=1;
	var SCENARIO_LOADING_ERROR=2;

	this.SCENARIO_NOTLOADED=SCENARIO_NOTLOADED;
	this.SCENARIO_LOADED=SCENARIO_LOADED;
	this.SCENARIO_LOADING_ERROR=SCENARIO_LOADING_ERROR;	

	// ******************************************************************************
	// Properties
	// A regular expresion used to validate the type of file (actually not used)
	var m_file_type="text.*";

	// Private Variables
	var m_valid=false;

	// The content of the scenario file loaded
	var m_file_content="";

	// File Handler
	var m_fh = new FileHandler();

	// Error message
	var m_error="";

	// The schema as a string loaded initially with the page
	var m_scenario_state=SCENARIO_NOTLOADED;

	// The structure of the scenario as a JavaScript Object (actually using scenario_obj)

	//var m_scenario=null;
	//this.m_scenario=m_scenario;


	// ******************************************************************************
	// Public Methods Publication
	this.isValid=isValid;
	this.getError=getError;
	this.getState=getState;

	this.loadScenarioRemoteFile=loadScenarioRemoteFile;
	this.loadScenarioLocalFile=loadScenarioLocalFile;


	// **************************************************************************
	// Public Methods Definition

	function isValid() {
		return m_valid;
	}

	function getError() {
		return m_error;
	}
	
	function getState(){
		return m_scenario_state;
	}

	// Asynchronous method to load the schema file
	function loadScenarioRemoteFile(file){
		// Load Scenario Schema Schema
		console.log("loadScenarioRemoteFile: " + file);

		jQuery.getJSON(file, function(data) {
			m_file_content=JSON.stringify(data);

			m_scenario_state=SCENARIO_LOADED;
			
			// Dispatch the event
			console.log("Remote Scenario File Loaded");
			var event = $.Event( "RemoteScenarioFileLoaded" );
			$(window).trigger( event );			
		})
		.error(function() {
			console.err("getJSON ERROR for Remote File");

			alert("getJSON ERROR. SCENARIO.JSON is not valid json.");
			m_scenario_state=SCENARIO_LOADING_ERROR;
		});	
	}   


	// Start file reading, return true if there is no error
	function loadScenarioLocalFile(file) {
		m_valid=false;
		if (m_fh.isEnabled()) {
			if (m_fh.openFile(file, readScenarioCallback)){
				return true;
			}else{
				m_error=m_fh.getError();
				return false;
			}
		}else{
			m_error="The browser does not allow to use File and FileReader APIs.";
			console.error(m_error);
			return false;
		}
	}


	// ******************************************************************************
	// Private Methods

	function validateScenario(){
	
   	

	}

	function validateScenarioObject(){


	}

	function getScenarioName() {
		if (scenario_obj!=null){
			return scenario_obj.name;
		}

		return null;
	}

	function getContents() {
		return m_file_content;
	}

	
	function setContents(arg){
		m_file_content=arg;
	}



	// ***********************************************************************************
	// Call back functions

	// This callback method is called when the file was read
	// This method start validations
	function readScenarioCallback(e) {
		console.log("Scenario file loaded.");

		var cont=e.target.result;
		m_file_content=cont;

		validateScenario();
	}    
}





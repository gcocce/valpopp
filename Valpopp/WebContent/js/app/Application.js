
console.log("Application Script");

//***************************************************************************
//Application Objects

var AppConstants= new AppConstants();

//Create Scenario View
var applicationView=new ApplicationView();

//Create Scenario Controller
var applicationController= new ApplicationController();


//Scenario Objects
var scenario_schema=null;

var scenario_model = null;
var scenario_controller=null;
var scenario_view=null;

//Application Global Variables
var appState=AppConstants.STARTING;

//*******************************************************************************
//Setup Section
//*******************************************************************************

//Listen for the event onload (everything is downloaded from the server) 
$(window).on( "load", setupApplication);


/* Every Thing that needs to be donne before running the application */
function setupApplication(){
	console.log("setupApplication called");
	
	console.log("appState:" + appState);
	
	console.log("languageModule.getState:" + languageModule.getState());

	if (appState==AppConstants.STARTING){
		appState=AppConstants.LOADED;
	}

	if(appState==AppConstants.LOADED && languageModule.getState()==languageModule.INITIALIZED){
		console.log("setupApplication started");

		// Load Scenario Schema
		scenario_schema=new Schema();
		scenario_schema.loadSchema(AppConstants.SCENARIO_SCHEMA);

		// Create Scenario Object
		scenario = new Scenario();
		scenario.loadScenarioRemoteFile(configModule.getDefaultScenario());

		appState=AppConstants.INITIATED; 	
		console.log("setupApplication Finised");
	}

}




//**************************************************************************
//Utility functions













//***************************************************************************************

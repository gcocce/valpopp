
console.log("Application Script");

//***************************************************************************
//Application Objects

var AppConstants= new AppConstants();

//Create Scenario View
var applicationView=new ApplicationView();

//Create Scenario Controller
var applicationController= new ApplicationController();

//Scenario Objects
var scenarioSchema = null;

var scenarioModel = null;
var scenarioController = null;
var scenarioView = null;

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
	
	//console.log("appState:" + appState);
	//console.log("languageModule.getState:" + languageModule.getState());

	if (appState==AppConstants.STARTING){
		appState=AppConstants.LOADED;
	}else if (appState==AppConstants.INITIATED){
		console.log("Application already Setup");
	}

	if(appState==AppConstants.LOADED && languageModule.getState()==languageModule.INITIALIZED){
		console.log("setupApplication started");

		// Load Scenario Schema
		scenarioSchema=new Schema();
		scenarioSchema.loadSchema(AppConstants.SCENARIO_SCHEMA);

		// Create Scenario View
		scenarioView= new ScenarioView();
		
		// Create Scenario Controller
		scenarioController= new ScenarioController();
		
		scenarioModel = new Scenario();
		scenarioModel.loadScenarioRemoteFile(configModule.getDefaultScenario());

		appState=AppConstants.INITIATED; 	
		console.log("setupApplication Finised");
	}

}





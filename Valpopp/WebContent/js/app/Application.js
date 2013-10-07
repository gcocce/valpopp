
console.log("Application Script");


//***************************************************************************
//Application Constants
//***************************************************************************

function AppConstants(){
	var STARTING=0;
	var LOADED=1;
	var INITIATED=2;
	
	this.STARTING=STARTING;
	this.LOADED=LOADED;	
	this.INITIATED=INITIATED;
	
}

//***************************************************************************
//Application Objects
//***************************************************************************

var AppConstants= new AppConstants();

// Scenario View
var applicationView=new ApplicationView();

// Scenario Controller
var applicationController= new ApplicationController();

//Scenario Objects
var scenarioSchema = null;
var scenarioModel = null;
var scenarioController = null;
var scenarioView = null;

// Application Global Variables
var appState=AppConstants.STARTING;

//*******************************************************************************
// Setup Section
//*******************************************************************************

// Listen for the event on load (everything is downloaded from the server) 
$(window).on( "load", setupApplication);

// Every Thing that needs to be done before running the application
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
		console.log("Selected Language: " + configModule.getLang());
		console.log("User Type: " + configModule.getUserMode());

		// Load Scenario Schema
		scenarioSchema=new Schema();
		scenarioSchema.loadSchema(configModule.getDefSchema());

		// Create Scenario View
		scenarioView= new ScenarioView();
		
		// Create Scenario Controller
		scenarioController= new ScenarioController();
		
		// Create Scenario Model
		scenarioModel = new ScenarioModel();
		scenarioModel.loadScenarioRemoteFile(configModule.getDefaultScenario());

		appState=AppConstants.INITIATED; 	
		console.log("setupApplication Finised");
	}

}





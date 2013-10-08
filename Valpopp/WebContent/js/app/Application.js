
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

var appConstants = new AppConstants();
var utils = new Utils();

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
var appState=appConstants.STARTING;

//*******************************************************************************
// Setup Section
//*******************************************************************************

// Listen for the event on load (everything is downloaded from the server) 
$(window).on( "load", setupApplication);


// Every Thing that needs to be done before running the application
function setupApplication(e){
	console.log("setupApplication called");
	
	//console.log("appState:" + appState);
	//console.log("languageModule.getState:" + languageModule.getState());
	

	if (appState==appConstants.STARTING){
		appState=appConstants.LOADED;
	}else if (appState==appConstants.INITIATED){
		console.log("Application already Setup");
	}

	if(appState==appConstants.LOADED && languageModule.getState()==languageModule.INITIALIZED){
		console.log("setupApplication started");
		console.log("Selected Language: " + configModule.getLang());
		console.log("User Type: " + configModule.getUserMode());
		
		applicationView.setProgressBar();
		
		// Load Scenario Schema
		scenarioSchema=new Schema();
		scenarioSchema.loadSchema(configModule.getDefaultSchema());

		// Create Scenario View
		scenarioView= new ScenarioView();
		
		// Create Scenario Controller
		scenarioController= new ScenarioController();
		
		// Create Scenario Model
		scenarioModel = new ScenarioModel();
		scenarioModel.loadScenarioRemoteFile(configModule.getDefaultScenario());

		appState=appConstants.INITIATED; 	
		console.log("setupApplication Finised");
	}

}





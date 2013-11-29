
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

//var utils = new Utils();
var htmlBuilder = new HtmlBuilder();

// Scenario View
var applicationView=new ApplicationView();

// Scenario Controller
var applicationController= new ApplicationController();

//Scenario Objects
var scenarioSchema = null;
var scenarioModelBuilder = null;
var scenarioController = null;
var scenarioView = null;

// Application Initial State
var appState=appConstants.STARTING;

// Application images (for preload)
var appImagesNames = new Array();
appImagesNames.push("mcq_right.gif");
appImagesNames.push("mcq_wrong.gif");
appImagesNames.push("show.jpg");
appImagesNames.push("hide.jpg");

//*******************************************************************************
//Detect system
//*******************************************************************************
var OSName="Unknown OS";
if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

if(console){
	console.log("OSName: "+ OSName);
}

//*******************************************************************************
//Detect browser info
//*******************************************************************************
var nVer = navigator.appVersion;
var nAgt = navigator.userAgent;
var browserName  = navigator.appName;
var fullVersion  = ''+parseFloat(navigator.appVersion); 
var majorVersion = parseInt(navigator.appVersion,10);
var nameOffset,verOffset,ix;

// In Opera, the true version is after "Opera" or after "Version"
if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
 browserName = "Opera";
 fullVersion = nAgt.substring(verOffset+6);
 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
   fullVersion = nAgt.substring(verOffset+8);
}
// In MSIE, the true version is after "MSIE" in userAgent
else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
 browserName = "Microsoft Internet Explorer";
 fullVersion = nAgt.substring(verOffset+5);
}
// In Chrome, the true version is after "Chrome" 
else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
 browserName = "Chrome";
 fullVersion = nAgt.substring(verOffset+7);
}
// In Safari, the true version is after "Safari" or after "Version" 
else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
 browserName = "Safari";
 fullVersion = nAgt.substring(verOffset+7);
 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
   fullVersion = nAgt.substring(verOffset+8);
}
// In Firefox, the true version is after "Firefox" 
else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
 browserName = "Firefox";
 fullVersion = nAgt.substring(verOffset+8);
}
// In most other browsers, "name/version" is at the end of userAgent 
else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
          (verOffset=nAgt.lastIndexOf('/')) ) 
{
 browserName = nAgt.substring(nameOffset,verOffset);
 fullVersion = nAgt.substring(verOffset+1);
 if (browserName.toLowerCase()==browserName.toUpperCase()) {
  browserName = navigator.appName;
 }
}
// trim the fullVersion string at semicolon/space if present
if ((ix=fullVersion.indexOf(";"))!=-1)
   fullVersion=fullVersion.substring(0,ix);
if ((ix=fullVersion.indexOf(" "))!=-1)
   fullVersion=fullVersion.substring(0,ix);

majorVersion = parseInt(''+fullVersion,10);
if (isNaN(majorVersion)) {
 fullVersion  = ''+parseFloat(navigator.appVersion); 
 majorVersion = parseInt(navigator.appVersion,10);
}

if (console){
	console.log('Browser name  = ' + browserName);
	console.log('Full version  = ' + fullVersion);
	console.log('Major version = ' + majorVersion);
	console.log('navigator.appName = ' + navigator.appName);
	console.log('navigator.userAgent = ' + navigator.userAgent);
}

//*******************************************************************************
// Setup Section
//*******************************************************************************

// Listen for the event on load (everything is download from the server) 
$(window).on( "load", setupApplication);

// Starting Process:
// Every Thing that needs to be done before running the application
// This function is called when all the scripts have been loaded and when the languageModule has been loaded

function setupApplication(e){
	//console.log("setupApplication called");
	//console.log("appState:" + appState);
	//console.log("languageModule.getState:" + languageModule.getState());

	if (appState==appConstants.STARTING){
		appState=appConstants.LOADED;
	}else if (appState==appConstants.INITIATED){
		//console.log("Application already Setup");
	}

	// Once both things are ready the function is executed
	if(appState==appConstants.LOADED && languageModule.getState()==languageModule.INITIALIZED){
		if (console){
			console.log("setupApplication started");
			console.log("Selected Language: " + configModule.getLang());
			console.log("User Type: " + configModule.getUserMode());
		}
		
		// Show progress bar until schema and scenario file are both download
		applicationView.setProgressBar();
		
		// Load Scenario Schema
		scenarioSchema=new Schema();
		scenarioSchema.loadSchema(configModule.getDefaultSchema());

		// Create Scenario View
		scenarioView= new ScenarioView();
		
		// Create Scenario Controller
		scenarioController= new ScenarioController();
		
		// Create Scenario Model Builder
		scenarioModelBuilder = new ScenarioModelBuilder();
		scenarioModelBuilder.loadScenarioRemoteFile(configModule.getDefaultScenario());

		appState=appConstants.INITIATED; 	
		
		if (console){
			console.log("setupApplication Finised");
		}
	}

}





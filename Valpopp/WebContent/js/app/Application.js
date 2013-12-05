
//***************************************************************************
//Application Constants
//
//Used to register the state of the application
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
// Application Main Objects Section
//***************************************************************************

// Constants used to identify the state of the application
var appConstants = new AppConstants();

// Application Initial State
var appState=appConstants.STARTING;

// Object used to build html elements for the view
var htmlBuilder = new HtmlBuilder();

// Scenario View
var applicationView=new ApplicationView();

// Scenario Controller
var applicationController= new ApplicationController();

//Scenario Schema used to validate the scenario file against a json schema
var scenarioSchema = null;

// Used to generate the ScenarioContext, perform validations and grant access to ScenarioPlay instances
var scenarioModelBuilder = null;

// Used to handle scenario user commands regarding the scenario display and the mcq
var scenarioController = null;

// Used to handle the view of the application, mainly dedicated to display ScenarioPlay contents
var scenarioView = null;

//***************************************************************************
//End of Application Main Objects Section
//***************************************************************************

// Application images (for preload, any other application image should be added here)
var appImagesNames = new Array();
appImagesNames.push("mcq_right.gif");
appImagesNames.push("mcq_wrong.gif");
appImagesNames.push("show.jpg");
appImagesNames.push("hide.jpg");

var debug=true;

//*******************************************************************************
// Detect system
//*******************************************************************************
var OSName="Unknown OS";
if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

if(console && debug){
	console.log("OSName: "+ OSName);
}

//*******************************************************************************
// Detect browser
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

if (console && debug){
	console.log('Browser name  = ' + browserName);
	console.log('Full version  = ' + fullVersion);
	console.log('Major version = ' + majorVersion);
	console.log('navigator.appName = ' + navigator.appName);
	console.log('navigator.userAgent = ' + navigator.userAgent);
}








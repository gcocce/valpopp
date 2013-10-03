

console.log("Application Script");

//*************************************************************************
// Application Constants

function AppConstants(){
	var STARTING=0;
	var LOADED=1;
	
	var SCENARIO_SCHEMA="js/model/schema/scenario_schema.json";

	this.STARTING=STARTING;
	this.LOADED=LOADED;	
	
	this.SCENARIO_SCHEMA=SCENARIO_SCHEMA;
}


var AppConstants= new AppConstants();


//***************************************************************************
// Variables and Objects for the Application

// Application Global Variables
var appState=AppConstants.STARTING;


// Application Objects
var scenario_schema=null;

var scenario_model = null;
var scenario_controller=null;
var scenario_view=null;




//*******************************************************************************
// Setup Section

//Listen for the event 
$(window).on( "load", eventWindowLoaded);

//Listen for the event 
$(window).on( "LanguageFileLoaded", eventLanguageFileLoaded);
$(window).on( "LanguageModuleInitiated", initLayout);

function eventWindowLoaded(e){
	// Do something here when the html page is fully loaded
	
	
}

/* Every Thing that needs to be donne before running the application */
function setupApplication(){
   console.log("setupApplication");
   
   // Check Config and Language Module state

   
   
   // Load Scenario Schema
   scenario_schema=new Schema();
   
   scenario_schema.loadSchema(SCENARIO_SCHEMA);

   
   
   // Create Scenario Object
   scenario = new Scenario();
   
   
   
   
   
   // Create Scenario View
   
   
   
   
   
   // Create Scenario Controller
   
   
   
   
   
   
   // Create Listeners
   
   
   
}


// Setup Layout When the Language Module Was Fully Loaded
function initLayout(e){
	removeProgressBar();
	
	// Enable buttons
	var button=document.getElementById("bt_open");
	button.disabled=false;
	
	button=document.getElementById("bt_settings");
	button.disabled=false;	
}

function removeProgressBar(){
	var div=document.getElementById("progress_bar");
	div.parentNode.removeChild(div);
	
	
	//Jquery mode
	//$( ".hello" ).remove();
}


//**************************************************************************
// Utility functions

function settingsButton(){
	
	$("#dialog").show();
	
    $("#dialog").dialog({ 
        modal: true, 
        overlay: { 
            opacity: 0.8, 
            background: "black" 
        } 
    });	
}


function validate() {
 console.log("Se ejecuta validate");
 
 var result= document.getElementById('result');
 result.innerHTML = "";    
 
 var elfile=document.getElementById('file');

 if (!scenario.openFile(elfile)) {
    var error=scenario.getError();
    alert(error);    
 }  
}





//***************************************************************

function setupEventListeners(){
	window.addEventListener('load', eventWindowLoaded, false);	
	
	
}





//***************************************************************
// Call back function for events








// Deprecated and not used
//***************************************************************************************
function contenido() {
   console.log("Se ejecuta contenido");
      
   var result= document.getElementById('result');
   
   if (scenario.isValid()) {
      result.innerHTML = scenario.getContents();
   }else{
      //result.innerHTML = scenario.getError();
      result.innerHTML = scenario.getContents();
   }
}


//***************************************************************************************


console.log("Application Script");

//***************************************************************************
// Variables and Objects for the Application

var AppConstants= new AppConstants();

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




//**************************************************************************
// Utility functions













//***************************************************************************************

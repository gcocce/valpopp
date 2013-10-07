console.log("ApplicationController Script");

/* Responsabilities:
 * 
 * Capture User Interface Events and Trigger Actions
 * Resolve Application Events
 */

function ApplicationController(){	
	// ******************************************************************************
	// Properties
	// ******************************************************************************

	
	
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
	// Start Application Setup
	function startApplicationSetup(){
		console.log("ApplicationController.startApplicationSetup");
		
		setupApplication();
	}
	
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************
	this.openButton=openButton;
	this.settingsButton=settingsButton;
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	// Button Controllers
	function settingsButton(){
		console.log("settingsButton");
		
		var dialog=$("#maindialog").show();
		
	    $("#maindialog").dialog({ 
	        modal: true,
	        width: 300,
	        height: 400,
	        position: {  my: "center", at: "center", of: window  },
	        title: "Settings",
	        buttons:{
				"Dismiss": function() {
					$(this).dialog("close");
				}
	        }
	    });
	    
	    dialog.dialog("open");
	}
	
	function openButton(){
		console.log("openButton");
		
		var dialog=$("#maindialog").show();
		
	    $("#maindialog").dialog({ 
	        modal: false,
	        width: 300,
	        height: 400,
	        position: {  my: "center", at: "center", of: window  },
	        title: "Load Scenario",
	        buttons:{
				"Local File System": function() {
					$(this).dialog("close");
				},
				"Scenario Examples": function() {
					$("#maindialog").dialog("close");					
					openScenarioListDialog();
				}
	        }
	    });
	    
	    dialog.dialog("open");		
	}
	
	function openScenarioListDialog(){
		console.log("openScenarioListDialog");
		
		var dialog=$("#seconddialog").show();
		
	    $("#seconddialog").dialog({ 
	        modal: true,
	        width: 400,
	        height: 500,	        
	        position: {  my: "center", at: "center", of: window  },
	        title: "List of Scenarios",
	    });
	    
	    dialog.dialog("open");
	}


	
	// ******************************************************************************
	// Events Listeners
	// ******************************************************************************
	
	// Events handled by the ApplicationController 
	$(window).on( "LanguageFileLoaded", initializeLanguageModule);
	
	// Events handled by the ApplicationView
	$(window).on( "LanguageModuleInitiated", applicationView.initLayout);
	
	// Events handled by the ApplicationView
	$(window).on( "ScenarioFileLoaded", applicationView.activateScenarioCommands);	
	
	// Events handled by the ApplicationView
	$(window).on( "LanguageModuleInitiated", startApplicationSetup);	
	
	
	// ******************************************************************************
	// Call back functions
	// ******************************************************************************
	
	function initializeLanguageModule(e){		
		console.log("ApplicationController.initializeLanguageModule");
		
		// Test Language Module
		if (languageModule.initialize()){
			console.log("Language Module Initialization Succeded");
		}else{
			console.log("Language Module Error: " + languageModule.getError());
		}
		
		// Create a new jQuery.Event object without the "new" operator.
		var eventLanguageModuleInitiated = $.Event( "LanguageModuleInitiated" );
		
		// Dispatch the event
		console.log("Language Module Initiated Event Dispatched");
		$(window).trigger( eventLanguageModuleInitiated );	
	}
	
}















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
		
		setupApplication(null);
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
	    
	    $("#maindialog").html("");
	    
	    dialog.dialog("open");
	}
	
	function openButton(){
		console.log("openButton");
		
		var dialog=$("#maindialog").show();
		
	    $("#maindialog").dialog({ 
	        modal: true,
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
	    
	    $("#maindialog").html("");
	    
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
	
	$(window).on( "SchemaFileLoadingError", applicationView.disableApplicationCommands);
		

	// ******************************************************************************
	// Call back functions
	// ******************************************************************************
	
	function initializeLanguageModule(e){		
		console.log("ApplicationController.initializeLanguageModule");
		
		// Test Language Module
		if (languageModule.initialize()){
			// Activate application commands layout
			applicationView.initLayout();
			
			// Is mandatory to call to application setup
			startApplicationSetup();
			
			console.log("Language Module Initialization Succeded");
		}else{
			applicationView.displayError(languageModule.getError());		
			
			console.log("Language Module Error: " + languageModule.getError());
		}
	}
		
	
}















console.log("ApplicationController Script");


function ApplicationController(){

	// Public Methods
	this.openButton=openButton;
	this.playButton=playButton;
	this.stopButton=stopButton;
	this.modeCheckbox=modeCheckbox;
	this.quizButton=quizButton;
	this.settingsButton=settingsButton;	
	
	// **************************************************************************
	// Private Methods
	
	// Start Application Setup
	function startApplicationSetup(){
		console.log("ApplicationController.startApplicationSetup");
		
		setupApplication();
	}	
	
	
	
	// **************************************************************************
	// Public Methods
	
	// Button Controllers
	function settingsButton(){
		console.log("settingsButton");
		
		$("#dialog").show();
		
	    $("#dialog").dialog({ 
	        modal: true, 
	        overlay: { 
	            opacity: 0.8, 
	            background: "black" 
	        } 
	    });	
	}

	function openButton(){
		console.log("openButton");
		
	}


	function playButton(){
		console.log("playButton");
		
	}


	function stopButton(){
		console.log("stopButton");
		
	}

	function quizButton(){
		console.log("quizButton");
		
	}

	function modeCheckbox(){
		console.log("modeCheckbox");
		
	}
	

	
	//***************************************************************
	// Events
	//***************************************************************
	
	// Events handled by the ApplicationController 
	$(window).on( "LanguageFileLoaded", initializeLanguageModule);
	
	
	// Events handled by the ApplicationView
	$(window).on( "LanguageModuleInitiated", applicationView.initLayout);
	
	// Events handled by the ApplicationView
	$(window).on( "ScenarioFileLoaded", applicationView.activateScenarioCommands);	
	
	// Events handled by the ApplicationView
	$(window).on( "LanguageModuleInitiated", startApplicationSetup);	
	
	
	//***************************************************************
	// Call back function for events
	//***************************************************************
	
	function initializeLanguageModule(e){		
		console.log("ApplicationController.initializeLanguageModule");
		
		// Test Language Module
		if (languageModule.initialize()){
			console.log("Language Module Initialization Succed");
			console.log("Selected Language: " + configModule.getLang());
			
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















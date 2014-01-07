
/* Responsibilities:
 * 
 * Perform the appropriate application layout display
 */

function ApplicationView(){
	// ******************************************************************************
	// Properties
	// ******************************************************************************
	// Reference to the dialog used by the application to show messages
	var m_open_dialog=null;	
	
	// Register if the user change any settings in the settings dialog
	var m_settings_modify=false;
	
	// Current selected language in the settings dialog
	var m_selected_language=0;
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************
	this.initLayout=initLayout;
	this.enableApplicationCommands=enableApplicationCommands;
	this.disableApplicationCommands=disableApplicationCommands;
	this.displayError=displayError;
	this.setProgressBar=setProgressBar;
	this.removeProgressBar=removeProgressBar;
	
	this.showOpenScenarioDialog=showOpenScenarioDialog;
	this.showOpenLocalScenarioDialog=showOpenLocalScenarioDialog;
	this.closeOpenLocalScenarioDialog=closeOpenLocalScenarioDialog;
	this.showSettingsDialog=showSettingsDialog;
	
	this.selectLanguage=selectLanguage;
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************

	function showSettingsDialog(){
		
		m_settings_modify=false;
		
		var dialog=$("#applicationdialog").show();
		
		var currentLanguagePos= languageModule.getCurrentLanguagePos();
		
		m_selected_language=currentLanguagePos;
		
		var html_content=htmlBuilder.getSettingsDialogHtml(m_selected_language);
		
		var dialog_buttons = {};
		
		var button_caption_apply=languageModule.getCaption("AV_BUTTON_APPLY");
		
		dialog_buttons[button_caption_apply] = function(){	
			applySettings();
			$("#applicationdialog").dialog("close");		
		};
		
	    $("#applicationdialog").dialog({ 
	        modal: true,
	        width: 300,
	        height: 300,
	        position: {  my: "center", at: "center", of: window  },
	        title: languageModule.getCaption("TITLE_SETTINGS_DIALOG"),
	        close: function( event, ui ) {}
	    });

	    $('#applicationdialog').dialog({ buttons: dialog_buttons });
	    
	    $("#applicationdialog").html(html_content);
	    
	    dialog.dialog("open");		
	}
	
	// Method used to update the current selected scenario example
	// Triggered when the user use the mouse or the finger to select an example
	function selectLanguage(index){
		
		m_settings_modify=true;
		
		var listItem=document.getElementById("ScenarioListItem" + index);
		
		var previouslistItem=document.getElementById("ScenarioListItem" + m_selected_language);
		
		previouslistItem.className="";
		
		listItem.className="ScenarioSelected";
		
		m_selected_language=index;		
	}	
	
	function applySettings(){
		if (m_settings_modify){
			if (console && debug){
				console.log("Apply new settings...");	
			}

			languageModule.setCurrentLanguage(m_selected_language);
			
			if (console && debug){
				console.log("Current Language: " + languageModule.getCurrentLanguage());	
			}			
			
			setApplicationButtonsCaption();
			
			// Create an event to notify ScenarioController or ScenarioView
			var eventLanguageFile = $.Event( "ApplicationLanguageChange" );
			$(window).trigger( eventLanguageFile );			
		}
	}
	
	function setApplicationButtonsCaption(){
		
		var button=document.getElementById("bt_open");
		button.value=languageModule.getCaption("BUTTON_OPEN");
		
		button=document.getElementById("bt_settings");
		button.value=languageModule.getCaption("BUTTON_SETTINGS");
		
	}
	
	function closeOpenLocalScenarioDialog(){
		var m_open_dialog=$("#applicationdialog");
		m_open_dialog.dialog("close");
	}
	
	// Show the dialog to open Local Files
	function showOpenLocalScenarioDialog(){
	    var width = window.innerWidth * 0.8;
	    var height = window.innerHeight * 0.8;
	    
	    if (width > 500){
	    	width = 500;
	    }
	    
	    if (height > 400){
	    	height = 400;
	    }
	    
		var m_open_dialog=$("#applicationdialog").show();
		
		var dialog_buttons = {};
		
		dialog_buttons[languageModule.getCaption("AV_BUTTON_ACCEPT")] = function(){	
			applicationController.openLocalScenario();
		};
		
		dialog_buttons[languageModule.getCaption("AV_BUTTON_CANCEL")] = function(){	
			$("#applicationdialog").dialog("close");
		};		
		
		m_open_dialog.dialog({ 
	        modal: true,
	        width: width,
	        height: height,
	        position: {  my: "center top+5%", at: "center top+5%", of: window  },
	        title: languageModule.getCaption("AV_DIALOG_TITLE_LOAD_SCENARIO"),
			close: function( event, ui ) {}
	    });
	    
	    m_open_dialog.html(htmlBuilder.getOpenLocalScenarioDialog());
    
	    m_open_dialog.dialog({ buttons: dialog_buttons });
	    
	    m_open_dialog.dialog("open");		
	}
	
	// Show the Main Open Dialog
	function showOpenScenarioDialog(){
	    var width = window.innerWidth * 0.8;
	    var height = window.innerHeight * 0.8;
	    
	    if (width > 500){
	    	width = 500;
	    }
	    
	    if (height > 400){
	    	height = 400;
	    }
	    
		var m_open_dialog=$("#applicationdialog").show();
		
		var dialog_buttons = {};

		dialog_buttons[languageModule.getCaption("AV_BUTTON_SELECT")] = function(){	
			$("#applicationdialog").dialog("close");					
			applicationController.openScenarioExample();		
		};
		
		dialog_buttons[languageModule.getCaption("AV_BUTTON_CANCEL")] = function(){	
			$("#applicationdialog").dialog("close");
		};			
		
		m_open_dialog.dialog({ 
	        modal: true,
	        width: width,
	        height: height,
	        position: {  my: "center top+5%", at: "center top+5%", of: window  },
	        title: languageModule.getCaption("AV_DIALOG_TITLE_LOAD_SCENARIO"),
			close: function( event, ui ) {}
	    });
		
		m_open_dialog.dialog({ buttons: dialog_buttons });
	    
	    m_open_dialog.html(htmlBuilder.getScenarioListLoading());
    
	    m_open_dialog.dialog("open");		
	}
	
	// Hide Progress Bar
	function removeProgressBar(){
		var div=document.getElementById("progress_bar");
		
		if (div){
			//div.parentNode.removeChild(div);
			div.className="invisible";
		}else{
			alert("null progress bar");
		}
	}
	
	// Show Progress Bar
	function setProgressBar(){
		var div=document.getElementById("progress_bar");
		
		if (div){
			div.className="visible";
		}else{
			if (console && debug){
				alert("Unexpected error: null progress bar");
			}
		}
	}
	
	// Display error message associated to the scenario
	function displayError(html_msg){
		//console.log("displayError: " + html_msg);
	    
		$("#applicationdialog").dialog({
			autoOpen: false,
			modal: true,
			width: 500,
			height: 300,
			position: {  my: "center", at: "center", of: window  },
			resizable: true,
			title: languageModule.getCaption("AV_DIALOG_TITLE_ERROR_MSG")
		});
		
		var dialog_buttons = {};
		
		dialog_buttons[languageModule.getCaption("AV_BUTTON_CLOSE")] = function(){	
			$("#applicationdialog").dialog("close");
		};
		
		$('#applicationdialog').dialog({ buttons: dialog_buttons });
		
		$("#applicationdialog").html(html_msg);
		
		$("#applicationdialog").dialog("open");
	}	
	
	
	// Setup Layout When the Language Module Was Fully Loaded
	function initLayout(e){
		if (console && debug){
			console.log("ApplicationView.initLayout");
			
			console.log("Number of languages: " + languageModule.getNumberofLanguages());
			
			console.log("Languages: " + languageModule.getAvailableLanguages());
		}
		
		removeProgressBar();
		
		insertCommandButtons();
		
		enableApplicationCommands();
	}
	
	// Set Captions buttons and other text used in the layout using the Language Module
	function insertCommandButtons(){
		if (console && debug){
			console.log("Insert Command Buttons...");
		}
		
		var CommnadsElement=document.getElementById("Commands");
		
		// Insert the list of buttons in the Commands div section
		CommnadsElement.innerHTML=htmlBuilder.getAppCommandButtonsHtml();
	}
	
	function disableApplicationCommands(){

		// Enable buttons
		var button=document.getElementById("bt_open");
		button.disabled=true;
		
		button=document.getElementById("bt_settings");
		button.disabled=true;	
	}	
	
	function enableApplicationCommands(){
		var button=document.getElementById("bt_open");
		button.disabled=false;
		
		button=document.getElementById("bt_settings");
		button.disabled=false;			
	}
		
}






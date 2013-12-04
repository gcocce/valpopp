
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
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************

	function showSettingsDialog(){
		var dialog=$("#applicationdialog").show();
		
	    $("#applicationdialog").dialog({ 
	        modal: true,
	        width: 300,
	        height: 300,
	        position: {  my: "center", at: "center", of: window  },
	        title: "Settings",
	        buttons:{},
			close: function( event, ui ) {}
	    });
	    
	    $("#applicationdialog").html("");
	    
	    dialog.dialog("open");		
	}
	
	function closeOpenLocalScenarioDialog(){
		var m_open_dialog=$("#applicationdialog");
		m_open_dialog.dialog("close");
	}
	
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
		
		m_open_dialog.dialog({ 
	        modal: true,
	        width: width,
	        height: height,
	        position: {  my: "center top+5%", at: "center top+5%", of: window  },
	        title: "Load Scenario",
	        buttons:{
				"Accept": function() {
					//$("#applicationdialog").dialog("close");			
					applicationController.openLocalScenario();
				},
				"Cancel": function() {
					$(this).dialog("close");
				}				
	        },
			close: function( event, ui ) {}
	    });
	    
	    m_open_dialog.html(htmlBuilder.getOpenLocalScenarioDialog());
    
	    m_open_dialog.dialog("open");		
	}
	
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
		
		m_open_dialog.dialog({ 
	        modal: true,
	        width: width,
	        height: height,
	        position: {  my: "center top+5%", at: "center top+5%", of: window  },
	        title: "Load Scenario",
	        buttons:{
				"Select": function() {
					$("#applicationdialog").dialog("close");					
					applicationController.openScenarioExample();
				},
				"Cancel": function() {
					$(this).dialog("close");
				}				
	        },
			close: function( event, ui ) {}
	    });
	    
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
			alert("null progress bar");
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
			title: "Application Error Message",
			buttons: {
				"Close": function(){
					$(this).dialog("close");
				}
			}
		});
		
		$("#applicationdialog").html(html_msg);
		
		$("#applicationdialog").dialog("open");
	}	
	
	
	// Setup Layout When the Language Module Was Fully Loaded
	function initLayout(e){
		console.log("ApplicationView.initLayout");

		removeProgressBar();
		
		enableApplicationCommands();
		
		//TODO: get caption por buttons regarding configuration language
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






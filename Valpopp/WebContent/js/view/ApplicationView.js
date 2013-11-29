
/* Responsibilities:
 * 
 * Perform the appropriate application layout display
 */

function ApplicationView(){
	// ******************************************************************************
	// Properties
	// ******************************************************************************
	
	
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
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************

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
		
		console.log("displayError: " + html_msg);
	    
		$("#maindialog").dialog({
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
		
		$("#maindialog").html(html_msg);
		
		$("#maindialog").dialog("open");
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
	
//	function disableApplicationCommands(){
//		
//		var button=document.getElementById("bt_open");
//		button.disabled=true;
//		
//		button=document.getElementById("bt_settings");
//		button.disabled=true;			
//	}
	

	// ******************************************************************************
	// Events Listeners
	// ******************************************************************************


	// ******************************************************************************
	// Call back functions
	// ******************************************************************************
	
	
}






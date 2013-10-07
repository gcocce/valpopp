console.log("ApplicationView Script");


/* Responsabilities:
 * 
 * Perform the apropiate application layout display
 */

function ApplicationView(){
	// ******************************************************************************
	// Properties
	// ******************************************************************************
	
	
	
	
	
	
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	function removeProgressBar(){
		var div=document.getElementById("progress_bar");
		
		if (div){
			div.parentNode.removeChild(div);
		}else{
			alert("null progress bar");
		}
		
		//Jquery mode
		//$( ".hello" ).remove();
	}
	
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************
	this.initLayout=initLayout;
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	// Setup Layout When the Language Module Was Fully Loaded
	function initLayout(e){
		console.log("ApplicationView.initLayout");

		removeProgressBar();
		
		// Enable buttons
		var button=document.getElementById("bt_open");
		button.disabled=false;
		
		button=document.getElementById("bt_settings");
		button.disabled=false;	
	}
	


	// ******************************************************************************
	// Events Listeners
	// ******************************************************************************
	
	


	// ******************************************************************************
	// Call back functions
	// ******************************************************************************
	
	
	
	
	
}






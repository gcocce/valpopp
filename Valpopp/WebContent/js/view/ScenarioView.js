console.log("ScenarioView Script");

/* Responsabilities:
 * 
 * Performs Scenario Display
 * 
 * Performs User Interface Display associated to the Scenario Layout
 * 
 */

function ScenarioView(){
	// ******************************************************************************
	// Properties
	// ******************************************************************************	
	var m_error="";
	
	var m_scenarioContext=null;
	
	// to display the node images
	var theNodesContainer=document.getElementById("vNodes");
    var theNodes = document.getElementById("vNodesCanvas");
    var theNodesContext=theNodes.getContext("2d");
    
    var theContainer = document.getElementById("vDraw");
    var theCanvas = document.getElementById("vScenarioCanvas");   
    var theCanvasContext=theCanvas.getContext("2d");
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
    function setupSize() {
    	console.log("ScenarioView.setupSize()");
        //var width = window.innerWidth;
        //var height = window.innerHeight;
    	
        var theContainerHeight = window.getComputedStyle(theContainer).getPropertyValue('height');
        var theContainerWidth = window.getComputedStyle(theContainer).getPropertyValue('width');
        
        var theNodesContainerHeight = window.getComputedStyle(theNodesContainer).getPropertyValue('height');        
        var theNodesContainerWidth = window.getComputedStyle(theNodesContainer).getPropertyValue('width');        
        
        console.log("vDraw height: "+theContainerHeight);
        console.log("vDraw width: "+theContainerWidth);
        
        console.log("vNodes height: "+theNodesContainerHeight);
        console.log("vNodes width: "+theNodesContainerWidth);
        
        theContainerHeight = parseInt(theContainerHeight);
        theContainerWidth = parseInt(theContainerWidth);
        
        theNodesContainerHeight = parseInt(theNodesContainerHeight);        
        theNodesContainerWidth = parseInt(theNodesContainerWidth);  
        
	    theCanvas.style.height = theContainerHeight + 'px';	    
	    theCanvas.style.width = theContainerWidth + 'px';
	    theCanvas.height = theContainerHeight;
	    theCanvas.width = theContainerWidth;	    
   	    
    	theNodes.style.height = theNodesContainerHeight + 'px';
	    theNodes.style.width = theContainerWidth + 'px';
	    theNodes.setAttribute('height',theNodesContainerHeight);	    
	    theNodes.setAttribute('width', theContainerWidth );    	    
    	
    	console.log("ScenarioView.setupSize()");
    	console.log("theCanvas style width:" + theCanvas.style.width + " height:" + theCanvas.style.height);
    	console.log("theCanvas width:" + theCanvas.width + " height:" +  theCanvas.height);
    	console.log("theNodes style width:" + theNodes.style.width + " height:" + theNodes.style.height);
    	console.log("theNodes width:" + theNodes.width + " height:" +  theNodes.height);    	
    }
    
    function displayScenarioTitle(){
		console.log("scenarioView.displayScenarioTitle()");
		
		var header=document.getElementById("vHeader");
		
		header.innerHTML=m_scenarioContext.getScenarioName();
	}
	
    
	function displayNodeImages(){
		
		console.log("displayNodeImages");
		
		var width= theNodes.width;
		var heigth= theNodes.height;
		
		var imgHeight= Math.round(heigth * 0.7);
		var tagHeight= Math.round(heigth * 0.3);
		
		console.log("Node image height: "+imgHeight);
		console.log("Node tag height: "+tagHeight)
		
		var img=null;
		
		var fontSize = tagHeight -1;
		var fontFace = "serif";
		//var textFillColor ="#ff0000";
		var textBaseline = "top";
		var textAlign = "center";
		var fontWeight ="normal";
		var fontStyle = "normal";		

		
		// Space the first and last node and the border
		var border = 30;
	    // Distance between nodes
	    var distNodos = (width - (border * 2) ) / (m_scenarioContext.getNumberofNodes() -1);	
	    
	    console.log("Number of nodes: "+ m_scenarioContext.getNumberofNodes());
	    
	    for (var x=0; x < m_scenarioContext.getNumberofNodes(); x++){
			try{
				img=m_scenarioContext.getNodeImg(x).getImg();
				
				if (img.height > imgHeight){
					var proportion = imgHeight / img.height;
					
					img.height = imgHeight;
					img.width = img.width * proportion;
				}
				
				console.log("display image for node 0: " + img.src);
				
				console.log("image width: "+ img.width +" image height:"+ img.height);
				
				// Display the image of the node
				theNodesContext.drawImage(img, border + (distNodos * x) - (img.width/2), 0, img.width, img.height);
				
				// Display the name of the node	        
				theNodesContext.textBaseline = textBaseline;
				theNodesContext.textAlign = textAlign;
				theNodesContext.font = fontWeight + " " + fontStyle + " " + fontSize + "px " + fontFace;
				theNodesContext.fillStyle    = "black";
				theNodesContext.fillText  ( m_scenarioContext.getNodeName(x) ,  border + (distNodos * x) , imgHeight);		
			}catch (e){
				console.error(e.toString());
				displayError(utils.wrapErrorMsg(e.toString()));
			}	    	
	    }
	}
	
	
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************
	this.displayError=displayError;
	this.displayMsg=displayMsg;
	this.enableScenarioCommands=enableScenarioCommands;
	this.disableScenarioCommands=disableScenarioCommands;
	this.initiateScenarioDisplay=initiateScenarioDisplay;

	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	function initiateScenarioDisplay(context){
		console.log("ScenarioView.initiateScenarioDisplay(context)");
		m_scenarioContext=context;
		
		enableScenarioCommands();
		
		setupSize();
		
		displayScenarioTitle();
		
		displayNodeImages();
	}
	
	function displayMsg(html_msg){
		console.log("ScenarioView.displayMsg");   
	    
		$("#maindialog").dialog({
			autoOpen: false,
			modal: true,
			width: 500,
			height: 300,
			position: {  my: "center", at: "center", of: window  },
			resizable: true,
			title: "Scenario Message",
			buttons: {
				"Close": function(){
					$(this).dialog("close");
				}
			}
		});
		
		$("#maindialog").html(html_msg);
		
		$("#maindialog").dialog("open");		
	}
	
	// Display error message associated to the scenario
	function displayError(html_msg){
		console.log("ScenarioView.displayError");   
	    
		$("#maindialog").dialog({
			autoOpen: false,
			modal: true,
			width: 500,
			height: 300,
			position: {  my: "center", at: "center", of: window  },
			resizable: true,
			title: "Scenario Error Message",
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

	function enableScenarioCommands(){
		console.log("ApplicationView.activateScenarioCommands()");
		
		// Enable buttons
		var button=document.getElementById("bt_play");
		button.disabled=false;
		
		button=document.getElementById("bt_stop");
		button.disabled=false;
		
		button=document.getElementById("bt_mode");
		button.disabled=false;
		
		button=document.getElementById("bt_data");
		button.disabled=false;
	}
	
	function disableScenarioCommands(){
		console.log("ApplicationView.disableScenarioCommands");
		
		// Enable buttons
		var button=document.getElementById("bt_play");
		button.disabled=true;
		
		button=document.getElementById("bt_stop");
		button.disabled=true;
		
		button=document.getElementById("bt_mode");
		button.disabled=true;
		
		button=document.getElementById("bt_data");
		button.disabled=true;		
	}
	
	
	
	
	// ******************************************************************************
	// Events
	// ******************************************************************************	
	
	// Events handled by the ApplicationController 
	$(window).on( "Event", someCalbackFunction);	
	
	
	
	
	
	// ******************************************************************************
	// Call back function for events
	// ******************************************************************************	
	
	function someCalbackFunction(e){
		
	}
}
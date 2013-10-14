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
	var m_scenarioPlay=null;
	
	// to display the node images
	var theNodesContainer=document.getElementById("vNodes");
    var theNodes = document.getElementById("vNodesCanvas");
    var theNodesContext=theNodes.getContext("2d");
    
    var theContainer = document.getElementById("vDraw");
    var theCanvas = document.getElementById("vScenarioCanvas");   
    var theCanvasContext=theCanvas.getContext("2d");
    
    var m_drawing_canvas=new Canvas(theCanvasContext);
    
	var m_scenType= new ScenType();
    var m_nodesPosition= new Array();
    var m_transfHeight=1.0;
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
    
    function setupSize() {
//    	console.log("ScenarioView.setupSize()");
    	
        var theContainerHeight = window.getComputedStyle(theContainer).getPropertyValue('height');
        var theContainerWidth = window.getComputedStyle(theContainer).getPropertyValue('width');
        
        var theNodesContainerHeight = window.getComputedStyle(theNodesContainer).getPropertyValue('height');        
        var theNodesContainerWidth = window.getComputedStyle(theNodesContainer).getPropertyValue('width');        
        
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
    }
    
    function displayScenarioTitle(){
		var header=document.getElementById("vHeader");
		
		header.innerHTML=m_scenarioContext.getScenarioName();
	}
	
    
	function displayNodeImages(){		
		var width= theNodes.width;
		var heigth= theNodes.height;
		
		var imgHeight= Math.round(heigth * 0.7);
		var tagHeight= Math.round(heigth * 0.3);
				
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
	       
	    m_nodesPosition[0]=0;
	    for (var x=0; x < m_scenarioContext.getNumberofNodes(); x++){
			try{
				var NodeImage=m_scenarioContext.getNodeImg(x);
				
				img=NodeImage.getImg();
				
				var proportion = imgHeight / NodeImage.getHeight();
				
				img.height = imgHeight;
				img.width = NodeImage.getWidth() * proportion;
				
				// Update Node x Position
				m_nodesPosition[x + 1]=border + (distNodos * x);
					
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
	
	function calculateMsgTextSize(m_transfHeight){
		var nodeDistance= m_nodesPosition[2] - m_nodesPosition[1];
		
		var size=Math.round(nodeDistance / 16 * m_transfHeight);
		
		return size;
	}
	

	function displayObject(obj){
		//m_transfHeight
//		console.log("displayObject of type: " + obj.getType());
		
		// TODO: display other object types
		switch (obj.getType()){
			case m_scenType.MESSAGE:
				
				var msg=obj.getObject();
				
				var name=msg.getMsg();
				
				var initPos=msg.getInitPos();
				var endPos=msg.getEndPos();
				
				var percent=msg.getDrawPercent();
					
				var pi= new Point(m_nodesPosition[initPos.getNode()], initPos.getY() * m_transfHeight);
				//var pf= new Point(m_nodesPosition[endPos.getNode()] * percent, endPos.getY() * m_transfHeight * percent);	
				
				var destX=0;
				var messageX=0;
				var messageY=0;
				
				// TODO: correct the way it is calculated, it should be more simple
		        if (initPos.getNode() < endPos.getNode()) {
		          destX= m_nodesPosition[initPos.getNode()] + (m_nodesPosition[endPos.getNode()] - m_nodesPosition[initPos.getNode()]) * percent;
		          messageX = m_nodesPosition[initPos.getNode()] + (m_nodesPosition[endPos.getNode()] - m_nodesPosition[initPos.getNode()]) / 2 ;		          
		        }else{
		          destX= m_nodesPosition[initPos.getNode()] - Math.abs(m_nodesPosition[endPos.getNode()] - m_nodesPosition[initPos.getNode()]) * percent ;
		          messageX = m_nodesPosition[initPos.getNode()] - Math.abs(m_nodesPosition[endPos.getNode()] - m_nodesPosition[initPos.getNode()]) / 2 ;
		        }
		        
				var pf= new Point(destX, initPos.getY() * m_transfHeight + (endPos.getY()- initPos.getY()) * m_transfHeight * percent);		        
		        
				messageY= initPos.getY() * m_transfHeight + ((endPos.getY()- initPos.getY()) * m_transfHeight) / 4;
					        
				var textSize=calculateMsgTextSize(m_transfHeight);
				
				m_drawing_canvas.drawMessage(name, messageX, messageY, textSize);
				
				m_drawing_canvas.drawArrow(pi, pf);
				
				break;
			default:
				console.log("displayObject, nor recognized type: " + obj.getType());
				break;
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
	this.getCurrentScenarioPlay=getCurrentScenarioPlay;
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	function getCurrentScenarioPlay(){
		return m_scenarioPlay;
	}
	
	function initiateScenarioDisplay(context){
		console.log("ScenarioView.initiateScenarioDisplay(context)");
		m_scenarioContext=context;
		
		m_scenarioPlay=new ScenarioPlay(context);
	
		setupSize();
		
		displayScenarioTitle();
		
		displayNodeImages();
		
		enableScenarioCommands();		
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
	
	$(window).on( "resize", updateScenarioView);
	
	$(window).on( "ScenarioPlayChanged", drawScenarioScreen);
	
	
	// ******************************************************************************
	// Call back function for events
	// ******************************************************************************	
	
	function updateScenarioView(e){
//		console.log("ScenarioView.updateScenarioView");
		
		if (m_scenarioPlay!=null){
			setupSize();
			
			displayScenarioTitle();
			
			displayNodeImages();
			
			drawScenarioScreen();
		}
	}
	
	// Get Data from ScenarioPlay and display it on the canvas
	function drawScenarioScreen(){
//		console.log("ScenarioView.drawScenarioScreen userScroll: " + m_scenarioPlay.getUserScroll());
//		console.log("ScenarioView.drawScenarioScreen");

		//TODO: Display the current scenarioPlay in the canvas
		var width= theCanvas.width;
		var height = theCanvas.height;

		m_transfHeight=1.0;
		
		height = m_scenarioPlay.getCurrentHeight() * m_transfHeight + 20;
		
	    theCanvas.style.height = height + 'px';	    
	    theCanvas.style.width = width + 'px';
	    theCanvas.height = height;
	    theCanvas.width = width;
	        
	    // Display horizontal lines if there is anything to be displayed
	    if (m_scenarioPlay.getCurrentHeight()>0){
		    for (var x=1; x <= m_scenarioContext.getNumberofNodes(); x++){
			    var pi=new Point(m_nodesPosition[x],0);
			    var pf=new Point(m_nodesPosition[x],height);
		    	
			    m_drawing_canvas.drawVerticalLine(pi, pf);
		    }
	    }
	    
	    var readyO=m_scenarioPlay.getReadyObjects();
	    
	    for (var x=0; x < readyO.length; x++){
	    	// Display ready Objects
	    	var obj=readyO[x];
	    	
	    	displayObject(obj);
	    }
	    
	    var processingO= m_scenarioPlay.getProcessingObjects();
	    
	    for (var x=0; x < processingO.length; x++){
	    	//Display processing Objects
	    	var obj=processingO[x];
	    	
	    	displayObject(obj);
	    }
		
//		var downlinepos = (messages.length + 1) * advance;
	    
		var theContainerHeight = window.getComputedStyle(theContainer).getPropertyValue('height');
        
//		console.log("downlinepos:" +downlinepos + " container.height:" + theContainerHeight );
		
		if (!m_scenarioPlay.getUserScroll() && height > parseInt(theContainerHeight)) {
			theContainer.scrollTop = height - parseInt(theContainerHeight);
        }		
	
	}	
}
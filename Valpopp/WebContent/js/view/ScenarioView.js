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
	
	// Reference to the model
	var m_scenarioContext=null;
	// Reference to one instance of ScenarioPlay
	var m_scenarioPlay=null;
	
	// Reference to the Html elements used to display the scenario
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
    
	var m_distBetweenNodes = 0;
	
	var m_current_dialog=null;
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
    
    function setupSize() {   	
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
	
    
    // Calculate Nodes Position and display Node Images
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
	    
		m_distBetweenNodes = m_nodesPosition[2] - m_nodesPosition[1];
	}
	
	
	function calculateMsgTextSize(m_transfHeight){
		var nodeDistance= m_nodesPosition[2] - m_nodesPosition[1];
		
		var size=Math.round(nodeDistance / 16 * m_transfHeight);
		
		return size;
	}
	
	function displayObject(obj){
//		console.log("displayObject of type: " + obj.getType());
		
		switch (obj.getType()){
			case m_scenType.MESSAGE:
				
				var msg=obj.getObject();
				
				var display=msg.getDisplay();
				
				if (display){
					var name=msg.getMsg();
					var initPos=msg.getInitPos();
					var endPos=msg.getEndPos();
					var dash=msg.getDash();
					var type=msg.getType();
					
					var messageY = msg.getMsgPosY() * m_transfHeight;
					
					var messageX=0;
			        if (initPos.getNode() < endPos.getNode()) {
			          messageX = m_nodesPosition[initPos.getNode()] + (m_nodesPosition[endPos.getNode()] - m_nodesPosition[initPos.getNode()]) / 2 ;		          
			        }else{
			          messageX = m_nodesPosition[initPos.getNode()] - Math.abs(m_nodesPosition[endPos.getNode()] - m_nodesPosition[initPos.getNode()]) / 2 ;
			        }
			        
					var textSize=calculateMsgTextSize(m_transfHeight);
					
					// Calculate initial and final arrow points
					var pi=new Point(m_nodesPosition[initPos.getNode()], initPos.getTime() * m_transfHeight);
					var pf=null;

					if (msg.getReady()){
						pf= new Point(m_nodesPosition[endPos.getNode()], endPos.getTime() * m_transfHeight);	
					}else{
						var destX=0;
						var destY=0;
						
						destY = (initPos.getTime() + msg.getTransmitedTime()) * m_transfHeight;
						
						var xdisp=0;
						var nodeDist=Math.abs(m_nodesPosition[endPos.getNode()] - m_nodesPosition[initPos.getNode()]);
						
						xdisp = Math.round( nodeDist * msg.getTransmitedTime() / msg.getTransTime() );
						
				        if (initPos.getNode() < endPos.getNode()) {
				          destX= m_nodesPosition[initPos.getNode()] + xdisp;
				        }else{
				          destX= m_nodesPosition[initPos.getNode()] - xdisp;
				        }
				        
						pf= new Point(destX, destY);		        
					}
					
					var color="black";
					switch (type){
					case "ONEWAY":
						color="#FF33FF";
						break;
					case "REQUEST":
						color="#FF0000";
						break;
					case "RESPONSE":
						color="#0033FF";
						break;
					default:
						color="black";	
						break;
					}
					
					var dashSize=0;
					if (dash.localeCompare("FULL")!=0){
						dashSize=4;
					}
					
					// Calculate the complement of the angle of the arrow
					var angle=  Math.atan((endPos.getTime() - initPos.getTime()) * m_transfHeight / Math.abs(m_nodesPosition[endPos.getNode()] - m_nodesPosition[initPos.getNode()]) );
					
					var complement = (Math.PI / 2)  - angle;
						
					m_drawing_canvas.drawArrow(pi, pf, color, dashSize, complement, m_distBetweenNodes);
					
					m_drawing_canvas.drawMessage(name, messageX, messageY, textSize);
				}
				break;
			case m_scenType.TREATMENT:
				var treatobj=obj.getObject();
				
				var display=treatobj.getDisplay();
				
				if (display){
					var initTime=treatobj.getInitTime();
					var endTime=treatobj.getEndTime();
					var currentTime=treatobj.getCurrentTime();
					var node=treatobj.getNode();
			
					// Calculate initial and final arrow points
					var pi=new Point(m_nodesPosition[node], initTime * m_transfHeight);
					var pf=null;
					
					if (endTime > currentTime){
						pf= new Point(m_nodesPosition[node], currentTime * m_transfHeight);
					}else{
						pf= new Point(m_nodesPosition[node], endTime * m_transfHeight);
					}
								
					m_drawing_canvas.drawTreatmentLine(pi, pf);
				}	
				break;
			case m_scenType.ACTION:
				//TODO: modify this code to display actions correctly
				var actionObj=obj.getObject();
				
				var node=actionObj.getNode();
				var initpos=actionObj.getInitPos();
				var endpos=actionObj.getFinalPos();
				var text= actionObj.getAction();
				
				var nodeDist = m_nodesPosition[2] - m_nodesPosition[1];
				
				var messageY = Math.round( initpos + (endpos - initpos) / 2);
				var messageX = 0;
				
				var textSize=calculateMsgTextSize(m_transfHeight);
				// The number of nodes depends on the scenario file configuration
				
				if (node==1){
					messageX = Math.round(nodeDist / 4) + 20;
				}else{
					if (node == m_scenarioContext.getNumberofNodes()){
						messageX= m_nodesPosition[node] - Math.round(nodeDist / 4);
					}else{
						messageX= m_nodesPosition[node];
					}
				}
				
				m_drawing_canvas.drawMessage(text, messageX, messageY, textSize);
				//m_drawing_canvas.drawAction
				
				break;
			case  m_scenType.TIMER:
				// TODO: code to display TIMER objects
				
				
				
				
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
	this.showScenarioQuizz=showScenarioQuizz;
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	function getCurrentScenarioPlay(){
		return m_scenarioPlay;
	}
	
	function showScenarioQuizz(){
		console.log("ScenarioView.showScenarioQuizz");
		
		var mcq = m_scenarioPlay.getMCQ();
		
		var mcq_title= mcq.title;
		
		var mcq_html= utils.getMCQHTML(mcq);
		
	    var width = window.innerWidth * 0.8;
	    var height = window.innerHeight * 0.8;
	    
	    if (width > 600){
	    	width = 600;
	    }
	    
	    if (height > 400){
	    	height = 400;
	    }
	    
	    m_current_dialog = $("#maindialog").dialog({
			autoOpen: false,
			modal: true,
			position: {  my: "center", at: "center", of: "#vScenario"  },
			resizable: true,	
			width: width,
			height: height,			
			title: mcq_title,
			buttons: {
				"Accept": function() {
					$("#maindialog").dialog("close");					
					quizzResults();
				},			
				"Close": function(){
					$(this).dialog("close");
				}
			}
		});
		
		//$("#maindialog").html("<h1>Answer the quizz!</h1>");
		//$("#maindialog").html(mcq_html);
	    m_current_dialog.html(mcq_html);
		
		//$("#maindialog").dialog("open");		
	    m_current_dialog.dialog("open");
	}
	
	// Move to private function section
	function quizzResults(){
		
		var mcq = m_scenarioPlay.getMCQ();
		
		var userResponses = new Array();
		var validResponses = new Array();
		var validAnswer=true;		
		
		for (var i=0; i < mcq.answers.length; i++ ){
			var userAnswer=document.getElementById("ValpoppMCQanswer" + (i+1));
			
			if (userAnswer.checked){
				userResponses[i]=true;
			}else{
				userResponses[i]=false;
			}
			
			if (mcq.answers[i].valid){
				validResponses[i]=true;
			}else{
				validResponses[i]=false;			
			}			
			
			if (userResponses[i]!=validResponses[i]){
				validAnswer=false;
			}			
		}
		
		m_current_dialog.html(utils.getMCQResults(mcq, userResponses, validResponses, validAnswer));
		
		// Select which buttons are displied
		if (configModule.getShowMCQAnswers() && !validAnswer){
			m_current_dialog.dialog('option', 'buttons', {
			    'Show Answers': function() {
			    	quizzAnswers();
			    },			
				"Close": function(){
					finishQuizz();
					$(this).dialog("close");
				}
			});			
		}else{
			m_current_dialog.dialog('option', 'buttons', {			
				"Close": function(){
					finishQuizz();
					$(this).dialog("close");
				}
			});				
		}
		
		m_current_dialog.dialog("open");		
	}
	
	// Move to private function section
	function quizzAnswers(){
		
		//TODO: show answers here
		var mcq = m_scenarioPlay.getMCQ();
		m_current_dialog.html(utils.getMCQAnswers(mcq));
		
		m_current_dialog.dialog('option', 'buttons', {
		    'Close': function() {
		    	finishQuizz();
		        $(this).dialog('close');
		    }
		});
		
		m_current_dialog.dialog("open");
		
	}
	
	function finishQuizz(){
		m_scenarioPlay.processMCQ();
		
		var event = $.Event( "ScenarioPlayQuizzFinished" );
		$(window).trigger( event );			
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
	
	//$(window).on( "ScenarioPlayMandatoryQuizz", showScenarioQuizz);	
	
	
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
	
	// Get Data from ScenarioPlay adapt it to the Scenario Size and display it on the canvas
	function drawScenarioScreen(){

		var width= theCanvas.width;
		var height = theCanvas.height;

		m_transfHeight=1.0;
		
		height = m_scenarioPlay.getCurrentMaxTime() * m_transfHeight + 20;
		
	    theCanvas.style.height = height + 'px';	    
	    theCanvas.style.width = width + 'px';
	    theCanvas.height = height;
	    theCanvas.width = width;
	        
	    // Display horizontal lines if there is anything to be displayed
	    if (m_scenarioPlay.getCurrentMaxTime() > 0){
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
	    
		var theContainerHeight = window.getComputedStyle(theContainer).getPropertyValue('height');
		
		if (!m_scenarioPlay.getUserScroll() && height > parseInt(theContainerHeight)) {
			theContainer.scrollTop = height - parseInt(theContainerHeight);
        }		
	
	}	
}
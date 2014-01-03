
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
	
	// Reference to the current instance of ScenarioPlay
	var m_scenarioPlay=null;
	
	// Reference to the Html elements used to display the scenario
    var theContainer = document.getElementById("vDraw");
    var theCanvas = document.getElementById("vScenarioCanvas");   
    var theCanvasContext=theCanvas.getContext("2d");
    
	var theNodesContainer=document.getElementById("vNodes");
    var theNodes = document.getElementById("vNodesCanvas");
    var theNodesContext=theNodes.getContext("2d");
    
	var theCommentsContainer=document.getElementById("vMessagesBody");
    var theCommentsCanvas = document.getElementById("vScenarioComments");
    var theCommentsContext= theCommentsCanvas.getContext("2d");
    
    var m_drawing_canvas=new Canvas(theCanvasContext);
    var m_comment_canvas=new Canvas(theCommentsContext);
    
    // Used to identify different types of Scenario Objects
	var m_scenType= new ScenType();
	
	// Register the horizontal position of the nodes
    var m_nodesPosition= new Array();
    
    // This variable can be used to aply a transformation to the scenario object
    // The vertical position is escalated by this variable.
    var m_transfHeight=1.0;
    
	var m_distBetweenNodes = 0;
	
	// Reference to the dialog been displayed
	var m_current_dialog=null;
	
	// Reference to the scenario data dialog
	var m_scenario_data_dialog=null;
	
	// Register if the scenario image dialog is open
	var m_scenario_img_dialog_open=false;
	
	// Register if the scenario messages dialog is open
	var m_scenario_msg_dialog_open=false;
	
	// Register if the Comment section is shown
	var m_scenario_comments=true;
	
	// Register the width of the comment section
	var m_comment_section_width=0;
	
	//TODO: review usability
	var m_comment_text_size=12;
	
	var m_current_quiz_points="";
	
	// ******************************************************************************
	// Constructor
	// ******************************************************************************
	
	initScenarioLayout();
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
    

	
	// Set a responsive width for the scenario and comment section
	function computeWindowSize(){
    	var window_width= $(window).width();
    	
//    	console.log("Window width: " + window_width );

    	if (window_width <= 768){
    		document.getElementById("vScenario").style.width="99%";
    		document.getElementById("vMessages").style.display="none";
    		
    	}else{
    		document.getElementById("vMessages").style.display="inline";
    		
        	if (m_scenario_comments){
        		theCommentsContainer=document.getElementById("vMessagesBody");
        	    theCommentsCanvas = document.getElementById("vScenarioComments");
        	    theCommentsContext= theCommentsCanvas.getContext("2d");
        	    
        		document.getElementById("vScenario").style.width="72%";
        		document.getElementById("vMessages").style.width="26%";                
        	}else{
        		document.getElementById("vScenario").style.width="96%";
        		document.getElementById("vMessages").style.width="2%";
        	}
    	}
    }
    
    function setupSize() {
    	computeWindowSize();
    	
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
	    
	    // If the comment section is present adapt the size
    	if (m_scenario_comments){
    		
            var theCommentsContainerHeight=window.getComputedStyle(theCommentsContainer).getPropertyValue('height');
            var theCommentsContainerWidth=window.getComputedStyle(theCommentsContainer).getPropertyValue('width');
            	           
            theCommentsContainerHeight = parseInt(theCommentsContainerHeight);
            theCommentsContainerWidth = parseInt(theCommentsContainerWidth);
            
            theCommentsCanvas.style.height = theCommentsContainerHeight + 'px';	    
            theCommentsCanvas.style.width = theCommentsContainerWidth + 'px';
            theCommentsCanvas.height = theCommentsContainerHeight;
            theCommentsCanvas.width = theCommentsContainerWidth;
            
            m_comment_section_width = theCommentsContainerWidth;
            
            m_comment_text_size=calculateCommentTextSize(m_comment_section_width);
    	}	    
    }
    
    function displayScenarioTitle(){

		var header=document.getElementById("vHeader");
		
		//header.innerHTML='<div id="ScenarioTitle">' + m_scenarioContext.getScenarioName() + '</div>';
		header.innerHTML=htmlBuilder.getScenarioTitleHtml(m_scenarioContext.getScenarioName(), m_current_quiz_points);	
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
				if (console){
					console.error(e.toString());
				}
				displayError(htmlBuilder.wrapErrorMsg(e.toString()));
			}	    	
	    }
	    
		m_distBetweenNodes = m_nodesPosition[2] - m_nodesPosition[1];
	}
	
	// Determine the size of the Messages text
	function calculateMsgTextSize(){
		var nodeDistance= m_nodesPosition[2] - m_nodesPosition[1];
		
		var size=Math.round(nodeDistance / 18);
		
		if (size > 20){
			size = 20;
		}
		
		return size;
	}
	
	// Determine the size of the comments text
	function calculateCommentTextSize(canvasWidth){

		var size=Math.round(canvasWidth / 18);
		
		return size;
	}	
	
	// Display objects of the scenario (messages, timer, treatment, comments, and so on...)
	function displayObject(obj){
		//	console.log("displayObject of type: " + obj.getType());
		
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
					
					var dashSize=[];
					if (dash.localeCompare("FULL")!=0){
						dashSize=[6];
					}
					
					// Calculate the complement of the angle of the arrow
					var angle=  Math.atan((endPos.getTime() - initPos.getTime()) * m_transfHeight / Math.abs(m_nodesPosition[endPos.getNode()] - m_nodesPosition[initPos.getNode()]) );
					
					var complement = (Math.PI / 2)  - angle;
						
					m_drawing_canvas.drawArrow(pi, pf, color, dashSize, complement, m_distBetweenNodes);
					
					m_drawing_canvas.drawMessage(name, messageX, messageY, textSize);
					
					if (m_scenario_comments){
						if (msg.getComment()){
							m_comment_canvas.drawComment(msg.getComment(), 0 , pi.getY(), m_comment_text_size, m_comment_section_width);	
						}
					}
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
				if (console){
					console.error("displayObject, nor recognized type: " + obj.getType());
				}
				break;
		}
	}
	
	function initScenarioLayout(){
		
		var commentsHeaderElement=document.getElementById("vMessagesHeader");
		
		commentsHeaderElement.innerHTML=htmlBuilder.getCommentsVisibleHeader();
	}
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************
	this.displayError=displayError;
	this.displayMsg=displayMsg;
	this.initiateScenarioDisplay=initiateScenarioDisplay;	
	this.enableScenarioCommands=enableScenarioCommands;
	this.disableScenarioCommands=disableScenarioCommands;
	//this.getCurrentScenarioPlay=getCurrentScenarioPlay;
	
	this.showScenarioQuizz=showScenarioQuizz;
	this.showQuizzAnswers=showQuizzAnswers;
	this.showQuizCorrections=showQuizCorrections;
	
	this.showScenarioDataMenu=showScenarioDataMenu;
	this.showScenarioImage=showScenarioImage;
	this.showScenarioMessages=showScenarioMessages;
	this.showScenarioReferences=showScenarioReferences;
	this.clearScenarioView=clearScenarioView;
	this.hideComments=hideComments;
	this.showComments=showComments;
	
	this.showQuizFinalResults=showQuizFinalResults;
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	

	function showQuizFinalResults(){
		
	}
	
	
	// Hide scenario comments section
	function hideComments(){
	
		m_scenario_comments=false;
		
		document.getElementById("vScenario").style.width="96%";
		document.getElementById("vMessages").style.width="2%";
		
		var elCommentsBody=document.getElementById("vMessagesBody");
		var elCommentsHeader=document.getElementById("vMessagesHeader");
		
		//elCommentsBody.style.overflowY ="hidden";
		
		var commentsBodyHml="";
		var commentsHeaderHtml=htmlBuilder.getCommentsHiddenHeader();
		
		elCommentsBody.innerHTML=commentsBodyHml;
		elCommentsHeader.innerHTML=commentsHeaderHtml;

		// If there is a valid ScanarioPlay
		if (m_scenarioPlay){
			//Update nodes disposition and scenario canvas size
			updateScenarioView(null);		
		}		
	}
	
	// Show scenario comments section
	function showComments(){
		
		m_scenario_comments=true;
		
		document.getElementById("vScenario").style.width="72%";
		document.getElementById("vMessages").style.width="26%";
		
		var elCommentsBody=document.getElementById("vMessagesBody");
		var elCommentsHeader=document.getElementById("vMessagesHeader");
				
		var commentsBodyHml='<canvas id="vScenarioComments" style="background-color: white; border: 1px; border-color: black; display: block;">Your browser does not support HTML5 Canvas.</canvas>';
		
		var commentsHeaderHtml=htmlBuilder.getCommentsVisibleHeader();
		
		elCommentsBody.innerHTML=commentsBodyHml;
		elCommentsHeader.innerHTML=commentsHeaderHtml;
		
		// Update references to Comment Section and Canvas
		theCommentsContainer=document.getElementById("vMessagesBody");
	    theCommentsCanvas = document.getElementById("vScenarioComments");
	    theCommentsContext= theCommentsCanvas.getContext("2d");
	    m_comment_canvas=new Canvas(theCommentsContext);
		

		// If there is a valid ScanarioPlay
		if (m_scenarioPlay){
			//Update nodes disposition and scenario canvas size
			updateScenarioView(null);
			
			// The the scroll position that it has before
			theContainer.scrollTop = m_scenarioPlay.getScrollPos();
			theCommentsContainer.scrollTop = m_scenarioPlay.getScrollPos();			
		}
	}
	

	// Show Scenario Img Dialog with the current Scenario Image
	function showScenarioImage(){
		
		m_scenario_img_dialog_open=true;
		
		// Get the image from the context
		var img = m_scenarioContext.getScenarioImg(m_scenarioPlay.getCurrentScenarioImg());
		
		var scenimg_html= htmlBuilder.getScenarioImgHtml(img, m_scenario_data_dialog.width(), m_scenario_data_dialog.height());
		
	    m_scenario_data_dialog = $("#scenarioData").dialog({
			autoOpen: false,
			modal: false,
			resizable: true,
			title: "Scenario Image",
			buttons: {},
			close: function( event, ui ) {
				m_scenario_img_dialog_open=false;
			}
		});
		
	    m_scenario_data_dialog.html(scenimg_html);
		
	    m_scenario_data_dialog.dialog("open");		
	}
	
	// Show the list of scenario messages already exchanged in the scenario simulation
	function showScenarioMessages(){

		m_scenario_msg_dialog_open=true;
				
		var scenmsg_html= htmlBuilder.getScenarioMsgHtml(m_scenarioPlay.getCurrentListofMessages());
		
	    m_scenario_data_dialog = $("#scenarioData").dialog({
			autoOpen: false,
			modal: true,
			resizable: true,		
			title: "Scenario Messages",
			buttons: {},
			close: function( event, ui ) {
				m_scenario_msg_dialog_open=false;
			}
		});
		
	    m_scenario_data_dialog.html(scenmsg_html);
		
	    m_scenario_data_dialog.dialog("open");
	    
	    // Check if scroll is necessary
	    var el=document.getElementById("ScenarioDataDialog");
	    
	    if (el.clientHeight < el.scrollHeight){
	    	el.scrollTop= el.scrollHeight-el.clientHeight;
	    }
	}
	
	// Show the list of reference of the scenario file
	function showScenarioReferences(){
		
		var scenmsg_html= htmlBuilder.getScenarioReferencesHtml(m_scenarioContext.getScenarioReferences());
		
	    m_scenario_data_dialog = $("#scenarioData").dialog({
			autoOpen: false,
			modal: true,
			resizable: true,		
			title: "Scenario References",
			buttons: {},
			close: function( event, ui ) {
				m_scenario_msg_dialog_open=false;
			}
		});
		
	    m_scenario_data_dialog.html(scenmsg_html);
		
	    m_scenario_data_dialog.dialog("open");
	    
	    // Check if scroll is necessary
	    var el=document.getElementById("ScenarioDataDialog");
	    
	    if (el.clientHeight < el.scrollHeight){
	    	el.scrollTop= el.scrollHeight-el.clientHeight;
	    }		
		
	}
	
	function showScenarioDataMenu(){
		
		m_scenario_img_dialog_open=false;
		m_scenario_msg_dialog_open=false;

		var scendata_html= htmlBuilder.getScenarioDataMenu();
		
	    var width = window.innerWidth * 0.8;
	    var height = window.innerHeight * 0.8;
	    
	    if (width > 400){
	    	width = 400;
	    }
	    
	    if (height > 400){
	    	height = 400;
	    }
	    
	    m_scenario_data_dialog = $("#scenarioData").dialog({
			autoOpen: false,
			modal: false,
			position: {  my: "center", at: "center", of: window },
			resizable: true,	
			width: width,
			height: height,			
			title: "Scenario Data",
			buttons: {}
		});
		
	    m_scenario_data_dialog.html(scendata_html);
		
	    m_scenario_data_dialog.dialog("open");		
	}
	
	// If the configuration establish that the MCQ is show automatically this functions does it
	function showScenarioQuizzAutomatic(){
		if(configModule.getAutomaticOpenMCQ()){
			showScenarioQuizz();	
		}
	}
	
	function showScenarioPathSelector(){
		
		var mcq = m_scenarioPlay.getMCQ();
		
		var mcq_title= mcq.title;
		
		var mcq_html= htmlBuilder.getPathSelectorHTML(mcq);
		
	    var width = window.innerWidth * 0.8;
	    var height = window.innerHeight * 0.8;
	    
	    if (width > 600){
	    	width = 600;
	    }
	    
	    if (height > 400){
	    	height = 400;
	    }
	    
	    m_current_dialog = $("#scenariodialog").dialog({
			autoOpen: false,
			modal: true,
			position: {  my: "center", at: "center", of: "#vScenario"  },
			resizable: true,	
			width: width,
			height: height,			
			title: mcq_title,
			buttons: {
				"Submit": function() {
					// If the user choose an option
					$("#scenariodialog").dialog("close");	
					scenarioController.processPathSelector();
				}
			},
			close: function( event, ui ) {
				// If the user close the dialog
				scenarioController.finishQuizz();
			}
		});
		
	    m_current_dialog.html(mcq_html);
		
	    m_current_dialog.dialog("open");		
	}
	
	// Show the MCQ dialog
	function showScenarioQuizz(){
		//console.log("ScenarioView.showScenarioQuizz");
		
		var mcq = m_scenarioPlay.getMCQ();
		
		var mcq_title= mcq.title;
		
		var mcq_html= htmlBuilder.getMCQHTML(mcq);
		
	    var width = window.innerWidth * 0.8;
	    var height = window.innerHeight * 0.8;
	    
	    if (width > 600){
	    	width = 600;
	    }
	    
	    if (height > 400){
	    	height = 400;
	    }
	    
	    m_current_dialog = $("#scenariodialog").dialog({
			autoOpen: false,
			modal: true,
			position: {  my: "center", at: "center", of: "#vScenario"  },
			resizable: true,	
			width: width,
			height: height,			
			title: mcq_title,
			buttons: {
				"Submit": function() {
					// If the user answer the MCQ
					$("#scenariodialog").dialog("close");	
					scenarioController.processQuizzAnswer();
				}
			},
			close: function( event, ui ) {
				// If the user close the dialog
				scenarioController.finishQuizz();
			}
		});
		
	    m_current_dialog.html(mcq_html);
		
	    m_current_dialog.dialog("open");
	}
	
	// Show the results for the user answer to the quiz
	function showQuizCorrections(html){
		//console.log("showQuizCorrections");
		
		m_current_dialog.html(html);

		// Select the buttons to be shown in the quiz dialog
		// If it is in Test Mode
		if (configModule.getTestModeMCQ()){
			// If the option ShowMCQAnswers is on
			if (configModule.getShowMCQAnswers()){
				m_current_dialog.dialog('option', 'buttons', {
					"Show Answers": function() {
						showQuizzAnswers(); 
					}
				});	
			}else{
				m_current_dialog.dialog('option', 'buttons', {});					
			}
		// If it is not in Test Mode
		}else{
			if (configModule.getShowMCQAnswers()){
				m_current_dialog.dialog('option', 'buttons', {
					"Show Answers": function() {
						showQuizzAnswers(); 
					}, 
					"Back": function(){
						// If the user choose to go back set the Quiz sate to not ready so he can answer again
						m_scenarioPlay.setQuizReady(false);
					
						$("#scenariodialog").dialog("close");
					
						showScenarioQuizz();
				      }
			    });					
			}else{
				m_current_dialog.dialog('option', 'buttons', {
					"Back": function(){
						// If the user choose to go back set the Quiz sate to not ready so he can answer again
						m_scenarioPlay.setQuizReady(false);
					
						$("#scenariodialog").dialog("close");
					
						showScenarioQuizz();
				      }
			    });					
			}
		}
		
		m_current_dialog.dialog("open");
	}	

	function showQuizzAnswers(){
		var mcq = m_scenarioPlay.getMCQ();
		
		m_current_dialog.html(htmlBuilder.getMCQAnswers(mcq));
		
		m_current_dialog.dialog('option', 'buttons', {});
		
		m_current_dialog.dialog("open");
	}
	
	function clearScenarioView(){
		m_scenarioContext=null;
		m_scenarioPlay=null;
		
	}
	
	// Get the current ScenarioPlay and initiate the layout for the current Scenario
	function initiateScenarioDisplay(context){
		if (console && debug){
			console.log("ScenarioView.initiateScenarioDisplay(context)");
		}
		
		m_scenario_img_dialog_open=false;
		m_scenario_msg_dialog_open=false;
		
		m_scenarioContext=context;
		
		m_current_quiz_points="";
		
		m_scenarioPlay = m_scenarioContext.getCurrentScenarioPlay();
	
		setupSize();
		
		displayScenarioTitle();
		
		displayNodeImages();
		
		enableScenarioCommands();		
	}
	
	// Display a dialog with an information message
	function displayMsg(html_msg){
		//console.log("ScenarioView.displayMsg");   
	    
		$("#scenariodialog").dialog({
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
		
		$("#scenariodialog").html(htmlBuilder.wrapHtmlMsg(html_msg));
		
		$("#scenariodialog").dialog("open");		
	}
	
	// Display a dialog with an error message associated to the scenario
	function displayError(html_msg){
		//console.log("ScenarioView.displayError");   
	    
		$("#scenariodialog").dialog({
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
		
		$("#scenariodialog").html(htmlBuilder.wrapHtmlErrorMsg(html_msg));
		
		$("#scenariodialog").dialog("open");
	}
	
	// Setup a valid Scenario Command buttons state 
	function enableScenarioCommands(){
		//console.log("ApplicationView.enableScenarioCommands()");
		
		// Enable buttons
		var button=document.getElementById("bt_play");
		button.disabled=false;
		
		button=document.getElementById("bt_clear");
		button.disabled=false;
		
		button=document.getElementById("bt_mode");
		button.disabled=false;
		
		button=document.getElementById("bt_data");
		button.disabled=false;
	}
	
	function disableScenarioCommands(){
		//console.log("ApplicationView.disableScenarioCommands");
		
		// Enable buttons
		var button=document.getElementById("bt_play");
		button.disabled=true;
		
		button=document.getElementById("bt_clear");
		button.disabled=true;
		
		button=document.getElementById("bt_mode");
		button.disabled=true;
		
		button=document.getElementById("bt_data");
		button.disabled=true;
		
		button=document.getElementById("bt_quiz");
		button.className="inactive";
		button.disabled=true;
	}
	
	
	// ******************************************************************************
	// Events
	// ******************************************************************************
	// Events handled by the ApplicationController 
	
	// Trigger when the screen is resized
	$(window).on( "resize", updateScenarioView);
	
	// Triggered when there is a change in the ScenarioPlay
	$(window).on( "ScenarioPlayChanged", drawScenarioScreen);
	
	// Triggered when there is a change in the ScenarioPlay
	$(window).on( "ScenarioQuizPartialResults", showQuizPartialResults);
	
	// Triggered when there is a Quizz to be shown
	$(window).on( "ScenarioPlayTestQuizz", showScenarioQuizzAutomatic);	
	
	// Triggered when there is a Quizz to be shown
	$(window).on( "ScenarioPlayPracticeQuizz", showScenarioQuizzAutomatic);	
	
	// Triggered when there is a pathSelector to be shown
	$(window).on( "ScenarioPlayPathSelector", showScenarioPathSelector);	
	
	// Triggered when the scenario image changes
	$(window).on( "ScenarioImgChanged", changeScenarioImg);
	
	// Triggered when the scenario message list changes
	$(window).on( "ScenarioMessageListChanged", changeScenarioMessageList);
	
	// Triggered when the scenario play is stopped
	$(window).on( "ScenarioStopClear", scenarioClear);
	
	
	$(window).on( "CleanScenarioPlayScreen", cleanScenarioPlayScreen);
	
	
	
	// ******************************************************************************
	// Call back function for events
	// ******************************************************************************	
	
	function cleanScenarioPlayScreen(e){
		
		m_current_quiz_points="";
		
		displayScenarioTitle();
		
		drawScenarioScreen();
	}
	
	function showQuizPartialResults(e){

		var partialResult=e.scorePoints + "/" + e.totalPoints;
		
		m_current_quiz_points = "Score: " + partialResult;
		
		displayScenarioTitle();
	}
	
	function scenarioClear(e){
		if (m_scenario_data_dialog){
			m_scenario_data_dialog.dialog("close");	
		}
	}
	
	function changeScenarioImg(e){
		if (console && debug){
			console.log("changeScenarioImg");
		}
		
		if (m_scenario_img_dialog_open){
			showScenarioImage();
		}
	}
	
	function changeScenarioMessageList(){
		if (m_scenario_msg_dialog_open){
			showScenarioMessages();
		}		
	}
	
	function updateScenarioView(e){
		
		if (m_scenarioPlay){
			
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
	
		height = m_scenarioPlay.getCurrentMaxTime() * m_transfHeight + 20;
		
		// The next lines force the canvas component to get clean
	    theCanvas.style.height = height + 'px';	    
	    theCanvas.style.width = width + 'px';
	    theCanvas.height = height;
	    theCanvas.width = width;
	    
	    // Clean also the comment section if it is present
	    if (m_scenario_comments){
			var c_width= theCommentsCanvas.width;
			//var c_height = theCommentsCanvas.height;
			
	    	theCommentsCanvas.style.height = height + 'px';	    
	    	theCommentsCanvas.style.width = c_width + 'px';
	    	theCommentsCanvas.height = height;
	    	theCommentsCanvas.width = c_width;	    	
	    }
	        
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
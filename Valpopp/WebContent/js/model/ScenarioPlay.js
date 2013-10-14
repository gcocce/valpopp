
console.log("ScenarioPlay Script");


/* Responsabilities:
 * 
 * Contain Scenario Display Data (Associated to user activity) 
 * 
 * This class wraps the data used to display the scenario
 * 
 * It uses the scenario context 
 * 
 */

function ScenarioPlay(context){
	
	// ******************************************************************************
	// Constants
	// ******************************************************************************
	var SCENARIO_STOPPED=0;
	var SCENARIO_PLAYING=1;
	var SCENARIO_PAUSED=2;
	var SCENARIO_QUIZZING=3;
	var SCENARIO_FINISHED=4;
	
	var LOOP_UPDATE_TIME=200;

	// To be used outside the class
	this.SCENARIO_STOPPED=SCENARIO_STOPPED;
	this.SCENARIO_PLAYING=SCENARIO_PLAYING;
	this.SCENARIO_PAUSED=SCENARIO_PAUSED;
	this.SCENARIO_QUIZZING=SCENARIO_QUIZZING;	
	this.SCENARIO_FINISHED=SCENARIO_FINISHED;
	
	// ******************************************************************************
	// Properties
	// ******************************************************************************	
	
	var m_error="";
	var m_state=SCENARIO_STOPPED;
	var m_continious_mode=true;
	
	var m_context=context;
	
	var m_scenType= new ScenType();
	
	// Messages
	//var m_messages=new Array();
	
	// Reference to Timer
	var m_loop=null;
	var m_userscroll=false;
	var m_finished=false;
	var m_started=false;
	
    var theContainer = document.getElementById("vDraw");
    var theCanvas = document.getElementById("vScenarioCanvas");   
    var theCanvasContext=theCanvas.getContext("2d");
    
    /* Object to register ScenarioPlay
     *  
     */
    // Scenario Data
    //TODO: chose better names for the variables 
    var m_scenario_messageList=new Array();
    var m_scenario_referenceList=new Array();
    	
    // Data structure for ScenarioPlay Managment
    var m_currentSequence=0;
    var m_currentMessage=0;
    
    var m_current_messageList=null;
    var m_currentSyncPoint=null;
    
    // The message sequences currently displayed
    var m_sequenceList=new Array();
    
    // The actual height for the canvas
    var m_scenCurrentHeight=0;
    
    var m_synckPointsPos = new Array();
    
    // Drawable objects already finished
    var m_readyObjects = new Array();
    
    // Drawable objects in process growing or increasing
    var m_processingObjects = new Array();
    
    // Temp
    var m_new_processingList=new Array();
    
    
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
    // Clean objects and variables used to play 
	function cleanScenarioPlay(){
		console.log("ScenarioPlay.cleanScenarioPlay");
		
		//TODO: Clean Objects used to store scenario play data
		m_finished=false;
		m_userscroll=false;
		m_started=false;
		
		m_currentSyncPoint=null;
			
		m_scenCurrentHeight=0;
		m_currentSequence=0;
		m_messagesList= new Array();
		m_sequenceList= new Array();
		m_synckPointsPos = new Array();
		m_readyObjects = new Array();
		m_processingObjects = new Array();
		m_new_processingList= new Array();
		
		// Update scroll position
		theContainer.scrollTop = 0;		
	}
	
	function cleanScenarioPlayScreen(){
		console.log("ScenarioPlay.cleanScenarioPlayScreen");
		
		//TODO: replace for a proper call
		notifyChange();
	}
	
	function processFirstMessage(scenMessage){
		console.log("Process First Message srcN:"+scenMessage.srcN + " destN:"+scenMessage.destN );
		var pi=new Position(scenMessage.srcN, 10);
		
		var nodeDif=Math.abs(scenMessage.destN - scenMessage.srcN) - 1;
		
		//TODO: calculate time to target and replace constant
		m_scenCurrentHeight = 60 + nodeDif * 20;
		var pf=new Position(scenMessage.destN, m_scenCurrentHeight);
		
		var msg=new ScenMessage(pi, pf, 0, scenMessage.name + "(" + scenMessage.param + ")");
		
		var obj= new ScenObject(m_scenType.MESSAGE, msg);
		
		m_processingObjects.push(obj);
	}	
	
	function processMessage(scenMessage, index, startPos){
		console.log("ProcessMessage message index:" + index);	
		console.log("ProcessMessage srcN:"+scenMessage.srcN + " destN:"+scenMessage.destN );
		var pi=new Position(scenMessage.srcN, startPos);
		
		var nodeDif=Math.abs(scenMessage.destN - scenMessage.srcN) - 1;
		
		//TODO: calculate time to target and replace constant	
		m_scenCurrentHeight = startPos + 50 + nodeDif * 20;
		var pf=new Position(scenMessage.destN, m_scenCurrentHeight);
			
		var msg=new ScenMessage(pi, pf, index, scenMessage.name + "(" + scenMessage.param + ")");
		
		var obj= new ScenObject(m_scenType.MESSAGE, msg);
		
		m_new_processingList.push(obj);
	}
	
	function calculateScenarioPlay(){
//		console.log("ScenarioPlay.calculateScenarioPlay finished:" + m_finished);
		
 		if (!m_finished){
			//TODO: Calculate the new state of ScenarioPlay objects
			
 			var sequence=null;
 			
 			// The first step of a scenario execution
 			if (!m_started){
 				console.log("ScenarioPlay Start with first Message");
 				
 				m_started=true;
 				
 				sequence=m_context.getSequence(m_currentSequence);
 				
 				m_current_messageList=sequence.messages;
 				
 				// Add the first message to the ProcessingList
 				// The first message can not start at a given Synch Point
 				processFirstMessage(m_current_messageList[m_currentMessage], 0);
 			}else{
 				sequence=m_context.getSequence(m_currentSequence);
 			}
 			

			if ( m_processingObjects.length==0){
				console.log("ScenarioPlay no more obj in processing list");
				m_finished=true;
				
				m_state=SCENARIO_STOPPED;
				
				window.clearTimeout(m_loop);
				
				var event = $.Event( "ScenarioPlayFinished" );
				$(window).trigger( event );					
			}else{
	 			//TODO: procesar la lista de objectos en proceso
				
	 			// Create a new Processing List
	 			m_new_processingList=new Array();
	 			
	 			for (var x=0; x < m_processingObjects.length; x++){
	 				
	 				// Si es de tipo MESSAGE extender
	 				
	 				var obj=m_processingObjects[x];
	 				
	 				switch (obj.getType()){
	 				case m_scenType.MESSAGE:
	 					var msg=obj.getObject();
	 					
	 					var iNode=msg.getInitPos().getNode();
	 					var fNode=msg.getEndPos().getNode();
	 						 					
	 					
	 					var percent=msg.getDrawPercent();
	 					
	 					percent = percent + (0.1 / Math.abs(fNode - iNode));
	 					if(Math.abs((percent-1))<0.0001){
	 						percent=1;
	 					}
	 					
//	 					console.log("percent: "+percent);
	 					
	 					msg.setDrawPercent(percent);
	 					
	 					obj.setObject(msg);
	 					
	 					if(percent==1){
	 						var index=msg.getIndex();
	 						
	 						console.log("calculateScenarioPlay message completed index:" + index);
	 						
	 						var index = msg.getIndex();
	 						var lastPos = msg.getEndPos().getY();
	 						var nextIndex = index+1;
	 						
 							if(msg.hasSyncPoint()){
 								m_currentSyncPoint=new SyncPoint(msg.getSyncPoint(),lastPos);
 							}else{
 								m_currentSyncPoint=null;
 							}
 							
	 						if (nextIndex < m_current_messageList.length){
	 							if(msg.hasSyncPoint()){
	 								
	 								// Add Messages With Same SyncPoint to the Processing List
	 								//processSyncPoint(msg.getSyncPoint(), nextIndex);
	 							}
	 							
	 							
	 							var nextMsg = m_current_messageList[nextIndex];
	 							processMessage(nextMsg, nextIndex, lastPos);
	 						}
	 		 				// Si se completa el mensaje y no tiene syncPoint agregar el siguiente
	 		 				// Si se completa el mensaje y tiene syncPoint agregar todos los que sincronizan
	 		 				// En ambos casos agregar el mensaje completado a la lista de completados 
	 						
	 						// The objects go to the Ready List
	 						m_readyObjects.push(obj);
	 					}else{
	 						// The object continues int the Processing List
	 						m_new_processingList.push(obj);
	 					}
	 					
	 					break;
	 					default:
	 						console.log("calculateScenarioPlay: object type unknown");
	 						break;
	 				}
	 			}
	 			
				// Replace the Processing Object List with the new one
	 			m_processingObjects=m_new_processingList;				
			}

			notifyChange();
		}
	}
	
	function start(){
		console.log("ScenarioPlay.start");
		
		cleanScenarioPlay();
		
		cleanScenarioPlayScreen();
		
		calculateScenarioPlay();
		
		m_loop=window.setTimeout(appLoop, LOOP_UPDATE_TIME);		
	}
	
	function notifyChange(){
//		console.log("ScenarioPlay.notifyChange");
		
		// Dispatch ScenarioNodeImgsProccessed Event
		var event = $.Event( "ScenarioPlayChanged" );
		$(window).trigger( event );	
	}
	
	
	function appLoop() {
		m_loop=window.setTimeout(appLoop, LOOP_UPDATE_TIME);
		
		calculateScenarioPlay();
	}
	 
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************
	
	this.getError=getError;
	this.getState=getState;
	this.stop=stop;
	this.play=play;
	this.pause=pause;
	this.continuePlay=continuePlay;
	this.changeMode=changeMode;
	
	this.setUserScroll=setUserScroll;
	this.getUserScroll=getUserScroll;
	
	this.getCurrentHeight=getCurrentHeight;
	this.getReadyObjects=getReadyObjects;
	this.getProcessingObjects=getProcessingObjects;
		
	this.getMessages=getMessages;
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	function getReadyObjects(){
		return m_readyObjects;
	}
	
	function getProcessingObjects(){
		return m_processingObjects;	
	}
	
	function getCurrentHeight(){
		return m_scenCurrentHeight;
	}
	
	function getUserScroll(){
		return m_userscroll;
	}
	
	function setUserScroll(value){
		m_userscroll=value;
	}
	
	function getMessages(){
		return m_messages;
	}
	
	function getError(){
		return m_error;
	}
	
	function getState(){
		return m_state;
	}
	
	function play(){
		console.log("ScenarioPlay.play m_state:", m_state);
		
		if (m_state==SCENARIO_STOPPED){
			m_state=SCENARIO_PLAYING;
			
			cleanScenarioPlayScreen();
			
			start();
		}	
	}
	
	function pause(){
		console.log("ScenarioPlay.pause m_state:", m_state);
		
		m_state=SCENARIO_PAUSED;
		 
		window.clearTimeout(m_loop);
	}
	
	function continuePlay(){
		console.log("ScenarioPlay.continuePlay m_state:", m_state);
		
		m_userscroll=false;
		m_state=SCENARIO_PLAYING;
		  
		m_loop=window.setTimeout(appLoop, LOOP_UPDATE_TIME);		
	}
	
	function stop(){
		console.log("ScenarioPlay.stop m_state:", m_state);
		
		window.clearTimeout(m_loop);
		
		m_state=SCENARIO_STOPPED;		
		   
		cleanScenarioPlay();
		
		cleanScenarioPlayScreen();
	}
	
	function changeMode(continious){
		console.log("ScenarioPlay.changeMode");
		m_continious_mode=continious;
	}
	
	// ******************************************************************************
	// Events Listeners
	// ******************************************************************************
	
	// ******************************************************************************
	// Call back functions
	// ******************************************************************************	
	

}

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
	
	var LOOP_UPDATE_TIME=100;

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
	var m_messages=new Array();
	
	// Reference to Timer
	var m_loop=null;
	var m_userscroll=false;
	var m_finished=false;
	
    var theContainer = document.getElementById("vDraw");
    var theCanvas = document.getElementById("vScenarioCanvas");   
    var theCanvasContext=theCanvas.getContext("2d");
    
    /* Object to register ScenarioPlay
     *  
     */
 
    
    // Scenario Data
    var m_scenario_messageList=new Array();
    var m_scenario_referenceList=new Array();
    	
    // Data structure for ScenarioPlay Managment
    var m_currentSequence=0;
    var m_currentMessage=0;
    
    var m_current_messageList=null;   
    
    // The message sequences currently displayed
    var m_sequenceList=new Array();
    
    // The actual height for the canvas
    var m_scenCurrentHeight=0;
    
    var m_synckPointsPos = new Array();
    
    // Drawable objects already finished
    var m_readyObjects = new Array();
    
    // Drawable objects in process growing or increasing
    var m_processingObjects = new Array();
    
    
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
    // Clean objects and variables used to play 
	function cleanScenarioPlay(){
		console.log("ScenarioPlay.cleanScenarioPlay");
		
		//TODO: Clean Objects used to store scenario play data
		m_finished=false;
		m_userscroll=false;
		
		// TODO: take this away
		m_messages = new Array();
		
		m_scenCurrentHeight=0;
		m_messagesList= new Array();
		m_sequenceList= new Array();
		m_synckPointsPos = new Array();
		m_readyObjects = new Array();
		m_processingObjects = new Array();
		
		// Update scroll position
		theContainer.scrollTop = 0;		
	}
	
	function cleanScenarioPlayScreen(){
		console.log("ScenarioPlay.cleanScenarioPlayScreen");
		
		//TODO: replace for a proper call
		notifyChange();
	}
	
	
	function processMessage(scenMessage, index){
		var pi=new Position(scenMessage.srcN, 0);
		var pf=new Position(scenMessage.destN,dist);
		
		var msg=new ScenMessage(pi, pf, index, scenMessage.name + "(" + scenMessage.param + ")");
		
		var obj= new ScenObject(m_scenType.MESSAGE, msg);
		
		m_processingObjects.push(obj);
	}
	
	function calculateScenarioPlay(){
//		console.log("ScenarioPlay.calculateScenarioPlay finished:" + m_finished);
		
 		if (!m_finished){
//			console.log("ScenarioPlay messages.lenght:" + m_messages.length );
			
			//TODO: Calculate the new state of ScenarioPlay objects
			
 			//TODO: HERE IS THE WORK BRO
 			
 			var sequence=null;
 			
 			if (m_state==SCENARIO_STOPPED){
 				
 				sequence=m_context.getSequence(0);
 				
 				m_currentMessage=0;
 				
 				m_current_messageList=sequence.messages;
 				
 				//TODO: Agregar el primer mensaje a la lista de objetos en proceso
 				processMessage(m_current_messageList[m_currentMessage], m_currentMessage);
				
 			}else{
 				sequence=m_context.getSequence(m_currentSequence);
 			}
 			
 			
 			//TODO: procesar la lista de objectos en proceso
 			
 			
 			// Hacer copia de la lista de objetos en proceso crear una nueva e ir agregando los que permanecen en esa lista
 			
 			for (var x=0; x < m_processingObjects.length; x++){
 				
 				// si es de tipo MESSAGE extender
 				
 				// Si se completa el mensaje y no tiene syncPoint agregar el siguiente
 				// Si se completa el mensaje y tiene syncPoint agregar todos los que sincronizan
 				// En ambos casos agregar el mensaje completado a la lista de completados
 				
 				// Si el objeto continua agregar a la nueva lista de objetos en proceso
 				// Si el objeto está completo agregar a la lista de objetos completos
 			}
 			
			// Reemplazar la lista de objectos en proceso
 			
 			
 			
//			if (m_messages.length==0){
//				m_messages[0]=0.1;
//			}else{
//				var value=m_messages[m_messages.length-1];
//				
//				if (value<1){
//					value = value + 0.1;
//					m_messages[m_messages.length-1]=value;
//				}else{
//					if (m_messages.length < 20){
//						m_messages[m_messages.length]=0.1;
//					}else{
//						m_finished=true;
//						
//						m_state=SCENARIO_STOPPED;
//						
//						window.clearTimeout(m_loop);
//						
//						var event = $.Event( "ScenarioPlayFinished" );
//						$(window).trigger( event );							
//					}
//				}
//			}

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
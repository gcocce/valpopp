
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
	// ScenarioPlay States
	var SCENARIO_STOPPED=0;
	var SCENARIO_PLAYING=1;
	var SCENARIO_PAUSED=2;
	var SCENARIO_QUIZZING=3;
	var SCENARIO_FINISHED=4;
	
	// Every Cicle of the simulations take place every LOOP_UPDATE_TIME miliseconds
	var LOOP_UPDATE_TIME=200;
	
	// Every cicle the time advance SIMULATION_TIME
	var SIMULATION_TIME = 4;

	// ScenarioPlay starts at INITIAL_TIME
	var INITIAL_TIME=configModule.getInitialSimulationTime();

	// Public constants
	this.SCENARIO_STOPPED=SCENARIO_STOPPED;
	this.SCENARIO_PLAYING=SCENARIO_PLAYING;
	this.SCENARIO_PAUSED=SCENARIO_PAUSED;
	this.SCENARIO_QUIZZING=SCENARIO_QUIZZING;	
	this.SCENARIO_FINISHED=SCENARIO_FINISHED;
	
	// ******************************************************************************
	// Properties
	// ******************************************************************************	
	
	// References to the html elements
    var theContainer = document.getElementById("vDraw");
    var theCanvas = document.getElementById("vScenarioCanvas");   
    var theCanvasContext=theCanvas.getContext("2d");
    
	// To register a description of the last error if any.
	var m_error="";
	
	// To register the state of the ScenarioPlay Instance
	var m_state=SCENARIO_STOPPED;
	
	// The register the mode selected (Continious or Step by Step)
	var m_continious_mode=true;
	
	// To dintiguish the different types of objects used in the ScenarioPlay
	var m_scenType= new ScenType(); // (message, treatment, action, timer)
	
	// Register whether the user chose to scroll the page or not, to avoid automatic scroll
	var m_userscroll=false;
	
	// Register whether the simulation has finished or not 
	var m_finished=false;
	
	// Default time between messages
	var m_space_bet_msg = configModule.getSpaceBetweenMessages();
	
	// Reference to the Timer used to control the messages display evolution
	var m_loop=null;
	
	// Register the current simulation time
	var m_sim_time=0;
	
	// Last sequence message treatment, used to display the next messages with a displacement
	var m_last_msg_treatment=0;
	
	// Register whether the current sequence has started or not 
	var m_sequence_started=false;
     
	// A reference to the ScenarioContext
	var m_context=context;

    // Register the Id of the current sequence been processed
    var m_currentSequenceId=0;   
    
    // Regerence to the message list of the current sequence been processed
    var m_current_messageList=null;
    
    // Register the last SyncPoint Processed, useful between a sequence change
    var m_currentSyncPoint=null;
    
    // Register if the current quiz has already been processed
    var m_quizz_processed=false;
       
    // Register the maximum height needed for the canvas
    var m_scenCurrentMaxTime=0;
    
    // Register the last position reached by a message
    var m_scenCurrentLastTime=0;
      
    // Register the list of objects already finished
    var m_readyObjects = new Array();
    
    // Register the list of objects in process of drawing (like a message that is going from on node to another)
    var m_processingObjects = new Array();
    
    // Temp register of the processing objects. Used each time the Processing Objects List is updated.
    var m_new_processingList=new Array();
    
    // List of messages already displayed in the current Scenario Play
    var m_message_list=new Array();
    
    // Name of the scenario image currently displayed
    var m_scenario_img=null;
    
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
    // Clean objects and variables used to play 
	function cleanScenarioPlay(){
		console.log("ScenarioPlay.cleanScenarioPlay");
		
		m_finished=false;
		m_userscroll=false;
		m_sequence_started=false;
		m_currentSyncPoint=null;
		m_quizz_processed=false;
			
		m_sim_time=INITIAL_TIME;
		m_last_msg_treatment=0;
		m_scenCurrentMaxTime=0;
		m_scenCurrentLastTime=INITIAL_TIME;
		m_currentSequenceId=0;
		m_messagesList= new Array();
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
	
	/* Process the Scenario File Message
	 * Parameters:
	 * scenMessage: Scenario File Message
	 * index: the index in the Scenario File messages array
	 * lastmsgTime: the last time of the previous message
	 * treatment: the treatment time of the previous message
	 */
	function processMessage(scenMessage, index, lastmsgTime, treatment){
		console.log("ProcessMessage Message index:" + index);	

		// Create an Action if it exists
		var action_displacement=0;
		var initTime= m_space_bet_msg + treatment + lastmsgTime;
			
		// If the message has an action to be displayed
		if (scenMessage.action){
//			action_displacement=50;
//			
//			// Advance the time introduce some incoherences, we can not do this
//			//m_sim_time = m_sim_time + action_displacement;
//			
//			var text = scenMessage.action.text;
//					
//			var scenAction= new ScenAction(scenMessage.srcN, initTime, initTime + action_displacement, text);
//			var scenobj= new ScenObject(m_scenType.ACTION, scenAction);
//			m_readyObjects.push(scenobj);
		}
		
		// Calculate Total Transmission Time for the message
		// Total transmission time= propagation time + (Message length / rate)
		var trans_time= m_context.getPropagTime(scenMessage.srcN, scenMessage.destN) + Math.round(scenMessage.length / m_context.getThroughput(scenMessage.srcN, scenMessage.destN));
		
		var lastTime = action_displacement + treatment + m_space_bet_msg + lastmsgTime +  + trans_time;
		
		var msgPosY = action_displacement + lastmsgTime + treatment + Math.round(trans_time / 4);
       
		var pi=new Position(scenMessage.srcN, action_displacement + m_space_bet_msg + treatment + lastmsgTime );		

		var pf=new Position(scenMessage.destN, lastTime);
			
		if (lastTime>m_scenCurrentMaxTime){
			m_scenCurrentMaxTime = lastTime;
		}
		
		var msgName="";
		if(scenMessage.param.localeCompare("")==0){
			msgName= scenMessage.name;
		}else{
			msgName= scenMessage.name + " (" + scenMessage.param + ")";
		}		
		var msg=new ScenMessage(pi, pf, index, msgName);
		
		msg.setReady(false);
		msg.setMsgPosY(msgPosY);
		msg.setSyncPoint(scenMessage.synchPoint);
		msg.setStartPoint(scenMessage.startTime);
		msg.setType(scenMessage.type);
		msg.setLength(scenMessage.length);
		msg.setTreatment(scenMessage.treatment);
		msg.setDash(scenMessage.dash);
		msg.setTransTime(trans_time);
		
		console.log("Message Total Transmision Time: " + msg.getTransTime());
		
		if (scenMessage.scenImg){
			msg.setScenImg(scenMessage.scenImg);
			//TODO: change scenario image
		}
		
		var obj= new ScenObject(m_scenType.MESSAGE, msg);
		
		if (scenMessage.treatment > 0){
			
			if (lastTime + scenMessage.treatment > m_scenCurrentMaxTime){
				m_scenCurrentMaxTime = lastTime + scenMessage.treatment;
			}
			
			// m_scenCurrentMaxTime = lastTime + scenMessage.treatment;
			
			//Add treatment object to the scenario Processing List
			var treatobj=new ScenTreatment(lastTime, lastTime + scenMessage.treatment, scenMessage.destN); 
			
			var scenobj= new ScenObject(m_scenType.TREATMENT, treatobj);
			
			if (index==0){
				m_processingObjects.push(scenobj);
			}else{
				m_new_processingList.push(scenobj);
			}
		}
		
		// The first message goes into the Processing List
		if (index==0){
			m_processingObjects.push(obj);
		}else{
			m_new_processingList.push(obj);
		}
	}
	
	function processSyncPoint(syncpoint, index, lastmsgTime, treatment){
		console.log("processSyncPoint "+ syncpoint);
		
		var count=0;
		for (var x=index; x < m_current_messageList.length; x++){
			var scenMessage=m_current_messageList[x];
			
			if(scenMessage.startTime.localeCompare(syncpoint)==0){
				count++;
				processMessage(scenMessage, x, lastmsgTime, treatment);
			}
		}
		
		console.log("number of syncronizing messages "+ count);
	}
	
	/* Calculate the time of ocurrence and create the Scenario Objects
	 * 
	 */
	function calculateScenarioPlay(){
//		console.log("ScenarioPlay.calculateScenarioPlay finished:" + m_finished);
	
		// If all the sequences have not been processed
 		if (!m_finished){
 			var m_current_sequence=null;
 			
 			// If the current sequence has not started to be processed
 			if (!m_sequence_started){
 				console.log("ScenarioPlay Start CurrentSequence:" + m_currentSequenceId);
 				
 				m_sequence_started=true;
 				m_quizz_processed=false;
 				
 				m_current_sequence=m_context.getSequence(m_currentSequenceId);
 				
 				// Establish a reference to the messages of the sequence
 				m_current_messageList=m_current_sequence.messages;
 				
 				// If the previous sequence established a synchronization point process the synchronization point
 				if (m_currentSyncPoint!=null){
 					processSyncPoint(m_currentSyncPoint.getSyncPoint(), 0, m_scenCurrentLastTime, m_last_msg_treatment);
 				}else{
 	 				// Add the first message to the ProcessingList
 	 				processMessage(m_current_messageList[0], 0, m_scenCurrentLastTime, m_last_msg_treatment); 					
 				}
 			}else{
 				m_current_sequence=m_context.getSequence(m_currentSequenceId);
 			}

 			// If there is any object in the Processing List
			if ( m_processingObjects.length!=0){
				
				// Update the current simulation time
				m_sim_time = m_sim_time + SIMULATION_TIME;
				
	 			// Create a new Processing List
	 			m_new_processingList=new Array();
	 			
	 			// For every object in the Processing List
	 			for (var x=0; x < m_processingObjects.length; x++){
	 				
	 				var obj=m_processingObjects[x];
	 				
	 				switch (obj.getType()){
	 				case m_scenType.MESSAGE: // If it is a MESSAGE type extend the arrow
	 					var msg=obj.getObject();
 					
	 					var iNode=msg.getInitPos().getNode();
	 					var fNode=msg.getEndPos().getNode();
	 					
	 					var startTime=msg.getInitPos().getTime();

	 					// If it is time to show the message
	 					if (m_sim_time >= startTime){
	 						
	 						msg.setDisplay(true);
	 						
		 					// Update the amount of time used to transmit the message if it is already displayed
		 					var transmited=msg.getTransmitedTime();
		 					transmited = transmited + SIMULATION_TIME;
		 					
		 					//console.log("Update message transmited time: "+ transmited);
		 					
		 					if( transmited >= msg.getTransTime()){
		 						transmited=msg.getTransTime();
		 					}
		 					 					
		 					msg.setTransmitedTime(transmited);
		 					
		 					obj.setObject(msg);
	 					
		 					// If message got to the destination node
		 					// Treatment should be managed here
		 					if(transmited>=msg.getTransTime()){
		 						msg.setReady(true);
		 						// Index of the messag in the ScenarioFile Array of Messages
		 						var index=msg.getIndex();
		 						//console.log("calculateScenarioPlay message completed index:" + index);
		 						
		 						var treatment=msg.getTreatment();
	
		 						var lastTime = msg.getEndPos().getTime();
		 						
		 						//Register the last vertical position of a message
		 						m_scenCurrentLastTime = lastTime;
		 						
		 						// Update last message treatment
		 						m_last_msg_treatment=treatment;
		 						
		 						var nextIndex = index + 1;
	 							
		 						// If there are following messages
		 						if (nextIndex < m_current_messageList.length){
		 							// If the current message has SyncPoint
		 							if(msg.hasSyncPoint()){
		 								// Add Messages With StartPoint equals to SyncPoint into the Processing List
		 								processSyncPoint(msg.getSyncPoint(), nextIndex, lastTime, treatment);
		 							}
		 							
		 							var nextMsg = m_current_messageList[nextIndex];
		 							
		 							// If the following messages has default StartPoint add to the Processing List
		 							if (nextMsg.startTime.localeCompare("")==0){
		 								processMessage(nextMsg, nextIndex, lastTime, treatment);	
		 							}
		 						}else{
		 							// If it is the last message and it has a SyncPoint register for the next Sequence
		 							if(msg.hasSyncPoint()){
		 								m_currentSyncPoint=new SyncPoint(msg.getSyncPoint(), lastTime + treatment);
		 							}else{
		 								m_currentSyncPoint=null;
		 							}	 							
		 						}
		 							 						
		 						// Add the current message to Ready List
		 						m_readyObjects.push(obj);
		 						
		 						if (!m_continious_mode){
		 							m_state=SCENARIO_PAUSED;
		 							
		 							window.clearTimeout(m_loop);
		 							
		 							var event = $.Event( "ScenarioPause" );
		 							$(window).trigger( event );		 							
		 						}
		 						
		 					}else{
		 						// If the message did not get to the destination node
		 						// it continues in the Processing List
		 						m_new_processingList.push(obj);
		 					}
	 					}else{
	 						m_new_processingList.push(obj);
	 					}
	 					
	 					break;
	 				case m_scenType.TREATMENT:
		 				// If it is a TREATMENT type extend the line
	 					var treatobj=obj.getObject();
	 					
	 					var startTime=treatobj.getInitTime();

	 					// Display is true if simulation time is higher than the startTime of the treatment object
	 					if (m_sim_time > startTime){
	 						
	 						treatobj.setDisplay(true);
		 					
		 					if( m_sim_time >= treatobj.getEndTime()){
		 						treatobj.setCurrentTime(treatobj.getEndTime());
		 					}else{
		 						treatobj.setCurrentTime(m_sim_time);
		 					}
		 					
		 					obj.setObject(treatobj);
		 					
		 					if( m_sim_time >= treatobj.getEndTime()){
		 						// Add the current object to Ready List
		 						m_readyObjects.push(obj);
		 					}else{
		 						m_new_processingList.push(obj);
		 					}		 					
	 					}else{
	 						m_new_processingList.push(obj);
	 					}
	 					break;
	 				case m_scenType.TIMER:
	 					
	 					
	 					break;
	 					default:
	 						console.log("calculateScenarioPlay: object type unknown");
	 						break;
	 				}
	 			}
	 			
				// Replace the Processing Object List with the new one
	 			m_processingObjects=m_new_processingList;
			}else{
			// If there are no more objects in the Processing List
				console.log("ScenarioPlay no more obj in processing list " + configModule.getMandatoryMCQ());
				
				
				// If the CurrentSequence does have an MCQ and it has not been processed 
				if (m_current_sequence.mcq && !m_quizz_processed){
					m_state=SCENARIO_QUIZZING;
					
					window.clearTimeout(m_loop);
					
					if(!configModule.getMandatoryMCQ()){
						m_quizz_processed=true;
					}					
					
					if (configModule.getMandatoryMCQ()){
						var event = $.Event( "ScenarioPlayMandatoryQuizz" );
						$(window).trigger( event );	
					}else{
						var event = $.Event( "ScenarioPlayQuizzOffer" );
						$(window).trigger( event );	
					}
				}else{
				// If the CurrentSequence does not have an MCQ or it has been processed
					
					// Get next Sequence ID
					var nextSequence=m_current_sequence.nextId;
					console.log("Next Sequence Id: " + nextSequence);
					
					m_quizz_processed=false;
					m_sequence_started=false;
					
					// Check if there are no more following sequence
					if (nextSequence==0){
						m_finished=true;
						
						m_state=SCENARIO_STOPPED;
						window.clearTimeout(m_loop);
						
						var event = $.Event( "ScenarioPlayFinished" );
						$(window).trigger( event );	
					}else{
						// Start the Sequence
						m_currentSequenceId=nextSequence;
						
						m_current_sequence=m_context.getSequence(m_currentSequenceId);
					}
				}				
			
			}

			notifyChange();
		}
	}
	
	// Start the ScenarioPlay execution
	function start(){
		console.log("ScenarioPlay.start");
		
		cleanScenarioPlay();
		
		cleanScenarioPlayScreen();
		
		calculateScenarioPlay();
		
		m_loop=window.setTimeout(appLoop, LOOP_UPDATE_TIME);		
	}
	
	// Notity the Scenario Play that a change ocurred
	function notifyChange(){
		// Dispatch ScenarioNodeImgsProccessed Event
		var event = $.Event( "ScenarioPlayChanged" );
		$(window).trigger( event );	
	}
	
	// Scheddule the next execution of appLoop and start calculateScenarioPlay()
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
	
	this.getCurrentMaxTime=getCurrentMaxTime;
	this.getReadyObjects=getReadyObjects;
	this.getProcessingObjects=getProcessingObjects;
		
	this.getMCQ=getMCQ;
	this.processMCQ=processMCQ;
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	function getMCQ(){
		var m_current_sequence=m_context.getSequence(m_currentSequenceId);
			
		// Establish a reference to the messages of the sequence
		return m_current_sequence.mcq;
	}
	
	function processMCQ(){
		m_quizz_processed=true;
	}
	
	function getReadyObjects(){
		return m_readyObjects;
	}
	
	function getProcessingObjects(){
		return m_processingObjects;	
	}
	
	function getCurrentMaxTime(){
		return m_scenCurrentMaxTime;
	}
	
	function getUserScroll(){
		return m_userscroll;
	}
	
	function setUserScroll(value){
		m_userscroll=value;
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
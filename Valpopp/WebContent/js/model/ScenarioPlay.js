
/* Responsibilities:
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
	var SCENARIO_PATHSELECTING=4;
	var SCENARIO_FINISHED=5;
	
	// Public constants
	this.SCENARIO_STOPPED=SCENARIO_STOPPED;
	this.SCENARIO_PLAYING=SCENARIO_PLAYING;
	this.SCENARIO_PAUSED=SCENARIO_PAUSED;
	this.SCENARIO_QUIZZING=SCENARIO_QUIZZING;
	this.SCENARIO_PATHSELECTING=SCENARIO_PATHSELECTING;
	this.SCENARIO_FINISHED=SCENARIO_FINISHED;
	
	// Each Simulation Cicle take place every LOOP_UPDATE_TIME (computer miliseconds)
	var LOOP_UPDATE_TIME = configModule.getSimulationLoopTime();
	
	// Every Simulation Cicle the Simulation Time advance SIMULATION_TIME value (miliseconds)
	var SIMULATION_TIME = configModule.getSimulationTimeAdvance();

	// ScenarioPlay starts at INITIAL_TIME
	var INITIAL_TIME = configModule.getInitialSimulationTime();
	
	
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
    var m_scenario_img=m_context.getFirstScenarioImage();
    
    // Register the current scroll position
    var m_scenario_scroll=0;
    
    // Register the state of the current quizz
    var m_current_quizz_ready=false;
    
    var m_current_quiz=null;
    
    var m_quiz_user_answers=null;
    
    var m_next_sequence=0;
    
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
    // Clean objects and variables used to in ScenarioPlay 
	function cleanScenarioPlay(){
		if (console && debug){
			console.log("ScenarioPlay.cleanScenarioPlay");
		}
		
		m_finished=false;
		m_userscroll=false;
		m_sequence_started=false;
		m_currentSyncPoint=null;
		m_quizz_processed=false;
		m_current_quizz_ready=false;
		m_scenario_img=m_context.getFirstScenarioImage();
		m_next_sequence=0;
		
		m_current_quiz=new QuizResults(configModule.getStudentLastName(), configModule.getStudentName() , m_context.getScenarioName());
		
		m_sim_time=INITIAL_TIME;
		m_last_msg_treatment=0;
		m_scenCurrentMaxTime=0;
		m_scenCurrentLastTime=INITIAL_TIME;
		m_currentSequenceId=0;
		m_message_list= new Array();
		m_readyObjects = new Array();
		m_processingObjects = new Array();
		m_new_processingList= new Array();
		
		// Update scroll position
		theContainer.scrollTop = 0;		
	}
	
	// Notify the view to clear the display section
	function cleanScenarioPlayScreen(){
		if (console && debug){
			console.log("ScenarioPlay.cleanScenarioPlayScreen");
		}

		var event = $.Event( "CleanScenarioPlayScreen" );
		$(window).trigger( event );			
	}
	
	/* Process the Scenario File Message
	 * Parameters:
	 * scenMessage: Scenario File Message
	 * index: the index in the Scenario File messages array
	 * lastmsgTime: the last time of the previous message
	 * treatment: the treatment time of the previous message
	 */
	function processMessage(scenMessage, index, lastmsgTime, treatment){
		if (console && debug){
			console.log("ProcessMessage Message index:" + index);	
		}

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
		
		if (scenMessage.comment){
			msg.setComment(scenMessage.comment.text);
		}
		
		//console.log("Message Total Transmision Time: " + msg.getTransTime());
		
		// If the message informs to change the scenario image
		if (scenMessage.scenImg){
			msg.setScenImg(scenMessage.scenImg);
		}
		
		var obj= new ScenObject(m_scenType.MESSAGE, msg);
		
		// If the message has treatment
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
	
	// Add to the processing list all the message that start at the Synchronization point
	function processSyncPoint(syncpoint, index, lastmsgTime, treatment){
		//console.log("processSyncPoint "+ syncpoint);
		
		var count=0;
		for (var x=index; x < m_current_messageList.length; x++){
			var scenMessage=m_current_messageList[x];
			
			if(scenMessage.startTime.localeCompare(syncpoint)==0){
				count++;
				processMessage(scenMessage, x, lastmsgTime, treatment);
			}
		}
		
		//console.log("number of syncronizing messages "+ count);
	}
	
	/* Create the Scenario Objects and Calculate the start time of objects 
	 * 
	 */
	function calculateScenarioPlay(){
//		console.log("ScenarioPlay.calculateScenarioPlay finished:" + m_finished);
	
		// If all the sequences have not been processed
 		if (!m_finished){
 			var m_current_sequence=null;
 			
 			// If the current sequence has not started to be processed
 			if (!m_sequence_started){
 				//console.log("ScenarioPlay Start CurrentSequence:" + m_currentSequenceId);
 				
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
		 						
		 						// Add the message to the list to be shown in Scenario Message List
		 						m_message_list.push(msg.getMsg());
		 						
		 						// Notify that the list has another message
	 							var event = $.Event( "ScenarioMessageListChanged" );
	 							$(window).trigger( event );		 						
		 						
		 						var scenImg=msg.getScenImg();
		 						
		 						// If the messages set a new scenario image
		 						if (scenImg.localeCompare("")!=0){
		 							
		 							m_scenario_img=scenImg;
		 							
		 							var event = $.Event( "ScenarioImgChanged" );
		 							$(window).trigger( event );	
		 						}
		 						
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
	 						if (console){
	 							console.error("calculateScenarioPlay: object type unknown");
	 						}
	 						break;
	 				}
	 			}
	 			
				// Replace the Processing Object List with the new one
	 			m_processingObjects=m_new_processingList;
			}else{
			// If there are no more objects in the Processing List
				if (console && debug){
					console.log("ScenarioPlay no more obj in processing list");
				}
				
				// If the CurrentSequence does have an MCQ and it has not been processed 
				if (m_current_sequence.mcq && !m_quizz_processed){
					
					m_state=SCENARIO_QUIZZING;
					
					// Stop timer
					window.clearTimeout(m_loop);
					
					if(!configModule.getTestModeMCQ()){
						m_quizz_processed=true;
					}	
					
					// Notify to the control and the view with an event if there is a mcq or a path Selector
					if (m_current_sequence.mcq.pathSelector){
						m_state=SCENARIO_PATHSELECTING;
						
						m_quizz_processed=true;
						
						var event = $.Event( "ScenarioPlayPathSelector" );
						$(window).trigger( event );	
					}else{
						// If the scenario simulation is under test mode
						if (configModule.getTestModeMCQ()){
							var event = $.Event( "ScenarioPlayTestQuizz" );
							$(window).trigger( event );	
						}else{
							var event = $.Event( "ScenarioPlayPracticeQuizz" );
							$(window).trigger( event );	
						}						
					}
				}else{
				// If the CurrentSequence does not have an MCQ|pathSelector or it has already been processed
					
					// Get next Sequence ID
					var nextSequence=0;
					
					// If there is a path Selector
					if (m_current_sequence.mcq.pathSelector){
						// If the user did not chose an option use default option
						if (m_next_sequence==0){
							m_next_sequence=m_current_sequence.nextId;
						}
						nextSequence=m_next_sequence;
						m_next_sequence=0;
					}else{
						nextSequence=m_current_sequence.nextId;
					}
					
					if (console && debug){
						console.log("Next Sequence Id: " + nextSequence);
					}
					
					m_quizz_processed=false;
					m_sequence_started=false;
					m_current_quizz_ready=false;
					
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

			// Notify change to the view
			notifyChange();
		}
	}
	
	// Start the ScenarioPlay execution
	function start(){
		//console.log("ScenarioPlay.start");
		
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
	
	this.getCurrentScenarioImg=getCurrentScenarioImg;
	this.getCurrentListofMessages=getCurrentListofMessages;
	
	this.setScrollPos=setScrollPos;
	this.getScrollPos=getScrollPos;
	
	this.getQuizReady=getQuizReady;
	this.setQuizReady=setQuizReady;
	
	this.setQuizAnswers=setQuizAnswers;
	this.getQuiz=getQuiz;
	this.getQuizPointsWon=getQuizPointsWon;
	this.getQuizTotalPoints=getQuizTotalPoints;
	
	this.setNextSequence=setNextSequence;
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	function setNextSequence(nextId){
		m_next_sequence=nextId;	
	}
	
	// This method is used by the controller to set the user answers
	function setQuizAnswers(answers){
		m_quiz_user_answers=answers;
	}
	
	function getQuizPointsWon(){
		m_current_quiz.getPointsWon();
	}
	
	function getQuizTotalPoints(){
		m_current_quiz.getTotalPoints();
	}
		
	function getQuiz(){
		return m_current_quiz;
	}
	
	// Executed when the Quiz is finished
	function processMCQ(){
		console.log("scenarioPlay.processMCQ");
		
		var m_current_sequence=m_context.getSequence(m_currentSequenceId);
		
		// Resolve the points won for the user
		m_current_quiz.addMCQ(m_current_sequence.mcq.title);
		
		for (var x=0; x < m_current_sequence.mcq.answers.length; x++){
			var validResponse=false;
			
			// Get the valid response for this answer
			if (m_current_sequence.mcq.answers[x].valid){
				validResponse=true;
			}
			
			m_current_quiz.setAnswerResult(x+1, m_current_sequence.mcq.answers[x].points, m_quiz_user_answers[x], validResponse);
		}
		
		m_current_quiz.finishMCQ();
		
		
		// Trigger Event to inform ScenarioView
		var event = $.Event( "ScenarioQuizPartialResults" );
		
		event.scorePoints=m_current_quiz.getPointsWon();
		event.totalPoints=m_current_quiz.getTotalPoints();
		$(window).trigger( event );	
		
		m_quizz_processed=true;
	}	
	
	//
	function getQuizReady(){
		return m_current_quizz_ready;
	}
	
	function setQuizReady(value){
		m_current_quizz_ready=value;
	}
	
	function setScrollPos(scroll){
		m_scenario_scroll=scroll;
	}
	
	function getScrollPos(){
		return m_scenario_scroll;
	}
	
	function getCurrentListofMessages(){
		return m_message_list;
	}
	
	function getCurrentScenarioImg(){
		return m_scenario_img;
	}
	
	function getMCQ(){
		var m_current_sequence=m_context.getSequence(m_currentSequenceId);
			
		// Establish a reference to the messages of the sequence
		return m_current_sequence.mcq;
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
		//console.log("ScenarioPlay.play m_state:", m_state);
		
		if (m_state==SCENARIO_STOPPED){
			m_state=SCENARIO_PLAYING;
			
			cleanScenarioPlayScreen();
			
			start();
		}	
	}
	
	function pause(){
		//console.log("ScenarioPlay.pause m_state:", m_state);
		
		m_state=SCENARIO_PAUSED;
		 
		window.clearTimeout(m_loop);
	}
	
	function continuePlay(){
		//console.log("ScenarioPlay.continuePlay m_state:", m_state);
		
		m_userscroll=false;
		m_state=SCENARIO_PLAYING;
		  
		m_loop=window.setTimeout(appLoop, LOOP_UPDATE_TIME);		
	}
	
	function stop(){
		//console.log("ScenarioPlay.stop m_state:", m_state);
		
		window.clearTimeout(m_loop);
		
		m_state=SCENARIO_STOPPED;		
		   
		cleanScenarioPlay();
		
		cleanScenarioPlayScreen();
	}
	
	function changeMode(continious){
		//console.log("ScenarioPlay.changeMode");
		
		m_continious_mode=continious;
	}
	
	// ******************************************************************************
	// Events Listeners
	// ******************************************************************************
	
	// ******************************************************************************
	// Call back functions
	// ******************************************************************************	

}


//Clases used by Scenario Play

// Used to register each MCQ results and to provide a csv result
function MCQ(titleValue){
	var mcqTitle=titleValue;

	var answers=new Array();

	this.setAnswerResult=setAnswerResult;
	this.getResults=getResults;
	
	
	function setAnswerResult(number, userAnswer, expected){
		answers.push({"number":number, "answer": userAnswer, "expected": expected});
	}
	
	function getResults(){
		var results="";
		
		results+="mcqTitle;"+mcqTitle+"\n";
		
		for (var x=0; x < answers.length; x++){
			// Determine if the user answer is right
			var result=false;
			if (answers[x].answer == answers[x].expected){
				result=true;
			}
			
			results+="answer;"+ answers[x].number +";"+ result +  "\n";
		}
		
		return results;
	}
}

// Used to Quiz results and provides a  csv result
function QuizResults(lastName, name, scenarioNameValue){
	var scenarioName=scenarioNameValue;
	var studentLastName=lastName;
	var studentName=name;
	
	var pointsWon=0;
	var totalPoints=0;
	
	var listOfMCQ=new Array();
	
	var m_currentMCQ=null;
	
	this.addMCQ=addMCQ;
	this.finishMCQ=finishMCQ;
	this.getResults=getResults;
	
	this.getScenarioName=getScenarioName;
	this.getStudentLastName=getStudentLastName;
	this.getStudentName=getStudentName;	
	this.setAnswerResult=setAnswerResult;
	this.getPointsWon=getPointsWon;
	this.getTotalPoints=getTotalPoints;
	
	function getScenarioName(){
		return scenarioName;
	}
	
	function getStudentLastName(){
		return studentLastName;		
	}
	
	function getStudentName(){
		return studentName;
	}
	
	function getPointsWon(){
		return pointsWon;
	}
	
	function getTotalPoints(){
		return totalPoints;
	}
	
	function addMCQ(title){
		m_currentMCQ=new MCQ(title);
	}	
	
	function setAnswerResult(number, points, userAnswer, expected){
		m_currentMCQ.setAnswerResult(number, userAnswer, expected);
		
		totalPoints+=points;
		
		if (userAnswer==expected){
			pointsWon+=points;
		}
	}
	
	function finishMCQ(){
		listOfMCQ.push(m_currentMCQ);
	}
	
	function getResults(){
		var results="";
			
		results+="student;"+ studentLastName + ";" + studentName +"\n";
		
		results+="date;"+ getCurrentDate() + "\n";		
		
		results+="scenario;"+ scenarioName + "\n";
		
		results+="points;"+ pointsWon + ";" + totalPoints + ";"+ pointsWon + "/" + totalPoints + "\n";
		
		for (var x=0; x < listOfMCQ.length; x++ ){
			results+=listOfMCQ[x].getResults();
		}
		
		return results;
	}
}

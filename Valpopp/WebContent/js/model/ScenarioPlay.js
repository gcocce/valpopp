
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

	this.SCENARIO_STOPPED=SCENARIO_STOPPED;
	this.SCENARIO_PLAYING=SCENARIO_PLAYING;
	this.SCENARIO_PAUSED=SCENARIO_PAUSED;
	this.SCENARIO_QUIZZING=SCENARIO_QUIZZING;	
	
	// ******************************************************************************
	// Properties
	// ******************************************************************************	
	
	var m_error="";
	var m_state=SCENARIO_STOPPED;
	var m_continious_mode=true;
	
	var m_context=context;
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
	function notifyChange(){
		// Dispatch ScenarioNodeImgsProccessed Event
		var event = $.Event( "ScenarioPlayChanged" );
		$(window).trigger( event );	
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
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	function getError(){
		return m_error;
	}
	
	function getState(){
		return m_state;
	}
	
	function play(){
		
	}
	
	function pause(){
		
	}
	
	function continuePlay(){
		
	}
	
	function stop(){
		
	}
	
	function changeMode(continious){
		m_continious_mode=continious;
	}
	
	// ******************************************************************************
	// Events Listeners
	// ******************************************************************************
	
	// Events to control node image download
	$(window).on( "ScenarioPlayAdvance", scenarioPlayUpdate);	

	// ******************************************************************************
	// Call back functions
	// ******************************************************************************	
	
	/* Get info from Scenario Context and update Scenario Play */
	function scenarioPlayUpdate(e){
		
		
		
	}
}

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
	
	var LOOP_UPDATE_TIME=1000;

	// To be used outside the class
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
	
	// Reference to Timer
	var m_loop;
	
	var m_userscroll=false;
	
    var theContainer = document.getElementById("vDraw");
    var theCanvas = document.getElementById("vScenarioCanvas");   
    var theCanvasContext=theCanvas.getContext("2d");
    
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
    // Clean objects and variables used to play 
	function cleanScenarioPlay(){
		console.log("ScenarioPlay.cleanScenarioPlay");
		
		//m_finished=false;
		m_userscroll=false;
		
		//TODO: Clean Objects used to store scenario play data
		
		theContainer.scrollTop = 0;		
	}
	
	function cleanScenarioPlayScreen(){
		console.log("ScenarioPlay.cleanScenarioPlayScreen");
		
		// TODO: Clean Canvas
	}	
	
	function calculateScenarioPlay(){
		console.log("ScenarioPlay.calculateScenarioPlay");
		
		//TODO: Calculate the new state of ScenarioPlay objects 
		
		
		notifyChange();
	}
	
	function start(){
		console.log("ScenarioPlay.start");
		
		m_userscroll=false;

		m_loop=window.setTimeout(appLoop, LOOP_UPDATE_TIME);

		calculateScenarioPlay();
	}
	
	function notifyChange(){
		console.log("ScenarioPlay.notifyChange");
		
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
	
	// Events to control node image download
	//$(window).on( "ScenarioPlayAdvance", scenarioPlayUpdate);	

	// ******************************************************************************
	// Call back functions
	// ******************************************************************************	
	

}

/* Responsibilities:
 * 
 * Capture Events associated to Scenario Layout and trigger the appropriate action
 */

function ScenarioController(){
	
	// ******************************************************************************
	// Properties
	// ******************************************************************************
	
	// Reference to html elements
    var theContainer = document.getElementById("vDraw");
    var theCanvas = document.getElementById("vScenarioCanvas");   
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
	
	// **************************************************************************
	// Public Methods Publication
	//***************************************************************************
	this.playButton=playButton;
	this.stopButton=stopButton;
	this.modeCheckbox=modeCheckbox;
	this.quizButton=quizButton;
	this.dataButton=dataButton;	
	this.changeMode=changeMode;
	
	//***************************************************************************
	// Public Methods Definition	
	//***************************************************************************
	
	function playButton(){
		
		var scenarioPlay=scenarioView.getCurrentScenarioPlay();
		
		var state=scenarioPlay.getState();
		
		//console.log("ScenarioController.playButton state:" + state);
		
		  theCommandButton = document.getElementById("bt_play");
			
		  switch (state) {
			case scenarioPlay.SCENARIO_STOPPED: // Play
			  theCommandButton.value="Pause";
			  scenarioPlay.play();
			  break;
			case scenarioPlay.SCENARIO_PLAYING: // Pause
			  theCommandButton.value="Continue";
			  scenarioPlay.pause();
			  break;
			case scenarioPlay.SCENARIO_PAUSED: // Continue
			  theCommandButton.value="Pause";
			  scenarioPlay.continuePlay();		  
			  break;
			case scenarioPlay.SCENARIO_QUIZZING:
			  theCommandButton.value="Pause";
			  var button=document.getElementById("bt_quiz");
			  button.disabled=true;
			  button.className="inactive";
			  scenarioPlay.continuePlay();		
			  
			  break;
			default:
				console.error("ScenarioController.playButton known state");
				break;
		  }
	}

	function stopButton(){
		
		theCommandButton = document.getElementById("bt_play");
		theCommandButton.value="Start";
		
		var button=document.getElementById("bt_quiz");
		button.disabled=true;
		button.className="inactive";		
		 
		//If there is any scenarioPlay properly loaded
		var scenarioPlay=scenarioView.getCurrentScenarioPlay();
		if (scenarioPlay){
			// Stop and clear the current scenario Play
			scenarioPlay.stop();
			
			// Notify that the Scenario Stops
			var event = $.Event( "ScenarioStopClear" );
			$(window).trigger( event );				
		}
	}
	
	function quizButton(){
		
		scenarioView.showScenarioQuizz();
	}

	function modeCheckbox(){
				
		var scenarioPlay=scenarioView.getCurrentScenarioPlay();
		
		// If the scenarioPlay objet is valid
		if (scenarioPlay){
			
			theCheckButton = document.getElementById("bt_mode");
			
			// Change mode
			scenarioPlay.changeMode(theCheckButton.checked);			
		}
	}
	
	function changeMode(){
		
		var scenarioPlay=scenarioView.getCurrentScenarioPlay();
		
		// If the scenarioPlay objet is valid
		if (scenarioPlay){
			theCheckButton = document.getElementById("bt_mode");
			
			if (theCheckButton.checked){
				theCheckButton.checked=false;
			}else{
				theCheckButton.checked=true;
			}
			
			// Change mode
			scenarioPlay.changeMode(theCheckButton.checked);		
		}
	}
	
	function dataButton(){
	    
		scenarioView.showScenarioDataMenu();
	}	

	

	
	//***************************************************************************
	// Events associated to mouse and gestures
	//***************************************************************************	
		
	  document.addEventListener('scroll', theDocumentWasScrolled, null);
	  theContainer.addEventListener('click', theContainerWasClicked, null);
	  theContainer.addEventListener('scroll', theContainerWasScrolled, null);
	  theContainer.addEventListener('mousewheel', theContainerWasMouseWheeled, null);
	  theContainer.addEventListener('mousedown', theContainerWasPressedDown, null);
	  
	  theContainer.addEventListener('DOMMouseScroll', theContainerWasMouseWheeled, null);
	  
	  theCanvas.addEventListener('touchstart', function(event) {
		// If there's exactly one finger inside this element
		if (event.targetTouches.length == 1) {
		  onTouchStart(event);
		}
	  }, false);
	  
	  theCanvas.addEventListener('touchmove', function(event) {
		// If there's exactly one finger inside this element
		if (event.targetTouches.length == 1) {
		  onTouchMove(event);
		}
	  }, false);
	  
	  var pi=null;
	  
	  function onTouchStart(event) {
		  pi = getCoords(event.touches[0]);
	  }
	  
	  function onTouchMove(event) {
		  var pf = getCoords(event.touches[0]);
	  
		  scrollCanvas(pf.y-pi.y);
	  
		  pi=pf;
	  }
	 
	  function scrollCanvas(diffY) {
		//console.log("scrollCanvas diff: " + diffY);
		
		theContainer.scrollTop = theContainer.scrollTop - diffY;
		
		var scenarioPlay=scenarioView.getCurrentScenarioPlay();
		scenarioPlay.setUserScroll(true);
		
		userscroll=true;
	  }
		
		
	  // Get the coordinates for a mouse or touch event
	  function getCoords(e) {		
		return { x: e.pageX - theCanvas.offsetLeft, y: e.pageY - theCanvas.offsetTop };
	  }

	  
	  function theContainerWasClicked(e) {
		//console.log("Container Was Clicked");
		
		userscroll=true;
		var scenarioPlay=scenarioView.getCurrentScenarioPlay();
		scenarioPlay.setUserScroll(true);		
		
		var scenarioPlay=scenarioView.getCurrentScenarioPlay();
		scenarioPlay.setUserScroll(true);
	  }
	  
	  // This is triggered every time the canvas container is scrolled (whoever does it)
	  function theContainerWasScrolled(e) {
		console.log("Container was Scrolled");

		var scroll = theContainer.scrollTop;
		var scenarioPlay=scenarioView.getCurrentScenarioPlay();
		scenarioPlay.setScrollPos(scroll);	
		
		var theCommentsContainer=document.getElementById("vMessagesBody");
		
		if (theCommentsContainer){
			theCommentsContainer.scrollTop = scroll;
		}
	  }
	  
	  function theDocumentWasScrolled(e) {
		 //console.log("Document was Scrolled");
	  }
	  
	  function theContainerWasMouseWheeled(e) {
		userscroll=true;
		var scenarioPlay=scenarioView.getCurrentScenarioPlay();
		scenarioPlay.setUserScroll(true);
		
		//console.log("Container Was MouseWheeled");
	  }
	  
	  function theContainerWasPressedDown(e) {
		userscroll=true;
		var scenarioPlay=scenarioView.getCurrentScenarioPlay();
		scenarioPlay.setUserScroll(true);
		
		//console.log("Container Was Mouse Pressed Down");		
	  }		
	  
	  
		//***************************************************************************
		// Events associated to ScenarioPlay State
		//***************************************************************************	  
	  
		// Trigger when the schema file is already loaded
		$(window).on( "ScenarioPlayFinished", initCommandButton);
	
		$(window).on( "ScenarioPlayMandatoryQuizz", quizzMandatoryCommandButtons);
		
		$(window).on( "ScenarioPlayQuizzOffer", quizzOfferCommandButtons);
		
		$(window).on( "ScenarioPlayQuizzFinished", quizzFinishedCommandButtons);
		
		$(window).on( "ScenarioPause", scenarioPausedCommandButtons);
		
  
		//***************************************************************************
		// Call back function for ScenarioPlay State
		//***************************************************************************	 
	  
		function initCommandButton(){			
			theCommandButton = document.getElementById("bt_play");
			theCommandButton.value="Start";			
		}
		
		function quizzMandatoryCommandButtons(){	
			var button=document.getElementById("bt_play");
			button.value="Continue";
			button.disabled=true;
			
			button=document.getElementById("bt_clear");
			button.disabled=true;
			
			//button=document.getElementById("bt_mode");
			//button.disabled=true;
			
			button=document.getElementById("bt_quiz");
			button.className="active";			
			button.disabled=false;			
		}
		
		function quizzOfferCommandButtons(){	
			var button=document.getElementById("bt_play");
			button.value="Continue";
			button.disabled=false;
			
			button=document.getElementById("bt_clear");
			button.disabled=false;
			
			button=document.getElementById("bt_mode");
			button.disabled=false;
			
			button=document.getElementById("bt_quiz");
			button.disabled=false;
			button.className="active";
		}		
				
		
		function quizzFinishedCommandButtons(){
			var button=document.getElementById("bt_clear");
			button.disabled=false;
			
			button=document.getElementById("bt_mode");
			button.disabled=false;
			
			button=document.getElementById("bt_quiz");
			button.disabled=true;
			
			button=document.getElementById("bt_play");
			button.disabled=false;
			
			// Continue Simulation
			if (configModule.getContinueAfterMCQ()){
				button.value="Pause";
				playButton();
			}else{
				button.value="Continue";
			}
		}
		
		function scenarioPausedCommandButtons(){
			var button=document.getElementById("bt_play");
			button.value="Continue";			
		}
	  
}

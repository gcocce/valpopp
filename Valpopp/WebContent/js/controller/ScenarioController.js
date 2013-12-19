
/* Responsibilities:
 * 
 * Capture Events associated to Scenario Layout and trigger the appropriate action
 * 
 */

function ScenarioController(){
	
	// ******************************************************************************
	// Properties
	// ******************************************************************************
	
	// Reference to html elements
    var theContainer = document.getElementById("vDraw");
    var theCanvas = document.getElementById("vScenarioCanvas");   
    
    // Reference to the ScenarioContext
    var m_scenarioContext = null;
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
	
	// **************************************************************************
	// Public Methods Publication
	//***************************************************************************
    this.setScenarioContext=setScenarioContext;
    
	this.playButton=playButton;
	this.stopButton=stopButton;
	this.modeCheckbox=modeCheckbox;
	this.quizButton=quizButton;
	this.dataButton=dataButton;	
	this.changeMode=changeMode;
	
	
	this.processQuizzAnswer=processQuizzAnswer;
	this.finishQuizz=finishQuizz;
	
	//***************************************************************************
	// Public Methods Definition	
	//***************************************************************************
	
	// Function initially called when the Scenario Model is ready to be displayed
	// It ask the context to create a ScenarioPlay and indicate to the view to initialize the display
	function setScenarioContext(context){
		m_scenarioContext = context;
		
		m_scenarioContext.createScenarioPlay();
		
		// Notify the view that the context can be used
		scenarioView.initiateScenarioDisplay(context);
	}
	
	function quizButton(){
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
		
		scenarioPlay.setQuizReady(false);
		
		scenarioView.showScenarioQuizz();
	}
	
	// Resolve the user answer for a quiz
	function processQuizzAnswer(){
		//console.log("scenarioController.processQuizzAnswer");
		
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
		
		// Get the current MCQ to be processed
		var mcq = scenarioPlay.getMCQ();
		
		var userResponses = new Array();
		var validResponses = new Array();
		var validAnswer=true;		
		
		// Determine it the answer was right
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
		
		var html=htmlBuilder.getMCQResults(mcq, userResponses, validResponses, validAnswer);
		
		// Set quiz state to ready because the user already answer the quiz
		scenarioPlay.setQuizReady(true);
		
		scenarioView.showQuizCorrections(html);
	}
	
	// Executed when the user close a quiz dialog
	function finishQuizz(){
		//console.log("scenarioController.finishQuiz");
		
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();	
		
		// If it has already been answered
		if (scenarioPlay.getQuizReady()){
			
			scenarioPlay.processMCQ();
			
			var event = $.Event( "ScenarioPlayQuizzFinished" );
			$(window).trigger( event );
		}
	}
	
	function playButton(){
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
		
		var state=scenarioPlay.getState();
		
		//console.log("ScenarioController.playButton state:" + state);
		
		  theCommandButton = document.getElementById("bt_play");
			
		  switch (state) {
			case scenarioPlay.SCENARIO_STOPPED: // Play
			  theCommandButton.value=languageModule.getCaption("BUTTON_PAUSE");
			  scenarioPlay.play();
			  break;
			case scenarioPlay.SCENARIO_PLAYING: // Pause
			  theCommandButton.value=languageModule.getCaption("BUTTON_CONTINUE");
			  scenarioPlay.pause();
			  break;
			case scenarioPlay.SCENARIO_PAUSED: // Continue
			  theCommandButton.value=languageModule.getCaption("BUTTON_PAUSE");
			  scenarioPlay.continuePlay();		  
			  break;
			case scenarioPlay.SCENARIO_QUIZZING:
			  theCommandButton.value=languageModule.getCaption("BUTTON_PAUSE");
			  var button=document.getElementById("bt_quiz");
			  button.disabled=true;
			  button.className="inactive";
			  scenarioPlay.continuePlay();		
			  
			  break;
			default:
				if (console){
					console.error("ScenarioController.playButton known state");
				}
			
				break;
		  }
	}

	function stopButton(){
		
		theCommandButton = document.getElementById("bt_play");
		theCommandButton.value=languageModule.getCaption("BUTTON_START");
		
		var button=document.getElementById("bt_quiz");
		button.disabled=true;
		button.className="inactive";		
		 
		//If there is any scenarioPlay properly loaded
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
		if (scenarioPlay){
			// Stop and clear the current scenario Play
			scenarioPlay.stop();
			
			// Notify that the Scenario Stops
			var event = $.Event( "ScenarioStopClear" );
			$(window).trigger( event );				
		}
	}
	
	
	function modeCheckbox(){
				
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
		
		// If the scenarioPlay object is valid
		if (scenarioPlay){
			
			theCheckButton = document.getElementById("bt_mode");
			
			// Change mode
			scenarioPlay.changeMode(theCheckButton.checked);			
		}
	}
	
	function changeMode(){
		
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
		
		// If the scenarioPlay object is valid
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
		
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
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
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
		scenarioPlay.setUserScroll(true);		
		
	  }
	  
	  // This is triggered every time the canvas container is scrolled (whoever does it)
	  function theContainerWasScrolled(e) {
		//console.log("Container was Scrolled");

		var scroll = theContainer.scrollTop;
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
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
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
		scenarioPlay.setUserScroll(true);
		
		//console.log("Container Was MouseWheeled");
	  }
	  
	  function theContainerWasPressedDown(e) {
		userscroll=true;
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
		scenarioPlay.setUserScroll(true);
		
		//console.log("Container Was Mouse Pressed Down");		
	  }		
	  
	  
		//***************************************************************************
		// Events associated to ScenarioPlay State
		//***************************************************************************	  
	  
		// Trigger when the schema file is already loaded
		$(window).on( "ScenarioPlayFinished", initCommandButton);
	
		// If the Quiz is mandatory this Event is triggered, the controller should arrange the buttons
		// to obligate the user to answer
		$(window).on( "ScenarioPlayTestQuizz", quizzMandatoryCommandButtons);
		
		// If the Quiz is not mandatory this Event is triggered, the controller should arrange the buttons
		// to offer the possibility to answer to the user
		$(window).on( "ScenarioPlayPracticeQuizz", quizzOfferCommandButtons);
		
		// This Event is triggered if the Quiz has finished
		$(window).on( "ScenarioPlayQuizzFinished", quizzFinishedCommandButtons);
		
		// This Event if a pause is necessary in the simulation
		$(window).on( "ScenarioPause", scenarioPausedCommandButtons);
		
		// This Event if a pause is necessary in the simulation
		$(window).on( "ApplicationLanguageChange", updateCommandButtonsCaption);
		
		//***************************************************************************
		// Call back function for ScenarioPlay State
		//***************************************************************************	 
	  
		function updateCommandButtonsCaption(){
			var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
			
			var state=scenarioPlay.getState();
			
			var button = document.getElementById("bt_play");
		 	
			// Change the play button caption regarding the ScenarioPlay state
		    switch (state) {
			case scenarioPlay.SCENARIO_STOPPED: // Play
				button.value=languageModule.getCaption("BUTTON_START");
			  break;
			case scenarioPlay.SCENARIO_PLAYING: // Pause
				button.value=languageModule.getCaption("BUTTON_PAUSE");
			  break;
			case scenarioPlay.SCENARIO_PAUSED: // Continue
			  theCommandButton.value=languageModule.getCaption("BUTTON_CONTINUE");  
			  break;
			case scenarioPlay.SCENARIO_QUIZZING:
			  theCommandButton.value=languageModule.getCaption("BUTTON_CONTINUE");
			  break;
			default:
				if (console){
					console.error("ScenarioController.playButton known state");
				}
				break;
		    }	
			
			button=document.getElementById("bt_quiz");
			button.value=languageModule.getCaption("BUTTON_QUIZ");
			
			button=document.getElementById("bt_clear");
			button.value=languageModule.getCaption("BUTTON_CLEAR");
			
			button=document.getElementById("bta_mode");
			button.innerHTML=languageModule.getCaption("BUTTON_MODE");
			
			button=document.getElementById("bt_data");
			button.value=languageModule.getCaption("BUTTON_DATA");	
			
			
		}
		
		function initCommandButton(){			
			theCommandButton = document.getElementById("bt_play");
			theCommandButton.value=languageModule.getCaption("BUTTON_START");			
		}
		
		function quizzMandatoryCommandButtons(){	
			var button=document.getElementById("bt_play");
			button.value=languageModule.getCaption("BUTTON_CONTINUE");
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
			button.value=languageModule.getCaption("BUTTON_CONTINUE");
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
			//console.log("quizzFinishedCommandButtons");
			
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
				button.value=languageModule.getCaption("BUTTON_PAUSE");
				playButton();
			}else{
				button.value=languageModule.getCaption("BUTTON_CONTINUE");
			}
		}
		
		function scenarioPausedCommandButtons(){
			var button=document.getElementById("bt_play");
			button.value=languageModule.getCaption("BUTTON_CONTINUE");			
		}
	  
}

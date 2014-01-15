
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
	this.processPathSelector=processPathSelector;
	this.finishQuizz=finishQuizz;
	
	this.processSOAPResult=processSOAPResult;
	
	//***************************************************************************
	// Public Methods Definition	
	//***************************************************************************
	
	function processSOAPResult(r)
	{
		if(console && debug){
			console.log(r);
		}
	}	
	
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
	
		var mcq = scenarioPlay.getMCQ();
		
		//IF there is a path selector show again the options
		if (mcq.pathSelector){
			var event = $.Event( "ScenarioPlayPathSelector" );
			$(window).trigger( event );			
		}else{
			// if there is a quiz show again the quiz
			scenarioView.showScenarioQuizz();
		}
	}
	
	function processPathSelector(){
		
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
		
		// Get the current MCQ to be processed
		var mcq = scenarioPlay.getMCQ();
		
		var userChoice = 0;		
		
		// Determine it the answer was right
		for (var i=0; i < mcq.answers.length; i++ ){
			var userAnswer=document.getElementById("ValpoppMCQanswer" + (i+1));

			// User answers
			if (userAnswer.checked){
				userChoice=mcq.answers[i].nextId;
				if (console && debug){
					console.log("User option: " + userChoice);
				}
			}
		}
		
		// Set the next sequence
		scenarioPlay.setNextSequence(userChoice);
		
		// Set quiz state to ready because the user already answer the quiz
		scenarioPlay.setQuizReady(true);
			
		// Trigger event to inform that the path selector has finished
		var event = $.Event( "ScenarioPlayQuizzFinished" );
		$(window).trigger( event );
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

			// User answers
			if (userAnswer.checked){
				userResponses[i]=true;
			}else{
				userResponses[i]=false;
			}
			
			// Valid answers
			if (mcq.answers[i].valid){
				validResponses[i]=true;
			}else{
				validResponses[i]=false;			
			}			
			
			// Determine if all the user answer is right
			if (userResponses[i]!=validResponses[i]){
				validAnswer=false;
			}			
		}
		
		var html=htmlBuilder.getMCQResults(mcq, userResponses, validResponses, validAnswer);
		
		// Set quiz state to ready because the user already answer the quiz
		scenarioPlay.setQuizReady(true);
		
		// Send to the model the user responses
		scenarioPlay.setQuizAnswers(userResponses);
		
		scenarioView.showQuizCorrections(html);
	}
	
	// Executed when the user close a quiz dialog
	// If there is a path Selector and the user close the dialog this is executed but
	// as the getQuizReady method returns false it does nothing.
	function finishQuizz(){
		if (debug && console){
			console.log("scenarioController.finishQuiz");	
		}
		
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();	
		
		if (scenarioPlay){
			// If it has already been answered
			if (scenarioPlay.getQuizReady()){
				
				scenarioPlay.processMCQ();
				
				var event = $.Event( "ScenarioPlayQuizzFinished" );
				$(window).trigger( event );
			}			
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
			case scenarioPlay.SCENARIO_PATHSELECTING:				
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
		
		if (scenarioPlay){
			scenarioPlay.setUserScroll(true);
		}
		
		//console.log("Container Was MouseWheeled");
	  }
	  
	  function theContainerWasPressedDown(e) {
		userscroll=true;
		var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
		if (scenarioPlay){
			scenarioPlay.setUserScroll(true);
		}
		
		//console.log("Container Was Mouse Pressed Down");		
	  }		
	  
	  
		//***************************************************************************
		// Events associated to ScenarioPlay State
		//***************************************************************************	  
	  
		// Trigger when the scenario simulation finish
		$(window).on( "ScenarioPlayFinished", processSimulationResult);
	
		// If the Quiz is mandatory this Event is triggered, the controller should arrange the buttons
		// to obligate the user to answer
		$(window).on( "ScenarioPlayTestQuizz", quizzMandatoryCommandButtons);
		
		// If there is a Path Selector this Event is triggered, the controller should arrange the buttons
		// to obligate the user to choose
		$(window).on( "ScenarioPlayPathSelector", pathSelectorCommandButtons);		
		
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
			var button=document.getElementById("bt_quiz");
			button.value=languageModule.getCaption("BUTTON_QUIZ");
			
			button=document.getElementById("bt_clear");
			button.value=languageModule.getCaption("BUTTON_CLEAR");
			
			button=document.getElementById("bta_mode");
			button.innerHTML=languageModule.getCaption("BUTTON_MODE");
			
			button=document.getElementById("bt_data");
			button.value=languageModule.getCaption("BUTTON_DATA");
			
			
			var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
			
			button = document.getElementById("bt_play");
			
			var state=null;
			
			// If there is a valid scenario
			if (scenarioPlay){
				state=scenarioPlay.getState();
				
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
				case scenarioPlay.SCENARIO_PATHSELECTING:
				    theCommandButton.value=languageModule.getCaption("BUTTON_CONTINUE");
				    
					button=document.getElementById("bt_quiz");
					button.value=languageModule.getCaption("BUTTON_CHOOSE");			    
					break;
				default:
					if (console){
						console.error("ScenarioController.playButton known state");
					}
					break;
			    }				
			}else{
				button.value=languageModule.getCaption("BUTTON_START");
			}
			
			//Notify Scenario View to update translatable captions
			scenarioView.updateTransletableCaptions();
		}
		
		function processSimulationResult(){
			
			var webServiceURL = configModule.getWebServiceURL();
			var webServiceMethod=configModule.getWebServiceMethod();
			var testMode=configModule.getTestModeMCQ();
			
			// Send the answer if the simulation is running under test mode and there is a web service
			if(testMode && webServiceURL!=null){
				
				var scenarioPlay=m_scenarioContext.getCurrentScenarioPlay();
				
				var quizResults=scenarioPlay.getQuiz();
				
				if (console && debug){
					console.log("Send Quiz Results:");
					console.log(quizResults.getResults());
				}
				
				// Send results through the web service
				try{
					var pl = new SOAPClientParameters();

					var name=quizResults.getStudentName();		
					pl.add("name", name);

					var lastName=quizResults.getStudentLastName();
					pl.add("lastName", lastName);
					
					var date=getCurrentDate();			
					pl.add("date", date);

					var scenarioName=quizResults.getScenarioName();
					pl.add("scenario", scenarioName );

					var points=quizResults.getPointsWon();
					pl.add("points", points);

					var description=quizResults.getResults();
					pl.add("description", description );
					
					SOAPClient.invoke(webServiceURL, webServiceMethod, pl, true, processSOAPResult);
				} catch (error){
					if (console && debug){
						console.log("There was an error while invoking the web service");
						console.error(error);					
					}
				}					
			}
			
			theCommandButton = document.getElementById("bt_play");
			theCommandButton.value=languageModule.getCaption("BUTTON_START");	
		}
		
		function quizzMandatoryCommandButtons(){	
			var button=document.getElementById("bt_play");
			button.value=languageModule.getCaption("BUTTON_CONTINUE");
			button.disabled=true;
			
			button=document.getElementById("bt_clear");
			button.disabled=true;
			
			button=document.getElementById("bt_quiz");
			button.className="active";			
			button.disabled=false;			
		}
		
		function pathSelectorCommandButtons(){
			var button=document.getElementById("bt_play");
			button.value=languageModule.getCaption("BUTTON_CONTINUE");
			button.disabled=true;
			
			button=document.getElementById("bt_clear");
			button.disabled=true;
			
			button=document.getElementById("bt_quiz");
			button.value=languageModule.getCaption("BUTTON_CHOOSE");
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
			var button=document.getElementById("bt_clear");
			button.disabled=false;
			
			button=document.getElementById("bt_mode");
			button.disabled=false;
			
			button=document.getElementById("bt_quiz");
			button.value=languageModule.getCaption("BUTTON_QUIZ");
			button.disabled=true;
			
			button=document.getElementById("bt_play");
			button.disabled=false;
			
			// Continue Simulation automatically if it is set to do that in the configuration
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

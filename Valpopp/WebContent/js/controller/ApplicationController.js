
/* Responsabilities:
 * 
 * 
 * Control when the language.csv file is downloaded and initiate the Language Module.
 * Trigger the setup process when all the scripts have been download and the Language module has been initialized.
 * Create Scenario Objects and Initiate schema and default scenario file downloading process.
 * Trigger actions for the application buttons Open and Settings.
 * Preload application images.
 * Handle list of scenario examples, show and filter the list.
 * Start loading process for scenario examples and local files.
 * 
 */

function ApplicationController(){	
	// ******************************************************************************
	// Properties
	// ******************************************************************************
	
	// Used to register an error description
	var m_error="";
	
	// The content of the scenario example list file
	var m_scenario_list=new Array();
	
	// A list with the file names of scenario examples
	var m_scenario_filter_list=new Array();
	
	// Reference to the current scenario selected
	var m_selected_example=-1;
	
	// Character that is used in the Scenario List as Separator
	var SEP=";";
	
	// Register if the application images have already been downloaded
	var appImagesLoaded=false;
	

	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
	// This method load the contents of the list.csv file which contains the scenario list
	function loadScenarioExampleList(){
		
		m_error="";
		
		examplesListFile=configModule.getExamplesList();
		
		// Load file languages content
		var jqxhr=$.get(examplesListFile, function(data){
			
			var lflines = data.split('\n');
			
			// Removes the header
			lflines.shift();			

			// preserves the contents in this variable
			m_scenario_list=lflines;
			
			scenarioExampleListLoaded();
		});
		
		// Set another completion function for the request above
		jqxhr.fail(function() {
		  m_error=languageModule.getCaption("AC_ERROR_READING_FILE");;
		  scenarioExampleListLoaded();		  
		});	
	}
	
	
	// Once the scenario list file is loaded build the list to show
	function scenarioExampleListLoaded(){
		
		var listElement=document.getElementById("ScenarioList");
		
		if (m_error.localeCompare("")!=0){
			listElement.innerHTML=htmlBuilder.wrapErrorMsg(languageModule.getCaption("AC_ERROR_LOADING_EXAMPLE_LIST"));
		}else{

			m_scenario_filter_list=new Array();
			
			var html_list='<ul>';
			
			for (var l=0; l < m_scenario_list.length; l++){
				var exampleLine=m_scenario_list[l];
				
				if (exampleLine.localeCompare("")!=0){
					var example=exampleLine.split(SEP);
					var name=example[0];
					var file_name=example[1];
					m_scenario_filter_list.push(file_name);
					
					if (l==0){
						html_list+='<li id="ScenarioListItem'+l+'" class="ScenarioSelected" onClick="applicationController.selectExample('+l+');">' + name + '</li>';
						m_selected_example=0;
					}else{
						html_list+='<li id="ScenarioListItem'+l+'" onClick="applicationController.selectExample('+l+');">' + name + '</li>';	
					}
				}
			}
			
			html_list+='</ul>';
			
			listElement.innerHTML=html_list;
		}
	}	
	
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************
	this.openButton=openButton;
	this.settingsButton=settingsButton;
	this.selectExample=selectExample;
	this.FilterList=FilterList;
	this.OpenLocalFile=OpenLocalFile;
	
	this.openScenarioExample=openScenarioExample;
	this.openLocalScenario=openLocalScenario;
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	// Dialog used to open a Local File
	function OpenLocalFile(){
		
		m_selected_example=-1;
		
		var m_fhandle = new FileHandler();
		
		if(m_fhandle.isEnabled()){
			applicationView.showOpenLocalScenarioDialog();
		}else{
			applicationView.displayError(htmlBuilder.wrapErrorMsg(m_fhandle.getError()));
		}
	}
	
	// Method used to open the local file selected by the user
	function openLocalScenario(){
		
		var theScenariofile=document.getElementById('LocalScenarioFile');
		
		var theScenarioImages=document.getElementById('ScenarioImagesFile');
		
		// Check made for IE
		if (!theScenariofile.files || !theScenarioImages.files){
			applicationView.closeOpenLocalScenarioDialog();
			
			applicationView.displayError(htmlBuilder.wrapErrorMsg(languageModule.getCaption("SB_ERROR_NOT_SELECTED_FILE")));
		}else{
			if (!scenarioModelBuilder.openLocalFile(theScenariofile, theScenarioImages)){
				
				applicationView.closeOpenLocalScenarioDialog();
				
				applicationView.displayError(htmlBuilder.wrapErrorMsg(scenarioModelBuilder.getError()));
				
			}else{
				applicationView.closeOpenLocalScenarioDialog();	
			}		
		}
		
	}
	
	// Method used to filter the list of scenario examples
	function FilterList(){
		
		var keywords= new String();
		
		keywords=document.getElementById("btscenario_filterkeyword").value;
			
		keywords=keywords.trim();
		
		keywords=keywords.toLowerCase();
			
		if (keywords.localeCompare("")!=0){
	
			var keyword=keywords.split(" ");
			
			var listElement=document.getElementById("ScenarioList");
			
			var html_list='<ul>';
			
			var counter=0;
			
			m_scenario_filter_list=new Array();
			
			for (var l=0; l < m_scenario_list.length; l++){
				var exampleLine=m_scenario_list[l];
				
				if (exampleLine.localeCompare("")!=0){
					var example=exampleLine.split(SEP);
					var name=example[0];
					var file_name=example[1];
					
					if (checkFilter(keyword, name)){
						if (counter==0){
							html_list+='<li id="ScenarioListItem'+counter+'" class="ScenarioSelected" onClick="applicationController.selectExample('+counter+');">' + name + '</li>';
							m_selected_example=0;
						}else{
							html_list+='<li id="ScenarioListItem'+counter+'" onClick="applicationController.selectExample('+counter+');">' + name + '</li>';	
						}
						
						m_scenario_filter_list.push(file_name);
						counter++;
					}
				}
			}
			
			html_list+='</ul>';
			
			listElement.innerHTML=html_list;			
			
		}else{
			if(keywords.localeCompare("")==0){
				scenarioExampleListLoaded();
			}			
		}
	}
	
	// Method to check if the user filter match the scenario name
	function checkFilter(keyword, name ){
		
		var title=name;
		
		title=title.toLowerCase();
		
		for (var x=0; x < keyword.length; x++){
			
			var key=keyword[x].trim();
			
			if (key.localeCompare("")!=0){
				
				if (title.search(key)>=0){
					return true;
				}
			}
		}
		
		return false;
	}
	
	// Method used to update the current selected scenario example
	// Triggered when the user use the mouse or the finger to select an example
	function selectExample(index){
		
		var listItem=document.getElementById("ScenarioListItem" + index);
		
		var previouslistItem=document.getElementById("ScenarioListItem" + m_selected_example);
		
		previouslistItem.className="";
		
		listItem.className="ScenarioSelected";
		
		m_selected_example=index;		
	}
	
	// Dialog used to show the setting options
	// Triggered when the user use the Settings Button
	function settingsButton(){
		applicationView.showSettingsDialog();
	}
	
	// Dialog that show the list of scenario examples
	// Triggered when the user press the Open Button
	function openButton(){

		scenarioController.stopButton();
		
		applicationView.showOpenScenarioDialog();
		
		m_selected_example=-1;
		
	    loadScenarioExampleList();
	}
	
	// Method used to open the current selected scenario example
	function openScenarioExample(){

		var file_name=m_scenario_filter_list[m_selected_example];
		
		applicationView.setProgressBar();
			
		scenarioView.clearScenarioView();
		
		scenarioView.disableScenarioCommands();
		
		scenarioModelBuilder.loadScenarioRemoteFile(configModule.getScenarioPath() + file_name);
	}
	
	// ******************************************************************************
	// Events Listeners
	// ******************************************************************************
	
	// The language file has been loaded, therefore the module can be initiated
	$(window).on( "LanguageFileLoaded", initializeLanguageModule);
	
	// Trigger when the schema file couldn't be loaded
	$(window).on( "SchemaFileLoadingError", schemaFileLoadingError);
		
	// Listen for the event on load (everything is download from the server) 
	$(window).on( "load", setupApplication);	
	
	// ******************************************************************************
	// Call back functions
	// ******************************************************************************
	
	function initializeLanguageModule(e){		
		
		// Initialize the Language Module
		if (languageModule.initialize()){
			
			// Activate application commands layout and use Language Module to set Captions
			applicationView.initLayout();
			
			// Is mandatory to call to application setup
			setupApplication(null);
			
			if (console && debug){
				console.log("Language Module Initialization Succeded");	
			}
			
		}else{
			applicationView.displayError(languageModule.getError());		
			
			if (console){
				console.error("Language Module Error: " + languageModule.getError());
			}
		}
	}
	
	// Starting Process:
	// Every Thing that needs to be done before running the application
	// This function is called when all the scripts have been download and the languageModule has been initialized
	function setupApplication(e){
		if (appState==appConstants.STARTING){
			appState=appConstants.LOADED;
		}else if (appState==appConstants.INITIATED){
			//Application already Setup
		}

		// Once both things are ready the function is executed
		if(appState==appConstants.LOADED && languageModule.getState()==languageModule.INITIALIZED){
			if (console && debug){
				console.log("setupApplication started");
				console.log("Selected Language: " + configModule.getLang());
				console.log("User Type: " + configModule.getUserMode());
			}
			
			// Show progress bar until schema and scenario file are both download
			applicationView.setProgressBar();
			
			// Disable ajax cache
			$.ajaxSetup({ cache: false });
			
			// Load Scenario Schema
			scenarioSchema=new Schema();
			scenarioSchema.loadSchema(configModule.getDefaultSchema());

			// Create Scenario View
			scenarioView= new ScenarioView();
			
			// Create Scenario Controller
			scenarioController= new ScenarioController();
			
			// Create Scenario Model Builder
			scenarioModelBuilder = new ScenarioModelBuilder();
			scenarioModelBuilder.loadScenarioRemoteFile(configModule.getDefaultScenario());

			appState=appConstants.INITIATED; 	
			
			// Preload the images used by the application
			preloadAppImages();
			
			if (console && debug){
				console.log("setupApplication Acomplished");
			}
		}
	}	
	
	// Preload application images
	function preloadAppImages(){
		if (!appImagesLoaded){
			
			for (var x=0; x < appImagesNames.length; x++){

				var m_img = new AppImage(configModule.getAppImgPath() + appImagesNames[x]);
				
			}	
			
			appImagesLoaded=true;			
		}
	}
	
	// Handle Schema File Loading Error
	function schemaFileLoadingError(e){
		applicationView.removeProgressBar();
		applicationView.disableApplicationCommands();
		applicationView.displayError('<div id="msg" class="error">' + languageModule.getCaption("AC_ERROR_DOWNLOADING_SCHEMA") + '</div>');		
	}	
	
}




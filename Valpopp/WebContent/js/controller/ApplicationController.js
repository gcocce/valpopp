console.log("ApplicationController Script");

/* Responsabilities:
 * 
 * Capture User Interface Events and Trigger Actions
 * Resolve Application Events
 */

function ApplicationController(){	
	// ******************************************************************************
	// Properties
	// ******************************************************************************
	var m_error="";
	
	var m_open_dialog=null;
	
	// The contento of the list file
	var m_scenario_list=new Array();
	
	// A list with the file names
	var m_scenario_filter_list=new Array();
	
	var m_selected_example=-1;
	
	var SEP=";";
	
	var appImagesLoaded=false;
	
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
	// Start Application Setup
	function startApplicationSetup(){
		console.log("ApplicationController.startApplicationSetup");
		
		setupApplication(null);
	}
	
	// This method load the contents of the list.csv file which contains the scenario list
	function loadScenarioExampleList(){
		// Load file languages content
		var jqxhr=$.get('scenarios/list.csv', function(data){
			
			var lflines = data.split('\n');
			
			// Removes the header
			lflines.shift();			

			// preserves the contents in this variable
			m_scenario_list=lflines;
			
			scenarioExampleListLoaded();
		});
		
		// Set another completion function for the request above
		jqxhr.fail(function() {
		  m_error="Error reading file!";
		  scenarioExampleListLoaded();		  
		});	
	}
	
	// Once the scenario list file is loaded build the list to show
	function scenarioExampleListLoaded(){
		
		var listElement=document.getElementById("ScenarioList");
		
		if (m_error.localeCompare("")!=0){
			listElement.innerHTML=utils.wrapErrorMsg("Ups! Something went worng while loading the list!");
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
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	function FilterList(){
		console.log("ApplicationController Filter List");
		
		var keywords= new String();
		
		keywords=document.getElementById("btscenario_filterkeyword").value;
			
		keywords=keywords.trim();
		
		keywords=keywords.toLowerCase();
			
		if (keywords.localeCompare("")!=0){
			console.log("some keywords");
	
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
	
	function selectExample(index){
		console.log("selectExample:"+index);
		
		var listItem=document.getElementById("ScenarioListItem" + index);
		
		var previouslistItem=document.getElementById("ScenarioListItem" + m_selected_example);
		
		previouslistItem.className="";
		
		listItem.className="ScenarioSelected";
		
		m_selected_example=index;		
	}
	
	// Button Controllers
	function settingsButton(){
		console.log("settingsButton");
		
		var dialog=$("#maindialog").show();
		
	    $("#maindialog").dialog({ 
	        modal: true,
	        width: 300,
	        height: 400,
	        position: {  my: "center", at: "center", of: window  },
	        title: "Settings",
	        buttons:{
				"Dismiss": function() {
					$(this).dialog("close");
				}
	        },
			close: function( event, ui ) {}
	    });
	    
	    $("#maindialog").html("");
	    
	    dialog.dialog("open");
	}
	
	function openButton(){
		console.log("openButton");
		
		scenarioController.stopButton();
		
		m_selected_example=-1;
		
	    loadScenarioExampleList();		
		
	    var width = window.innerWidth * 0.8;
	    var height = window.innerHeight * 0.8;
	    
	    if (width > 500){
	    	width = 500;
	    }
	    
	    if (height > 400){
	    	height = 400;
	    }
	    
		var m_open_dialog=$("#maindialog").show();
		
		m_open_dialog.dialog({ 
	        modal: true,
	        width: width,
	        height: height,
	        position: {  my: "center", at: "center", of: "#vScenario"  },
	        title: "Load Scenario",
	        buttons:{
				"Select": function() {
					$("#maindialog").dialog("close");					
					openScenarioExample();
				},
				"Cancel": function() {
					$(this).dialog("close");
				}				
	        },
			close: function( event, ui ) {}
	    });
	    
	    m_open_dialog.html(utils.getScenarioListLoading());
	    
    
	    m_open_dialog.dialog("open");		
	}
	
	function openScenarioExample(){
		console.log("openScenarioExample selected Item: " + m_selected_example);
		
		var file_name=m_scenario_filter_list[m_selected_example];
		
		console.log("File: " + file_name);
		
		applicationView.setProgressBar();
			
		scenarioView.clearScenarioDisplay();
		scenarioView.disableScenarioCommands();
		
		scenarioModelBuilder.loadScenarioRemoteFile(configModule.getScenarioPath()+ file_name);
	}


	
	// ******************************************************************************
	// Events Listeners
	// ******************************************************************************
	
	// Events handled by the ApplicationController 
	$(window).on( "LanguageFileLoaded", initializeLanguageModule);
	
	$(window).on( "SchemaFileLoadingError", applicationView.disableApplicationCommands);
		
	$(window).on( "ScenarioLoaded", preloadAppImages);
	
	// ******************************************************************************
	// Call back functions
	// ******************************************************************************
	

	
	function initializeLanguageModule(e){		
		console.log("ApplicationController.initializeLanguageModule");
		
		// Test Language Module
		if (languageModule.initialize()){
			// Activate application commands layout
			applicationView.initLayout();
			
			// Is mandatory to call to application setup
			startApplicationSetup();
			
			console.log("Language Module Initialization Succeded");
		}else{
			applicationView.displayError(languageModule.getError());		
			
			console.log("Language Module Error: " + languageModule.getError());
		}
	}
		
	
	function preloadAppImages(){
		if (!appImagesLoaded){
			console.log("Preload application images");
					
			for (var x=0; x < appImagesNames.length; x++){
				
				console.log("preload appImage: "+ appImagesNames[x])

				var m_img = new AppImage(configModule.getAppImgPath() + appImagesNames[x]);
				
			}	
			appImagesLoaded=true;			
		}
	}
	
}















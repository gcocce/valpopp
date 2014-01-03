
/* This class is intended to handle the scenario */

/* Responsibilities:
 * 
 * Load Scenario File
 * 
 * Validate Scenario File
 * 
 * Build Scenario Model from Scenario File
 * 
 * Complete Scenario Model with default values
 * 
 * Check Images Existence and Download them
 * 
 */

function ScenarioModelBuilder() {

	// ******************************************************************************
	// Constants
	// ******************************************************************************
	
	// Possible Scenario States
	var SCENARIO_OK=0;
	var SCENARIO_NOTLOADED=1;
	var SCENARIO_LOADED=2;
	var SCENARIO_INVALID=3;
	var SCENARIO_LOADING_ERROR=4;
	var SCENARIO_IMG_LOADING_ERROR=5;

	this.SCENARIO_OK=SCENARIO_OK;
	this.SCENARIO_NOTLOADED=SCENARIO_NOTLOADED;
	this.SCENARIO_LOADED=SCENARIO_LOADED;
	this.SCENARIO_INVALID=SCENARIO_INVALID;
	this.SCENARIO_LOADING_ERROR=SCENARIO_LOADING_ERROR;	
	this.SCENARIO_IMG_LOADING_ERROR=SCENARIO_IMG_LOADING_ERROR;
	
	// *** Scenario Types ***
	// Remote Scenario, those that are in the server, the scenario examples
	var SCENARIO_REMOTE=9;
	// Local Scenario, the scenario provided by the user
	var SCENARIO_LOCAL=10;
	
	this.SCENARIO_REMOTE=SCENARIO_REMOTE;
	this.SCENARIO_LOCAL=SCENARIO_LOCAL;

	// ******************************************************************************
	// Properties
	// ******************************************************************************
	
	// A regular expresion used to validate the type of file (actually not used)
	var m_file_type="text.*";

	// Private Variables
	var m_valid=true;

	// The content of the scenario file loaded
	var m_file_content="";

	// File Handler
	var m_fhandle = new FileHandler();

	// Error message
	var m_error="";
	var m_output="";

	// The schema as a string loaded initially with the page
	var m_scenario_state=SCENARIO_NOTLOADED;
	
	var m_scenario_type=SCENARIO_REMOTE;

	// The structure of the scenario as a JavaScript Object (actually using scenario_obj)
	var m_scenario_obj=null;
	
	// Reference to the ScenarioContext
	var m_scenarioContext=new ScenarioContext();
	
	// Number of node images processed during scenario loading
	var m_node_images_processed=0;
	
	// Number of Scenrio Images
	var m_scenario_images=0;
	
	// Number of scenario images processed during loading
	var m_scenario_images_processed=0;
	
	// Reference of the Scenario Images in the case of a local scenario file
	var m_scenario_local_images= null;
	
	// The number of images to be load in the case of a local scenario file
	var m_scenario_total_local_images=0;
	
	// The number of images processed in the case of a local scenario file
	var m_scenario_local_images_procesed=0;
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
      
	// Method for validates node data, validates that node ids are unique
      function validateNodes(nodes) {
        for (var x = 0; x < nodes.length; x++) {
           // NotNeeded
        	m_output += '<span>Node Id =' +  nodes[x].Id + ' Name: ' + nodes[x].name + '</span><br/>';
           
           var id=nodes[x].Id;
                   
           // We check if the node id is unique
           var items = jQuery.grep(nodes, function (node) { return node.Id == id; });
           
           if (items.length!=1) {
        	   m_error = htmlBuilder.wrapErrorMsg("Node Id repeated, it must be unique.");
              return false;
           }
        }      
        
        return true;
      }
      
      // Method for validate Sequence data, validates that
      // each sequence is the last one or it points to another sequence
      // if it points to another sequence validates that the next sequence has a higher Id
      // it validates that the sequence pointed to exists in the model
      // it check that each sequence has a unique id
      function validateSequences(sequences) {
        for (var x = 0; x < sequences.length; x++) {
        	
           // NotNeeded
        	m_output += '<br/><span>Sequence Id =' +  sequences[x].Id + ' nextId: ' + sequences[x].nextId + '</span><br/>';
        	m_output += '<br/><span>Messages:</span><br/>';
           
           var id=sequences[x].Id;
           var nextId=sequences[x].nextId;
           
           // Check that scenario id is less than nextId
           if (id >= nextId && nextId!=0) {
        	   m_error=  htmlBuilder.wrapErrorMsg("Sequence Id="+ id +" is greater or equal than nextId "+ nextId +", it must be the opposite unless nextId is 0.");
               return false;
           }
           
           // Check that nextId exists
           if (nextId!=0) {
              // Check if the nextId exists as a Sequence Id
              var items = jQuery.grep(sequences, function (sequence) { return sequence.Id == nextId; });
              
              if (items.length<1) {
                 m_error=htmlBuilder.wrapErrorMsg("nextId "+ nextId +" does not point to an existing sequence Id.");
                 return false;
              }                
           }

           // Check if the sequence id is unique
           var items = jQuery.grep(sequences, function (sequence) { return sequence.Id == id; });
           
           if (items.length!=1) {
              m_error=htmlBuilder.wrapErrorMsg("Sequence Id repeated, it must be unique.");
              return false;
           }         
           
           // Check messages validity
           if (!validateMessages(m_scenario_obj.sequences[x].messages)) {
              return false;
           }
           
           // If there is a MCQ Check MCQ validity
           if (m_scenario_obj.sequences[x].mcq){
               if (!validateMCQ(m_scenario_obj.sequences[x].mcq)) {
                   return false;
                }           	   
           }
        }
        
        return true;
      }
      
      // Method for validate List of Messages validity, y validate that:
      // Source and Destination node are different
      // Source and Destination node number belong to the number of nodes of the model
      function validateMessages(messages) {      
        for (var y= 0; y < messages.length; y++) {
           
           // Check that a messages does not have same source and destination
           if (messages[y].srcN==messages[y].destN) {
              m_error=htmlBuilder.wrapErrorMsg("Source and destination node of a message can not be the same.");
              return false;
           }
           
           //TODO:
           //Source and Destination node number belong to the number of nodes of the model
           
           
           
           // Not important for validation
           if (messages[y].param) {
              m_output += '<span>Message =' +  messages[y].name + '(' + messages[y].param + ')  srcN: ' + messages[y].srcN +' destN: ' + messages[y].destN + '</span><br/>';
           }else{
        	   m_output += '<span>Message =' +  messages[y].name + ' srcN: ' + messages[y].srcN +' destN: ' + messages[y].destN + '</span><br/>';   
           }
        }
           
        return true;
      }
      
      // Method for validate MCQ, validate that:
      // It has at least one right answer if it is not a "pathSelector"
      function validateMCQ(mcq) {

        
        if(mcq.pathSelector){
        	mcq.pathSelector=true;
        	
            var hasNextId=true;
            
        	// Every Answer should have a nextId
            for (var x= 0; x < mcq.answers.length; x++) {
                // Check if the answer is valid
                if (!mcq.answers[x].nextId) {
                	hasNextId=false;
                }
             }
            
            if (!hasNextId){
            	m_output += '<span>MCQ of title: ' + mcq.title + ', every answer should has a nextId.</span><br/>';
           	    m_error=htmlBuilder.wrapErrorMsg("MCQ of title: " + mcq.title + ", every answer must have a nextId element.");
               return false;            	
            }
        	
        }else{
            var valids=0;
            
            for (var x= 0; x < mcq.answers.length; x++) {
                // Check if the answer is valid
                if (mcq.answers[x].valid=="y") {
                   valids++;
                }
             }
           
             if (valids==0) {
          	   m_output += '<span>MCQ of title: ' + mcq.title + ', must have at least one valid answer.</span><br/>';
                 m_error=htmlBuilder.wrapErrorMsg("MCQ of title: " + mcq.title + ", must have at least one valid answer.");
                return false;
             }        	
        }
        
        return true;
      }	
      
    // Initiate the download of the nodes images in the case of a Remote Scenario
	function getRemoteNodeImages(){

		var nodes= m_scenario_obj.nodes;

        for (var x = 0; x < nodes.length; x++) {
        	// Download and validate image
        	m_scenarioContext.setNodeImg(x, nodes[x].img, configModule.getScenarioImgPath() + nodes[x].img);
         }
		
		return true;
	}
	
	// Load the node images in the case of a Local Scenario
	function getLocalNodeImages(){
		
		var nodes= m_scenario_obj.nodes;
		m_error="";
		
        for (var x = 0; x < nodes.length; x++) {
        	// Download and validate image
            m_scenarioContext.setNodeImg(x, nodes[x].img, m_scenario_local_images[nodes[x].img]);
         }
        		
		return true;		
	}

	// Method used to initiate variables used by the class before loading an Scenario
	function initModel(){
		if (console && debug){
			console.log("ScenarioModelBuilder.initModel()");
		}
		
		m_node_images_processed=0;
		
		// Init context if it already exists
		if (m_scenarioContext){
			m_scenarioContext.initContext();
		}
	}
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************
  	this.getError=getError;
	this.getState=getState;
	this.getContents=getContents;
	this.setContents=setContents;
	this.getOutput=getOutput;
	this.getContext=getContext;
		
    this.validateScenario=validateScenario;
    this.performAdditionalValidations=performAdditionalValidations;
	this.loadScenarioRemoteFile=loadScenarioRemoteFile;
	this.openLocalFile=openLocalFile;
	this.normalizeScenario=normalizeScenario;
	this.getRemoteNodeImages=getRemoteNodeImages;
	

	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************

	// Performs the additional validations
	function performAdditionalValidations(){
		m_error="";
		
        var title=m_scenario_obj.name;
        m_output="";
     
        m_output='<span>Nodes: </span><br/>';
        
        if (!validateNodes(m_scenario_obj.nodes)) {
           return false;
        }
             
        m_output+='<br/><span>Sequences: </span><br/>';

        if (!validateSequences(m_scenario_obj.sequences)) {
           return false;
        }
                
        return true;
	}
	
	
	function getContext(){
		return m_scenarioContext;
	}
	
	function getOutput(){
		return m_output;
	}
	
	function getContents() {
		return m_file_content;
	}

	
	function setContents(arg){
		m_file_content=arg;
		
		// Create Scenario Object
		m_scenario_obj=JSON.parse(m_file_content);
	}
	
	function getError() {
		return m_error;
	}
	
	function getState(){
		return m_scenario_state;
	}
	
	// Initiate Scenario Normalization, it involves the use of default values to complete the model
	function normalizeScenario(){
		m_scenarioContext.normalizeScenario();
	}
	
	/* Validate scenario against schema and then perform additional validations
	 * 
	 * returns true if it is ok, false in other case
	 * a message error is set in the m_error variable
	 * 
	 * if both validations are right starts node images download
	 * 
	 */
	function validateScenario(){
		if (console && debug){
			console.log("scenarioModelBuilder.validateScenario");
		}
		
		if(!scenarioSchema.validateScenario(m_file_content)){
			m_error=scenarioSchema.getError();
			m_scenario_state=SCENARIO_INVALID;
			return false;
		}
		
		m_scenario_obj=JSON.parse(m_file_content);
		
		if(!performAdditionalValidations()){
			m_scenario_state=SCENARIO_INVALID;
			return false;
		}	
		
		m_scenarioContext.setScenario(m_scenario_obj);
		
		m_scenario_state=SCENARIO_OK;

		return true;
	}

	// Asynchronous method to load the scenario file
	function loadScenarioRemoteFile(file){
		
		m_scenario_type=SCENARIO_REMOTE;
			
		// Load Scenario File
		if (console && debug){
			console.log("loadScenarioRemoteFile: " + file);
		}
		
		initModel();

		jQuery.getJSON(file, function(data) {
			m_file_content=JSON.stringify(data);

			m_scenario_state=SCENARIO_LOADED;
			
			// Dispatch the event
			var event = $.Event( "RemoteScenarioFileLoaded" );
			$(window).trigger(event);
		})
		.error(function() {
			m_error="There was an error while attempting to download the SCENARIO file.";
			
			if (console){
				console.error(m_error);
			}

			m_scenario_state=SCENARIO_LOADING_ERROR;
			
			var event = $.Event( "RemoteScenarioFileLoadingError" );
			$(window).trigger( event );			
		});	
	}
	
	// Asynchronous method to load a local scenario and it images
	function openLocalFile(thefile, theimages){
	
		// Initiate variables
		m_scenario_local_images= new Array();

		m_scenario_local_images_procesed=0;
		
		m_scenario_type=SCENARIO_LOCAL;
		
		m_scenario_state=SCENARIO_NOTLOADED;
		
		m_scenario_total_local_images=theimages.files.length;
		
		//console.log("Total local images: " + m_scenario_total_local_images);
		
        // Get File Object
        var fPointer = thefile.files[0];
        
        if (fPointer) {
			// If File and FileReader are available (the browser has implemented the html5 standard to manipulate local files)
			if (m_fhandle.isEnabled()){
				
				// Read the local file using FileHandler Class
				// The call back function should process the file after it is read
				if (m_fhandle.openJsonFile(fPointer, readLocalScenarioCallback)){
					
					applicationView.setProgressBar();
					
					scenarioView.clearScenarioView();
					
					scenarioView.disableScenarioCommands();
					
					for (var x=0; x < theimages.files.length; x++){
						if (!m_fhandle.openImageFile(theimages.files[x])){
							
							m_error=m_fhandle.getError();
						}
					}
					
					return true;
				}else{
					m_error=m_fhandle.getError();
					return false;
				}
			}else{
		    	// The html5 standard is not fully implemented in the browser
				m_error=m_fhandle.getError();
				return false;
			}
        } else {
            m_error="It seems that there is no selected file!";
            
            if (console){
            	console.error(m_error);
            }
            
            return false;
        }
	}

	//***************************************************************************
	// Events Listeners for Loading Process
	//***************************************************************************
		
	// Trigger when the a remote scenario file is already loaded
	$(window).on( "RemoteScenarioFileLoaded", initializeScenarioValidation);
	
	// Trigger when the schema file is already loaded the first time during the application initialization
	$(window).on( "SchemaFileLoaded", initializeScenarioValidation);	
	
	// Trigger when the schema file couldn't be loaded
	$(window).on( "SchemaFileLoadingError", schemaLoadingError);
	
	// Trigger when the scenario file couldn't be loaded
	$(window).on( "RemoteScenarioFileLoadingError", remoteScenarioLoadingError);
	
	// Trigger when all the nodes images download attempt has been processed
	$(window).on( "ScenarioNodeImgsProccessed", scenarioNodeImgProcessed);
	
	// Triggered when one node image of a remote scenario has been download successfully
	$(window).on( "RemoteNodeImageLoaded", scenarioNodesImgCtrl);
	
	// Triggered when there was an error while downloading one node image of a remote scenario
	$(window).on( "RemoteNodeImageLoadingError", scenarioNodesImgCtrl);	
	
	// Triggered when one scenario image of a remote scenario has been download successfully
	$(window).on( "RemoteScenarioImageLoaded", scenarioImgCtrl);
	
	// Triggered when there was an error while downloading one scenario image of a remote scenario
	$(window).on( "RemoteScenarioImageLoadingError", scenarioImgCtrl);	
	
	// Triggered when one Local Scenario Image has been loaded successfully
	$(window).on( "LocalScenarioImageLoaded", readLocalImageFile);
	
	// Triggered when there was an error while loading one Local Scenario Image
	$(window).on( "LocalScenarioImageLoadingError", readLocalImageFileError);
	
	
	//***************************************************************************
	// Call back function for loading process
	//***************************************************************************
	
	// Function to validate the default scenario loaded the first time any user start the application
	// This function is called two times until both schema and scenario are already download
	// If the syntax and logic of the scenario is ok it will automatically initiate the nodes images download
	// Once the images are download the event ScenarioNodeImgsProccessed is triggered
	function initializeScenarioValidation(){
		if (console && debug){
			console.log("ApplicationController.initializeScenarioValidation");
		}
		
		if(scenarioSchema.getState()==scenarioSchema.SCHEMA_LOADED && scenarioModelBuilder.getState()==scenarioModelBuilder.SCENARIO_LOADED){	
			if (!scenarioModelBuilder.validateScenario()){
				
				// If there is an error
				applicationView.removeProgressBar();
				
				if (configModule.getUserMode().localeCompare("editor")==0){
					scenarioView.displayError(scenarioModelBuilder.getError());
				}else{
					scenarioView.displayError(htmlBuilder.wrapErrorMsg("Scenario is not Valid!"));
				}
				
				return;
			}else{
				
				// Proceeds downloading the node images
				if(!getRemoteNodeImages()){
					if (configModule.getUserMode().localeCompare("editor")==0){
						scenarioView.displayError(scenarioModelBuilder.getError());
					}else{
						scenarioView.displayError(htmlBuilder.wrapErrorMsg("Scenario is not Valid!"));
					}
				}
			}
		}else{ 
			// In the case one of the files is not ready
			if (console && debug){
				console.log("Scenario schema or scenario file not ready");
				console.log("Scenario State: " + scenarioModelBuilder.getState());
				console.log("Schema State: " + scenarioSchema.getState());				
			}
		}	
	}
	
	function schemaLoadingError(e){
		scenarioView.disableScenarioCommands();
	}
	
	function remoteScenarioLoadingError(e){
		applicationView.removeProgressBar();
		
		scenarioView.disableScenarioCommands();

		scenarioView.displayError(htmlBuilder.wrapErrorMsg(scenarioModelBuilder.getError()));
	}
	
	// Initiate Scenario Display if all images has been downloaded
	// If one file is missing show error
	function scenarioNodeImgProcessed(e){
		
		applicationView.removeProgressBar();
		
		if (scenarioModelBuilder.getState()==scenarioModelBuilder.SCENARIO_OK){
			// In this case nodes images has been downloaded correctly.
			
			scenarioModelBuilder.normalizeScenario();
			
			// Indicate to the controller to set the context
			scenarioController.setScenarioContext(scenarioModelBuilder.getContext());

			// Preload the others scenario images
			preloadScenarioImages();
		}else{
			scenarioView.displayError(htmlBuilder.wrapErrorMsg(scenarioModelBuilder.getError()));
			return;
		}
	}	


	// Control Nodes Images Download and trigger ScenarioNodeImgsProccessed event when all files has been processed
	function scenarioNodesImgCtrl(e){
		m_node_images_processed++;
		
		// It finish when all the images nodes are processed
		if (m_node_images_processed==m_scenarioContext.getNumberofNodes()){
			m_error="";
			
			if (console && debug){
				console.log("Check for Nodes Images State");
			}
		
			for (var x=0; x < m_scenarioContext.getNumberofNodes(); x++){
				
				var scimg=m_scenarioContext.getNodeImg(x);
				
				if (scimg.getState()!=scimg.IMG_OK){
					m_scenario_state=SCENARIO_IMG_LOADING_ERROR;
					
					//console.log("Error downloading image for node number: " + (x + 1) + ", file name: "+ scimg.getName());
					m_error+="Error downloading image for node number: " + (x + 1)  + ", file name: "+ scimg.getName()+ "<br>";
				}
			}
						
			// Dispatch ScenarioNodeImgsProccessed Event
			var event = $.Event( "ScenarioNodeImgsProccessed" );
			$(window).trigger( event );	
		}
	}
	
	// Preload the images of the scenario
	function preloadScenarioImages(e){
		m_scenario_images=0;
		m_scenario_images_processed=0;
		
		// Count the amount of images of the scenario
		// For the first mandatory image of the scenario
		m_scenario_images++;
		
		// For every other images of the scenario
		for (var x=0; x < m_scenario_obj.sequences.length; x++){
			var messages=m_scenario_obj.sequences[x].messages;
			
			for (var y=0; y < messages.length; y++){
				
				if (messages[y].scenImg){
					m_scenario_images++;
				}
			}
		}

		// If it is the case of a Remote Scenario
		if (m_scenario_type==SCENARIO_REMOTE){
			// Start downloading the images
			m_scenarioContext.setScenarioImg(m_scenario_obj.img, configModule.getScenarioImgPath() + m_scenario_obj.img);
			
			for (var x=0; x < m_scenario_obj.sequences.length; x++){
	
				var messages=m_scenario_obj.sequences[x].messages;
				
				for (var y=0; y < messages.length; y++){
					
					if (messages[y].scenImg){
						m_scenarioContext.setScenarioImg(messages[y].scenImg, configModule.getScenarioImgPath() + messages[y].scenImg);
					}
				}
			}
		}else{ // If it is the case of a Local Scenario
			// Assign the images already loaded to the context
			m_scenarioContext.setScenarioImg(m_scenario_obj.img, m_scenario_local_images[m_scenario_obj.img]);
			
			for (var x=0; x < m_scenario_obj.sequences.length; x++){
	
				var messages=m_scenario_obj.sequences[x].messages;
				
				for (var y=0; y < messages.length; y++){
					
					if (messages[y].scenImg){
						m_scenarioContext.setScenarioImg(messages[y].scenImg, m_scenario_local_images[messages[y].scenImg]);
					}
				}
			}
		}
		
	}
	
	// Control the download of the scenario images images
	function scenarioImgCtrl(e){		
		m_scenario_images_processed++;
		
		// Once all the images has been processed
		if (m_scenario_images_processed==m_scenario_images){
			var there_is_error=false;
			
			//console.log("Check scenario images");
			
			var list=m_scenarioContext.getScenarioImgList();
			
			m_error="";
			
			for (key in list) {
				
				var img=list[key];
								
				// If the images has not been found
				if (img.getState()!=img.IMG_OK){
					there_is_error=true;
					m_error+="Error downloading image: "+ img.getName() + "<br>";
				}				
			}			
			
			if (there_is_error){
				scenarioView.displayError('<div id="msg" class="error">'+m_error+'</div>');
			}
			
		}
	}
	
	// Executed when the Local Scenario File has been read
	function readLocalScenarioCallback(e){
		
		m_scenario_state=SCENARIO_LOADED;
		
		var file_contents=e.target.result;
		
		setContents(file_contents);
		
		initModel();
		
		if(scenarioSchema.getState()==scenarioSchema.SCHEMA_LOADED){
			
			if (!validateScenario()){
				
				applicationView.removeProgressBar();
				
				if (configModule.getUserMode().localeCompare("editor")==0){
					
					scenarioView.displayError(scenarioModelBuilder.getError());
					
				}else{
					
					scenarioView.displayError(htmlBuilder.wrapErrorMsg("Scenario is not Valid!"));
				}
			}
		}else{ 
			if (console){
				console.error("Schema State: " + scenarioSchema.getState());
			}
			
			scenarioView.displayError(htmlBuilder.wrapErrorMsg("Scenario Schema is not Valid!"));
		}			
	}
	
	// Process the images files read, add them to m_scenario_local_images array
	// count the number of images processed, once all of them are processed
	// initiate the scenario image validation process if the scenario file is valid.
	function readLocalImageFile(e){
		processLocalImages(e, true);
	}
	
	function readLocalImageFileError(e){
		processLocalImages(e, false);
	}
	
	// Executed each time that a local image file is processed
	// It count the number of images and when all are already processed
	// it initiate the scenario image validation process
	function processLocalImages(e, state){
	
		m_scenario_local_images_procesed++;
		
		if (state){
			
			//console.log("Local image successfully processed: " + e.imageName);
			
			var file_contents=e.imageData;
			
			var file_name=e.imageName;
			
			m_scenario_local_images[file_name]=file_contents;
			
			if (m_scenario_total_local_images==m_scenario_local_images_procesed){
				
				//console.log("All the local images has been procesed...");
				
				if (m_scenario_state==SCENARIO_OK){
					
					// Add node images to the ScenarioContext and validate node images existence		
					if (!getLocalNodeImages()){
						applicationView.removeProgressBar();
						
						scenarioView.displayError(htmlBuilder.wrapErrorMsg(getError()));
					}
				}else{
					if (console){
						console.error("The scenario file should be already validated.");
					}
				}
			}	
		}else{
			if (console && debug){
				console.log("There was an error loading the local Image: "+ e.imageName);
				console.log("Error: "+ e.imageError);
			}
		}
	}
	   
}


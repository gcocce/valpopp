/* This class is intended to handle the scenario */

/* Responsabilities:
 * 
 * Contain Scenario Data
 * Control Scenario Data
 * Validate Scenario Data
 * 
 */

function ScenarioModel() {
	console.log("Scenario Object is created.");

	// ******************************************************************************
	// Constants
	// ******************************************************************************
	var SCENARIO_OK=0;
	var SCENARIO_NOTLOADED=1;
	var SCENARIO_LOADED=2;
	var SCENARIO_LOADING_ERROR=3;
	var SCENARIO_IMG_LOADING_ERROR=4;

	this.SCENARIO_OK=SCENARIO_OK;
	this.SCENARIO_NOTLOADED=SCENARIO_NOTLOADED;
	this.SCENARIO_LOADED=SCENARIO_LOADED;
	this.SCENARIO_LOADING_ERROR=SCENARIO_LOADING_ERROR;	
	this.SCENARIO_IMG_LOADING_ERROR=SCENARIO_IMG_LOADING_ERROR;

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
	var m_fh = new FileHandler();

	// Error message
	var m_error="";
	var m_output="";

	// The schema as a string loaded initially with the page
	var m_scenario_state=SCENARIO_NOTLOADED;

	// The structure of the scenario as a JavaScript Object (actually using scenario_obj)
	var m_scenario_obj=null;
	
	var m_scenarioContext=new ScenarioContext();
	
	var m_node_images_processed=0;

	// ******************************************************************************
	// Private Methods
	// ******************************************************************************

	//TODO: perform additional validations
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
      
      function validateNodes(nodes) {
        for (var x = 0, xl = nodes.length; x < xl; ++x) {
           // NotNeeded
        	m_output += '<span>Node Id =' +  nodes[x].Id + ' Name: ' + nodes[x].name + '</span><br/>';
           
           var id=nodes[x].Id;
                   
           // We check if the node id is unique
           var items = jQuery.grep(nodes, function (node) { return node.Id == id });
           
           if (items.length!=1) {
        	   m_error = utils.wrapErrorMsg("Node Id repeated, it must be unique.");
              return false;
           }
        }      
        
        
        return true;
      }
      
      function validateSequences(sequences) {
        for (var x = 0, xl = sequences.length; x < xl; ++x) {
           // NotNeeded
        	m_output += '<br/><span>Sequence Id =' +  sequences[x].Id + ' nextId: ' + sequences[x].nextId + '</span><br/>';
        	m_output += '<br/><span>Messages:</span><br/>';
           
           var id=sequences[x].Id;
           var nextId=sequences[x].nextId;
           
           // Check that scenario id is less than nextId
           if (id >= nextId && nextId!=0) {
        	   m_error=  utils.wrapErrorMsg("Sequence Id="+ id +" is greater or equal than nextId "+ nextId +", it must be the opposite unless nextId is 0.");
               return false;
           }
           
           // Check that nextId exists
           if (nextId!=0) {
              // Check if the nextId exists as a Sequence Id
              var items = jQuery.grep(sequences, function (sequence) { return sequence.Id == nextId });
              
              if (items.length<1) {
                 m_error=utils.wrapErrorMsg("nextId "+ nextId +" does not point to an existing sequence Id.");
                 return false;
              }                
           }

           // Check if the sequence id is unique
           var items = jQuery.grep(sequences, function (sequence) { return sequence.Id == id });
           
           if (items.length!=1) {
              m_error=utils.wrapErrorMsg("Sequence Id repeated, it must be unique.");
              return false;
           }         
           
           // Check messages validity
           if (!validateMessages(m_scenario_obj.sequences[x].messages)) {
              return false;
           }
           
           // TODO: if there is a MCQ check if there is at least one answer
           // Check MCQ validity
           if (!validateMCQ(m_scenario_obj.sequences[x].mcq)) {
              return false;
           }         
           
        }
        
        return true;
      }
      
      function validateMessages(messages) {      
        for (var y= 0, yl = messages.length; y < yl; ++y) {
           
           // Check that a messages does not have same source and destination
           if (messages[y].srcN==messages[y].destN) {
              m_error=utils.wrapErrorMsg("Source and destination node of a message can not be the same.");
              return false;
           }
           
           if (messages[y].param) {
              m_output += '<span>Message =' +  messages[y].name + '(' + messages[y].param + ')  srcN: ' + messages[y].srcN +' destN: ' + messages[y].destN + '</span><br/>';
           }else{
        	   m_output += '<span>Message =' +  messages[y].name + ' srcN: ' + messages[y].srcN +' destN: ' + messages[y].destN + '</span><br/>';   
           }
           
        }
           
        return true;
      }
      
      function validateMCQ(mcq) {
        var valids=0;
        
        for (var x= 0, xl = mcq.answers.length; x < xl; ++x) {
           // Check if the answer is valid
           if (mcq.answers[x].valid=="y") {
              valids++;
           }
           
           if (valids==0) {
        	   m_output += '<span>MCQ of title: ' + mcq.title + ', must have at least one valid answer.</span><br/>';
               m_error=utils.wrapErrorMsg("MCQ of title: " + mcq.title + ", must have at least one valid answer.");
              return false;
           }
        }
      
        return true;
      }	
      
    // Initiate the download of the nodes images
	function validateImages(){
		var nodes= m_scenario_obj.nodes;
				
    	// Download and validate image
		//m_scenario_context.setScenarioImg(0,m_scenario_obj.img);
        
        for (var x = 0, xl = nodes.length; x < xl; ++x) {
        	
        	// Download and validate image
        	m_scenarioContext.setNodeImg(x, configModule.getScenarioImgPath() + nodes[x].img);
         }
		
		return true;
	}

	function initModel(){
		console.log("ScenarioModel.initModel()");
		
		m_node_images_processed=0;
	}
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************
  	this.getError=getError;
	this.getState=getState;
	this.getContents=getContents;
	this.setContents=setContents;
	this.getOutput=getOutput;
		
    this.validateScenario=validateScenario;
	this.loadScenarioRemoteFile=loadScenarioRemoteFile;
	this.loadScenarioLocalFile=loadScenarioLocalFile;

	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************

	function getOutput(){
		return m_output;
	}
	
	function getContents() {
		return m_file_content;
	}

	
	function setContents(arg){
		m_file_content=arg;
	}
	
	function getError() {
		return m_error;
	}
	
	function getState(){
		return m_scenario_state;
	}
	
	/* Validate scenario against schema and then perform aditional validations
	 * 
	 * returns true if it is ok, false in other case
	 * a message error is set in the m_error variable
	 * 
	 * if both validations are right starts node images download
	 * 
	 */
	function validateScenario(){
		console.log("scenarioModel.validateScenario.");
		if(!scenarioSchema.validateScenario(m_file_content)){
			m_error=scenarioSchema.getError();
			return false;
		}
		
		m_scenario_obj=JSON.parse(m_file_content);
		
		if(!performAdditionalValidations()){
			return false;
		}
		
		m_scenarioContext.setNumberofNodes(m_scenario_obj.nodes.length);
		m_scenario_state=SCENARIO_OK;
		
		if(!validateImages()){
			return false
		}
		
		//TODO: Update Scenario Context
		//TODO: Complete the scenario Object.

		return true;
	}

	// Asynchronous method to load the schema file
	function loadScenarioRemoteFile(file){
		// Load Scenario Schema Schema
		console.log("loadScenarioRemoteFile: " + file);
		
		initModel();

		jQuery.getJSON(file, function(data) {
			m_file_content=JSON.stringify(data);

			m_scenario_state=SCENARIO_LOADED;
			
			// Dispatch the event
			console.log("Remote Scenario File Loaded");
			var event = $.Event( "RemoteScenarioFileLoaded" );
			$(window).trigger(event);
		})
		.error(function() {
			console.error("Default SCENARIO file is not a valid json");

			m_scenario_state=SCENARIO_LOADING_ERROR;
			
			var event = $.Event( "RemoteScenarioFileLoadingError" );
			$(window).trigger( event );			
		});	
	}   


	// Start file reading, return true if there is no error
	function loadScenarioLocalFile(file) {
		
		initModel();
		
		m_valid=false;
		if (m_fh.isEnabled()) {
			if (m_fh.openFile(file, readScenarioCallback)){
				return true;
			}else{
				m_error=m_fh.getError();
				return false;
			}
		}else{
			m_error="The browser does not allow to use File and FileReader APIs.";
			console.error(m_error);
			return false;
		}
	}

	// ******************************************************************************
	// Events Listeners
	// ******************************************************************************
	
	// Events to control node image download
	$(window).on( "RemoteScenarioImageLoaded", scenarioNodesImgCtrl);	
	$(window).on( "RemoteScenarioImageLoadingError", scenarioNodesImgCtrl);	


	// ******************************************************************************
	// Call back functions
	// ******************************************************************************

	// Control Nodes Images Download and trigger event when all files has been processed
	function scenarioNodesImgCtrl(e){
		m_node_images_processed++;
		
		// It finish when all the images nodes are processed
		if (m_node_images_processed==m_scenarioContext.getNumberofNodes()){
			m_error="";
			
			console.log("Check for Img State");
		
			for (var x=0; x < m_scenarioContext.getNumberofNodes(); x++){
				
				var scimg=m_scenarioContext.getNodeImg(x);
				
				if (scimg.getState()!=scimg.IMG_OK){
					m_scenario_state=SCENARIO_IMG_LOADING_ERROR;
					
					console.log("Error downloading image for node number: " + (x + 1) + ", file name: "+ scimg.getUrl());
					m_error+="Error downloading image for node number: " + (x + 1)  + ", file name: "+ scimg.getUrl()+ "<br>";
				}
			}
						
			// Dispatch ScenarioNodeImgsProccessed Event
			var event = $.Event( "ScenarioNodeImgsProccessed" );
			$(window).trigger( event );	
		}
	}
	
	
	// This callback method is called when the file was read
	// This method start validations
	function readScenarioCallback(e) {
		console.log("Scenario file loaded.");

		var cont=e.target.result;
		m_file_content=cont;

		validateScenario();
	}    
}


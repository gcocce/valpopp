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
	var SCENARIO_NOTLOADED=0;
	var SCENARIO_LOADED=1;
	var SCENARIO_LOADING_ERROR=2;

	this.SCENARIO_NOTLOADED=SCENARIO_NOTLOADED;
	this.SCENARIO_LOADED=SCENARIO_LOADED;
	this.SCENARIO_LOADING_ERROR=SCENARIO_LOADING_ERROR;	

	// ******************************************************************************
	// Properties
	// ******************************************************************************
	
	// A regular expresion used to validate the type of file (actually not used)
	var m_file_type="text.*";

	// Private Variables
	var m_valid=false;

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
	//this.m_scenario=m_scenario;


	// ******************************************************************************
	// Private Methods
	// ******************************************************************************

	//TODO: perform additional validations
	function performAdditionalValidations(){
		m_error="";
		
        var title=scenario_obj.name;
        m_output="";
     
        m_output='<span>Nodes: </span><br/>';
        
        if (!validateNodes(scenario_obj.nodes)) {
           return false;
        }
             
        m_output+='<br/><span>Sequences: </span><br/>';

        if (!validateSequences(scenario_obj.sequences)) {
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
           if (!validateMessages(scenario_obj.sequences[x].messages)) {
              return false;
           }
           
           // TODO: if there is a MCQ check if there is at least one answer
           // Check MCQ validity
           if (!validateMCQ(scenario_obj.sequences[x].mcq)) {
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
	 */
	function validateScenario(){
		console.log("scenarioModel.validateScenario.");
		if(!scenarioSchema.validateScenario(m_file_content)){
			m_error=scenarioSchema.getError();
			return false;
		}
		
		scenario_obj=JSON.parse(m_file_content);
		
		if(!performAdditionalValidations()){
			return false;
		}		
	   	
		return true;
	}	


	// Asynchronous method to load the schema file
	function loadScenarioRemoteFile(file){
		// Load Scenario Schema Schema
		console.log("loadScenarioRemoteFile: " + file);

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
	
	


	// ******************************************************************************
	// Call back functions
	// ******************************************************************************

	// This callback method is called when the file was read
	// This method start validations
	function readScenarioCallback(e) {
		console.log("Scenario file loaded.");

		var cont=e.target.result;
		m_file_content=cont;

		validateScenario();
	}    
}





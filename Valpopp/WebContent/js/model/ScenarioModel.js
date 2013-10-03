/* This class is intended to handle the scenario */

function Scenario() {
	console.log("Scenario Object is created.");

	//******************************************************************************
	// Constants
	var SCENARIO_NOTLOADED=0;
	var SCENARIO_LOADED=1;
	var SCENARIO_LOADING_ERROR=2;

	this.SCENARIO_NOTLOADED=SCENARIO_NOTLOADED;
	this.SCENARIO_LOADED=SCENARIO_LOADED;
	this.SCENARIO_LOADING_ERROR=SCENARIO_LOADING_ERROR;	

	//******************************************************************************
	// Properties
	// A regular expresion used to validate the type of file (actually not used)
	var m_file_type="text.*";

	// Private Variables
	var m_valid=false;

	// The content of the scenario file loaded
	var m_file_content="";

	// File Handler
	var m_fh = new FileHandler();

	// Error message
	var m_error;

	// The schema as a string loaded initially with the page
	var m_scenario_state="";

	// The structure of the scenario as a JavaScript Object (actually using scenario_obj)

	//var m_scenario=null;
	//this.m_scenario=m_scenario;


	//******************************************************************************
	// Public Methods Publication
	this.isValid=isValid;
	this.getError=getError;

	this.loadScenarioRemoteFile=loadScenarioRemoteFile;
	this.loadScenarioLocalFile=loadScenarioLocalFile;


	// **************************************************************************
	// Public Methods Definition

	function isValid() {
		return m_valid;
	}

	function getError() {
		return m_error;
	}

	// Asynchronous method to load the schema file
	function loadScenarioRemoteFile(file){
		// Load Scenario Schema Schema
		console.log("loadScenarioRemoteFile" + file);

		jQuery.getJSON(file, function(data) {
			m_file_content=JSON.stringify(data);

			console.log("Scenario Remote File Loaded");

			m_schema_state=this.SCENARIO_LOADED;
			
			
			
		})
		.error(function() {
			console.err("getJSON ERROR for Remote File");

			alert("getJSON ERROR. SCENARIO.JSON is not valid json.");

			m_scenario_state=this.SCENARIO_LOADING_ERROR;
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





	//******************************************************************************
	// Private Methods

	function validateScenario(){
		if(!validateType()){
			var error="Scenario File Type is not Valid: " + m_fh.getType();
			console.error(error);
			m_error=error;
			alert(error);
			return false;
		}

		if (!validateSchema()) {
			var error="Scenario Schema Syntax is not Valid.";
			console.error(error);
			console.log(m_error);
			return false;
		}

		scenario_obj=JSON.parse(m_file_content);

		if (!validateScenario()) {
			var error="Scenario Schema Object is not Consistent.";
			console.error(error);
			console.log(m_error);
			var result= document.getElementById('result');
			result.className = "invalid";
			result.innerHTML = "Scenario file is invalid:<br/>" + m_error;
			return false;
		}

		m_valid=true;
		return true;
		console.log("Scenario file is valid.");
		var result= document.getElementById('result');
		result.className = "valid";
		result.innerHTML = "Scenario file is Valid.";

		return true;    	

	}

	function validateType() {
		console.log("ScenarioValidator, File Type: " + m_fh.getType());

		/*
		 * Sometimes browser do not return a type of file,
		 * so it make no sense to validate file type.
		 */
		return true;

		if (m_fh.getType().match(m_file_type)) {
			return true;
		} else{
			return false;
		}
	}

	var output;

	function validateScenarioObject(){

		var title=scenario_obj.name;
		output="";

		output='<span>Nodes: </span><br/>';

		if (!validateNodes(scenario_obj.nodes)) {
			return false;
		}

		output+='<br/><span>Sequences: </span><br/>';

		if (!validateSequences(scenario_obj.sequences)) {
			return false;
		}

		var result= document.getElementById('result');
		result.className = "valid";
		result.innerHTML = output;

		return true;
	}

	function validateNodes(nodes) {
		for (var x = 0, xl = nodes.length; x < xl; ++x) {
			// NotNeeded
			output += '<span>Node Id =' +  nodes[x].Id + ' Name: ' + nodes[x].name + '</span><br/>';

			var id=nodes[x].Id;

			// We check if the node id is unique
			var items = jQuery.grep(nodes, function (node) { return node.Id == id });

			if (items.length!=1) {
				m_error="Node Id repeated, it must be unique.";
				return false;
			}
		}      


		return true;
	}

	function validateSequences(sequences) {
		for (var x = 0, xl = sequences.length; x < xl; ++x) {
			// NotNeeded
			output += '<br/><span>Sequence Id =' +  sequences[x].Id + ' nextId: ' + sequences[x].nextId + '</span><br/>';
			output += '<br/><span>Messages:</span><br/>';

			var id=sequences[x].Id;
			var nextId=sequences[x].nextId;

			// Check that scenario id is less than nextId
			if (id >= nextId && nextId!=0) {
				m_error="Sequence Id="+ id +" is greater or equal than nextId "+ nextId +", it must be the opposite unless nextId is 0.";
				return false;
			}

			// Check that nextId exists
			if (nextId!=0) {
				// Check if the nextId exists as a Sequence Id
				var items = jQuery.grep(sequences, function (sequence) { return sequence.Id == nextId });

				if (items.length<1) {
					m_error="nextId "+ nextId +" does not point to an existing sequence Id.";
					return false;
				}                
			}

			// Check if the sequence id is unique
			var items = jQuery.grep(sequences, function (sequence) { return sequence.Id == id });

			if (items.length!=1) {
				m_error="Sequence Id repeated, it must be unique.";
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
				m_error="Source and destination node of a message can not be the same.";
				return false;
			}

			if (messages[y].param) {
				output += '<span>Message =' +  messages[y].name + '(' + messages[y].param + ')  srcN: ' + messages[y].srcN +' destN: ' + messages[y].destN + '</span><br/>';
			}else{
				output += '<span>Message =' +  messages[y].name + ' srcN: ' + messages[y].srcN +' destN: ' + messages[y].destN + '</span><br/>';   
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
				output += '<span>MCQ of title: ' + mcq.title + ', must have at least one valid answer.</span><br/>';
				m_error="MCQ of title: " + mcq.title + ", must have at least one valid answer.";
				return false;
			}
		}

		return true;
	}

	
	function getScenarioName() {
		if (scenario_obj!=null){
			return scenario_obj.name;
		}

		return null;
	}

	function getContents() {
		return m_file_content;
	}

	function setContents(arg){
		m_file_content=arg;
	}









	// ***********************************************************************************
	// Call back functions

	// This callback method is called when the file was read
	// This method start validations
	function readScenarioCallback(e) {
		console.log("Scenario file loaded.");

		var cont=e.target.result;
		m_file_content=cont;

		validateScenario();
	}    
}






function Schema(){
	// Constants
	var SCHEMA_NOTLOADED=0;
	var SCHEMA_LOADED=1;
	var SCHEMA_LOADING_ERROR=2;
	
	this.SCHEMA_LOADED=SCHEMA_LOADED;
	this.SCHEMA_NOTLOADED=SCHEMA_NOTLOADED;
	this.SCHEMA_LOADING_ERROR=SCHEMA_LOADING_ERROR;
	
	// Properties
	var m_schema_state=SCHEMA_NOTLOADED;	
	var m_schema_string=null;
	
	// Methods
	this.loadSchema=loadSchema;
	this.getState=getState;

	
	function getState(){
		return m_schema_state;
	}
	
	// Asynchronous method to load the schema file
	function loadSchema(file){
	   // Load Scenario Schema Schema
	   console.log("loadSchema" + file);
	   
	   jQuery.getJSON(file, function(data) {
		  m_schema_string=JSON.stringify(data);

	      console.log("Schema loaded");
	      
	      m_schema_state=this.SCHEMA_LOADED;
	   })
	   .error(function() {
		  console.err("getJSON ERROR");
		  
	      alert("getJSON ERROR. SCHEMA.JSON is not valid json.");

	      m_schema_state=this.SCHEMA_LOADING_ERROR;
	   });	
	}
	
}


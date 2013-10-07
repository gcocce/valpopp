
console.log("Schema Script");

/* Responsabilities:
 * 
 */

function Schema(){
	// ******************************************************************************
	// Constants
	// ******************************************************************************
	
	var SCHEMA_NOTLOADED=0;
	var SCHEMA_LOADED=1;
	
	var SCHEMA_LOADING_ERROR=100;	
	
	this.SCHEMA_LOADED=SCHEMA_LOADED;
	this.SCHEMA_NOTLOADED=SCHEMA_NOTLOADED;
	
	this.SCHEMA_LOADING_ERROR=SCHEMA_LOADING_ERROR;
	
	// ******************************************************************************
	// Properties
	// ******************************************************************************	
	
	
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
	
	
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************	
	var m_schema_state=SCHEMA_NOTLOADED;	
	var m_schema_string=null;
	
	// Methods
	this.getState=getState;
	this.loadSchema=loadSchema;
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************	
	
	function getState(){
		return m_schema_state;
	}
	
	// Asynchronous method to load the schema file
	function loadSchema(file){
	   // Load Scenario Schema Schema
	   console.log("Schema.loadSchema: " + file);
	   
	   jQuery.getJSON(file, function(data) {
		    m_schema_string=JSON.stringify(data);
					 
			m_schema_state=SCHEMA_LOADED;
	      
			// Dispatch the event
			console.log("Schema File Loaded");
			var event = $.Event( "SchemaFileLoaded" );
			$(window).trigger( event );		      
	   })
	   .error(function() {
		  console.err("getJSON ERROR");
		  
	      alert("getJSON ERROR. SCHEMA.JSON is not valid json.");

	      m_schema_state=SCHEMA_LOADING_ERROR;
	   });	
	}
	
}



console.log("Schema Script");

/* Responsabilities:
 * 
 * Contain the schema and perform the validation against it
 *  
 */

function Schema(){
	// ******************************************************************************
	// Constants
	// ******************************************************************************
	
	var SCHEMA_LOADED=0;	
	var SCHEMA_NOTLOADED=1;
	
	var SCHEMA_LOADING_ERROR=100;	
	
	this.SCHEMA_LOADED=SCHEMA_LOADED;
	this.SCHEMA_NOTLOADED=SCHEMA_NOTLOADED;
	this.SCHEMA_LOADING_ERROR=SCHEMA_LOADING_ERROR;
	
	// ******************************************************************************
	// Properties
	// ******************************************************************************	
	var m_schema_state=SCHEMA_NOTLOADED;	
	var m_schema_string=null;	
	var m_error="";
	var m_scenario_string="";
	
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
    function validateAgainstSchema() {
        try {
           var environmentId = "json-schema-draft-03";
           var json =  m_scenario_string;
           var jsonUri =  "json";
           var schema =  m_schema_string;
           var schemaUri =  "schema";
           
           m_error="";
           
           try {
                 schema = schema ? JSON.parse(schema) : undefined;
           } catch (e) {
        	   m_error='<div id="msg" class="error">Schema File is not a valid JSON<br><br>'+e.toString()+'</div>';
        	   return false;
           }
           
           try {
               json = json ? JSON.parse(json) : undefined;
	       } catch (e) {
	    	   m_error='<div id="msg" class="error">Scenario File is not a valid JSON<br><br>'+e.toString()+'</div>';
	    	   return false;
	       }           
           
           var environment = JSV.createEnvironment(environmentId);
           var report = environment.validate(environment.createInstance(json, jsonUri), environment.createSchema(schema, null, schemaUri));
           var output="";
           
           if (report.errors.length) {
                   output = "";
                   for (var x = 0, xl = report.errors.length; x < xl; ++x) {
                           output += '<div id="msg" class="error"><span class="error_uri">Problem with <code>' +
                                   report.errors[x].uri +
                                   '</code> : </span><span class="error_message">' +
                                   report.errors[x].message +
                                   '</span><br/><span class="error_schemaUri">Reported by <code>' +
                                   report.errors[x].schemaUri +
                                   '</code></span><br/><span class="error_attribute">Attribute "<code>' +
                                   report.errors[x].attribute + 
                                   '</code>"</span><span class="error_details"> (<code>' +
                                   JSON.stringify(report.errors[x].details) +
                                   '</code>)</span></div>';                          
                   }
                   m_error= output;
                   return false;
           } else {
        	   console.log("The scenario complies with the schema.");
               return true;
           }
        } catch (e) {
           m_error='<div id="msg" class="error">' + e + '</div>';
           console.log(e.toString());
           return false;
        }
      }
	
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************	

	
	// Methods
	this.validateScenario=validateScenario;
	this.getError=getError;
	this.getState=getState;
	this.loadSchema=loadSchema;
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************	
	
	// Validate a scenario file against the schema
	function validateScenario(scenario){
		m_scenario_string=scenario;
		
		return validateAgainstSchema();
	}
	
	// Return error message
	function getError(){
		return m_error;
	}
	
	function getState(){
		return m_schema_state;
	}
	
	// Asynchronous method to load the schema file
	function loadSchema(file){
	   // Load Scenario Schema Schema
	   console.log("Schema.loadSchema: " + file);
	   
	   jQuery.getJSON(file, function(data) {
			// Dispatch the event
			console.log("Schema File Loaded");
			
		    m_schema_string=JSON.stringify(data);
					 
			m_schema_state=SCHEMA_LOADED;
			
			var event = $.Event( "SchemaFileLoaded" );
			$(window).trigger( event );		      
	   })
	   .error(function() {
			console.error("getJSON ERROR. SCHEMA.JSON is not a valid json.");
			
			m_schema_state=SCHEMA_LOADING_ERROR;
			
			// Dispatch the event
			var event = $.Event( "SchemaFileLoadingError" );
			$(window).trigger( event );	
	   });	
	}
}



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
	this.getState=getState;
	this.loadSchema=loadSchema;
	this.validateScenarioSyntax=validateScenarioSyntax;
	
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
	
	
	function validateScenarioSyntax() {
		  try {
		     var environmentId = "json-schema-draft-03";
		     var json =  m_file_content;
		     var jsonUri =  "json";
		     var schema =  scenario_schema;
		     var schemaUri =  "schema";
		     
		     m_error="";
		
		     try {
		             json = json ? JSON.parse(json) : undefined;
		     } catch (e) {
		             throw new Error("Scenario File is not a valid JSON");
		     }
		     
		     try {
		           schema = schema ? JSON.parse(schema) : undefined;
		     } catch (e) {
		           throw new Error("Schema File is not valid JSON");
		     }
		     
		     var environment = JSV.createEnvironment(environmentId);
		     var report = environment.validate(environment.createInstance(json, jsonUri), environment.createSchema(schema, null, schemaUri));
		     var reportElement = document.getElementById("result");
		     var output;
		     
		     if (report.errors.length) {
		             reportElement.className = "invalid";
		             output = "";
		             for (var x = 0, xl = report.errors.length; x < xl; ++x) {
		                     output += '<div class="error"><span class="error_uri">Problem with <code>' +
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
		             reportElement.innerHTML = output;
		             m_error= output;
		             return false;
		     } else {
		             reportElement.className = "valid";
		             reportElement.textContent = "Input is valid!";
		             return true;
		     }
		  } catch (e) {
		     var reportElement = document.getElementById("result");
		     reportElement.className = "invalid";
		     reportElement.textContent = e;
		     m_error=e;
		     return false;
		  }
		}
}


/* This class is intended to handle the scenario */

function Scenario() {
   var m_valid=false;
   console.log("Scenario Object is created.");
    
   // A regular expresion used to validate the type of file (actually not used)
   var m_file_type="text.*";
    
   // The content of the scenario file loaded
   var m_file_content="";
    
   // File Handler
   var m_fh = new FileHandler();
    
   // Error message
   var m_error;
    
   // The schema as a string loaded initially with the page
   var m_schema="";
     
   // The structure of the scenario as a JavaScript Object (actually using scenario_obj)
   //var m_scenario=null;
   //this.m_scenario=m_scenario;
    
   this.openFile=openFile;
   this.getContents=getContents;
   this.isValid=isValid;
   this.getError=getError;
    
   // This callback method is called when the file was read
   // This method start validations
   function readScenarioCallback(e) {
      console.log("Scenario file loaded.");
      
      var cont=e.target.result;
      m_file_content=cont;
        
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
    
    // Start file reading, return true if there is no error
    function openFile(arg) {
      m_valid=false;
      if (m_fh.isEnabled()) {
          if (m_fh.openFile(arg, readScenarioCallback)){
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
    
    function validateSchema() {
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
    
    var output;
    
    function validateScenario(){
      
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
    
    function isValid() {
        return m_valid;
    }
    
    function getError() {
        return m_error;
    }    
}





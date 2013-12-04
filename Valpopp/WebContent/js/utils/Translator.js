

function Translator(){
	
	var PROCESS_HEADER=0;
	var PROCESS_SEQUENCE=2;
	
	var m_process=PROCESS_HEADER;
	var m_reading_messages=false;
	
	// In order to displace node number if they start with 0
	var m_node_plus=0;
	var m_current_sequence_id=0;
	
	var m_line_number=0;
	
	var m_max_node=0;
	
	var m_error="";
	var m_file_content="";
	var m_file_translated="";
    var m_codification="UTF-8";
	
    function init(){
    	m_error="";
    	m_line_number=0;
    	m_max_node=0;
    	m_file_content="";
    	m_file_translated={};    	
    	m_process=PROCESS_HEADER;
    	
    	m_reading_messages=false;
    	
    	m_current_sequence_id=0;
    	
    }
    
	function readFile(fHandler, callbackFunction){
  		try {
            m_type=fHandler.type;
            m_size=fHandler.size;
            m_name=fHandler.name;
            
           var fReader = new FileReader();
           
           fReader.onerror = function (e){
        	   	m_error=e.target.error;
        	   	
        	   	if (console){
        	   		console.log("Error code %s", m_error);	
        	   	}
                
                alert(m_error);
           };
            
            fReader.onload = callbackFunction;
                
            fReader.readAsText(fHandler, m_codification);
            
    	   	if (console){
    	   		console.log("FileHandler, file type: "+ fHandler.type);
    	   	}            
	    } catch(e) {
	    	if (console){
	    		console.error(e);
	    	}
	        
	        m_error=e.message;
	        return false;
	    }
    
	    return true;
	}
	
	// Get file contents
	function readFileCallBack(e){
		
		m_file_content=e.target.result;
		
		//console.log("File contents:");
		//console.log(m_file_content);
		
		if(processfile()){
			//document.location = 'data:Application/octet-stream,' + encodeURIComponent(m_file_translated);
			
			// Show translation result
			var result=document.getElementById("translation");
			
			result.className = "valid";
			result.innerHTML = "The file was successfully translated to Json Format";
				
			// Check Json syntax
			var result=document.getElementById("validation");
			
			if (!scenarioSchema.validateScenario(m_file_translated)){
				result.className = "invalid";
				result.innerHTML= "The Syntax of the Json file has the following errors: <br><br>" + scenarioSchema.getError();
				
			}else{
				// Perform the additional validations
				
				var scenarioModelBuilder=new ScenarioModelBuilder();
				
				scenarioModelBuilder.setContents(m_file_translated);
				
				if (!scenarioModelBuilder.performAdditionalValidations()){
					result.className = "invalid";
					result.innerHTML= "The Scenario File has the following errors: <br><br>" + scenarioModelBuilder.getError();					
					
				}else{
					result.className = "valid";
					result.innerHTML="The Syntax of the Json file complies with the Schema!";					
				}
			}			
			
			// Show download link
			var result=document.getElementById("download");
			
			result.innerHTML = '<a href="data:Application/octet-stream,'+ encodeURIComponent(m_file_translated)+'" target="_blank" download="scenario.json">Download Scenario File</a>';
		}else{
			// Show translation result
			var result=document.getElementById("translation");
			
			result.className = "invalid";
			
			if (console){
				console.log("getError: "+ m_line_number);	
			}
			
			if (m_line_number!=0){
				m_error= "Line: " + m_line_number + "<br> Error: " + m_error;
			}		
			
			result.innerHTML = m_error;
		}
		
	}
	
	function processfile(){
		
		var data=m_file_content;
		
		var lflines = data.split('\n');
				
		for (var x=0; x < lflines.length; x++){
			
			var line= new String();
			
			line=lflines[x];
			
			m_line_number++;
			
			line=line.trim();
			
			// Filter blanck lines
			if (line.length>0){
				
				var char= line[0];
				
				// Filter comments
				if (char.localeCompare("#")!=0){
					//console.log (line);
					
					if (!processLine(line)){
						return false;
					}
				}
			}
		}
		
		m_file_translated= JSON.stringify(m_file_translated, null, 4); 
		
		return true;
	}
	
	function processLine(line){
		
		var line_content=line.split(";");
		
		switch (m_process){
			case PROCESS_HEADER:
				
				return processHeaderLineContent(line_content);
				
				break;
			case PROCESS_SEQUENCE:
				
				return processSequenceLineContent(line_content);
				
				break;
			default:
				m_error="Unexpected process!";
				return false;
				
				break;
		};
		
		return true;
	}
	
	function processHeaderLineContent(line_content){
		
		switch (line_content[0]){
		case "ScenarioName":
			
			m_file_translated["name"]=line_content[1];
			
			break;
		case "ImageFile":
			
			m_file_translated["img"]=line_content[1];
			
			break;
		case "defaultmessage":
			
			m_file_translated["defaultmessage"] = {"type":  line_content[1] ,"length":  parseInt(line_content[2]), "treatment":  parseInt(line_content[3]), "dash":  line_content[4]};
			
			break;
		case "defaultpropagthroughputs":
			
			m_file_translated["defaultpropagthroughputs"]={"propagTime":  parseInt(line_content[1]) ,"throughput":  parseInt(line_content[2])};
			
			break;
		case "scenarioreference":
			
			if (!m_file_translated.references){
				m_file_translated.references=[];
			}
			
			m_file_translated.references.push({"title": line_content[1], "link": line_content[2]});
			
			break;					
		case "NodeName":
			
			if (!m_file_translated.nodes){
				m_file_translated.nodes=[];
				
				m_node_plus=parseInt(line_content[1]);
				if (m_node_plus==0){
					m_node_plus=1;
				}else{
					m_node_plus=0;
				}
			}
			
			var node_number = parseInt(line_content[1]) + m_node_plus;
					
			if (!node_number){
				m_error = "Node number should be a number, value: " + line_content[1];
				return false;
			}
			
			m_file_translated.nodes.push({"Id": node_number, "name": line_content[2], "img": line_content[3]});
			
			m_max_node++;
			
			break;
		case "PropagThroughput":
			
			if (!m_file_translated.propagthroughputs){
				m_file_translated.propagthroughputs=[];
			}
			
			var srcN = parseInt(line_content[1]) + m_node_plus;
			
			if (!srcN){
				m_error = "srcNode should be a valid node number, value: " + srcN;
				return false;				
			}
			
			if (srcN < 1 || srcN > m_max_node){
				m_error = "srcNode number should be between 1 and " + m_max_node;
				return false;
			}
			
			var destN = parseInt(line_content[2]) + m_node_plus;
			
			if (!destN){
				m_error = "destNode should be a valid node number, value: " + destN;
			}
			
			if (destN < 1 || destN > m_max_node){
				m_error = "destNode number should be between 1 and " + m_max_node;
				return false;
			}			
			
			var propTime = parseInt(line_content[3]);
			var throughput = parseInt(line_content[4]);
			
			if (isNaN(propTime) || propTime < 0 ){
				m_error = "Propagation Time should be a valid number, value: " + line_content[3];
				return false;
			}
			
			if (isNaN(throughput) || throughput < 0){
				m_error = "Throughput should be a valid number, value: " + line_content[4];
				return false;
			}			
			
			m_file_translated.propagthroughputs.push({"srcN": srcN, "destN": destN, "propagTime": propTime, "throughput": throughput });
			
			break;
		case "sequence": // Start processing the first sequence 
			
			m_process=PROCESS_SEQUENCE;
			
			return processSequenceLineContent(line_content);
			
			break;					
		default:
			m_error="Unexpected token: " + line_content[0] ;
			return false;
			break;
		};	
		
		return true;
	}
	
	
	function processSequenceLineContent(line_content){
		
		switch (line_content[0]){
		case "sequence":
			
			if (!m_file_translated.sequences){
				m_file_translated.sequences=[];
			}else{
				m_current_sequence_id++;
			}
			
			m_file_translated.sequences[m_current_sequence_id]={"Id": parseInt(line_content[1]) , "nextId": parseInt(line_content[2]), "messages": []};
			
			m_reading_messages=true;
				
			break;
			
		case "mcq":

			m_reading_messages=false;
			
			var points= new String();
			
			points=line_content[3];
			
			points=points.trim();
			
			if (parseInt(points)){
				m_file_translated.sequences[m_current_sequence_id]["mcq"]={"title": line_content[1], "text": line_content[2], "points": parseInt(points)};
			}else{
				m_file_translated.sequences[m_current_sequence_id]["mcq"]={"title": line_content[1], "text": line_content[2]};
			}
			
			break;
		case "mcqanswer":

			if (!m_file_translated.sequences[m_current_sequence_id].mcq.answers){
				m_file_translated.sequences[m_current_sequence_id].mcq.answers=[];
			}
			
			var answer={"text": line_content[1]};
			
			var feedback= new String();
			
			feedback=line_content[2];
			
			feedback=feedback.trim();
			
			if (feedback.length > 0){
				answer["feedback"]=feedback;
			}
			
			var valid= new String();
			valid= line_content[3];
			valid = valid.trim();
			
			if (valid.length > 0){
				answer["valid"]=valid;
			}
			
			m_file_translated.sequences[m_current_sequence_id].mcq.answers.push(answer);	
			
			break;			
		default:
			// It is necessary to check if it is a message
			if (m_reading_messages){
				
				if (line_content.length < 10){
					m_error="The message should have at least 10 parameters!";
					return false;
				}

				var srcN=parseInt(line_content[0]) + m_node_plus;
				var destN=parseInt(line_content[1]) + m_node_plus;
				
				if(!srcN){
					m_error="The number of the src node is not valid: " + line_content[0];
				}
				
				if (srcN < 1 || srcN > m_max_node){
					m_error = "srcNode number should be between 1 and " + m_max_node;
					return false;
				}
				
				if (!destN){
					m_error="The number of the dest node is not valid: " + line_content[1];
				}
				
				if (destN < 1 || destN > m_max_node){
					m_error = "destNode number should be between 1 and " + m_max_node;
					return false;
				}				
							
				var message={"srcN": srcN, "destN": destN, "name": line_content[2] };
				
				checkAtribute(message, "param", line_content[3], false);
				
				checkAtribute(message, "type", line_content[4], false);
				
				if (!checkAtribute(message, "length", line_content[5], true)){
					return false;
				}
				
				if (!checkAtribute(message, "treatment", line_content[6], true)){
					return false;
				}
				
				checkAtribute(message, "dash", line_content[7], false);
				
				checkAtribute(message, "startTime", line_content[8], false);
				
				checkAtribute(message, "synchPoint", line_content[9], false);
				
				// Process timer if present
				if (line_content[10]){
					if (!checkAtribute(message, "timer", line_content[10], true)){
						return false;
					}					
				}
				
				// Process scenImg if present
				if (line_content[11]){
					checkAtribute(message, "scenImg", line_content[11], false);
				}
				
				// Process Comment if present
				if (line_content[12]){
					var comment_text=new String();
					comment_text= line_content[12];
					comment_text=comment_text.trim();
					
					if(comment_text.length > 0){
						var comment={"text": comment_text};
						message["comment"]=comment;						
					}
				}
				
				// Process Action if present
				if (line_content[13]){
					var action_text=new String();
					action_text= line_content[13];
					action_text=action_text.trim();
					
					if (action_text.length > 0){
						var action={"text": action_text};
						message["action"]=action;						
					}
				}				
				
				m_file_translated.sequences[m_current_sequence_id].messages.push(message);
				
			}else{
				m_error="Unexpected error, processing sequence, line contents: " + line_content;
				return false;				
			}
		
			break;
		};	
		
		return true;
	}
	
	function checkAtribute(message, attribut_name, value, isNumber){
		
		var atribute= new String();
		atribute=value;
		atribute=atribute.trim();
		
		if (atribute.length > 0){
			
			if (isNumber){
				if (isNaN(atribute) || !parseInt(atribute) || parseInt(atribute) < 0 ){
					m_error="Parameter " + attribut_name + " should be a valid number, the value is: " + value;
					return false;
				}
				
				message[attribut_name]=parseInt(atribute);
				
			}else{
				// If the attribute is dash ensure that the value is UpperCase
				if (attribut_name.localeCompare("dash")==0){
					atribute=atribute.toUpperCase();
				}
				
				message[attribut_name]=atribute;
			}
		}
		
		return true;
	}
	
	
	// **************************************************************************
	// Public Methods Publication
	//***************************************************************************

	this.translate=translate;
	this.getError=getError;


	//***************************************************************************
	// Public Methods Definition	
	//***************************************************************************
	
	function getError(){
		return m_error;
	}

	function translate(filePointer){
	
		init();
		
		if(filePointer){
			
			if(readFile(filePointer, readFileCallBack)){
				
				return true;
			}else{
				return false;
			}
		}else{
			
			m_error="Error: there is no selected file!";
			
			if (console){
				console.error(m_error);
			}
			
			return false;
		}
	}
	
}
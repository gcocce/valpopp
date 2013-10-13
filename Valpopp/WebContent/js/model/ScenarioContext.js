
console.log("ScenarioContext Script");


/* Responsabilities:
 * 
 * Contain Scenario Data
 * 
 */

function ScenarioContext(){
	
	// ******************************************************************************
	// Constants
	// ******************************************************************************
	var CONTEXT_OK=0;
	var CONTEXT_NODE_IMGS_ERROR=1;

	this.CONTEXT_OK=CONTEXT_OK;
	this.CONTEXT_NODE_IMGS_ERROR=CONTEXT_NODE_IMGS_ERROR;
	
	var DEFAULT_PROPAGATION_TIME=10;
	var DEFAULT_THROUGHPUT=3400;

	
	// ******************************************************************************
	// Properties
	// ******************************************************************************	
	var m_error="";
	var m_state=CONTEXT_OK;
	
	var m_nodes_number=0;
	var m_current_img="";
	
	// Object with the default values of the scenario
	var m_default={};
	
	// Matrix with the propagthrugput values
	var m_def_prog=new Array();
	
	var m_nodes_images = new Array();
	var m_scenario_images= new Array();
	
	var m_scenario_object=null;
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
	// Complete the list of default values used for the scenario
	function completeDefaults(){
		var def=m_scenario_object.defaultmessage;
		
		if (!def){
			def={};
		}
		
		if(def.type){
			m_default["type"]=def.type;
		}else{
			m_default["type"]="ONEWAY";
		}
		
		if (def.length){
			m_default["length"]=def.length;
		}else{
			m_default["length"]=4;
		}
		
		if (def.treatment){
			m_default["treatment"]=def.treatment;
		}else{
			m_default["treatment"]=0;
		}
		
		if (def.dash){
			m_default["dash"]=def.dash;
		}else{
			m_default["dash"]="full";
		}

		if (def.startTime){
			m_default["startTime"]=def.startTime;
		}else{
			m_default["startTime"]="";
		}
		
		if (def.synchPoint){
			m_default["synchPoint"]=def.synchPoint;
		}else{
			m_default["synchPoint"]="";
		}		
			
		/*
		for(key in m_default) { 
			alert("key " + key + " has value " + m_default[key]); 
		}*/

	}
	
	function createDefaultPropagthroughput(){
		for (var x=1; x <= m_nodes_number; x++){
			m_def_prog[x]={};
			for (var y=1; y<= m_nodes_number; y++){
				if(x!=y){
					m_def_prog[x][y]={"srcN": x,"destN": y, "propagTime" : DEFAULT_PROPAGATION_TIME, "throughput": DEFAULT_THROUGHPUT};
				}
			}
		}
	} 
	
	function checkPropagthroughput(){
		var prop=m_scenario_object.propagthroughputs;
		
		createDefaultPropagthroughput();
		
		if (prop){
			for (var i=0; i < prop.length; i++){
				var data=prop[i];
				
				m_def_prog[data.srcN][data.destN]={"srcN": data.srcN,"destN": data.destN, "propagTime" : data.propagTime, "throughput": data.throughput};
				

			}
		}
		
		console.log(m_def_prog);
	}
	
	function normalizeSequences(){
		for (var x=0; x < m_scenario_object.sequences.length; x++){
			normalizeMessages(m_scenario_object.sequences[x].messages);
			
			//normalizeMCQ(m_scenario_object.sequences[x].mcq);
		}
		
	}
	
	function normalizeMessages(messages){
		for (var x=0; x < messages.length; x++){
			
			if (!messages[x].param){
				messages[x].param="";
			}
			
			if (!messages[x].type){
				messages[x].type=m_default["type"];
			}
			
			if (!messages[x].length){
				messages[x].length=m_default["length"];
			}
			
			if (!messages[x].treatment){
				messages[x].treatment=m_default["treatment"];
			}
			
			if (!messages[x].dash){
				messages[x].dash=m_default["dash"];
			}
			
			if (!messages[x].startTime){
				messages[x].startTime=m_default["startTime"];
			}
			
			if (!messages[x].synchPoint){
				messages[x].synchPoint=m_default["synchPoint"];
			}
		}
	}
	
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************
	
	this.getError=getError;
	this.getState=getState;
	this.getScenarioName=getScenarioName;
	this.setScenario=setScenario;
	this.getNumberofNodes=getNumberofNodes;
	this.getCurrentImgName=getCurrentImgName;
	this.getNodeImg=getNodeImg;
	this.getNodeName=getNodeName;
	this.getSequence=getSequence;
	
	this.setNumberofNodes=setNumberofNodes;
	this.setNodeImg=setNodeImg;
	this.setScenarioImg=setScenarioImg;
	this.normalizeScenario=normalizeScenario;
		
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************

	function getNodeName(index){
		return m_scenario_object.nodes[index].name;
	}
	
	function getScenarioName(){
		return m_scenario_object.name;
	}
	
	function setScenarioImg(index, img_url){
		m_scenario_images[index]=new ScenarioImage(img_url);	
	}
	
	function setNodeImg(index, img_url){
		m_nodes_images[index]=new ScenarioImage(img_url);
	}
	
	function setScenario(obj){
		m_scenario_object=obj;
	}
	
	function getNodeImg(index){
		return m_nodes_images[index];
	}
	
	function getError(){
		return m_error;
	}
	
	function getSequence(id){
		if (id==0){
			return m_scenario_object.sequences[0];
		}else{		
			for (var x=0; x < m_scenario_object.sequences.length; x++){
				if(m_scenario_object.sequences[x].Id==id){
					return m_scenario_object.sequences[x];
				}
			}
			return m_scenario_object.sequences[0];
		}
	}
	
	
	function setNumberofNodes(number){
		return m_nodes_number=number;
	}	
	
	function getNumberofNodes(){
		return m_nodes_number;
	}
	
	function getCurrentImgName(){
		return m_current_img;
	}
	
	function getState(){
		return m_state;
	}	
	
	function normalizeScenario(){
		
		console.log("scenarioContext.normalizeScenario()");
		
		completeDefaults();
		
		checkPropagthroughput();
		
		normalizeSequences();
		
		console.log(m_scenario_object);
	}
	

	// ******************************************************************************
	// Events Listeners
	// ******************************************************************************
	
	$(window).on( "RemoteScenarioImageLoadingError", scenarioImgLoadingError);

	// ******************************************************************************
	// Call back functions
	// ******************************************************************************	
	
	function scenarioImgLoadingError(){
		m_state=CONTEXT_NODE_IMGS_ERROR;
	}
	
}
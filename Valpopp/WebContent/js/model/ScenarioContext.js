
console.log("ScenarioContext Script");


/* Responsabilities:
 * 
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

	
	// ******************************************************************************
	// Properties
	// ******************************************************************************	
	var m_error="";
	var m_state=CONTEXT_OK;
	
	var m_nodes_number=0;
	var m_current_img="";
	
	var m_nodes_images = new Array();
	var m_scenario_images= new Array();
	
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
	
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************
	
	this.getError=getError;
	this.getState=getState;
	this.setNumberofNodes=setNumberofNodes;
	this.getNumberofNodes=getNumberofNodes;
	this.getCurrentImgName=getCurrentImgName;
	this.setNodeImg=setNodeImg;
	this.getNodeImg=getNodeImg;
	this.setScenarioImg=setScenarioImg;
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	
	function setScenarioImg(index, img_url){
		m_scenario_images[index]=new ScenarioImage(img_url);	
	}
	
	function setNodeImg(index, img_url){
		m_nodes_images[index]=new ScenarioImage(img_url);
	}
	
	function getNodeImg(index){
		return m_nodes_images[index];
	}
	
	function getError(){
		return m_error;
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

console.log("Canvas Script");


/* Responsabilities:
 * 
 * 
 */

function Canvas(){
	// ******************************************************************************
	// Properties
	// ******************************************************************************	
	
	var m_error="";
	
	var m_width=0;
	var m_height=0;
	
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
	
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************
	
	this.setWidth=setWidth;
	this.setheight=setheight;
	this.getError=getError;
	
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	function setWidth(value){
		m_width=value;
	}
	
	function setHeight(value){
		m_height=value;
	}
	
	function getError(){
		return m_error;
	}
}
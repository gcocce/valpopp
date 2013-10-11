
console.log("Canvas Script");


/* Responsabilities:
 * 
 * 
 */

function Canvas(drawing_context){
	// ******************************************************************************
	// Properties
	// ******************************************************************************	
	
	var m_error="";
	
	var m_context=drawing_context;
	
	var m_width=0;
	var m_height=0;
	
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
	
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************
	
	this.setWidth=setWidth;
	this.setHeight=setHeight;
	this.getError=getError;
	this.drawArrow=drawArrow;
	
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
	
	function drawArrow(pi,pf){
        //console.log("Canvas.drawArrow final point: "+pf.getX()+","+pf.getY());
		m_context.fillStyle = '#000000';  
		m_context.strokeStyle  = "black";
		m_context.lineWidth  = 1;
		m_context.lineCap  = 'square';
		m_context.beginPath();
		m_context.moveTo(Math.round(pi.getX())+0.5, Math.round(pi.getY())+0.5);
		m_context.lineTo(pf.getX(), pf.getY());
		m_context.stroke();
		m_context.closePath();		
	}
	
}
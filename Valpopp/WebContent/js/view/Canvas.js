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
	this.drawVerticalLine=drawVerticalLine;
	this.drawArrow=drawArrow;
	this.drawMessage=drawMessage;
	this.drawTreatmentLine=drawTreatmentLine;
	
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
	
	function drawVerticalLine(pi,pf){
		m_context.strokeStyle  = "blue";
		m_context.lineWidth  = 1;
		m_context.lineCap  = 'square';
		m_context.beginPath();
		m_context.moveTo(pi.getX(), pi.getY());
		m_context.lineTo(pf.getX(), pf.getY());
		m_context.stroke();
		m_context.closePath();		
	}
	
	function drawTreatmentLine(pi, pf){
		m_context.strokeStyle  = "black";
		m_context.lineWidth  = 2;
		m_context.setLineDash([0]);
		m_context.lineCap  = 'square';
		m_context.beginPath();
		m_context.moveTo(pi.getX(), pi.getY());
		m_context.lineTo(pf.getX(), pf.getY());
		m_context.stroke();
		m_context.closePath();			
	}
	
	function drawArrow(pi,pf, color, dash){
        //console.log("Canvas.drawArrow final point: "+pf.getX()+","+pf.getY());
		m_context.fillStyle = '#000000';  
		m_context.strokeStyle  = color;
		m_context.setLineDash([dash]);
		m_context.lineWidth  = 1;
		m_context.lineCap  = 'square';
		m_context.beginPath();
		m_context.moveTo(Math.round(pi.getX())+0.5, Math.round(pi.getY())+0.5);
		m_context.lineTo(pf.getX(), pf.getY());
		m_context.stroke();
		m_context.closePath();		
	}
	
	function drawMessage(msg, posx, posy, textSize){
//		console.log("drawMessage " + msg);
		var fontSize = textSize;
		var fontFace = "serif";
		var textFillColor ="#ff0000";
		var textBaseline = "middle";
		var textAlign = "center";
		var fontWeight ="normal";
		var fontStyle = "normal";

		m_context.textBaseline = textBaseline;
		m_context.textAlign = textAlign;
		m_context.font = fontWeight + " " + fontStyle + " " + fontSize + "px " + fontFace;

		m_context.fillStyle    = "black";
		m_context.fillText  ( msg,  posx , posy);		
	}

}
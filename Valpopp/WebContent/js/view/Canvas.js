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
		// The following function does not works on firefox older versions
		//m_context.setLineDash([0]);
		m_context.lineCap  = 'square';
		m_context.beginPath();
		m_context.moveTo(pi.getX(), pi.getY());
		m_context.lineTo(pf.getX(), pf.getY());
		m_context.stroke();
		m_context.closePath();			
	}
	
	function drawArrow(pi,pf, color, dash, angle, distBetweenNodes){
        //console.log("Canvas.drawArrow final point: "+pf.getX()+","+pf.getY());
		m_context.fillStyle = '#000000';  
		m_context.strokeStyle  = color;
		// The following function does not works on firefox older versions
		//m_context.setLineDash([dash]);
		m_context.lineWidth  = 1;
		m_context.lineCap  = 'square';
		m_context.beginPath();
		m_context.moveTo(Math.round(pi.getX())+0.5, Math.round(pi.getY())+0.5);
		m_context.lineTo(pf.getX(), pf.getY());
		m_context.stroke();
		m_context.closePath();
		
		// Draw the point of the arrow
		// The following function does not works on firefox older versions
		//m_context.setLineDash([0]);
		
		var direction = -1;
		if (pf.getX() < pi.getX()){
			direction = 1;
		}
		
		m_context.save();
		// Translate to the point of the arrow
		m_context.translate(pf.getX(), pf.getY());
		// Rotate in the opposite direction
		m_context.rotate(direction * angle);
		
		//Draw the path, shape, or image at 0,0.		
		m_context.strokeStyle  = color;
		m_context.lineWidth  = 1;
		m_context.lineCap  = 'square';
		m_context.beginPath();
		m_context.fillStyle=color;		

		var width=5;
		var length=12;
		
		if (distBetweenNodes > 200){
			width=5;
			length=12;
		}else{
			if (distBetweenNodes > 100){
				width=4;
				length=10;	
			}else{
				if (distBetweenNodes > 60){
					width=3;
					length=7;
				}else{
					width=2;
					length=5;
				}
			}
		}
		
		m_context.moveTo(0, 0);		
		m_context.lineTo(width, -length);
		m_context.lineTo(-width, -length);		
		m_context.lineTo(0, 0);
		m_context.stroke();
		m_context.closePath();        
		m_context.fill();
        
		m_context.restore();
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

	function drawAction(msg, posx, posy, textSize){
		
//		context.fillStyle   = '#00f'; // blue
//		context.strokeStyle = '#f00'; // red
//		context.lineWidth   = 4;		
//		context.strokeRect(0,  60, 150, 50);
		
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
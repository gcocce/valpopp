
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
	
	var m_width=drawing_context.width;
	var m_height=0;
	
	
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************

	// Wrap the line of the comment but no more than two lines are possible (the remaining is not printed)
	function wrapText(text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';
        var lines=0;

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = m_context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
        	  lines++;
        	  m_context.fillText(line, x, y);
        	  //m_context.strokeText(line, x, y);
        	  line = words[n] + ' ';
        	  y += lineHeight;
        	  
        	  // If another line is required go out
        	  if (lines==2) return;
          }
          else {
            line = testLine;
          }
        }
        
        m_context.fillText(line, x, y);
        //m_context.strokeText(line, x, y);
      }
	
	// Function to set dash line if possible regarding browser and function availability
	function setDash(context, array) {
	    offset = (typeof offset === 'number') ? offset : 0;

	    if (typeof context.setLineDash == 'undefined') { //Firefox
	        context.mozDash = array;
	        context.mozDashOffset = 0;
	    } else { //Chrome
	    	// If the function is defined we used it, otherwise we do the normal line
	    	if (context.setLineDash) {
		        context.setLineDash(array);
	    	}else{
	    		console.log("setLineDash is no present, using straight line.");
	    	}
	    	
	    }
	}	
	
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
	this.drawComment=drawComment;
	
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
		// Clear dash parameter
		setDash(m_context, []);
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

		// Set dash parameter
		setDash(m_context, []);
		m_context.lineCap  = 'square';
		m_context.beginPath();
		m_context.moveTo(pi.getX(), pi.getY());
		m_context.lineTo(pf.getX(), pf.getY());
		m_context.stroke();
		m_context.closePath();			
	}
	
	function drawArrow(pi,pf, color, dash, angle, distBetweenNodes){

		m_context.fillStyle = '#000000';  
		m_context.strokeStyle  = color;

		// Set dash parameter
		setDash(m_context, dash);
		m_context.lineWidth  = 1;
		m_context.lineCap  = 'square';
		m_context.beginPath();
		m_context.moveTo(Math.round(pi.getX())+0.5, Math.round(pi.getY())+0.5);
		m_context.lineTo(pf.getX(), pf.getY());
		m_context.stroke();
		m_context.closePath();
		
		// Draw the point of the arrow
		// Clear dash parameter
		setDash(m_context, []);
		
		// Establish direction
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
	
	function drawComment(msg, posx, posy, textSize, canvasWidth){
		
		var lineHeight = textSize + 2;
		
		// Clear the below space of the canvas from posy
		m_context.fillStyle = 'white';
		m_context.fillRect(posx, posy, canvasWidth, lineHeight * 2);

		// Draw the text comment
		var fontSize = textSize;
		var fontFace = "serif";
		var textBaseline = "top";
		var textAlign = "left";
		var fontWeight ="normal";
		var fontStyle = "normal";

		m_context.textBaseline = textBaseline;
		m_context.textAlign = textAlign;
		m_context.font = fontWeight + " " + fontStyle + " " + fontSize + "px " + fontFace;

		m_context.fillStyle = "black";
		
		wrapText(msg, posx, posy, canvasWidth, lineHeight);		
	}	

	function drawAction(msg, posx, posy, textSize){
		
//		context.fillStyle   = '#00f'; // blue
//		context.strokeStyle = '#f00'; // red
//		context.lineWidth   = 4;		
//		context.strokeRect(0,  60, 150, 50);
		
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

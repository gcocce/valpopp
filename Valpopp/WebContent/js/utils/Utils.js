
function Utils(){
	
	
	// **************************************************************************
	// Public Methods Publication
	//***************************************************************************
	this.wrapErrorMsg=wrapErrorMsg;
	this.wrapMsg=wrapMsg;

	//***************************************************************************
	// Public Methods Definition	
	//***************************************************************************
	
	function wrapErrorMsg(msg){
		return '<div id="msg" class="error">' + msg + '</div>';
	}
	
	
	function wrapMsg(msg){
		return '<div id="msg" class="valid">' + msg + '</div>';
	}	
}

function ScenType(){
	var MESSAGE=0;
	var ACTION=1;
	var TIMER=2;
	var TREATMENT=3;
	
	this.MESSAGE=MESSAGE;
	this.ACTION=ACTION;
	this.TIMER=TIMER;
	this.TREATMENT=TREATMENT;
}

function ScenObject(type, object){
	var m_type=type;
	var m_obj=object;
	
	this.getType=getType;
	
	function getType(){
		return m_type;
	}
	
	function getObject(){
		return m_obj;
	}
}

function ScenTimer(pi,pf){
	var m_pi=pi;
	var m_pf=pf;
	var m_drawpercent=0;	
	
	this.getInitPos=getInitPos;
	this.getEndPos=getEndPos;
	this.getDrawPercent=getDrawPercent;
	this.setDrawPercent=setDrawPercent;		
	
	function getInitPos(){
		return m_pi;		
	}
	
	function getEndPos(){
		return m_pf;		
	}
	
	function getDrawPercent() {
		return m_drawpercent;
	}

	function setDrawPercent(drawpv) {
		m_drawpercent=drawpv;
	}		
}

function ScenTreatment(pi,pf){
	var m_pi=pi;
	var m_pf=pf;
	var m_drawpercent=0;	
	
	this.getInitPos=getInitPos;
	this.getEndPos=getEndPos;
	this.getDrawPercent=getDrawPercent;
	this.setDrawPercent=setDrawPercent;		
	
	function getInitPos(){
		return m_pi;		
	}
	
	function getEndPos(){
		return m_pf;		
	}

	function getDrawPercent() {
		return m_drawpercent;
	}

	function setDrawPercent(drawpv) {
		m_drawpercent=drawpv;
	}	
}

function ScenMessage(pi,pf, index, msgv){
	var m_pi=pi;
	var m_pf=pf;
	
	// Regiter the position in the list of messages
	var m_index=index;
		
	// Register the text message to be displayed
	var m_msg=msgv;
	
	// Register the percentage of display
	var m_drawpercent=0;
	
	this.getInitPos=getInitPos;
	this.getEndPos=getEndPos;
	
	this.getMsg = getMsg;
	
	this.getDrawPercent=getDrawPercent;
	this.setDrawPercent=setDrawPercent;	
	
	function getInitPos(){
		return m_pi;		
	}
	
	function getEndPos(){
		return m_pf;		
	}	
	
	function getMsg() {
		return m_msg;
	}
	
	function getDrawPercent() {
		return m_drawpercent;
	}

	function setDrawPercent(drawpv) {
		m_drawpercent=drawpv;
	}	
}

function ScenAction(){
	
}

function ScenarioImage(url_param){
	// ******************************************************************************
	// Constants
	// ******************************************************************************
	var IMG_OK=0;
	var IMG_ERROR=1;

	this.IMG_OK=IMG_OK;
	this.IMG_ERROR=IMG_ERROR;
	
	// ******************************************************************************
	// Properties
	// ******************************************************************************	
	
	var m_img=new Image();
	var m_url=url_param;
	var m_state=IMG_ERROR;
	var m_width=0;
	var m_height=0;
	
	// ******************************************************************************
	// Constructor
	// ******************************************************************************	
	
	m_img.onerror = function () {
	    console.log("Fail to download: " + url_param);
	    m_state=IMG_ERROR;
	    
	    //Dispatch Event
		var event = $.Event( "RemoteScenarioImageLoaded" );
		$(window).trigger( event );	
	};
	
	m_img.onload = function () {
	    console.log("Successful download: " + url_param);
	    m_state=IMG_OK;
	    m_other=1;
	    
	    m_width=m_img.width;
	    m_height=m_img.height;
	    
	    //Dispatch Event
		var event = $.Event( "RemoteScenarioImageLoadingError" );
		$(window).trigger( event );	
	};
	
	m_img.src = url_param;
	
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************

	this.getState=getState;
	this.getImg=getImg;
	this.getUrl=getUrl;
	this.getWidth=getWidth;
	this.getHeight=getHeight;

	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	function getWidth(){
		return m_width;
	}
	
	function getHeight(){
		return m_height;
	}
	
	function getState(){
		return m_state;
	}
	
	function getUrl(){
		return m_url;
	}
	
	function getImg(){
		return m_img;
	}
}

function Point(xvalue,yvalue){
    var m_x =xvalue;
    var m_y =yvalue;
    this.getX = getX;
    this.getY = getY;
    this.setX = setX;
    this.setY = setY;
    
    function getX() {
      return m_x;
    }
    
    function getY() {
      return m_y;
    }
    
    function setX(xvalue) {
      m_x= xvalue;
    }
    
    function setY(yvalue) {
      m_y = yvalue;
    }
}

function Position(NodeNumber, y){
	var m_node=NodeNumber;
	var m_y=y;
	
	this.getNode=getNode;
	this.getY=getY;
	
	function getNode(){
		return m_node;
	}
	
	function getY(){
		return m_y;		
	}
}
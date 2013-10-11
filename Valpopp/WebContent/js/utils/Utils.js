
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
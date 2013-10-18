
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
	this.getObject=getObject;
	this.setObject=setObject;
	
	function getType(){
		return m_type;
	}
	
	function getObject(){
		return m_obj;
	}
	
	function setObject(obj){
		m_obj=obj;
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

function ScenTreatment(it,et,node){
	var m_it=it;
	var m_et=et;
	var m_node=node;
	var m_current_time=it;
	var m_display=false;
	
	this.getInitTime=getInitTime;
	this.getEndTime=getEndTime;
	this.getNode=getNode;
	
	this.setCurrentTime=setCurrentTime;
	this.getCurrentTime=getCurrentTime;
	
	this.getDisplay=getDisplay;
	this.setDisplay=setDisplay;
	
	function getDisplay(){
		return m_display;
	}
	
	function setDisplay(display){
		m_display=display;
	}
	
	function setCurrentTime(time){
		m_current_time=time;
	}
	
	function getCurrentTime(){
		return m_current_time;
	}
	
	function getNode(){
		return m_node;
	}
	
	function getInitTime(){
		return m_it;		
	}
	
	function getEndTime(){
		return m_et;		
	}
}

function ScenMessage(pi,pf, index, msgv){
	var m_pi=pi;
	var m_pf=pf;
	
	// Regiter the position in the list of messages
	var m_index=index;
		
	// Register the text message to be displayed with its parameters
	var m_msg=msgv;
	var m_msg_pos=0;
	
	// Register type of message
	var m_type="";
	var m_length=0;
	var m_treatment=0;
	var m_dash="FULL"
		
	// Total Transmision Time
	var m_trans_time=0;
	
	// Time already used of the Transmition time
	var m_transmited_time=0;
	
	var m_synchPoint="";
	var m_startPoint="";
	
	var m_scenImg="";
	
	// Register the percentage of display
	//var m_drawpercent=0;
	var m_display=false;
	var m_ready=false;
	
	this.getInitPos=getInitPos;
	this.getEndPos=getEndPos;
	
	this.getMsg = getMsg;
	this.getIndex=getIndex;
	
	this.setType=setType;
	this.getType=getType;
	
	this.setLength=setLength;
	this.getLength=getLength;
	
	this.setTreatment=setTreatment;
	this.getTreatment=getTreatment;
	
	this.setDash=setDash;
	this.getDash=getDash;
	
	this.setScenImg=setScenImg;
	this.getScenImg=getScenImg;
	this.hasScenImg=hasScenImg;

	this.hasStartPoint=hasStartPoint;	
	this.getStartPoint=getStartPoint;
	this.setStartPoint=setStartPoint;
	
	this.hasSyncPoint=hasSyncPoint;	
	this.setSyncPoint=setSyncPoint;
	this.getSyncPoint=getSyncPoint;
	
	this.setTransTime=setTransTime;
	this.getTransTime=getTransTime;
	
	this.getDisplay=getDisplay;
	this.setDisplay=setDisplay;
	
	this.setMsgPosY=setMsgPosY;
	this.getMsgPosY=getMsgPosY;
	
	this.setReady=setReady;
	this.getReady=getReady;
	
	this.setTransmitedTime=setTransmitedTime;
	this.getTransmitedTime=getTransmitedTime;
	
	function setTransmitedTime(time){
		m_transmited_time=time;
	}
	
	function getTransmitedTime(){
		return m_transmited_time;
	}
	
	function setReady(value){
		m_ready=value;
	}
	
	function getReady(){
		return m_ready;
	}
	
	function getMsgPosY(){
		return m_msg_pos;
	}
	
	function setMsgPosY(value){
		m_msg_pos=value;
	}
	
	function getDisplay() {
		return m_display;
	}

	function setDisplay(value) {
		m_display=value;
	}	
	
	function setTransTime(time){
		m_trans_time=time;
	}
	
	function getTransTime(){
		return m_trans_time;
	}
	
	function getInitPos(){
		return m_pi;		
	}
	
	function getEndPos(){
		return m_pf;		
	}	
	
	function getMsg() {
		return m_msg;
	}
	
	function getIndex(){
		return m_index;
	}
	
	function hasSyncPoint(){
		if (m_synchPoint.localeCompare("")==0){
			return false;
		}else{
			return true;
		}
	}
	
	function hasStartPoint(){
		if (m_startPoint.localeCompare("")==0){
			return false;
		}else{
			return true;
		}
	}
	
	function setSyncPoint(value){
		m_synchPoint=value;
	}
	
	function getSyncPoint(){
		return m_synchPoint;
	}
	
	function setStartPoint(value){
		m_startPoint=value;
	}
	
	function getStartPoint(){
		return m_startPoint;
	}
	
	function setType(type){
		m_type=type;
	}
	
	function getType(){
		return m_type;
	}
	
	function setLength(length){
		m_length=length;
	}
	
	function getLength(){
		return m_length;
	}
	
	function setTreatment(treatment){
		m_treatment=treatment;
	}
	
	function getTreatment(){
		return m_treatment;
	}
	
	function setDash(dash){
		m_dash=dash;
	}
	
	function getDash(){
		return m_dash;
	}
	
	function setScenImg(img){
		m_scenImg=img;
	}
	
	function getScenImg(){
		return m_scenImg;
	}
	
	function hasScenImg(){
		if (m_scenImg.localeCompare("")==0){
			return false;
		}else{
			return true;
		}		
	}
}

function ScenAction(node, initpos, finalpos, action){
	var m_node=node;
	var m_initpos=initpos;
	var m_finalpos=finalpos;
	var m_action=action;
	
	this.getNode=getNode;
	this.getInitPos=getInitPos;
	this.getFinalPos=getFinalPos;
	this.getAction=getAction;
	
	function getNode(){
		return m_node;
	}
	
	function getInitPos(){
		return m_initpos;
	}
	
	function getFinalPos(){
		return m_finalpos;
	}
	
	function getAction(){
		return m_action;
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

function SyncPoint(value, pos){
	var m_pos=pos;
	var m_sync=value;
	
	this.getSyncPoint=getSyncPoint;
	this.getPos=getPos;
	
	function getPos(){
		return m_pos;
	}
	
	function getSyncPoint(){
		return m_sync;
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
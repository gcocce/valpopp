
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
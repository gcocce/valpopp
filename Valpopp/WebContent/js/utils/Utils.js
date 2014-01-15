
//function Utils(){

function HtmlBuilder(){
	// **************************************************************************
	// Public Methods Publication
	//***************************************************************************
	this.wrapErrorMsg=wrapErrorMsg;
	this.wrapMsg=wrapMsg;
	this.getMCQHTML=getMCQHTML;
	this.getMCQResults=getMCQResults;
	this.getMCQAnswers=getMCQAnswers;
	this.wrapComment=wrapComment;
	this.getScenarioListLoading=getScenarioListLoading;
	this.getScenarioDataMenu=getScenarioDataMenu;
	this.wrapHtmlErrorMsg=wrapHtmlErrorMsg;
	this.wrapHtmlMsg=wrapHtmlMsg;
	this.getScenarioImgHtml=getScenarioImgHtml;
	this.getScenarioMsgHtml=getScenarioMsgHtml;
	this.getScenarioReferencesHtml=getScenarioReferencesHtml;
	this.getOpenLocalScenarioDialog=getOpenLocalScenarioDialog;
	
	this.getAppCommandButtonsHtml=getAppCommandButtonsHtml;
	
	this.getCommentsVisibleHeader=getCommentsVisibleHeader;
	this.getCommentsHiddenHeader=getCommentsHiddenHeader;
	
	this.getSettingsDialogHtml=getSettingsDialogHtml;
	
	this.getScenarioTitleHtml=getScenarioTitleHtml;
	
	this.getPathSelectorHTML=getPathSelectorHTML;

	//***************************************************************************
	// Public Methods Definition	
	//***************************************************************************
	
	function getScenarioTitleHtml(title, points){
		var html='<div id="ScenarioTitle">' + title + '</div>';
		
		html+='<div id="ScenarioPoints">' + points + '</div>';
		
		return html;		
	}
	
	function getSettingsDialogHtml(m_selected_language){
		
		var html='<div id="DialogContainer">';
		
		html+='<div id="SettingsContainer">';

		html+='<div id="SettingElement">';
		html+='<span class="SettingTitle">'+languageModule.getCaption("HB_MSG_SELECT_LANGUAGE")+'</span>';

		// Body with the scenario examples list
		html+='<div id="LanguageListContainer"><div id="ScenarioList">';
		
		var arrayofLang = languageModule.getAvailableLanguages();
		
		//console.log(arrayofLang);
		
		html+='<ul>';
		
		for (var l=0; l < arrayofLang.length; l++){
			
			var language= new String();
			
			language=arrayofLang[l];
			
			language=language.trim();
			
			if (language.localeCompare("")!=0){
				
				if (l==m_selected_language){
					html+='<li id="ScenarioListItem'+l+'" class="ScenarioSelected" onClick="applicationView.selectLanguage('+l+');">' + language + '</li>';
					m_selected_example=0;
				}else{
					html+='<li id="ScenarioListItem'+l+'" onClick="applicationView.selectLanguage('+l+');">' + language + '</li>';	
				}
			}
		}
		
		html+='</ul>';
		
		html+='</div>'; // End of ScenarioList
		
		html+='</div>'; // End of Language List Container
		
		html+='</div>'; // End of SettingElement

// 		//Add other settings here
//		html+='<div id="SettingElement">';
//		html+='<span class="SettingTitle">Another Setting...</span>';
//		html+='</div>';			
		
		html+='</div>'; // End of SettingsContainer		
		
		html+='</div>'; // End of DialogContainer		
		
		return html;
	}
	
	function getCommentsHiddenHeader(){
		
		var html='<a href="#" onClick="scenarioView.showComments();"><img src="img/show.jpg"></a>';
		
		return html;
	}
	
	function getCommentsVisibleHeader(){

		var html='<a href="#" onClick="scenarioView.hideComments();"><img src="img/hide.jpg"></a>';
		
		return html;
	}
	
	function getAppCommandButtonsHtml(){
		var html="";
		
		html='<ul>'+
	    '<li><input id="bt_open" type="button" onclick="applicationController.openButton();" value="'+languageModule.getCaption("BUTTON_OPEN")+'" disabled></li>'+
	    '<li><input id="bt_play" class="play" type="button" onclick="scenarioController.playButton();" value="'+languageModule.getCaption("BUTTON_START")+'" disabled></li>'+
	    '<li><input id="bt_quiz" class="inactive" type="button" onclick="scenarioController.quizButton();" value="'+languageModule.getCaption("BUTTON_QUIZ")+'" disabled></li>'+
	    '<li><input id="bt_clear" type="button" onclick="scenarioController.stopButton();" value="'+languageModule.getCaption("BUTTON_CLEAR")+'" disabled></li>'+
	    '<li><input id="bt_mode" type="checkbox" onclick="scenarioController.modeCheckbox();" checked disabled><a href="#" id="bta_mode" onclick="scenarioController.changeMode();" >'+languageModule.getCaption("BUTTON_MODE")+'</a></li>'+
	    '<li><input id="bt_data" type="button" onclick="scenarioController.dataButton();" value="'+languageModule.getCaption("BUTTON_DATA")+'" disabled></li>'+
	    '<li><input id="bt_settings" type="button" onclick="applicationController.settingsButton();" value="'+languageModule.getCaption("BUTTON_SETTINGS")+'" disabled></li>'+
	    '</ul>';
		
		return html;
	}
	
	function getScenarioReferencesHtml(references){
		var html='<div id="ScenarioDataDialog"><div id="ScenarioReferenceList"><br>';
		
		if (references){
			for (key in references) {
				
				var ref=references[key];
								
				html+='<a href="'+ref.link+'" target="_blank">'+ref.title+'</a><br><br>';
			}			
		}else{
			html+='There are no reference for this Scenario<br><br>';			
		}
		
		html+='</div></div>';
		
		return html;		
	}
	
	function getScenarioMsgHtml(list){
		var html='<div id="ScenarioDataDialog"><div id="ScenarioMessageList">';
		
		for (key in list) {
			
			var msg=list[key];
							
			html+=msg+'<br>';
		}
		
		html+='</div></div>';
		
		return html;
	}
	
	function getScenarioImgHtml(img, width, height){
		//img.getState();
		var dlg_width=Math.round(width)-10;
		var dlg_height=Math.round(height)-10;
		
		var img_width=img.getWidth();
		var img_height=img.getHeight();

		// Adapt image size to dialog size
		if (dlg_width<img_width){
			var prop= dlg_width / img_width;
			img_width=dlg_width;
			img_height=img_height * prop;
		}
		
		if (dlg_height < img_height){
			var prop= dlg_height / img_height;
			img_height=dlg_height;
			img_width=img_width * prop;
		}		

		return '<div id="ScenarioDataDialog"><img src="'+img.getUrl()+'" height="'+img_height+'" width="'+img_width+'"></div>';
	}
	
	function wrapHtmlErrorMsg(html_msg){
		return '<div id="msgContainer">'+html_msg+'</div>';
	}
	
	function wrapHtmlMsg(html_msg){
		return '<div id="msgContainer">'+html_msg+'</div>';
	}	
	
	// For string messages
	function wrapErrorMsg(msg){
		return '<div id="msgContainer"><div id="msg" class="error">' + msg + '</div></div>';
	}
	
	// For string messages
	function wrapMsg(msg){
		return '<div id="msgContainer"><div id="msg" class="valid">' + msg + '</div></div>';
	}
	
	// For string messages
	function wrapComment(msg){
		return '<div id="msgContainer"><div id="msg" class="comment">' + msg + '</div></div>';
	}
	
	function getMCQHTML(mcq){
		
		var question='<div id="MCQquestion" class="MCQquestion"><h2>'+ mcq.text +'</h2><br></div>';
		
		var answers='<div id="MCQanswers" class="MCQanswers"><table width="100%" border="0">';
		
		for (var i=0; i < mcq.answers.length; i++ ){
			answers+='<tr><td width="5%"></td><td width="5%"><input id="ValpoppMCQanswer'+ (i+1) +'" type="checkbox" unchecked></td><td width="90%">'+ (i+1) +') '+ mcq.answers[i].text +'</td></tr>';
		}
		
		answers+='</table></div>';
		
		var comments='<div id="MCQcomments" class="MCQcomments"></div>';
		
		var html='<div id="mcq" class="MCQcontainer" >' + question + answers + comments + '</div>';
		
		return html;		
	}
	
	function getPathSelectorHTML(mcq){
		var question='<div id="MCQquestion" class="MCQquestion"><h2>'+ mcq.text +'</h2><br></div>';
		
		var options='<div id="MCQanswers" class="MCQanswers"><table width="100%" border="0">';
		
		for (var i=0; i < mcq.answers.length; i++ ){
			options+='<tr><td width="5%"></td><td width="5%"><input id="ValpoppMCQanswer'+ (i+1) +'" type="radio" name="path"></td><td width="90%">'+ (i+1) +') '+ mcq.answers[i].text +'</td></tr>';
		}
		
		options+='</table></div>';
		
		var comments='<div id="MCQcomments" class="MCQcomments"></div>';
		
		var html='<div id="mcq" class="MCQcontainer" >' + question + options + comments + '</div>';
		
		return html;			
	}
	
	function getMCQResults(mcq, userRes, validRes, result){
		var title="";
		var responses="";
		
		if(result){
			title='<div id="MCQquestion" class="MCQquestion"><h2 style="color:green">'+languageModule.getCaption("HB_MSG_RIGHT_ANSWER")+'!</h2><br></div>';
			responses='';
		}else{
			title='<div id="MCQquestion" class="MCQquestion"><h2 style="color:red">'+languageModule.getCaption("HB_MSG_WRONG_ANSWER")+'!</h2><br></div>';
			responses='<div id="MCQanswers" class="MCQanswers"><table width="100%" border="0">';
			
			// Show feedback
			for (var i=0; i < mcq.answers.length; i++ ){
				var feedback="";
				var link="";
				if (mcq.answers[i].feedback){
					feedback=mcq.answers[i].feedback;
					if (mcq.answers[i].link){
						link=mcq.answers[i].link;
					}
				}
				if (link.localeCompare("")==0){
					responses+='<tr><td width="5%"></td><td width="5%"></td><td width="90%">'+ (i+1) +') '+ feedback +'</td></tr>';	
				}else{
					responses+='<tr><td width="5%"></td><td width="5%"></td><td width="90%">'+ (i+1) +') <a href="'+ link +'" target="_blank">'+ feedback +'</a></td></tr>';
				}
			}
			
			responses+='</table></div>';
		}
		
		var html='<div id="mcq" class="MCQcontainer" >' + title + responses + '</div>';
		
		return html;		
	}
	
	function getMCQAnswers(mcq){
		var title="";
		var responses="";
		
		title='<div id="MCQquestion" class="MCQquestion"><h2>'+ mcq.text +'</h2><br></div>';

		responses='<div id="MCQanswers" class="MCQanswers"><table width="100%" border="0">';
		
		// Show rigth solution
		for (var i=0; i < mcq.answers.length; i++ ){
			var img="";
			
			if (mcq.answers[i].valid){
				img='<img src="img/mcq_right.gif" height="32" width="32">';
			}else{
				img='<img src="img/mcq_wrong.gif" height="32" width="32">';
			}
			
			responses+='<tr nowrap><td width="5%">'+img+'</td><td width="5%"></td><td width="90%">'+ (i+1) +') '+ mcq.answers[i].text +'</td></tr>';
		}
		
		responses+='</table></div>';
		
		var html='<div id="mcq" class="MCQcontainer" >' + title + responses + '</div>';
		
		return html;		
	}
	
	function getOpenLocalScenarioDialog(){
		var html='<div id="DialogContainer">';
		
		html+='<div class="openfileheader" id="OpenFileHeader">'+languageModule.getCaption("HB_MSG_OPEN_LOCAL_SCENARIO")+'</div>';
		
		html+='<div class="openfilebody" id="OpenFileBody"><br>';
			html+='<p style="font-weight:bold">'+languageModule.getCaption("HB_MSG_SELECT_SCENARIO_FILE")+'</p><br>';
			html+='<p><input type="file" name="LocalScenarioFile" id="LocalScenarioFile" size="40" placeholder="Local Scenario File" /></p><br><br>';
			html+='<p style="font-weight:bold">'+languageModule.getCaption("HB_MSG_SELECT_SCENARIO_IMAGES")+'</p><br>';
			html+='<p><input type="file" name="ScenarioImagesFile" id="ScenarioImagesFile" size="40" multiple placeholder="Scenario Images"/></p>';
		html+='</div>';
		
		html+='</div>';
		
		return html;
	}
	
	function getScenarioListLoading(){
		var html='<div id="DialogContainer">';
		 
		// Header with the title, the text fiel for the filter and the button to open a local file
		html+='<div id="OpenDialogHeader">';
		
		var userMode=configModule.getUserMode();
		if (userMode.localeCompare("basic")==0){
			html+='<span class="OpenDialogTitle">'+languageModule.getCaption("HB_MSG_SCENARIO_LIST")+'</span>';
		}else{
			html+='<span class="OpenDialogTitle">'+languageModule.getCaption("HB_MSG_SCENARIO_LIST")+'</span><input type="button" class="OpenLocalFileButton" name="bt_openlocalfile" id="btscenario_openfile" onClick="applicationController.OpenLocalFile();" value="'+languageModule.getCaption("HB_BUTTON_OPEN_LOCAL")+'" width="20%"/>';
		}
		
		html+='</div>';  // End of OpenDialogHeader
		
		html+='<div id="ScenarioFilter" class="Filter">';
		html+='<input type="text" name="btscenario_filterkeyword" id="btscenario_filterkeyword" placeholder="'+languageModule.getCaption("HB_TEXT_FILTER_LIST")+'" onkeyup="applicationController.FilterList();" maxlength="30" width="80%" />';
		html+='</div>';
		
		// Body with the scenario examples list
		html+='<div id="ScenarioListContainer"><div id="ScenarioList" class="ScenarioList"><br><br><img src="img/progress_bar.gif"/></div></div>';
		html+='</div>';
		
		return html;
	}
	
	function getScenarioDataMenu(){
		var html='<div id="ScenarioDataDialog">';
		
		html+='<div class="ScenarioDataButton"><input type="button" value="'+languageModule.getCaption("HB_BUTTON_SCENARIO_IMG")+'" onClick="scenarioView.showScenarioImage();"></div>';

		html+='<div class="ScenarioDataButton"><input type="button" value="'+languageModule.getCaption("HB_BUTTON_SCENARIO_MSGS")+'" onClick="scenarioView.showScenarioMessages();"></div>';
		
		html+='<div class="ScenarioDataButton"><input type="button" value="'+languageModule.getCaption("HB_BUTTON_SCENARIO_REFERENCES")+'" onClick="scenarioView.showScenarioReferences();"></div>';
		
		html+='</div>';
		
		return html;
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

/* This class is used to wrap Object that can be displayed in the Scenario.
 * 
 * It should be a base class, but in order to avoid the complexity of inheritance in Javascript
 * we choose to use this class that contain objctes with the type.
 * 
 * The first parameter define the type of object that the second parameter is
 * The second parameter is the object that will be displayed
 * 
 * Possible type the objects: ScenTimer, ScenTreatment, ScenMessage, ScenAction
 * 
 * */
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

function ScenTimer(node, initTime, endTime){
	var m_node=node;
	var m_current_time=initTime;
	var m_initTime=initTime;
	var m_endTime=endTime;
	var m_display=false;
	
	this.getInitTime=getInitTime;
	this.getEndTime=getEndTime;
	this.getCurrentTime=getCurrentTime;
	this.setCurrentTime=setCurrentTime;	
	this.getNode=getNode;
	
	this.getDisplay=getDisplay;
	this.setDisplay=setDisplay;
	
	function getDisplay(){
		return m_display;
	}
	
	function setDisplay(display){
		m_display=display;
	}
	
	function getCurrentTime(){
		return m_current_time;
	}
	
	function setCurrentTime(time){
		m_current_time=time;
	}
	
	function getNode(){
		return m_node;
	}
	
	function getInitTime(){
		return m_initTime;		
	}
	
	function getEndTime(){
		return m_endTime;		
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
	
	// Register the comment to be displayed
	var m_comment=null;
	
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
	
	this.setComment=setComment;
	this.getComment=getComment;
	
	function setComment(comment){
		m_comment=comment;
	}
	
	function getComment(){
		return m_comment;
	}
	
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


/* This class is used both for node and scenario images
 * 
 * First parameter is the file name
 * Second parameter is the url of the image
 * The third parameter establish which one it is
 *  */
 function ScenarioImage(img_name, url_param, isNode){
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
	
	var m_name=img_name;
	var m_img= new Image();
	var m_url=url_param;
	var m_state=IMG_ERROR;
	var m_width=0;
	var m_height=0;
	
	// ******************************************************************************
	// Constructor
	// ******************************************************************************	
		
	// Callback Function in case of error while downloading
	m_img.onerror = function () {
	    //console.log("Fail to download: " + img_name);
	    m_state=IMG_ERROR;
	    
	    //Dispatch Event
	    if (isNode){
			var event = $.Event( "RemoteNodeImageLoaded" );
			$(window).trigger( event );
	    }else{
			var event = $.Event( "RemoteScenarioImageLoaded" );
			$(window).trigger( event );	    	
	    }
	};
	
	// Callback Function in case of successful download
	m_img.onload = function () {
	    //console.log("Successful download: " + img_name);
	    m_state=IMG_OK;
	    
	    m_width=m_img.width;
	    m_height=m_img.height;
	    
	    //Dispatch Event
	    if (isNode){
			var event = $.Event( "RemoteNodeImageLoadingError" );
			$(window).trigger( event );	
	    }else{
			var event = $.Event( "RemoteScenarioImageLoadingError" );
			$(window).trigger( event );	    	
	    }
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
	this.getName=getName;

	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************
	
	function getName(){
		return m_name;
	}
	
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

 /* This class is used to process image used for the application when they are preloaded
  * */
function AppImage(url_param){
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
	
	// Callback Function used if there is an error while downloading
	m_img.onerror = function () {
	    m_state=IMG_ERROR;
	};
	
	// Callback Function used if it is successfully downloaded
	m_img.onload = function () {
	    m_state=IMG_OK;    
	    m_width=m_img.width;
	    m_height=m_img.height;	
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

// A point in the ScenarioView 
// x for the x axe and y for the y axe
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

// Position in the model ScenarioPlay 
// It is identified by the number of the node and the time of ocurrence
function Position(NodeNumber, time){
	var m_node=NodeNumber;
	var m_time=time;
	
	this.getNode=getNode;
	this.getTime=getTime;
	
	function getNode(){
		return m_node;
	}
	
	function getTime(){
		return m_time;		
	}
}


function getCurrentDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;

	var yyyy = today.getFullYear();
	if(dd<10){dd='0'+dd;} 
	if(mm<10){mm='0'+mm;}
	
	var currentDate = mm+'/'+dd+'/'+yyyy;
	
	return currentDate;
}

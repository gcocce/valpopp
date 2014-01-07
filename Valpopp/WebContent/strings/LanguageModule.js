

var languageModule = (function () {
	var DOWNLOADING=0;
	var LOADED=1;
	var INITIALIZED=2;
	
	// Field Separator
	var SEP=";";
	
	// State of the object
	var state=DOWNLOADING;
	
	// Description of an error message
	var m_error="";
	
	// Number of available languages
	var numLanguages=0;
	
	// Number of defined text captions
	var numConstants=0;
	
	// List of available languages Ids ("en", "es", ...)
	var langIdList=new Array();
	
	// List of available languages Captions (English, Spanish, ...)
	var langCaptionList=new Array();
	
	// Default Language
	var currentlang = configModule.getLang();
	
	// Language File Content
	var fileContents="";
	
	// Object to hold all the captions in the different languages
	var captions= {};
	
	// Language File Lines
	var lflines = new Array();
	
	// Load file languages content
	var jqxhr=$.get(configModule.getLanguageFile(), function(data){
		// For deguggin purpuse
		fileContents=data;
		
		lflines = data.split('\n');
		var firstline=lflines[0];
		var langArr=firstline.split(SEP);
		langArr.shift();
			
		numLanguages=langArr.length;
		if (numLanguages < 1){
			m_error="LanguageModule: There is an inconsistency in the Language File Header";
		}else{
			// Process language file header, get the id and caption for each available language
			for (var l=0; l < langArr.length; l++){
				var lang=langArr[l];
				lang=lang.split(":");
				langIdList.push(lang[0]);
				langCaptionList.push(lang[1]);
			}			
		}
	
		// Remove the header of the language file
		lflines.shift();
			
		// Dispatch the event
		var eventLanguageFile = $.Event( "LanguageFileLoaded" );

		state=LOADED;
		$(window).trigger(eventLanguageFile);
	});	
	
	// Set another completion function for the request above
	jqxhr.fail(function() {
	  m_error="LanguageModule: There was an error while downloading the Language File!";
	});

	// Initialize Module
	function doInitialization() {
		
		// If there is no previous error
		if (m_error.localeCompare("")==0){
			
			var tempc=lflines;
			
			// For each line in the Language File
			for (var c=0; c < lflines.length; c++){
				var line=tempc[c].split(SEP);
				
				// Do not consider blank lines
				if (line.length > 1){
					
					// Creates a property of type object with the name of the Constant
					captions[line[0]]={};
				}
			}	
			
			// For each line in the Language File
			for (var c=0; c < lflines.length; c++){
				// Separate each line into its contents
				var line=lflines[c].split(SEP);
				
				// Do not consider blank lines
				if (line.length > 1){
					
//					// Test that every line has a translation for the number of available languages
//					if (line.length - 1 < numLanguages){ //(The line has also the Constant that why -1)
//						m_error="Missing translation for: " + line[0];
//						return false;
//					}else if (line.length - 1 > numLanguages){
//						m_error="LanguageModule: More translation than languages availables("+numLanguages+") for: " + line[0];
//						return false;
//					}
					
					// Test that every line has a translation for the number of available languages
					if (line.length - 1 > numLanguages){
						m_error="LanguageModule: More translation than languages availables("+numLanguages+") for: " + line[0];
						return false;
					}					
					
					numConstants++;
					
					// For each available language
					for (var l=1; l<line.length; l++){
						// Add property to the object with the Constant Name 
						captions[line[0]][langIdList[l-1]]=line[l];
						
						// For extreme debugging purpose
						//console.log(captions[line[0]][langIdList[l-1]]);
					}
				}
			}		
		}
		
		state=INITIALIZED;
		return true;
	}
	
	function setLanguage(pos){
		currentlang=langIdList[pos];
		
		if (console && debug){
			console.log("setLanguage: " + currentlang );	
		}
	}			

  // Return an object exposed to the public
	return { 
		DOWNLOADING:DOWNLOADING,
		LOADED:LOADED,
		INITIALIZED:INITIALIZED,
		getCaption: function (caption){
			
			// Check if the caption is in the list
			if (captions[caption]){
				
				var text= new String();
				
				text = captions[caption][currentlang];
				
				if (text){
					text = text.trim();
				}else{
					text="";
				}
				
				// If the captions is different than ""
				if (text.localeCompare("")!=0){
					return text;	
				}else{
					// If the caption is not defined for the selected language try to use the default language
					if (console && debug){
						console.log("Caption Not found in lang: " + currentlang + " for "+ caption);
					}
					
					text = captions[caption][configModule.getDefaultLanguage()];
					
					if (text){
						text = text.trim();
					}else{
						text="";
					}
					
					if (text.localeCompare("")!=0){
						return text;	
					}else{
						if (console){
							console.error("Caption Not found in lang: " + configModule.getDefaultLanguage() + " for "+ caption);
						}
						return "Undefined";
					}
				}				
			}else{
				// The caption is not defined
				if (console){
					console.error("LangModule: Caption Not found: "+ caption);
				}
			}
		},
		initialize: doInitialization,
		getError: function (){
			return m_error;
		},
		getState: function(){
			return state;
		},
		getFileContents: function (){
			return fileContents;
		},
		getNumberofLanguages: function(){
			return numLanguages;
		},
		getAvailableLanguages: function (){
			return langCaptionList;
		},
		getCurrentLanguage: function (){
			var pos = langIdList.indexOf(currentlang);
			return langCaptionList[pos];
		},
		getCurrentLanguagePos:function(){
			return langIdList.indexOf(currentlang);
		},
		getNumConstants: function (){
			return numConstants;
		},
		setCurrentLanguage:function (pos){
			setLanguage(pos);
		}
	};
}());


	